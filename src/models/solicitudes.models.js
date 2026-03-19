// solicitudes.model.js
import db from '../config/db.js';

// ─────────────────────────────────────────────
//  CONSULTAS DE LECTURA
// ─────────────────────────────────────────────

/** Solicitudes de un usuario con datos de equipo y categoría */
export const getSolicitudesByUsuario = async (id_usuario) => {
    const [rows] = await db.query(`
        SELECT s.*, e.nombre AS equipo, e.ruta_imagen, c.nombre AS categoria
        FROM solicitudes s
        INNER JOIN equipos e ON s.id_equipo = e.id_equipo
        INNER JOIN categorias c ON e.id_categoria = c.id_categoria
        WHERE s.id_usuario = ?
        ORDER BY s.fecha_solicitud DESC
    `, [id_usuario]);
    return rows;
};

/** Contadores de estados para un usuario */
export const getStatsByUsuario = async (id_usuario) => {
    const [rows] = await db.query(`
        SELECT 
            COUNT(*)                                             AS total,
            SUM(CASE WHEN estado = 'pendiente'  THEN 1 ELSE 0 END) AS pendientes,
            SUM(CASE WHEN estado = 'aprobada'   THEN 1 ELSE 0 END) AS aprobadas,
            SUM(CASE WHEN estado = 'rechazada'  THEN 1 ELSE 0 END) AS rechazadas,
            SUM(CASE WHEN estado = 'devuelta'   THEN 1 ELSE 0 END) AS devueltas
        FROM solicitudes
        WHERE id_usuario = ?
    `, [id_usuario]);
    return rows[0];
};

/** Todas las solicitudes (vista admin) */
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

/** Una solicitud por ID (vista admin) */
export const getSolicitudById = async (id_solicitud) => {
    const [rows] = await db.query(`
        SELECT s.*, 
               u.nombre  AS usuario_nombre, 
               u.usuario AS matricula,
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
//  FUNCIONES DE LA BD
// ─────────────────────────────────────────────

/**
 * FUNCIÓN: TieneSolicitudActiva(p_id_usuario)
 * Devuelve true si el usuario tiene solicitudes en estado 'pendiente' o 'aprobada'.
 * Usada antes de crear una nueva solicitud.
 */
export const tieneSolicitudActiva = async (id_usuario) => {
    const [[{ resultado }]] = await db.query(
        'SELECT TieneSolicitudActiva(?) AS resultado',
        [id_usuario]
    );
    return resultado === 1;
};

/**
 * FUNCIÓN: TotalSolicitudesUsuario(p_id_usuario)
 * Devuelve el total histórico de solicitudes del usuario (todos los estados).
 */
export const totalSolicitudesUsuario = async (id_usuario) => {
    const [[{ total }]] = await db.query(
        'SELECT TotalSolicitudesUsuario(?) AS total',
        [id_usuario]
    );
    return total;
};

/**
 * FUNCIÓN: ObtenerEstadoEquipo(p_id_equipo)
 * Devuelve el estado actual de un equipo: 'disponible' | 'prestado' | 'mantenimiento'.
 * Útil para verificar disponibilidad antes de mostrar un equipo al usuario.
 */
export const obtenerEstadoEquipo = async (id_equipo) => {
    const [[{ estado }]] = await db.query(
        'SELECT ObtenerEstadoEquipo(?) AS estado',
        [id_equipo]
    );
    return estado;
};

// ─────────────────────────────────────────────
//  PROCEDIMIENTOS ALMACENADOS
// ─────────────────────────────────────────────

/**
 * SP: RegistrarSolicitud(p_id_usuario, p_id_equipo)
 * — Verifica internamente que el equipo esté 'disponible'.
 * — Inserta la solicitud en estado 'pendiente'.
 * — Registra auditoría automáticamente.
 * — Si el equipo NO está disponible, hace ROLLBACK (no lanza error; la fila no se inserta).
 */
export const registrarSolicitud = async (id_usuario, id_equipo) => {
    await db.query('CALL RegistrarSolicitud(?, ?)', [id_usuario, id_equipo]);
};

/**
 * SP: AprobarSolicitud(p_id_solicitud, p_id_admin)
 * — Cambia estado de la solicitud a 'aprobada'.
 * — Cambia estado del equipo a 'prestado'.
 * — Inserta registro en historial.
 * — Inserta auditoría del admin.
 * — Todo en una transacción con COMMIT.
 * ⚡ Dispara trigger: tg_auditoria_solicitudes (registra cambio de estado en auditoría)
 * ⚡ Dispara trigger: AuditoriaCambioEquipo   (registra cambio de estado del equipo)
 */
export const aprobarSolicitud = async (id_solicitud, id_admin) => {
    await db.query('CALL AprobarSolicitud(?, ?)', [id_solicitud, id_admin]);
};

/**
 * SP: RechazarSolicitud(p_id_solicitud, p_id_admin, p_motivo)
 * — Cambia estado de la solicitud a 'rechazada'.
 * — Guarda el motivo en historial.
 * — Inserta auditoría del admin.
 * ⚡ Dispara trigger: tg_auditoria_solicitudes (registra cambio de estado en auditoría)
 */
export const rechazarSolicitud = async (id_solicitud, id_admin, motivo) => {
    await db.query('CALL RechazarSolicitud(?, ?, ?)', [id_solicitud, id_admin, motivo]);
};

/**
 * SP: MarcarDevuelta(p_id_solicitud, p_id_admin)
 * — Cambia estado de la solicitud a 'devuelta'.
 * — Inserta registro en historial.
 * — Inserta auditoría del admin.
 * ⚡ Dispara trigger: ActualizarEquipoDevuelto  → pone el equipo en 'disponible' automáticamente.
 * ⚡ Dispara trigger: tg_auditoria_solicitudes  → registra el cambio de estado.
 * ⚡ Dispara trigger: AuditoriaCambioEquipo     → registra el cambio de estado del equipo.
 */
export const marcarDevuelta = async (id_solicitud, id_admin) => {
    await db.query('CALL MarcarDevuelta(?, ?)', [id_solicitud, id_admin]);
};

// ─────────────────────────────────────────────
//  ESTADÍSTICAS GLOBALES (Dashboard admin)
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