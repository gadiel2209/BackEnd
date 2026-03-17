const Contacto = require('../models/contacto.models');

export const enviarReporte = (req, res) => {
    // Validar que los campos obligatorios lleguen en el body
    const { nombre, correo, mensaje } = req.body;

    if (!nombre || !correo || !mensaje) {
        return res.status(400).send({
            message: "Nombre, correo y mensaje son campos obligatorios."
        });
    }

    // Crear el objeto con los datos del reporte/sugerencia
    const nuevoContacto = {
        nombre: nombre,
        correo: correo,
        asunto: req.body.asunto || "Sin asunto",
        mensaje: mensaje
    };

    // Guardar en la base de datos
    Contacto.create(nuevoContacto, (err, data) => {
        if (err) {
            res.status(500).send({
                message: "Ocurrió un error al procesar tu reporte."
            });
        } else {
            res.status(201).send({
                message: "¡Reporte enviado con éxito!",
                data: data
            });
        }
    });

    res.status(201).json({ message: "Reporte recibido" });
};
export default { enviarReporte };