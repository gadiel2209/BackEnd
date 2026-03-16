import { Router } from 'express'
import * as ctrl from '../controllers/informacion.controllers.js'

const router = Router()

// GET para mostrar todo
router.get('/', ctrl.getInfoInstitucional)

// PUT para editar cada sección por su ID
router.put('/mision/:id', ctrl.updateMision)
router.put('/vision/:id', ctrl.updateVision)
router.put('/quienes/:id', ctrl.updateQuienes)

export default router