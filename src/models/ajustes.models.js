import db from '../config/db.js'

// Obtener todos (útil para el panel de configuración del admin)
export const getAllAjustes = async () => {
    const [rows] = await db.query('SELECT clave, valor FROM ajustes_globales')
    return rows
}

// Obtener uno solo (útil para el frontend, ej: obtener solo 'telefono_contacto')
export const getAjusteByClave = async (clave) => {
    const [rows] = await db.query('SELECT valor FROM ajustes_globales WHERE clave = ?', [clave])
    return rows[0]
}

// Actualizar (La función que permite el cambio real)
export const updateAjuste = async (clave, valor) => {
    const [result] = await db.query(
        'UPDATE ajustes_globales SET valor = ? WHERE clave = ?',
        [valor, clave]
    )
    return result.affectedRows
}
// Añade esto a tu archivo de modelos
export const createAjuste = async ({ clave, valor, descripcion }) => {
    const [result] = await db.query(
        'INSERT INTO ajustes_globales (clave, valor, descripcion) VALUES (?, ?, ?)',
        [clave, valor, descripcion]
    );
    return result; 
};