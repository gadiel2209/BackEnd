import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as usuarioModel from '../models/usuario.models.js';

export const register = async (req, res) => {
    try {
        const { nombre, ap_paterno, ap_materno, usuario, correo, password, id_rol } = req.body;

        if (!nombre || !ap_paterno || !ap_materno || !usuario || !correo || !password) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        const existeCorreo = await usuarioModel.findUsuarioByCorreo(correo);
        if (existeCorreo) return res.status(409).json({ message: 'El correo ya está registrado' });

        const existeUsuario = await usuarioModel.findUsuarioByUsername(usuario);
        if (existeUsuario) return res.status(409).json({ message: 'El nombre de usuario ya está en uso' });

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // id_rol 2 = Usuario por defecto si no se especifica
        const rolAsignado = id_rol ?? 2;

        const nuevoId = await usuarioModel.createUsuario({
            nombre,
            ap_paterno,
            ap_materno,
            usuario,
            correo,
            password: passwordHash,
            id_rol: rolAsignado,
        });

        res.status(201).json({ message: 'Usuario creado con éxito', id: nuevoId });
    } catch (error) {
        console.error('Error en register:', error);
        res.status(500).json({ error: 'Error interno en el servidor' });
    }
};

export const login = async (req, res) => {
    try {
        const { correo, password } = req.body;

        if (!correo || !password) {
            return res.status(400).json({ message: 'Correo y contraseña son obligatorios' });
        }

        const usuarioEncontrado = await usuarioModel.findUsuarioByCorreo(correo);
        if (!usuarioEncontrado) return res.status(401).json({ message: 'Credenciales inválidas' });

        const esValida = await bcrypt.compare(password, usuarioEncontrado.password);
        if (!esValida) return res.status(401).json({ message: 'Credenciales inválidas' });

        const token = jwt.sign(
            {
                id: usuarioEncontrado.id_usuario,
                correo: usuarioEncontrado.correo,
                usuario: usuarioEncontrado.usuario,
                id_rol: usuarioEncontrado.id_rol,
            },
            process.env.JWT_SECRET || 'clave_temporal_de_emergencia',
            { expiresIn: '8h' }
        );

        res.json({
            token,
            usuario: {
                id: usuarioEncontrado.id_usuario,
                nombre: `${usuarioEncontrado.nombre} ${usuarioEncontrado.ap_paterno}`,
                usuario: usuarioEncontrado.usuario,
                id_rol: usuarioEncontrado.id_rol,
            },
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ error: 'Error en el proceso de login' });
    }
};