import { Router } from 'express';
import * as ctrl from '../controllers/inventario.controllers.js';

const router = Router();

router.get('/', ctrl.getAllEquipos);
router.get('/:id', ctrl.getEquipoById);
router.post('/', ctrl.createEquipo);
router.put('/:id', ctrl.updateEquipo);
router.delete('/:id', ctrl.deleteEquipo);

export default router;