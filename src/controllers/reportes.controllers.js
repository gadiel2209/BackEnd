import * as reportesModelo from '../models/reportes.models.js'

export const getMovimientos = async(req, res) => {
    try {
        const { inicio, fin } = req.query // Se reciben por ?inicio=...&fin=...

        if (!inicio || !fin) {
            return res.status(400).json({ message: 'Se requieren fechas de inicio y fin (YYYY-MM-DD)' })
        }

        const data = await reportesModelo.getReporteMovimientos(inicio, fin)
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const getDashboardStats = async(req, res) => {
    try {
        const stats = await reportesModelo.getResumenDashboard()
        const populares = await reportesModelo.getEquiposMasPedidos()

        res.status(200).json({
            resumen: stats,
            top_equipos: populares
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}