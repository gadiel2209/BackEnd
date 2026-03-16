import db from '../config/db.js'

// ── BUSCAR POR CORREO — login y validación de registro ─────────────
export const findUsuarioByCorreo = async (correo) => {
    const [rows] = await db.query(
        'SELECT * FROM usuarios WHERE correo = ?',
        [correo]
    )
    return rows[0] || null
}

// ── BUSCAR POR USERNAME — validación de registro ───────────────────
export const findUsuarioByUsername = async (usuario) => {
    const [rows] = await db.query(
        'SELECT * FROM usuarios WHERE usuario = ?',
        [usuario]
    )
    return rows[0] || null
}

// ── BUSCAR POR ID — perfil y middleware ────────────────────────────
export const findUsuarioById = async (id_usuario) => {
    const [rows] = await db.query(
        `SELECT u.id_usuario, u.nombre, u.ap_paterno, u.ap_materno,
                u.correo, u.usuario, u.id_rol, u.fecha_registro,
                r.nombre AS rol
        FROM usuarios u
        INNER JOIN roles r ON u.id_rol = r.id_rol
        WHERE u.id_usuario = ?`,
        [id_usuario]
    )
    return rows[0] || null
}

// ── CREAR USUARIO ──────────────────────────────────────────────────
export const createUsuario = async ({ nombre, ap_paterno, ap_materno, correo, usuario, password, id_rol }) => {
    const [result] = await db.query(
        `INSERT INTO usuarios (nombre, ap_paterno, ap_materno, correo, usuario, password, id_rol)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [nombre, ap_paterno, ap_materno, correo, usuario, password, id_rol]
    )
    return result.insertId
}

// ── OBTENER TODOS — panel admin ────────────────────────────────────
export const getAllUsuarios = async () => {
    const [rows] = await db.query(
        `SELECT u.id_usuario, u.nombre, u.ap_paterno, u.ap_materno,
                u.correo, u.usuario, u.id_rol, u.fecha_registro,
                r.nombre AS rol
        FROM usuarios u
        INNER JOIN roles r ON u.id_rol = r.id_rol
        ORDER BY u.fecha_registro DESC`
    )
    return rows
}

// ── ACTUALIZAR DATOS BÁSICOS ───────────────────────────────────────
export const updateUsuario = async (id_usuario, { nombre, ap_paterno, ap_materno, correo, usuario }) => {
    const [result] = await db.query(
        `UPDATE usuarios
        SET nombre = ?, ap_paterno = ?, ap_materno = ?, correo = ?, usuario = ?
        WHERE id_usuario = ?`,
        [nombre, ap_paterno, ap_materno, correo, usuario, id_usuario]
    )
    return result.affectedRows
}

// ── ACTUALIZAR CONTRASEÑA ──────────────────────────────────────────
export const updatePassword = async (id_usuario, passwordHash) => {
    const [result] = await db.query(
        'UPDATE usuarios SET password = ? WHERE id_usuario = ?',
        [passwordHash, id_usuario]
    )
    return result.affectedRows
}

// ── ELIMINAR USUARIO ───────────────────────────────────────────────
export const deleteUsuario = async (id_usuario) => {
    const [result] = await db.query(
        'DELETE FROM usuarios WHERE id_usuario = ?',
        [id_usuario]
    )
    return result.affectedRows
}