import db from '../config/db.js'

// --- MISIÓN ---
export const getMision = async () => {
    const [rows] = await db.query('SELECT * FROM mision LIMIT 1')
    return rows[0]
}

export const updateMision = async (id, descripcion) => {
    const [result] = await db.query(
        'UPDATE mision SET descripcion = ? WHERE id = ?',
        [descripcion, id]
    )
    return result.affectedRows
}

// --- VISIÓN ---
export const getVision = async () => {
    const [rows] = await db.query('SELECT * FROM vision LIMIT 1')
    return rows[0]
}

export const updateVision = async (id, descripcion) => {
    const [result] = await db.query(
        'UPDATE vision SET descripcion = ? WHERE id = ?',
        [descripcion, id]
    )
    return result.affectedRows
}

// --- QUIÉNES SOMOS ---
export const getQuienes = async () => {
    const [rows] = await db.query('SELECT * FROM quienes LIMIT 1')
    return rows[0]
}

export const updateQuienes = async (id, descripcion) => {
    // Nota: Se usa 'descricion' tal cual está en tu SQL
    const [result] = await db.query(
        'UPDATE quienes SET descricion = ? WHERE id = ?',
        [descripcion, id]
    )
    return result.affectedRows
}