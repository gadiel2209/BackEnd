const express = require('express');
const router = express.Router();
const contactoController = require('../controllers/contacto.controller');

// Ruta para enviar el formulario de contacto
// Se accederá mediante POST a: /api/contacto
router.post('/', contactoController.enviarReporte);

module.exports = router;