import { Router } from 'express'
import * as ctrl from '../controllers/reportes.controllers.js'

const router = Router()

// Obtener estadísticas para las gráficas del inicio
router.get('/dashboard', ctrl.getDashboardStats)

// Obtener lista de préstamos filtrados por fecha
router.get('/movimientos', ctrl.getMovimientos)

export default router