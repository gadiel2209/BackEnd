// categorias.routes.js
import { Router } from 'express'
import * as ctrl from '../controllers/categorias.controllers.js'

const router = Router()

router.get('/', ctrl.getAllCategorias)
router.get('/:id', ctrl.getCategoriaById) // Este permite ver una sola
router.post('/', ctrl.createCategoria)
router.put('/:id', ctrl.updateCategoria)
router.delete('/:id', ctrl.deleteCategoria) // <--- ESTA ES LA QUE FALTA EN PRODUCCIÓN

export default router