import * as equipoModelo from '../models/inventario.models.js';

const ESTADOS_VALIDOS = ['disponible', 'prestado', 'dañado', 'mantenimiento'];

export const getAllEquipos = async (req, res) => {
    try {
        const equipos = await equipoModelo.getAllEquipos();
        res.status(200).json(equipos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createEquipo = async (req, res) => {
    try {
        const { nombre, id_categoria, estado } = req.body;
        if (!nombre || !id_categoria) return res.status(400).json({ message: 'Nombre e id_categoria son obligatorios' });
        
        if (estado && !ESTADOS_VALIDOS.includes(estado)) 
            return res.status(400).json({ message: 'Estado no válido' });

        const nuevo = await equipoModelo.createEquipo(req.body);
        res.status(201).json(nuevo);
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'Código QR duplicado' });
        res.status(500).json({ message: error.message });
    }
};

export const deleteEquipo = async (req, res) => {
    try {
        const afectados = await equipoModelo.deleteEquipo(req.params.id);
        if (afectados === 0) return res.status(404).json({ message: 'No encontrado' });
        res.status(200).json({ message: 'Eliminado correctamente' });
    } catch (error) {
        if (error.code === 'ER_ROW_IS_REFERENCED_2') 
            return res.status(409).json({ message: 'No se puede eliminar: el equipo tiene solicitudes asociadas' });
        res.status(500).json({ message: error.message });
    }
};