import { Router } from 'express'
import * as ctrl from '../controllers/ajustes.controllers.js'

const router = Router()

router.get('/', ctrl.getAllAjustes)
router.get('/:clave', ctrl.getAjusteByClave) // Ejemplo: GET /api/ajustes/mision
router.post('/', ctrl.createAjuste)
router.put('/:clave', ctrl.updateAjuste)    // Ejemplo: PUT /api/ajustes/mision

export default router