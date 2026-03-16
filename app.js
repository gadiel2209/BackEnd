import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import equipoRoutes from './src/routes/equipos.routes.js'
import categoriaRoutes from './src/routes/categorias.routes.js'
import solicitudRoutes from './src/routes/solicitudes.routes.js'
import reporteRoutes from './src/routes/reportes.routes.js'
import marcaRoutes from './src/routes/marca.routes.js'
import authRoutes from './src/routes/auth.routes.js'
import usuarioRoutes from './src/routes/usuarios.routes.js'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

// Ruta de cortesía
app.get('/', (req, res) => {
    res.json({
        message: 'API de Préstamos funcionando correctamente',
        author: 'Gadiel Hernandez',
        version: '1.0.0'
    })
})

// Rutas
app.use('/api/equipos', equipoRoutes)
app.use('/api/categorias', categoriaRoutes)
app.use('/api/solicitudes', solicitudRoutes)
app.use('/api/reportes', reporteRoutes)
app.use('/api/marcas', marcaRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/usuarios', usuarioRoutes)

// Solo levantar servidor local si no estamos en Vercel
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`)
    })
}

export default app