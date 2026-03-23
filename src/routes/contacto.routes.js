import express from 'express';
import { enviarReporte, obtenerMensajes, borrarMensaje } from '../controllers/contacto.controllers.js';

const router = express.Router();

router.post('/', enviarReporte);
router.get('/', obtenerMensajes);
router.delete('/:id', borrarMensaje); // Coincide con fetch(`${API}/contacto/${id}`, { method: 'DELETE' })

export default router;