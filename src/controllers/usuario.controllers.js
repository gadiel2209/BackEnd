import * as usuarioModelo from '../models/usuario.models.js'
import bcrypt from 'bcryptjs'

export const getAllUsuarios = async(req, res) => {
    try {
        const usuarios = await usuarioModelo.getAllUsuarios()
        res.status(200).json(usuarios)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const getUsuarioById = async(req, res) => {
    try {
        const id = parseInt(req.params.id)
        if (isNaN(id)) return res.status(400).json({ message: 'ID inválido' })

        const usuario = await usuarioModelo.getUsuarioById(id)
        if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' })

        res.status(200).json(usuario)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const createUsuario = async(req, res) => {
    try {
        const { nombre, ap_paterno, ap_materno, correo, usuario, password, id_rol } = req.body

        if (!nombre || !ap_paterno || !ap_materno || !correo || !usuario || !password || !id_rol) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' })
        }

        // ✅ Hashear password antes de guardar
        const salt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(password, salt)

        const nuevo = await usuarioModelo.createUsuario({ 
            ...req.body, 
            password: passwordHash 
        })
        res.status(201).json(nuevo)
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') 
            return res.status(409).json({ message: 'El correo o usuario ya están registrados' })
        res.status(500).json({ message: error.message })
    }
}

export const updateUsuario = async(req, res) => {
    try {
        const id = parseInt(req.params.id)
        if (isNaN(id)) return res.status(400).json({ message: 'ID inválido' })
        
        const datos = { ...req.body }

        // ✅ Ya estaba bien, hashea si viene password
        if (datos.password) {
            const salt = await bcrypt.genSalt(10)
            datos.password = await bcrypt.hash(datos.password, salt)
        }

        const afectados = await usuarioModelo.updateUsuario(id, datos)
        if (afectados === 0) return res.status(404).json({ message: 'Usuario no encontrado' })

        res.status(200).json({ message: 'Usuario actualizado correctamente' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const deleteUsuario = async(req, res) => {
    try {
        const id = parseInt(req.params.id)
        if (isNaN(id)) return res.status(400).json({ message: 'ID inválido' })
        
        const afectados = await usuarioModelo.deleteUsuario(id)
        if (afectados === 0) return res.status(404).json({ message: 'Usuario no encontrado' })

        res.status(200).json({ message: 'Usuario eliminado correctamente' })
    } catch (error) {
        if (error.code === 'ER_ROW_IS_REFERENCED_2')
            return res.status(409).json({ message: 'No se puede eliminar: el usuario tiene historial o solicitudes asociadas' })
        res.status(500).json({ message: error.message })
    }
}