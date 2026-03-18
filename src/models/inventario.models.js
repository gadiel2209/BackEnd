import db from '../config/db.js';

// Obtener todos los equipos con detalles técnicos
export const getAllEquipos = async () => {
    const [rows] = await db.query(`
        SELECT e.id_equipo, e.nombre, e.descripcion, e.ruta_imagen, e.codigo_qr, e.estado, e.fecha_registro,
               c.nombre AS categoria
        FROM equipos e
        INNER JOIN categorias c ON e.id_categoria = c.id_categoria
    `);
    return rows;
};

// Obtener equipo por ID
export const getEquipoById = async (id) => {
    const [rows] = await db.query(`
        SELECT e.*, c.nombre AS categoria
        FROM equipos e
        INNER JOIN categorias c ON e.id_categoria = c.id_categoria
        WHERE e.id_equipo = ?
    `, [id]);
    return rows[0];
};

// Crear equipo
export const createEquipo = async ({ nombre, descripcion, ruta_imagen, codigo_qr, id_categoria, estado }) => {
    const [result] = await db.query(
        `INSERT INTO equipos (nombre, descripcion, ruta_imagen, codigo_qr, id_categoria, estado)
         VALUES (?, ?, ?, ?, ?, ?)`, 
        [nombre, descripcion || null, ruta_imagen || null, codigo_qr || null, id_categoria, estado || 'disponible']
    );
    return { id_equipo: result.insertId, nombre, estado: estado || 'disponible' };
};

// Actualizar equipo
export const updateEquipo = async (id, { nombre, descripcion, ruta_imagen, codigo_qr, id_categoria, estado }) => {
    const [result] = await db.query(
        `UPDATE equipos 
         SET nombre = ?, descripcion = ?, ruta_imagen = ?, codigo_qr = ?, id_categoria = ?, estado = ?
         WHERE id_equipo = ?`,
        [nombre, descripcion || null, ruta_imagen || null, codigo_qr || null, id_categoria, estado, id]
    );
    return result.affectedRows;
};

// Eliminar equipo
export const deleteEquipo = async (id) => {
    const [result] = await db.query('DELETE FROM equipos WHERE id_equipo = ?', [id]);
    return result.affectedRows;
};