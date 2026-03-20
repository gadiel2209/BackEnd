import express from 'express';
import { enviarReporte, obtenerMensajes } from '../controllers/contacto.controllers.js';

const router = express.Router();

router.post('/', enviarReporte);
router.get('/', obtenerMensajes);

export default router;
