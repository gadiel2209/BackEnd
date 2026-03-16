import { Router } from 'express'
import * as userCtrl from '../controllers/usuarios.controllers.js'
import { verificarToken } from '../middlewares/auth.middleware.js'

const router = Router()

// Públicas
router.get('/total', userCtrl.getTotalUsuarios)

// Protegidas (Cualquier usuario logueado)
router.get('/perfil', verificarToken, userCtrl.getPerfil)
router.put('/perfil', verificarToken, userCtrl.updatePerfil)
router.put('/password', verificarToken, userCtrl.cambiarPassword)

// Administrativas (Sugerencia: crear un middleware 'esAdmin')
router.get('/', verificarToken, userCtrl.getUsuarios)
router.delete('/:id', verificarToken, userCtrl.eliminarUsuario)

export default router