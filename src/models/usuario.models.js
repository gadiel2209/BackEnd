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
    const [result] = await db.query(
        `INSERT INTO usuarios (nombre, ap_paterno, ap_materno, correo, usuario, password, id_rol)
         VALUES (?, ?, ?, ?, ?, ?, ?)`, 
        [nombre, ap_paterno, ap_materno, correo, usuario, password, id_rol]
    )
    return { id: result.insertId, nombre, usuario, correo }
}

// Actualizar usuario existente
export const updateUsuario = async (id, datos) => {
    try {
        // 1. Extraer los nombres de las propiedades que vienen en 'datos' (ej: ['password'])
        const campos = Object.keys(datos);
        
        if (campos.length === 0) return 0;

        // 2. Construir la parte dinámica del SET: "password = ?" o "nombre = ?, usuario = ?..."
        const setQuery = campos.map(campo => `${campo} = ?`).join(', ');
        
        // 3. Obtener los valores en el mismo orden
        const valores = Object.values(datos);
        
        // 4. Agregar el ID para el WHERE
        valores.push(id);

        const [result] = await db.query(
            `UPDATE usuarios SET ${setQuery} WHERE id_usuario = ?`,
            valores
        );

        return result.affectedRows;
    } catch (error) {
        // Esto ayudará a ver en la terminal del servidor qué falló exactamente
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