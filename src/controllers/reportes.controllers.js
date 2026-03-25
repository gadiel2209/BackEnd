import * as reportesModelo from '../models/reportes.models.js'

export const getDashboardStats = async (req, res) => {
    try {
        const stats = await reportesModelo.getResumenDashboard()
        const populares = await reportesModelo.getEquiposMasPedidos()
        const porMes = await reportesModelo.getSolicitudesPorMes()  // ← agrega esto
        res.status(200).json({ resumen: stats, top_equipos: populares, por_mes: porMes })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const getMovimientos = async (req, res) => {
    try {
        const { inicio, fin } = req.query
        if (!inicio || !fin) return res.status(400).json({ message: 'Faltan fechas inicio/fin' })

        const data = await reportesModelo.getReporteMovimientos(inicio, fin)
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const createReporte = async (req, res) => {
    try {
        const { id_solicitud, id_usuario_reporta, descripcion } = req.body;

        if (!id_solicitud || !id_usuario_reporta || !descripcion) {
            return res.status(400).json({ message: 'Todos los campos son requeridos' });
        }

        const nuevoId = await reportesModelo.createReporte(id_solicitud, id_usuario_reporta, descripcion);
        res.status(201).json({
            message: 'Reporte de incidencia creado correctamente',
            id_reporte: nuevoId
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getIncidencias = async (req, res) => {
    try {
        const data = await reportesModelo.getAllReportes();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};