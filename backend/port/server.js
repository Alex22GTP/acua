require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 5000;

// Configuración de la base de datos
const pool = new Pool({
  user: process.env.DB_USER || "alexis",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "sepreve_bd",
  password: process.env.DB_PASSWORD || "1379",
  port: process.env.DB_PORT || 5432,
});

app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("¡Servidor backend funcionando!");
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${port}`);
});

app.get("/test-db", async (req, res) => {
    try {
      const result = await pool.query("SELECT NOW()"); // Ejecuta una consulta simple
      res.json({ success: true, message: "Conexión exitosa", timestamp: result.rows[0].now });
    } catch (error) {
      console.error("Error al conectar con la base de datos:", error);
      res.status(500).json({ success: false, message: "Error en la conexión a la base de datos" });
    }
  });
  