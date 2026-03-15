import { Router } from 'express'
import * as ctrl from '../controllers/reportes.controllers.js'

const router = Router()

// Si entras a /api/reportes/ sin nada más, debe haber una ruta definida
router.get('/', (req, res) => res.json({ message: "EndPoint de reportes listo" }))

// Ruta para el dashboard (estadísticas)
router.get('/dashboard', ctrl.getDashboardStats)

// Ruta para movimientos (requiere parámetros ?inicio=...&fin=...)
router.get('/movimientos', ctrl.getMovimientos)

// Ruta para crear un reporte de incidencia
router.post('/', ctrl.createReporte);

export default router