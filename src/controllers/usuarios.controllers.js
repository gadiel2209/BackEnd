// Agrega un comentario vacío al final de la línea 1
import * as usuarioModel from '../models/usuarios.models.js' // fix
import bcrypt from 'bcryptjs'

// Obtener todos los usuarios (para que /api/usuarios funcione)
export const getUsuarios = async (req, res) => {
    try {
        const usuarios = await usuarioModel.getAllUsuarios();
        res.status(200).json(usuarios);
    } catch (error) {
        // Esto ayudará a ver el error real en los logs de Vercel
        res.status(500).json({ 
            message: "Error al obtener usuarios", 
            error: error.message 
        });
    }
};

// GET /api/usuarios/perfil — requiere token
export const getPerfil = async (req, res) => {
    try {
        const id = req.usuario.id
        const usuario = await usuarioModel.findUsuarioById(id)
        if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' })

        // No devolver el password
        const { password, ...datos } = usuario
        res.status(200).json(datos)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// PUT /api/usuarios/password — requiere token
export const cambiarPassword = async (req, res) => {
    try {
        const id = req.usuario.id
        const { password_actual, password_nueva } = req.body

        if (!password_actual || !password_nueva)
            return res.status(400).json({ message: 'Todos los campos son obligatorios.' })

        if (password_nueva.length < 6)
            return res.status(400).json({ message: 'La nueva contraseña debe tener al menos 6 caracteres.' })

        const usuario = await usuarioModel.findUsuarioById(id)
        if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado.' })

        const esValida = await bcrypt.compare(password_actual, usuario.password)
        if (!esValida) return res.status(401).json({ message: 'La contraseña actual es incorrecta.' })

        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password_nueva, salt)

        await usuarioModel.updatePassword(id, hash)
        res.status(200).json({ message: 'Contraseña actualizada correctamente.' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// GET /api/usuarios/total — público, para estadísticas del login
export const getTotalUsuarios = async (req, res) => {
    try {
        const usuarios = await usuarioModel.getAllUsuarios()
        res.status(200).json({ total: usuarios.length })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}