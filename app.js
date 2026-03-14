import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
// Las rutas ahora apuntan correctamente a la carpeta src
import equipoRoutes from './src/routes/equipos.routes.js'
import categoriaRoutes from './src/routes/categorias.routes.js'
import solicitudRoutes from './src/routes/solicitudes.routes.js'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

// Ruta de cortesía para saber que la API funciona al entrar al link principal
app.get('/', (req, res) => {
    res.json({
        message: "API de Préstamos funcionando correctamente",
        author: "Gadiel Hernandez",
        version: "1.0.0"
    });
});

// Tus rutas de la API
app.use('/api/equipos', equipoRoutes)
app.use('/api/categorias', categoriaRoutes)
app.use('/api/solicitudes', solicitudRoutes)

// Solo encendemos el servidor con .listen si NO estamos en Vercel
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`)
    })
}

// Exportación necesaria para Vercel
export default app;