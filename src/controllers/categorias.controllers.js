import * as categoriaModelo from '../models/categorias.models.js'

export const getAllCategorias = async (req, res) => {
    try {
        const categorias = await categoriaModelo.getAllCategorias()
        res.status(200).json(categorias)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const getCategoriaById = async (req, res) => {
    try {
        const categoria = await categoriaModelo.getCategoriaById(req.params.id)
        if (!categoria) return res.status(404).json({ message: "No existe" })
        res.status(200).json(categoria)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const createCategoria = async (req, res) => {
    try {
        const nueva = await categoriaModelo.createCategoria(req.body.nombre)
        res.status(201).json(nueva)
    } catch (error) {
        res.status(500).json({ message: "Error al crear: " + error.message })
    }
}

export const updateCategoria = async (req, res) => {
    try {
        await categoriaModelo.updateCategoria(req.params.id, req.body.nombre)
        res.status(200).json({ message: "Actualizado" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const deleteCategoria = async (req, res) => {
    try {
        await categoriaModelo.deleteCategoria(req.params.id)
        res.status(200).json({ message: "Eliminado" })
    } catch (error) {
        // Importante: Si la categoría está en uso en la tabla EQUIPOS, fallará aquí
        res.status(500).json({ message: "No se puede eliminar: existen equipos en esta categoría." })
    }
}