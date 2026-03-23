import express from 'express';
import { enviarReporte, obtenerMensajes, borrarMensaje } from '../controllers/contacto.controllers.js';

const router = express.Router();

router.get('/', obtenerMensajes);
router.post('/', enviarReporte);
router.delete('/:id', borrarMensaje); // Importante para eliminarMensajeAPI(id)

export default router;