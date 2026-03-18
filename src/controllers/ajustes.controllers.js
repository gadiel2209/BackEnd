import * as model from '../models/ajustes.models.js'

export const getAjustes = async (req, res) => {
    try {
        const rows = await model.getAllAjustes();
        // Convertimos el array de filas en un objeto simple { clave: valor }
        const settings = rows.reduce((acc, item) => {
            acc[item.clave] = item.valor;
            return acc;
        }, {});
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateAjuste = async (req, res) => {
    try {
        const { clave } = req.params;
        const { valor } = req.body;
        const affected = await model.updateAjuste(clave, valor);
        
        if (affected === 0) return res.status(404).json({ message: "Ajuste no encontrado" });
        res.json({ message: `Ajuste ${clave} actualizado` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const createAjuste = async (req, res) => {
    try {
        const { clave, valor, descripcion } = req.body;

        // Validación básica
        if (!clave || valor === undefined) {
            return res.status(400).json({ message: 'La clave y el valor son obligatorios' });
        }

        const nuevoAjuste = await model.createAjuste({ clave, valor, descripcion });
        res.status(201).json({
            message: 'Nuevo ajuste global creado con éxito',
            data: nuevoAjuste
        });
    } catch (error) {
        // Manejar error de clave duplicada (UNIQUE KEY en SQL)
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Esta clave ya existe' });
        }
        res.status(500).json({ message: error.message });
    }
}