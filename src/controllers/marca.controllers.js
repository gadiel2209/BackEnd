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

export const updateMarca = async(req, res) => {
    try {
        const { id } = req.params;
        const { nombre } = req.body;
        await marcaModelo.updateMarca(id, nombre);
        res.json({ message: "Actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};