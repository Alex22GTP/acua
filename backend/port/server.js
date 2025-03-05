require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const multer = require("multer");

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
app.use(cors({ origin: "http://localhost:3000" }));

// Iniciar servidor
app.listen(port, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${port}`);
});

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("¡Servidor backend funcionando!");
});

// Configuración de Multer para manejar imágenes en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Subir imagen de prueba
app.post("/subir-imagen-prueba", upload.single("imagen"), async (req, res) => {
  try {
    const imagenBuffer = req.file.buffer; // Obtener la imagen en binario
    const tipo = req.file.mimetype; // Tipo de imagen (ej. 'image/jpeg')
    const nombre = req.file.originalname; // Nombre original del archivo

    await pool.query(
      "INSERT INTO imagenes_prueba (imagen, tipo, nombre) VALUES ($1, $2, $3)",
      [imagenBuffer, tipo, nombre]
    );

    res.json({ success: true, message: "Imagen subida correctamente" });
  } catch (error) {
    console.error("Error al subir la imagen:", error);
    res.status(500).json({ success: false, message: "Error al subir la imagen" });
  }
});

// Obtener imagen por ID
app.get("/imagen/:id", async (req, res) => {
  const { id } = req.params;
  console.log(`🖼️ Solicitando imagen con ID: ${id}`);
  try {
    const result = await pool.query("SELECT imagen FROM Catalogos WHERE id_catalogo = $1", [id]);

    if (result.rows.length === 0) {
      console.error("❌ Imagen no encontrada en la BD");
      return res.status(404).json({ error: "Imagen no encontrada" });
    }

    const imagenBuffer = result.rows[0].imagen;
    res.setHeader("Content-Type", "image/jpeg");
    res.send(imagenBuffer);
    console.log("✅ Imagen enviada correctamente");
  } catch (error) {
    console.error("🚨 Error al obtener la imagen:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});


// Ruta para obtener las categorías
app.get("/api/getCategories", async (req, res) => {
  try {
    const result = await pool.query('SELECT id_catalogo, nombre, imagen FROM Catalogos');
    console.log(result.rows); // Verifica si los datos están correctamente obtenidos
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener las categorías:', error);
    res.status(500).json({ success: false, message: 'Error al obtener las categorías' });
  }
});

// Subir categoría
app.post("/api/subir-categoria", upload.single("imagen"), async (req, res) => {
  try {
    const imagenBuffer = req.file.buffer; // Obtener la imagen en binario
    const tipo = req.file.mimetype; // Tipo de imagen
    const nombre = req.body.nombre; // Nombre de la categoría (lo recibirás del cuerpo de la solicitud)

    // Inserta la categoría y su imagen en la tabla Catalogos
    await pool.query(
      "INSERT INTO Catalogos (nombre, imagen) VALUES ($1, $2)",
      [nombre, imagenBuffer]
    );

    res.json({ success: true, message: "Categoría subida correctamente" });
  } catch (error) {
    console.error("Error al subir la categoría:", error);
    res.status(500).json({ success: false, message: "Error al subir la categoría" });
  }
});
