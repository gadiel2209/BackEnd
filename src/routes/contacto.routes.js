import express from 'express';
// Importamos el controlador usando llaves si es una exportación nombrada
import { enviarReporte } from '../controllers/contacto.controllers.js';

const router = express.Router();

router.post('/', enviarReporte);

// ESTA LÍNEA ES LA QUE SOLUCIONA EL ERROR:
export default router;