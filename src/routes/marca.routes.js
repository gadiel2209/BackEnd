import { Router } from 'express'
import * as ctrl from '../controllers/marca.controllers.js'

const router = Router()

// Obtener todas las marcas
router.get('/', ctrl.getAllMarcas)

// Obtener una marca por ID (ESTA ES LA QUE TE DABA EL 404)
router.get('/:id', ctrl.getMarcaById) 

// Crear marca
router.post('/', ctrl.createMarca)

// Actualizar marca (ESTA ES LA QUE NECESITAS PARA GUARDAR CAMBIOS)
router.put('/:id', ctrl.updateMarca) 

// Eliminar marca
router.delete('/:id', ctrl.deleteMarca)

export default router