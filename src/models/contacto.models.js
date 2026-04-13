import db from '../config/db.js';

const Contacto = {

    // ─── CREAR MENSAJE (formulario público y usuario) ─────────────
    create: async (nuevo) => {
        const query = `
            INSERT INTO contacto (nombre, correo, asunto, mensaje)
            VALUES (?, ?, ?, ?)`;
        const [result] = await db.query(query, [
            nuevo.nombre,
            nuevo.correo,
            nuevo.asunto,
            nuevo.mensaje
        ]);
        return result;
    },

    // ─── OBTENER TODOS (para el admin) ───────────────────────────
    getAll: async () => {
        const [rows] = await db.query(`
            SELECT
                id_contacto  AS _id,
                nombre,
                correo,
                asunto,
                mensaje,
                respuesta,
                fecha_respuesta,
                fecha        AS createdAt
            FROM contacto
            ORDER BY fecha DESC
        `);
        return rows;
    },

    // ─── OBTENER MENSAJES DE UN CORREO (para el usuario) ─────────
    getByCorreo: async (correo) => {
        const [rows] = await db.query(`
            SELECT
                id_contacto  AS _id,
                nombre,
                correo,
                asunto,
                mensaje,
                respuesta,
                fecha_respuesta,
                fecha        AS createdAt
            FROM contacto
            WHERE correo = ?
            ORDER BY fecha DESC
        `, [correo]);
        return rows;
    },

    // ─── GUARDAR RESPUESTA DEL ADMIN ──────────────────────────────
    responder: async (id, respuesta) => {
        const [result] = await db.query(`
            UPDATE contacto
            SET respuesta = ?, fecha_respuesta = NOW()
            WHERE id_contacto = ?
        `, [respuesta, id]);
        return result;
    },

    // ─── ELIMINAR ─────────────────────────────────────────────────
    delete: async (id) => {
        return await db.query(
            'DELETE FROM contacto WHERE id_contacto = ?',
            [id]
        );
    }
};

export default Contacto;