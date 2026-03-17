import Contacto from '../models/contacto.models.js'; 

export const enviarReporte = async (req, res) => {
    const { nombre, correo, asunto, mensaje } = req.body;

    if (!nombre || !correo || !mensaje) {
        return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    try {
        const nuevoContacto = { nombre, correo, asunto, mensaje };
        
        // Esperamos a que la DB responda
        const result = await Contacto.create(nuevoContacto);

        res.status(201).json({
            message: "¡Reporte enviado!",
            id: result.insertId
        });
    } catch (error) {
        console.error("Error detallado:", error);
        res.status(500).json({ message: "Error al guardar en la base de datos" });
    }
};