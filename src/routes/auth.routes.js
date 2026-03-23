import { Router } from 'express'
import { login, register, enviarCodigo, verificarCodigo } from '../controllers/auth.controllers.js'

const router = Router()

router.post('/login',           login)
router.post('/register',        register)
router.post('/enviar-codigo',   enviarCodigo)
router.post('/verificar-codigo', verificarCodigo)
router.get('/', (req, res) => {
    res.json({ message: "Auth endpoint activo." })
})

export default router