import db from '../config/db.js'

export const getAllMarcas = async() => {
    const [rows] = await db.query(`SELECT * FROM marcas ORDER BY id_marca DESC`)
    return rows
}

export const getMarcaById = async(id) => {
    // Corregido: 'marcas' en plural
    const [rows] = await db.query('SELECT * FROM marcas WHERE id_marca = ?', [id])
    return rows[0]
}

export const createMarca = async({ nombre }) => {
    const [result] = await db.query(`INSERT INTO marcas (nombre) VALUES (?)`, [nombre])
        // Corregido: devolvemos id_marca para mantener consistencia
    return { id_marca: result.insertId, nombre }
}

export const updateMarca = async(id, nombre) => {
    const [result] = await db.query('UPDATE marcas SET nombre = ? WHERE id_marca = ?', [nombre, id])
    return result.affectedRows
}

export const deleteMarca = async(id) => {
    // Corregido: Sintaxis de la query
    const [result] = await db.query('DELETE FROM marcas WHERE id_marca = ?', [id])
    return result.affectedRows
}