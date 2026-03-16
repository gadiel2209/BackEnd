import db from '../config/db.js'
import bcrypt from 'bcryptjs'

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
// Actualizar solo la contraseña
export const updatePassword = async(id, nuevaPasswordCifrada) => {
    const [result] = await db.query(
        `UPDATE usuarios SET password = ? WHERE id_usuario = ?`, 
        [nuevaPasswordCifrada, id]
    )
    return result.affectedRows
}

// Crear nuevo usuario (Nota: password debe venir ya cifrada)
export const createUsuario = async({ nombre, ap_paterno, ap_materno, correo, usuario, password, id_rol }) => {
    // 2. Cifrar la contraseña antes de insertar
    const salt = await bcrypt.genSalt(10);
    const passwordCifrada = await bcrypt.hash(password, salt);

    const [result] = await db.query(
        `INSERT INTO usuarios (nombre, ap_paterno, ap_materno, correo, usuario, password, id_rol)
         VALUES (?, ?, ?, ?, ?, ?, ?)`, 
        [nombre, ap_paterno, ap_materno, correo, usuario, passwordCifrada, id_rol]
    )
    return { id: result.insertId, nombre, usuario, correo }
}

// Actualizar usuario existente
export const updateUsuario = async (id, datos) => {
    try {
        // 3. Si en los datos viene 'password', la ciframos antes de seguir
        if (datos.password) {
            const salt = await bcrypt.genSalt(10);
            datos.password = await bcrypt.hash(datos.password, salt);
        }

        const campos = Object.keys(datos);
        if (campos.length === 0) return 0;

        const setQuery = campos.map(campo => `${campo} = ?`).join(', ');
        const valores = Object.values(datos);
        valores.push(id);

        const [result] = await db.query(
            `UPDATE usuarios SET ${setQuery} WHERE id_usuario = ?`,
            valores
        );

        return result.affectedRows;
    } catch (error) {
        console.error("Error en updateUsuario:", error.message);
        throw error; 
    }
}

// Eliminar usuario
export const deleteUsuario = async(id) => {
    const [result] = await db.query(
        'DELETE FROM usuarios WHERE id_usuario = ?', [id]
    )
    return result.affectedRows
}