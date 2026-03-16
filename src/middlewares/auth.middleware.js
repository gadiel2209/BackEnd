import jwt from 'jsonwebtoken'

// ── VERIFICAR TOKEN ───────────────────────────────────────────────
// Úsalo en cualquier ruta que requiera sesión activa
export const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization']

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Acceso denegado. Token requerido.' })
    }

    const token = authHeader.split(' ')[1]

    try {
        const verificado = jwt.verify(token, process.env.JWT_SECRET)
        req.usuario = verificado   // { id, correo, usuario, id_rol }
        next()
    } catch (error) {
        return res.status(403).json({ message: 'Token no válido o expirado.' })
    }
}

// ── VERIFICAR ROL ADMIN ───────────────────────────────────────────
// Úsalo DESPUÉS de verificarToken en rutas exclusivas de admin
// id_rol 1 = Administrador
export const soloAdmin = (req, res, next) => {
    if (!req.usuario) {
        return res.status(401).json({ message: 'Sin autenticación.' })
    }

    if (req.usuario.id_rol !== 1) {
        return res.status(403).json({ message: 'Acceso denegado. Se requieren permisos de administrador.' })
    }

    next()
}

// ── VERIFICAR ROL ESPECÍFICO ──────────────────────────────────────
// Uso flexible: soloRoles(1, 2) permite admin y usuario normal
export const soloRoles = (...roles) => (req, res, next) => {
    if (!req.usuario) {
        return res.status(401).json({ message: 'Sin autenticación.' })
    }

    if (!roles.includes(req.usuario.id_rol)) {
        return res.status(403).json({ message: 'No tienes permiso para realizar esta acción.' })
    }

    next()
}