import * as ajusteModelo from '../models/ajustes.models.js'

export const getAllAjustes = async (req, res) => {
    try {
        const ajustes = await ajusteModelo.getAllAjustes()
        res.status(200).json(ajustes)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const getAjusteByClave = async (req, res) => {
    try {
        const { clave } = req.params
        const ajuste = await ajusteModelo.getAjusteByClave(clave)
        if (!ajuste) return res.status(404).json({ message: 'Ajuste no encontrado' })
        res.status(200).json(ajuste)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const createAjuste = async (req, res) => {
    try {
        const { clave, valor } = req.body
        if (!clave || !valor) return res.status(400).json({ message: 'Clave y Valor son requeridos' })

        const nuevo = await ajusteModelo.createAjuste(req.body)
        res.status(201).json(nuevo)
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') 
            return res.status(409).json({ message: 'La clave ya existe' })
        res.status(500).json({ message: error.message })
    }
}

export const updateAjuste = async (req, res) => {
    try {
        const { clave } = req.params
        const { valor } = req.body

        if (valor === undefined) return res.status(400).json({ message: 'El campo valor es requerido' })

        const afectados = await ajusteModelo.updateAjuste(clave, req.body)
        if (afectados === 0) return res.status(404).json({ message: 'Ajuste no encontrado' })

        res.status(200).json({ message: 'Ajuste actualizado correctamente' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}