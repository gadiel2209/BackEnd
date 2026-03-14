import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import equipoRoutes from './routes/equipos.routes.js'
import categoriaRoutes from './routes/categorias.routes.js'
import solicitudRoutes from './routes/solicitudes.routes.js'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

// Rutas
app.use('/api/equipos', equipoRoutes)
app.use('/api/categorias', categoriaRoutes)
app.use('/api/solicitudes', solicitudRoutes)

// --- CAMBIO DEL PASO 3 AQUÍ ---

// Solo encendemos el servidor con .listen si NO estamos en Vercel (Producción)
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`)
    })
}

// Exportamos la app para que Vercel la gestione automáticamente
export default app;