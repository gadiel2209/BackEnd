import { Router } from 'express'
import { getPerfil, cambiarPassword, getTotalUsuarios } from '../controllers/usuarios.controllers.js'
import { verificarToken } from '../middlewares/auth.middleware.js'

const router = Router()

router.get('/', verificarToken, userCtrl.getUsuarios);
router.get('/total',    getTotalUsuarios)           // público — estadísticas
router.get('/perfil',   verificarToken, getPerfil)  // protegido
router.put('/password', verificarToken, cambiarPassword) // protegido


export default router