// solicitudes.model.js
import db from '../config/db.js';

// ─────────────────────────────────────────────────────────────────
//  HELPER: ejecutar un SP en una conexión dedicada
//
//  ¿Por qué es necesario?
//  Los SPs usan START TRANSACTION / COMMIT / ROLLBACK internamente.
//  Si el SP falla (ej: lock timeout), MySQL deja la transacción abierta
//  en esa conexión del pool. La próxima vez que se reutilice esa
//  conexión, el nuevo SP choca con la transacción colgada y lanza
//  "Lock wait timeout exceeded".
//
//  Solución: pedir una conexión exclusiva del pool, usarla solo para
//  ese SP y liberarla siempre en el bloque finally, sin importar si
//  hubo éxito o error.
// ─────────────────────────────────────────────────────────────────
async function ejecutarSP(sql, params = []) {
    const conn = await db.getConnection();
    try {
        // Timeout reducido para fallar rápido y no bloquear el pool
        await conn.query('SET innodb_lock_wait_timeout = 10');
        const [result] = await conn.query(sql, params);
        return result;
    } finally {
        conn.release(); // SIEMPRE liberar la conexión al pool
    }
}

// ─────────────────────────────────────────────
//  CONSULTAS DE LECTURA
// ─────────────────────────────────────────────

export const getSolicitudesByUsuario = async (id_usuario) => {
    const [rows] = await db.query(`
        SELECT s.*, e.nombre AS equipo, e.ruta_imagen, c.nombre AS categoria
        FROM solicitudes s
        INNER JOIN equipos    e ON s.id_equipo  = e.id_equipo
        INNER JOIN categorias c ON e.id_categoria = c.id_categoria
        WHERE s.id_usuario = ?
        ORDER BY s.fecha_solicitud DESC
    `, [id_usuario]);
    return rows;
};

export const getStatsByUsuario = async (id_usuario) => {
    const [rows] = await db.query(`
        SELECT
            COUNT(*)                                                 AS total,
            SUM(CASE WHEN estado = 'pendiente'  THEN 1 ELSE 0 END) AS pendientes,
            SUM(CASE WHEN estado = 'aprobada'   THEN 1 ELSE 0 END) AS aprobadas,
            SUM(CASE WHEN estado = 'rechazada'  THEN 1 ELSE 0 END) AS rechazadas,
            SUM(CASE WHEN estado = 'devuelta'   THEN 1 ELSE 0 END) AS devueltas
        FROM solicitudes
        WHERE id_usuario = ?
    `, [id_usuario]);
    return rows[0];
};

export const getAllSolicitudes = async () => {
    const [rows] = await db.query(`
        SELECT s.*,
               u.nombre  AS usuario_nombre,
               u.usuario AS matricula,
               e.nombre  AS equipo_nombre,
               e.ruta_imagen
        FROM solicitudes s
        INNER JOIN usuarios u ON s.id_usuario = u.id_usuario
        INNER JOIN equipos  e ON s.id_equipo  = e.id_equipo
        ORDER BY s.fecha_solicitud DESC
    `);
    return rows;
};

export const getSolicitudById = async (id_solicitud) => {
    const [rows] = await db.query(`
        SELECT s.*,
               u.nombre  AS usuario_nombre,
               u.usuario AS matricula,
               u.correo  AS correo,
               e.nombre  AS equipo_nombre,
               e.ruta_imagen
        FROM solicitudes s
        INNER JOIN usuarios u ON s.id_usuario = u.id_usuario
        INNER JOIN equipos  e ON s.id_equipo  = e.id_equipo
        WHERE s.id_solicitud = ?
    `, [id_solicitud]);
    return rows[0];
};

// ─────────────────────────────────────────────
//  FUNCIONES DE LA BD (no usan transacciones,
//  pueden compartir conexión del pool con seguridad)
// ─────────────────────────────────────────────

