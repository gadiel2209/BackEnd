// Agrega un comentario vacío al final de la línea 1
import * as usuarioModel from '../models/usuarios.models.js' // fix
import bcrypt from 'bcryptjs'

// ... (tus imports anteriores)

// GET /api/usuarios — Solo Admin
export const getUsuarios = async (req, res) => {
    try {
        const usuarios = await usuarioModel.getAllUsuarios();
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PUT /api/usuarios/update-perfil — Usuario edita sus propios datos
export const updatePerfil = async (req, res) => {
    try {
        const id = req.usuario.id;
        const { nombre, ap_paterno, ap_materno, correo, usuario } = req.body;

        // Validar que no existan duplicados si cambia correo o user
        const result = await usuarioModel.updateUsuario(id, { nombre, ap_paterno, ap_materno, correo, usuario });
        
        if (result === 0) return res.status(400).json({ message: "No se realizaron cambios." });
        
        res.status(200).json({ message: "Perfil actualizado con éxito." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE /api/usuarios/:id — Solo Admin
export const eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await usuarioModel.deleteUsuario(id);
        
        if (result === 0) return res.status(404).json({ message: "Usuario no encontrado." });
        
        res.status(200).json({ message: "Usuario eliminado correctamente." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};