import { Router } from 'express'
import * as ctrl from '../controllers/ajustes.controllers.js'

const router = Router()

router.get('/', ctrl.getAjustes) // Para leer (Footer)
router.post('/', ctrl.createAjuste) // <-- NUEVA: Para agregar datos
router.put('/:clave', ctrl.updateAjuste) // Para editar datos existentes

export default router