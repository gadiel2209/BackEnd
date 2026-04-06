import db from '../config/db.js'

// Obtener todos los ajustes con sus descripciones (para el admin)
export const getAllAjustes = async () => {
    const [rows] = await db.query('SELECT id, clave, valor, descripcion FROM ajustes_globales')
    return rows
}

// Obtener un solo ajuste por su clave (devuelve null si no existe)
export const getAjusteByClave = async (clave) => {
    const [rows] = await db.query('SELECT valor FROM ajustes_globales WHERE clave = ?', [clave])
    return rows.length > 0 ? rows[0] : null; 
}

// Actualizar un ajuste existente
export const updateAjuste = async (clave, valor) => {
    const [result] = await db.query(
        'UPDATE ajustes_globales SET valor = ? WHERE clave = ?',
        [valor, clave]
    )
    return result.affectedRows
}

// Crear un nuevo ajuste
export const createAjuste = async ({ clave, valor, descripcion }) => {
    const [result] = await db.query(
        'INSERT INTO ajustes_globales (clave, valor, descripcion) VALUES (?, ?, ?)',
        [clave, valor, descripcion]
    );
    return result; 
};