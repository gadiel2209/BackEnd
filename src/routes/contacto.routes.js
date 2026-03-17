import express from 'express';
const router = express.Router();
import contactoController from '../controllers/contacto.controller.js';

// Tu ruta
router.post('/', contactoController.enviarReporte);

// ESTA ES LA LÍNEA QUE FALTA O ESTÁ MAL:
export default router;