import db from '../config/db.js'

// Obtener todos los ajustes
export const getAllAjustes = async () => {
    const [rows] = await db.query('SELECT * FROM ajustes_globales')
    return rows
}

// Obtener un ajuste por su clave (ej: 'mision', 'contacto_email')
export const getAjusteByClave = async (clave) => {
    const [rows] = await db.query('SELECT * FROM ajustes_globales WHERE clave = ?', [clave])
    return rows[0]
}

// Crear un nuevo ajuste
export const createAjuste = async ({ clave, valor, descripcion }) => {
    const [result] = await db.query(
        `INSERT INTO ajustes_globales (clave, valor, descripcion) VALUES (?, ?, ?)`,
        [clave, valor, descripcion || null]
    )
    return { id: result.insertId, clave, valor, descripcion }
}

// Actualizar ajuste por clave
export const updateAjuste = async (clave, { valor, descripcion }) => {
    const [result] = await db.query(
        `UPDATE ajustes_globales SET valor = ?, descripcion = ? WHERE clave = ?`,
        [valor, descripcion || null, clave]
    )
    return result.affectedRows
}

// Eliminar ajuste
export const deleteAjuste = async (id) => {
    const [result] = await db.query('DELETE FROM ajustes_globales WHERE id = ?', [id])
    return result.affectedRows
}