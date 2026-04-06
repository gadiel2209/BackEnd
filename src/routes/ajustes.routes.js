import { Router } from 'express';
import { 
    getAjustesPublicos, 
    getAjustesAdmin, 
    getAjuste,
    createAjuste, 
    updateAjuste 
} from '../controllers/ajustes.controllers.js';

const router = Router();

router.get('/ajustes', getAjustesPublicos);
router.get('/ajustes/:clave', getAjuste);
router.get('/admin/ajustes', getAjustesAdmin);
router.post('/admin/ajustes', createAjuste);
router.put('/admin/ajustes/:clave', updateAjuste);

export default router;