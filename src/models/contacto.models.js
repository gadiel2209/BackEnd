const db = require('../config/db'); // Tu conexión a la base de datos

const Contacto = {
    create: (nuevoContacto, result) => {
        const query = "INSERT INTO contacto (nombre, correo, asunto, mensaje) VALUES (?, ?, ?, ?)";
        const values = [
            nuevoContacto.nombre, 
            nuevoContacto.correo, 
            nuevoContacto.asunto, 
            nuevoContacto.mensaje
        ];

        db.query(query, values, (err, res) => {
            if (err) {
                console.error("Error al insertar:", err);
                result(err, null);
                return;
            }
            result(null, { id: res.insertId, ...nuevoContacto });
        });
    }
};

module.exports = Contacto;