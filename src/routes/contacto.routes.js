import express from 'express';
// Los nombres dentro de {} deben ser iguales a los del controlador
import { enviarReporte, obtenerMensajes, borrarMensaje } from '../controllers/contacto.controllers.js';

const router = express.Router();

router.post('/', enviarReporte);
router.get('/', obtenerMensajes);
router.delete('/:id', borrarMensaje);

export default router;