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

        // Usamos await porque la conexión es /promise
        const [result] = await db.query(query, values);
        return result;
    }
};

export default Contacto;