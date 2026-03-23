import db from '../config/db.js';

const Contacto = {
    // Para el formulario de envío
    create: async (nuevo) => {
        const query = "INSERT INTO contacto (nombre, correo, asunto, mensaje) VALUES (?, ?, ?, ?)";
        const [result] = await db.query(query, [nuevo.nombre, nuevo.correo, nuevo.asunto, nuevo.mensaje]);
        return result;
    },

    // Para el Buzón Admin (Mapeo de nombres para tu JS)
    getAll: async () => {
        const [rows] = await db.query(
            `SELECT 
                id AS _id, 
                nombre, 
                correo, 
                asunto, 
                mensaje, 
                fecha AS createdAt, 
                leido 
             FROM contacto 
             ORDER BY fecha DESC`
        );
        return rows;
    },

    // Para el botón de eliminar
    delete: async (id) => {
        return await db.query('DELETE FROM contacto WHERE id = ?', [id]);
    }
};

export default Contacto;