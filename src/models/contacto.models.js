import db from '../config/db.js'; // Importa tu conexión

const Contacto = {
    create: (nuevoContacto, result) => {
        const query = "INSERT INTO contacto (nombre, correo, asunto, mensaje) VALUES (?, ?, ?, ?)";
        const values = [nuevoContacto.nombre, nuevoContacto.correo, nuevoContacto.asunto, nuevoContacto.mensaje];

        db.query(query, values, (err, res) => {
            if (err) {
                result(err, null);
                return;
            }
            result(null, { id: res.insertId, ...nuevoContacto });
        });
    }
};

export default Contacto; // Exportación por defecto