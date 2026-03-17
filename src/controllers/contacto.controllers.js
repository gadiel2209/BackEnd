// USA IMPORT EN LUGAR DE REQUIRE
import Contacto from '../models/contacto.models.js'; 

// Exporta la función directamente
export const enviarReporte = (req, res) => {
    const { nombre, correo, asunto, mensaje } = req.body;

    if (!nombre || !correo || !mensaje) {
        return res.status(400).json({
            message: "Nombre, correo y mensaje son obligatorios."
        });
    }

    const nuevoContacto = {
        nombre,
        correo,
        asunto: asunto || "Sin asunto",
        mensaje
    };

    Contacto.create(nuevoContacto, (err, data) => {
        if (err) {
            res.status(500).json({ message: "Error al guardar el reporte" });
        } else {
            res.status(201).json({
                message: "¡Reporte enviado!",
                data: data
            });
        }
    });
};