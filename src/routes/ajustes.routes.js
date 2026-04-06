import { Router } from 'express';
import { 
    getAjustesPublicos, 
    getAjustesAdmin, 
    getAjuste,
    createAjuste, 
    updateAjuste 
} from '../controllers/ajustes.controllers.js';

const router = Router();
router.get('/', getAjustesPublicos);
router.get('/:clave', getAjuste);
router.get('/admin', getAjustesAdmin);
router.post('/admin', createAjuste);
router.put('/admin/:clave', updateAjuste);

export default router;