// solicitud.model.js
import db from '../config/db.js'; // Sin las llaves { }

export const getSolicitudesByUsuario = async (id_usuario) => {
    // Aquí es donde el código fallaba porque no sabía qué era "db"
    const [rows] = await db.query(`
        SELECT s.*, e.nombre AS equipo, e.ruta_imagen, c.nombre AS categoria
        FROM solicitudes s
        INNER JOIN equipos e ON s.id_equipo = e.id_equipo
        INNER JOIN categorias c ON e.id_categoria = c.id_categoria
        WHERE s.id_usuario = ?
        ORDER BY s.fecha_solicitud DESC
    `, [id_usuario]);
    return rows;
}

// Obtener las estadísticas para los contadores (stats)
export const getStatsByUsuario = async (id_usuario) => {
    const [rows] = await db.query(`
        SELECT 
            COUNT(*) AS total,
            SUM(CASE WHEN estado = 'pendiente' THEN 1 ELSE 0 END) AS pendientes,
            SUM(CASE WHEN estado = 'aprobada' THEN 1 ELSE 0 END) AS aprobadas,
            SUM(CASE WHEN estado = 'rechazada' THEN 1 ELSE 0 END) AS rechazadas,
            SUM(CASE WHEN estado = 'devuelta' THEN 1 ELSE 0 END) AS devueltas
        FROM solicitudes 
        WHERE id_usuario = ?
    `, [id_usuario]);
    return rows[0]; // Retornamos solo el primer objeto con los conteos
}

// 1. Registrar Solicitud: Usa el procedimiento 'RegistrarSolicitud'
// Este procedimiento ya verifica internamente si el equipo está 'disponible'
export const registrarSolicitud = async (id_usuario, id_equipo) => {
    // El SP hace el START TRANSACTION y el INSERT
    await db.query('CALL RegistrarSolicitud(?, ?)', [id_usuario, id_equipo]);
};

// 2. Aprobar Solicitud: Usa el procedimiento 'AprobarSolicitud'
// Esto dispara automáticamente el cambio de estado del equipo a 'prestado' y crea la auditoría
export const aprobarSolicitud = async (id_solicitud, id_admin) => {
    await db.query('CALL AprobarSolicitud(?, ?)', [id_solicitud, id_admin]);
};

export const rechazarSolicitud = async (id_solicitud, id_admin, motivo) => {
    await db.query('CALL RechazarSolicitud(?, ?, ?)', [id_solicitud, id_admin, motivo]);
};

export const marcarDevuelta = async (id_solicitud, id_admin) => {
    await db.query('CALL MarcarDevuelta(?, ?)', [id_solicitud, id_admin]);
};

// 5. Verificar Solicitud Activa: Usa la FUNCIÓN 'TieneSolicitudActiva'
// Devuelve 1 si tiene pendientes o aprobadas, 0 si no
export const tieneSolicitudActiva = async (id_usuario) => {
    const [[{ resultado }]] = await db.query(
        'SELECT TieneSolicitudActiva(?) AS resultado', [id_usuario]
    );
    return resultado === 1;
};

// 6. Obtener estadísticas para el Dashboard (Imagen del Dashboard)
// Aprovechamos los estados definidos en tu ENUM de la tabla solicitudes
export const getStatsGlobales = async () => {
    const [rows] = await db.query(`
        SELECT 
            SUM(CASE WHEN estado = 'pendiente' THEN 1 ELSE 0 END) AS pendientes,
            SUM(CASE WHEN estado = 'aprobada' THEN 1 ELSE 0 END) AS en_prestamo,
            -- Aquí podrías añadir lógica de fechas para 'vencidas' si existiera el campo
            COUNT(id_solicitud) AS total
        FROM solicitudes
    `);
    return rows[0];
};

// 7. Consulta General para el Admin
export const getAllSolicitudes = async () => {
    const [rows] = await db.query(`
        SELECT s.*, u.nombre AS usuario_nombre, u.usuario AS matricula, 
               e.nombre AS equipo_nombre, e.ruta_imagen
        FROM solicitudes s
        INNER JOIN usuarios u ON s.id_usuario = u.id_usuario
        INNER JOIN equipos e ON s.id_equipo = e.id_equipo
        ORDER BY s.fecha_solicitud DESC
    `);
    return rows;
};


export const getSolicitudById = async (id_solicitud) => {
    const [rows] = await db.query(`
        SELECT s.*, u.nombre AS usuario_nombre, u.usuario AS matricula, 
               e.nombre AS equipo_nombre, e.ruta_imagen
        FROM solicitudes s
        INNER JOIN usuarios u ON s.id_usuario = u.id_usuario
        INNER JOIN equipos e ON s.id_equipo = e.id_equipo
        WHERE s.id_solicitud = ?
    `, [id_solicitud]);
    return rows[0];
};