import { Router } from 'express'
import { login, register } from '../controllers/auth.controllers.js'

const router = Router()

router.post('/login',    login)
router.post('/register', register)
router.get('/', (req, res) => {
    res.json({ message: "Auth endpoint activo. Use POST /login o /register" });
});

export default router