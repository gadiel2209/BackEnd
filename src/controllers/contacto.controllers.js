import Contacto from '../models/contacto.models.js'; 

export const enviarReporte = async (req, res) => {
    const { nombre, correo, asunto, mensaje } = req.body;

    if (!nombre || !correo || !mensaje) {
        return res.status(400).json({ message: "Nombre, correo y mensaje son obligatorios." });
    }

    try {
        const nuevoContacto = {
            nombre,
            correo,
            asunto: asunto || "Sin asunto",
            mensaje
        };

        // Esperamos la ejecución del modelo
        const data = await Contacto.create(nuevoContacto);

        res.status(201).json({
            message: "¡Reporte enviado!",
            id: data.insertId
        });
    } catch (error) {
        console.error("Error en BD:", error);
        res.status(500).json({ message: "Error al guardar el reporte en la base de datos" });
    }
};