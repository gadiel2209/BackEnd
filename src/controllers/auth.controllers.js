import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as usuarioModel from '../models/usuarios.models.js';
import db from '../config/db.js'; 

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

// ── ENVIAR CÓDIGO ─────────────────────────────────────────────────
export const enviarCodigo = async (req, res) => {
    const { correo } = req.body
    if (!correo) return res.status(400).json({ message: 'Correo requerido' })

    try {
        // Generar código de 6 dígitos
        const codigo = Math.floor(100000 + Math.random() * 900000).toString()

        // Expiración: 10 minutos
        const fecha_expiracion = new Date(Date.now() + 10 * 60 * 1000)
            .toISOString().slice(0, 19).replace('T', ' ')

        // Eliminar códigos anteriores del mismo correo
        await db.query('DELETE FROM verificacion_correo WHERE correo = ?', [correo])

        // Insertar nuevo código
        await db.query(
            'INSERT INTO verificacion_correo (correo, codigo, fecha_expiracion) VALUES (?, ?, ?)',
            [correo, codigo, fecha_expiracion]
        )

        // Devolver el código al frontend para que EmailJS lo envíe
        res.status(200).json({ message: 'Código generado', codigo })

    } catch (error) {
        console.error('Error en enviarCodigo:', error)
        res.status(500).json({ message: 'Error al generar código' })
    }
}

// ── VERIFICAR CÓDIGO ──────────────────────────────────────────────
export const verificarCodigo = async (req, res) => {
    const { correo, codigo } = req.body
    if (!correo || !codigo) return res.status(400).json({ message: 'Correo y código requeridos' })

    try {
        const [rows] = await db.query(
            `SELECT * FROM verificacion_correo 
            WHERE correo = ? AND codigo = ? AND fecha_expiracion > NOW()
            ORDER BY id DESC LIMIT 1`,
            [correo, codigo]
        )

        if (rows.length === 0)
            return res.status(400).json({ message: 'Código incorrecto o expirado' })

        // Eliminar código usado
        await db.query('DELETE FROM verificacion_correo WHERE correo = ?', [correo])

        res.status(200).json({ message: 'Código verificado correctamente', verificado: true })

    } catch (error) {
        console.error('Error en verificarCodigo:', error)
        res.status(500).json({ message: 'Error al verificar código' })
    }
}