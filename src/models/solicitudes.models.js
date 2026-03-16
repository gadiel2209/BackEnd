// solicitud.model.js
import { db } from '../config/db.js'; 

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


// Registrar nueva solicitud (valida disponibilidad internamente)
export const registrarSolicitud = async (id_usuario, id_equipo) => {
    await db.query('CALL RegistrarSolicitud(?, ?)', [id_usuario, id_equipo])
}

// Aprobar
export const aprobarSolicitud = async (id_solicitud, id_admin) => {
    await db.query('CALL AprobarSolicitud(?, ?)', [id_solicitud, id_admin])
}

// Rechazar
export const rechazarSolicitud = async (id_solicitud, id_admin, motivo) => {
    await db.query('CALL RechazarSolicitud(?, ?, ?)', [id_solicitud, id_admin, motivo])
}

// Marcar devuelta
export const marcarDevuelta = async (id_solicitud, id_admin) => {
    await db.query('CALL MarcarDevuelta(?, ?)', [id_solicitud, id_admin])
}

// Verificar si usuario tiene solicitud activa
export const tieneSolicitudActiva = async (id_usuario) => {
    const [[{ resultado }]] = await db.query(
        'SELECT TieneSolicitudActiva(?) AS resultado', [id_usuario]
    )
    return resultado === 1
}

// Consultar todas las solicitudes
export const getAllSolicitudes = async () => {
    const [rows] = await db.query(`
        SELECT s.*, u.nombre, u.usuario, e.nombre AS equipo, e.estado AS estado_equipo
        FROM solicitudes s
        INNER JOIN usuarios u ON s.id_usuario = u.id_usuario
        INNER JOIN equipos e ON s.id_equipo = e.id_equipo
    `)
    return rows
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