import * as marcaModelo from '../models/marca.models.js';

export const getAllMarcas = async(req, res) => {
    try {
        const marcas = await marcaModelo.getAllMarcas();
        res.json(marcas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createMarca = async(req, res) => {
    try {
        const { nombre } = req.body;
        const nueva = await marcaModelo.createMarca({ nombre });
        res.status(201).json(nueva);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteMarca = async(req, res) => {
    try {
        const id = req.params.id;
        await marcaModelo.deleteMarca(id);
        res.json({ message: "Eliminado" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getMarcaById = async(req, res) => {
    try {
        const id = req.params.id;
        const marca = await marcaModelo.getMarcaById(id);
        if (!marca) return res.status(404).json({ message: "No encontrado" });
        res.json(marca);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// En marca.controllers.js
export const updateMarca = async(req, res) => {
    try {
        const { id } = req.params; // Esto saca el ID de la URL
        const { nombre } = req.body; // Esto saca el nombre del formulario
        
        // Llamamos al modelo pasando id primero y luego nombre
        const filasAfectadas = await marcaModelo.updateMarca(id, nombre);
        
        if (filasAfectadas === 0) return res.status(404).json({ message: "No se encontró la marca para actualizar" });
        
        res.json({ message: "Actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};