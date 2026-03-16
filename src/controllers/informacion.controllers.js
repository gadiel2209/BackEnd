import * as infoModelo from '../models/informacion.models.js'

// Obtener toda la información institucional (Misión, Visión, Quiénes)
export const getInfoInstitucional = async (req, res) => {
    try {
        const mision = await infoModelo.getMision()
        const vision = await infoModelo.getVision()
        const quienes = await infoModelo.getQuienes()
        res.status(200).json({ mision, vision, quienes })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Actualizar Misión
export const updateMision = async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const { descripcion } = req.body
        if (!descripcion) return res.status(400).json({ message: 'La descripción es requerida' })

        const afectados = await infoModelo.updateMision(id, descripcion)
        if (afectados === 0) return res.status(404).json({ message: 'Registro no encontrado' })

        res.status(200).json({ message: 'Misión actualizada correctamente' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Actualizar Visión
export const updateVision = async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const { descripcion } = req.body
        if (!descripcion) return res.status(400).json({ message: 'La descripción es requerida' })

        const afectados = await infoModelo.updateVision(id, descripcion)
        if (afectados === 0) return res.status(404).json({ message: 'Registro no encontrado' })

        res.status(200).json({ message: 'Visión actualizada correctamente' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Actualizar Quiénes Somos
export const updateQuienes = async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const { descripcion } = req.body // El body puede usar 'descripcion' y el modelo lo mapea a 'descricion'
        
        const afectados = await infoModelo.updateQuienes(id, descripcion)
        if (afectados === 0) return res.status(404).json({ message: 'Registro no encontrado' })

        res.status(200).json({ message: 'Sección Quiénes Somos actualizada' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}