import { Router } from 'express'
// Importa todas las funciones y las agrupa en el objeto userCtrl
import * as userCtrl from '../controllers/usuarios.controllers.js' 
import { verificarToken } from '../middlewares/auth.middleware.js'

const router = Router()

// Ahora userCtrl ya está definido y esto no dará error
router.get('/', verificarToken, userCtrl.getUsuarios) 
router.get('/total', userCtrl.getTotalUsuarios)
router.get('/perfil', verificarToken, (req, res) => {
    // Si llega aquí, es porque verificarToken ejecutó next()
    res.json(req.usuario); 
});
router.put('/password', verificarToken, userCtrl.cambiarPassword)

export default router