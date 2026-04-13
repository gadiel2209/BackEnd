import Contacto from '../models/contacto.models.js';

// ─── ENVIAR MENSAJE (público y usuario autenticado) ───────────────
export const enviarReporte = async (req, res) => {
    const { nombre, correo, asunto, mensaje } = req.body;

    if (!nombre || !correo || !mensaje) {
        return res.status(400).json({ message: 'Faltan datos obligatorios' });
    }

    try {
        const result = await Contacto.create({ nombre, correo, asunto, mensaje });
        res.status(201).json({ message: '¡Reporte enviado!', id: result.insertId });
    } catch (error) {
        console.error('Error al guardar contacto:', error);
        res.status(500).json({ message: 'Error al guardar en la base de datos' });
    }
};

// ─── OBTENER TODOS (solo admin) ───────────────────────────────────
export const obtenerMensajes = async (req, res) => {
    try {
        const mensajes = await Contacto.getAll();
        res.status(200).json(mensajes);
    } catch (error) {
        console.error('Error al obtener mensajes:', error);
        res.status(500).json({ message: error.message });
    }
};

// ─── OBTENER MIS MENSAJES (usuario autenticado) ───────────────────
// Requiere middleware de autenticación que ponga req.usuario
export const obtenerMisMensajes = async (req, res) => {
    try {
        // El middleware de auth debe dejar el correo en req.usuario.correo
        const correo = req.usuario?.correo;

        if (!correo) {
            return res.status(401).json({ message: 'No autorizado' });
        }

        const mensajes = await Contacto.getByCorreo(correo);
        res.status(200).json(mensajes);
    } catch (error) {
        console.error('Error al obtener mis mensajes:', error);
        res.status(500).json({ message: error.message });
    }
};

// ─── RESPONDER MENSAJE (solo admin) ──────────────────────────────
export const responderMensaje = async (req, res) => {
    const { id } = req.params;
    const { respuesta } = req.body;

    if (!respuesta || respuesta.trim() === '') {
        return res.status(400).json({ message: 'La respuesta no puede estar vacía' });
    }

    try {
        const result = await Contacto.responder(id, respuesta.trim());

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Mensaje no encontrado' });
        }

        res.status(200).json({ message: 'Respuesta guardada correctamente' });
    } catch (error) {
        console.error('Error al responder:', error);
        res.status(500).json({ message: 'Error al guardar la respuesta' });
    }
};

// ─── ELIMINAR (solo admin) ────────────────────────────────────────
export const borrarMensaje = async (req, res) => {
    try {
        const { id } = req.params;
        await Contacto.delete(id);
        res.status(200).json({ message: 'Mensaje eliminado' });
    } catch (error) {
        console.error('Error al borrar:', error);
        res.status(500).json({ message: 'Error al borrar' });
    }
};