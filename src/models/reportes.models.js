import db from '../config/db.js'

export const getResumenDashboard = async() => {
    const [rows] = await db.query(`
        SELECT 
            (SELECT COUNT(*) FROM equipos) as total_equipos,
            (SELECT COUNT(*) FROM solicitudes WHERE estado = 'pendiente') as pendientes,
            (SELECT COUNT(*) FROM equipos WHERE estado = 'prestado') as prestados
    `)
    return rows[0]
}

export const getEquiposMasPedidos = async() => {
    const [rows] = await db.query(`
        SELECT e.nombre, COUNT(s.id_solicitud) as total 
        FROM equipos e 
        LEFT JOIN solicitudes s ON e.id_equipo = s.id_equipo 
        GROUP BY e.id_equipo ORDER BY total DESC LIMIT 5
    `)
    return rows
}

export const getReporteMovimientos = async(inicio, fin) => {
    const [rows] = await db.query(`
        SELECT s.id_solicitud, u.nombre as usuario, e.nombre as equipo, s.fecha_solicitud, s.estado
        FROM solicitudes s
        JOIN usuarios u ON s.id_usuario = u.id_usuario
        JOIN equipos e ON s.id_equipo = e.id_equipo
        WHERE s.fecha_solicitud BETWEEN ? AND ?
    `, [inicio, fin])
    return rows
}

// Función para crear un nuevo reporte de incidencia
export const createReporte = async(id_solicitud, id_usuario_reporta, descripcion) => {
    const [result] = await db.query(
        `INSERT INTO reportes (id_solicitud, id_usuario_reporta, descripcion) 
         VALUES (?, ?, ?)`, [id_solicitud, id_usuario_reporta, descripcion]
    );
    return result.insertId;
};

export const getAllReportes = async() => {
    const [rows] = await db.query(`
        SELECT r.id_reporte, r.descripcion, r.fecha_reporte, 
               u.nombre AS administrador, e.nombre AS equipo
        FROM reportes r
        JOIN usuarios u ON r.id_usuario_reporta = u.id_usuario
        JOIN solicitudes s ON r.id_solicitud = s.id_solicitud
        JOIN equipos e ON s.id_equipo = e.id_equipo
        ORDER BY r.fecha_reporte DESC
    `);
    return rows;
};