import { Router } from 'express'
import * as ctrl from '../controllers/ajustes.controllers.js'

const router = Router()

// GET /api/ajustes -> Para pintar el Footer y la página de contacto
router.get('/', ctrl.getAjustes)

// PUT /api/ajustes/:clave -> Para que el admin edite los datos
router.put('/:clave', ctrl.updateAjuste)

export default router