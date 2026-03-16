import * as marcaModelo from '../models/marca.model.js'

export const getAllMarcas = async(req, res) => {
    try {
        const marcas = await marcaModelo.getAllMarcas()
        res.status(200).json(marcas)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const getMarcaById = async(req, res) => {
    try {
        const id = parseInt(req.params.id)
        if (isNaN(id)) return res.status(400).json({ message: 'ID inválido' })
        const marca = await marcaModelo.getMarcaById(id)
        if (!marca) return res.status(404).json({ message: 'Marca no encontrada' })
        res.status(200).json(marca)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const createMarca = async(req, res) => {
    try {
        const { nombre } = req.body
        if (!nombre) return res.status(400).json({ message: 'Nombre requerido' })
        const nueva = await marcaModelo.createMarca({ nombre })
        res.status(201).json(nueva)
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'Esa marca ya existe' })
        res.status(500).json({ message: error.message })
    }
}

// NUEVO: Para que funcione la edición
export const updateMarca = async(req, res) => {
    try {
        const id = parseInt(req.params.id)
        const { nombre } = req.body
        const afectados = await marcaModelo.updateMarca(id, nombre)
        if (afectados === 0) return res.status(404).json({ message: 'Marca no encontrada' })
        res.json({ message: 'Marca actualizada' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const deleteMarca = async(req, res) => {
    try {
        const id = parseInt(req.params.id)
        const afectados = await marcaModelo.deleteMarca(id)
        if (afectados === 0) return res.status(404).json({ message: 'Marca no encontrada' })
        res.status(200).json({ message: 'Marca eliminada correctamente' })
    } catch (error) {
        if (error.code === 'ER_ROW_IS_REFERENCED_2')
            return res.status(409).json({ message: 'No se puede eliminar, la marca está en uso en el inventario' })
        res.status(500).json({ message: error.message })
    }
}