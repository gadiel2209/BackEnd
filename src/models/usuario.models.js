import db from '../config/db.js'

// Obtener todos los usuarios con su rol
export const getAllUsuarios = async() => {
    const [rows] = await db.query(`
        SELECT u.id_usuario, u.nombre, u.ap_paterno, u.ap_materno, 
               u.correo, u.usuario, u.id_rol, u.fecha_registro,
               r.nombre AS rol
        FROM usuarios u
        INNER JOIN roles r ON u.id_rol = r.id_rol
    `)
    return rows
}

// Obtener un usuario por ID
export const getUsuarioById = async(id) => {
    const [rows] = await db.query(`
        SELECT u.id_usuario, u.nombre, u.ap_paterno, u.ap_materno, 
               u.correo, u.usuario, u.id_rol, u.fecha_registro,
               r.nombre AS rol
        FROM usuarios u
        INNER JOIN roles r ON u.id_rol = r.id_rol
        WHERE u.id_usuario = ?
    `, [id])
    return rows[0]
}

// Crear nuevo usuario (Nota: password debe venir ya cifrada)
export const createUsuario = async({ nombre, ap_paterno, ap_materno, correo, usuario, password, id_rol }) => {
    const [result] = await db.query(
        `INSERT INTO usuarios (nombre, ap_paterno, ap_materno, correo, usuario, password, id_rol)
         VALUES (?, ?, ?, ?, ?, ?, ?)`, 
        [nombre, ap_paterno, ap_materno, correo, usuario, password, id_rol]
    )
    return { id: result.insertId, nombre, usuario, correo }
}

// Actualizar usuario existente
export const updateUsuario = async(id, { nombre, ap_paterno, ap_materno, correo, usuario, id_rol }) => {
    const [result] = await db.query(
        `UPDATE usuarios
         SET nombre = ?, ap_paterno = ?, ap_materno = ?, correo = ?, usuario = ?, id_rol = ?
         WHERE id_usuario = ?`, 
        [nombre, ap_paterno, ap_materno, correo, usuario, id_rol, id]
    )
    return result.affectedRows
}

// Eliminar usuario
export const deleteUsuario = async(id) => {
    const [result] = await db.query(
        'DELETE FROM usuarios WHERE id_usuario = ?', [id]
    )
    return result.affectedRows
}