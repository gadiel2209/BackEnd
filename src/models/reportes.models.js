import db from '../config/db.js'

// 1. Reporte de solicitudes por rango de fechas
export const getReporteMovimientos = async(fechaInicio, fechaFin) => {
    const [rows] = await db.query(`
        SELECT s.id_solicitud, u.nombre AS usuario, e.nombre AS equipo, 
               s.fecha_solicitud, s.estado
        FROM solicitudes s
        INNER JOIN usuarios u ON s.id_usuario = u.id_usuario
        INNER JOIN equipos e ON s.id_equipo = e.id_equipo
        WHERE s.fecha_solicitud BETWEEN ? AND ?
        ORDER BY s.fecha_solicitud DESC
    `, [fechaInicio, fechaFin])
    return rows
}

// 2. Estadísticas generales para el Dashboard
export const getResumenDashboard = async() => {
    const [rows] = await db.query(`
        SELECT 
            (SELECT COUNT(*) FROM equipos) as total_equipos,
            (SELECT COUNT(*) FROM solicitudes WHERE estado = 'pendiente') as solicitudes_pendientes,
            (SELECT COUNT(*) FROM equipos WHERE estado = 'prestado') as equipos_prestados,
            (SELECT COUNT(*) FROM equipos WHERE estado = 'dañado') as equipos_danados
    `)
    return rows[0]
}

// 3. Equipos más solicitados (Top 5)
export const getEquiposMasPedidos = async() => {
    const [rows] = await db.query(`
        SELECT e.nombre, COUNT(s.id_solicitud) as total_prestamos
        FROM equipos e
        LEFT JOIN solicitudes s ON e.id_equipo = s.id_equipo
        GROUP BY e.id_equipo
        ORDER BY total_prestamos DESC
        LIMIT 5
    `)
    return rows
}