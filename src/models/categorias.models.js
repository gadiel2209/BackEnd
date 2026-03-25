import db from '../config/db.js'

export const getAllCategorias = async () => {
    const [rows] = await db.query('SELECT id_categoria, nombre FROM categorias ORDER BY nombre')
    return rows
}

// Obtener una sola para el modo edición
export const getCategoriaById = async (id) => {
    const [rows] = await db.query('SELECT * FROM categorias WHERE id_categoria = ?', [id])
    return rows[0]
}

export const createCategoria = async (nombre) => {
    const [result] = await db.query('INSERT INTO categorias (nombre) VALUES (?)', [nombre])
    return { id_categoria: result.insertId, nombre }
}

export const updateCategoria = async (id, nombre) => {
    await db.query('UPDATE categorias SET nombre = ? WHERE id_categoria = ?', [nombre, id])
    return { id_categoria: id, nombre }
}

export const deleteCategoria = async (id) => {
    const [result] = await db.query('DELETE FROM categorias WHERE id_categoria = ?', [id])
    return result
}