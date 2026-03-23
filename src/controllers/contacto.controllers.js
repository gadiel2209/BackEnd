import Contacto from '../models/contacto.models.js'; 

export const enviarReporte = async (req, res) => {
    const { nombre, correo, asunto, mensaje } = req.body;
    if (!nombre || !correo || !mensaje) {
        return res.status(400).json({ message: "Faltan datos obligatorios" });
    }
    try {
        const result = await Contacto.create({ nombre, correo, asunto, mensaje });
        res.status(201).json({ message: "¡Reporte enviado!", id: result.insertId });
    } catch (error) {
        res.status(500).json({ message: "Error al guardar" });
    }
};

export const obtenerMensajes = async (req, res) => {
    try {
        const mensajes = await Contacto.getAll();
        res.status(200).json(mensajes); // Retorna el array que espera renderizarLista()
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// controllers/contacto.controllers.js
export const borrarMensaje = async (req, res) => {
    try {
        const { id } = req.params; // Captura el ID de la URL
        const result = await Contacto.delete(id);

        if (result.affectedRows > 0) {
            res.status(200).json({ message: "Mensaje eliminado" });
        } else {
            res.status(404).json({ message: "Mensaje no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el mensaje" });
    }
};