import { Router } from 'express'
import * as ctrl from '../controllers/usuario.controllers.js'
import { verificarToken, soloAdmin } from '../middlewares/auth.middleware.js'

const router = Router()

router.patch('/:id/fix', ctrl.updateUsuario) // ← TEMPORAL

router.get('/', verificarToken, soloAdmin, ctrl.getAllUsuarios)
router.get('/:id', verificarToken, ctrl.getUsuarioById)
router.post('/', verificarToken, soloAdmin, ctrl.createUsuario)
router.put('/:id', verificarToken, ctrl.updateUsuario)
router.patch('/:id', verificarToken, soloAdmin, ctrl.updateUsuario)
router.delete('/:id', verificarToken, soloAdmin, ctrl.deleteUsuario)

export default router