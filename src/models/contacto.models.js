import db from '../config/db.js';

const Contacto = {
    // Crear mensaje
    create: async (nuevoContacto) => {
        const query = "INSERT INTO contacto (nombre, correo, asunto, mensaje) VALUES (?, ?, ?, ?)";
        const values = [nuevoContacto.nombre, nuevoContacto.correo, nuevoContacto.asunto, nuevoContacto.mensaje];
        const [result] = await db.query(query, values);
        return result;
    },

    // Obtener todos para el Buzón (Cambiamos id por _id para tu frontend)
    getAll: async () => {
        // Seleccionamos 'id' como '_id' y 'fecha' como 'createdAt' para que coincida con tu JS
        const [rows] = await db.query(
            'SELECT id AS _id, nombre, correo, asunto, mensaje, fecha AS createdAt FROM contacto ORDER BY fecha DESC'
        );
        return rows;
    },

    // Eliminar mensaje (Para la función eliminarMensajeAPI)
    delete: async (id) => {
        const [result] = await db.query('DELETE FROM contacto WHERE id = ?', [id]);
        return result;
    }
};

export default Contacto;