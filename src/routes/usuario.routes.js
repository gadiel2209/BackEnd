import { Router } from 'express'
import * as ctrl from '../controllers/usuarios.controllers.js'

const router = Router()

router.get('/', ctrl.getAllUsuarios)
router.get('/:id', ctrl.getUsuarioById)
router.post('/', ctrl.createUsuario)
router.put('/:id', ctrl.updateUsuario)
router.delete('/:id', ctrl.deleteUsuario)

export default router