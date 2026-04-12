import db from '../config/db.js'

// GET ALL
export const getAllUsuarios = async () => {
    const [rows] = await db.query(`
        SELECT u.id_usuario, u.nombre, u.ap_paterno, u.ap_materno,
               u.correo, u.usuario, u.fecha_registro, u.id_rol,
               r.nombre AS rol
        FROM usuarios u
        INNER JOIN roles r ON u.id_rol = r.id_rol
    `)
    return rows
}

// GET BY ID
export const getUsuarioById = async (id) => {
    const [rows] = await db.query(`
        SELECT u.id_usuario, u.nombre, u.ap_paterno, u.ap_materno,
               u.correo, u.usuario, u.fecha_registro, u.id_rol,
               r.nombre AS rol
        FROM usuarios u
        INNER JOIN roles r ON u.id_rol = r.id_rol
        WHERE u.id_usuario = ?
    `, [id])
    return rows[0]
}

// CREATE
export const createUsuario = async ({ nombre, ap_paterno, ap_materno, correo, usuario, password, id_rol }) => {
    const [result] = await db.query(
        `INSERT INTO usuarios (nombre, ap_paterno, ap_materno, correo, usuario, password, id_rol)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [nombre, ap_paterno, ap_materno, correo, usuario, password, id_rol]
    )
    return { id: result.insertId, nombre, ap_paterno, ap_materno, correo, usuario, id_rol }
}

// UPDATE
export const updateUsuario = async (id, { nombre, ap_paterno, ap_materno, correo, usuario, id_rol }) => {
    const [result] = await db.query(
        `UPDATE usuarios
         SET nombre = ?, ap_paterno = ?, ap_materno = ?, correo = ?, usuario = ?, id_rol = ?
         WHERE id_usuario = ?`,
        [nombre, ap_paterno, ap_materno, correo, usuario, id_rol, id]
    )
    return result.affectedRows
}

// DELETE EN CASCADA MANUAL
export const deleteUsuario = async (id) => {
    const conn = await db.getConnection()
    try {
        await conn.beginTransaction()

        // 1. Auditoría
        await conn.query(
            `DELETE FROM auditoria WHERE id_usuario = ?`, [id]
        )

        // 2. Verificación de correo — la tabla usa correo, no id_usuario
        await conn.query(`
            DELETE vc FROM verificacion_correo vc
            INNER JOIN usuarios u ON vc.correo = u.correo
            WHERE u.id_usuario = ?
        `, [id])

        // 3. Reportes — via solicitudes del usuario
        await conn.query(`
            DELETE r FROM reportes r
            INNER JOIN solicitudes s ON r.id_solicitud = s.id_solicitud
            WHERE s.id_usuario = ?
        `, [id])

        // 4. Historial — via solicitudes del usuario
        await conn.query(`
            DELETE h FROM historial h
            INNER JOIN solicitudes s ON h.id_solicitud = s.id_solicitud
            WHERE s.id_usuario = ?
        `, [id])

        // 5. Solicitudes
        await conn.query(
            `DELETE FROM solicitudes WHERE id_usuario = ?`, [id]
        )

        // 6. Usuario
        const [result] = await conn.query(
            `DELETE FROM usuarios WHERE id_usuario = ?`, [id]
        )

        await conn.commit()
        return result.affectedRows

    } catch (error) {
        await conn.rollback()
        throw error
    } finally {
        conn.release()
    }
}