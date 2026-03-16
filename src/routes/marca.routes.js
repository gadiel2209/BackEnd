import { Router } from 'express'
import * as ctrl from '../controllers/marca.controllers.js'

const router = Router()

router.get('/', ctrl.getAllMarcas)
    // router.get('/:id', ctrl.getMarcaById) // Comenta esta si no existe en el controller
router.post('/', ctrl.createMarca)
    // router.put('/:id', ctrl.updateMarca) // Comenta esta si no existe en el controller
router.delete('/:id', ctrl.deleteMarca)

export default router