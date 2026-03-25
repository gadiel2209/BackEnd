import { Router } from 'express'
import * as ctrl from '../controllers/categorias.controllers.js'

const router = Router()

router.get('/', ctrl.getAllCategorias)
router.get('/:id', ctrl.getCategoriaById)
router.post('/', ctrl.createCategoria)
router.put('/:id', ctrl.updateCategoria)
router.delete('/:id', ctrl.deleteCategoria)

export default router