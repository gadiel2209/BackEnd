import db from '../config/db.js';

const Contacto = {
    create: async (nuevoContacto) => {
        const query = "INSERT INTO contacto (nombre, correo, asunto, mensaje) VALUES (?, ?, ?, ?)";
        const values = [
            nuevoContacto.nombre, 
            nuevoContacto.correo, 
            nuevoContacto.asunto, 
            nuevoContacto.mensaje
        ];

        // En mysql2/promise, query devuelve un array [filas, campos]
        const [result] = await db.query(query, values);
        return result;
    },

    getAll: async () => {
    const [rows] = await db.query(
        'SELECT * FROM contacto ORDER BY fecha DESC'
    );
    return rows;
}
};

export default Contacto;
