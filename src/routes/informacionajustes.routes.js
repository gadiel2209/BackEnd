import { Router } from 'express'
import * as ctrl from '../controllers/informacion.controllers.js'

const router = Router()

// Obtener todos los textos institucionales
router.get('/', ctrl.getInfoInstitucional)

// Rutas individuales para edición
router.put('/mision/:id', ctrl.updateMision)
router.put('/vision/:id', ctrl.updateVision)
router.put('/quienes/:id', ctrl.updateQuienes)

export default router