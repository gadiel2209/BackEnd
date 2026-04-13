import jwt from 'jsonwebtoken'

export const verificarToken = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization']

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Acceso denegado. Token requerido.' })
        }

        const token = authHeader.split(' ')[1]
        const secret = process.env.JWT_SECRET || 'clave_temporal_de_emergencia'
        const verificado = jwt.verify(token, secret)
        req.usuario = verificado
        next()

    } catch (error) {
        return res.status(403).json({
            message: 'Token no válido o expirado.',
            error: error.name,
            detalle: error.message
        })
    }
}

export const soloAdmin = (req, res, next) => {
    if (!req.usuario) {
        return res.status(401).json({ message: 'Sin autenticación.' })
    }
    if (req.usuario.id_rol !== 1) {
        return res.status(403).json({ message: 'Acceso denegado. Se requieren permisos de administrador.' })
    }
    next()
}

export const soloRoles = (...roles) => (req, res, next) => {
    if (!req.usuario) {
        return res.status(401).json({ message: 'Sin autenticación.' })
    }
    if (!roles.includes(req.usuario.id_rol)) {
        return res.status(403).json({ message: 'No tienes permiso para realizar esta acción.' })
    }
    next()
}