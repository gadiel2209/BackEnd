import express from 'express';
import {
    enviarReporte,
    obtenerMensajes,
    obtenerMisMensajes,
    responderMensaje,
    borrarMensaje
} from '../controllers/contacto.controllers.js';

// Importa tu middleware de autenticación y el de verificar rol admin
// Ajusta la ruta según tu proyecto
import { verificarToken, soloAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Público — cualquiera puede enviar un mensaje
router.post('/',                   enviarReporte);

// Usuario autenticado — solo ve sus propios mensajes
router.get('/mis-mensajes',        verificarToken, obtenerMisMensajes);

// Admin — ve todos, responde y elimina
router.get('/',                    verificarToken, soloAdmin, obtenerMensajes);
router.put('/:id/responder',       verificarToken, soloAdmin, responderMensaje);
router.delete('/:id',              verificarToken, soloAdmin, borrarMensaje);

export default router;