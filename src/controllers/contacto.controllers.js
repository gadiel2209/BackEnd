import Contacto from '../models/contacto.models.js'; 

// ASEGÚRATE DE QUE TENGA "export const"
export const enviarReporte = async (req, res) => {
    const { nombre, correo, asunto, mensaje } = req.body;

    if (!nombre || !correo || !mensaje) {
        return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    try {
        const nuevoContacto = { nombre, correo, asunto, mensaje };
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

// ASEGÚRATE DE QUE TENGA "export const"
export const obtenerMensajes = async (req, res) => {
    try {
        const mensajes = await Contacto.getAll();
        res.status(200).json(mensajes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ASEGÚRATE DE QUE TENGA "export const"
export const borrarMensaje = async (req, res) => {
    try {
        const { id } = req.params;
        await Contacto.delete(id);
        res.status(200).json({ message: "Mensaje eliminado" });
    } catch (error) {
        res.status(500).json({ message: "Error al borrar" });
    }
};