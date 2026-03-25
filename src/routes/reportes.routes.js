import { Router } from 'express'
import * as ctrl from '../controllers/reportes.controllers.js'

const router = Router()

// Si entras a /api/reportes/ sin nada más, debe haber una ruta definida
//router.get('/', (req, res) => res.json({ message: "EndPoint de reportes listo" }))
router.get('/', ctrl.getIncidencias);

// Ruta para el dashboard (estadísticas)
router.get('/dashboard', ctrl.getDashboardStats)

// Ruta para movimientos (requiere parámetros ?inicio=...&fin=...)
router.get('/movimientos', ctrl.getMovimientos)

// Ruta para crear un reporte de incidencia
router.post('/', ctrl.createReporte);

// En reportes.routes.js — solo para debug
router.get('/test', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT 1+1 AS resultado')
        res.json({ db: 'ok', resultado: rows[0].resultado })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

export default router