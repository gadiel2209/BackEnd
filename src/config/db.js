import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
dotenv.config()

// createPool SIN await — no es una función async
const db = mysql.createPool({
    host:               process.env.DB_HOST,
    user:               process.env.DB_USER,
    password:           process.env.DB_PASSWORD,
    database:           process.env.DB_NAME,
    port:               parseInt(process.env.DB_PORT) || 3306,
    waitForConnections: true,
    connectionLimit:    2,      // bajo para serverless
    queueLimit:         0,
    connectTimeout:     10000   // 10s antes de fallar
})

export default db