import db from '../config/db.js'

export const getAllCategorias = async () => {
    const [rows] = await db.query('SELECT id_categoria, nombre FROM categorias ORDER BY nombre')
    return rows
}


export const createAjuste = async ({ clave, valor, descripcion }) => {
    const [result] = await db.query(
        'INSERT INTO ajustes_globales (clave, valor, descripcion) VALUES (?, ?, ?)',
        [clave, valor, descripcion || null]
    )
    return { id: result.insertId, clave, valor, descripcion }
}