/** FUNCIÓN: TieneSolicitudActiva → true si hay pendiente o aprobada */
export const tieneSolicitudActiva = async (id_usuario) => {
    const [[{ resultado }]] = await db.query(
        'SELECT TieneSolicitudActiva(?) AS resultado', [id_usuario]
    );
    return resultado === 1;
};

/** FUNCIÓN: TotalSolicitudesUsuario → total histórico de solicitudes */
export const totalSolicitudesUsuario = async (id_usuario) => {
    const [[{ total }]] = await db.query(
        'SELECT TotalSolicitudesUsuario(?) AS total', [id_usuario]
    );
    return total;
};

/** FUNCIÓN: ObtenerEstadoEquipo → 'disponible' | 'prestado' | 'mantenimiento' */
export const obtenerEstadoEquipo = async (id_equipo) => {
    const [[{ estado }]] = await db.query(
        'SELECT ObtenerEstadoEquipo(?) AS estado', [id_equipo]
    );
    return estado;
};

// ─────────────────────────────────────────────
//  PROCEDIMIENTOS ALMACENADOS
//  Todos usan ejecutarSP() → conexión dedicada
//  que se libera aunque MySQL lance un error.
// ─────────────────────────────────────────────

/**
 * SP: RegistrarSolicitud(p_id_usuario, p_id_equipo)
 * Verifica disponibilidad del equipo e inserta la solicitud en transacción.
 * Si el equipo no está disponible hace ROLLBACK internamente (sin lanzar error).
 */
export const registrarSolicitud = async (id_usuario, id_equipo) => {
    await ejecutarSP('CALL RegistrarSolicitud(?, ?)', [id_usuario, id_equipo]);
};

/**
 * SP: AprobarSolicitud(p_id_solicitud, p_id_admin)
 * Aprueba solicitud, pone equipo en 'prestado', historial y auditoría.
 * ⚡ Triggers: tg_auditoria_solicitudes, AuditoriaCambioEquipo
 */
export const aprobarSolicitud = async (id_solicitud, id_admin) => {
    await ejecutarSP('CALL AprobarSolicitud(?, ?)', [id_solicitud, id_admin]);
};

/**
 * SP: RechazarSolicitud(p_id_solicitud, p_id_admin, p_motivo)
 * Rechaza solicitud, guarda motivo en historial y auditoría.
 * ⚡ Triggers: tg_auditoria_solicitudes
 */
export const rechazarSolicitud = async (id_solicitud, id_admin, motivo) => {
    await ejecutarSP('CALL RechazarSolicitud(?, ?, ?)', [id_solicitud, id_admin, motivo]);
};

/**
 * SP: MarcarDevuelta(p_id_solicitud, p_id_admin)
 * Marca solicitud como devuelta, historial y auditoría.
 * ⚡ Triggers: ActualizarEquipoDevuelto (equipo → 'disponible'),
 *             tg_auditoria_solicitudes, AuditoriaCambioEquipo
 */
export const marcarDevuelta = async (id_solicitud, id_admin) => {
    await ejecutarSP('CALL MarcarDevuelta(?, ?)', [id_solicitud, id_admin]);
};

// ─────────────────────────────────────────────
//  ESTADÍSTICAS GLOBALES
// ─────────────────────────────────────────────

export const getStatsGlobales = async () => {
    const [rows] = await db.query(`
        SELECT
            SUM(CASE WHEN estado = 'pendiente' THEN 1 ELSE 0 END) AS pendientes,
            SUM(CASE WHEN estado = 'aprobada'  THEN 1 ELSE 0 END) AS en_prestamo,
            SUM(CASE WHEN estado = 'rechazada' THEN 1 ELSE 0 END) AS rechazadas,
            SUM(CASE WHEN estado = 'devuelta'  THEN 1 ELSE 0 END) AS devueltas,
            COUNT(id_solicitud)                                    AS total
        FROM solicitudes
    `);
    return rows[0];
};