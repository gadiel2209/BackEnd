import db from '../config/db.js';

export const getAllMarcas = async() => {
    // Changed 'marcas' to 'marca'
    const [rows] = await db.query('SELECT * FROM marca');
    return rows;
};

export const getMarcaById = async(id) => {
    // Changed 'marcas' to 'marca'
    const [rows] = await db.query('SELECT * FROM marca WHERE id_marca = ?', [id]);
    return rows[0];
};

export const createMarca = async({ nombre }) => {
    // Changed 'marcas' to 'marca'
    const [result] = await db.query('INSERT INTO marca (nombre) VALUES (?)', [nombre]);
    return { id_marca: result.insertId, nombre };
};

export const updateMarca = async(id, nombre) => {
    // Changed 'marcas' to 'marca'
    const [result] = await db.query('UPDATE marca SET nombre = ? WHERE id_marca = ?', [nombre, id]);
    return result.affectedRows;
};

export const deleteMarca = async(id) => {
    // Changed 'marcas' to 'marca'
    const [result] = await db.query('DELETE FROM marca WHERE id_marca = ?', [id]);
    return result.affectedRows;
};