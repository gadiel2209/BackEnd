import Contacto from '../models/contacto.models.js';

export const obtenerMensajes = async (req, res) => {
    try {
        const mensajes = await Contacto.getAll();
        res.status(200).json(mensajes); // Retorna el array para mensajesBuzon = data;
    } catch (error) {
        res.status(500).json({ message: "Error al obtener mensajes" });
    }
};

export const borrarMensaje = async (req, res) => {
    try {
        const { id } = req.params;
        await Contacto.delete(id);
        res.status(200).json({ message: "Eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar" });
    }
};

// ... mantener enviarReporte