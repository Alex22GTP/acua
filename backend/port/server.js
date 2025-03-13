require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const multer = require("multer");

const app = express();
const port = process.env.PORT || 5000;

// Configuración de la base de datos
const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "sepreve_bd",
  password: process.env.DB_PASSWORD || "1234",
  port: process.env.DB_PORT || 5432,
});


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
// Ruta para obtener todas las categorías
app.get("/api/getCategories", async (req, res) => {
  try {
    const result = await pool.query('SELECT id_catalogo, nombre, imagen FROM Catalogos');
    
    // Convertir las imágenes a base64
    const catalogos = result.rows.map((catalogo) => {
      const imagenBuffer = catalogo.imagen; // Esto es un Buffer
      const base64Image = imagenBuffer.toString('base64'); // Convierte el Buffer a base64
      return {
        id_catalogo: catalogo.id_catalogo,
        nombre: catalogo.nombre,
        imagen: `data:image/png;base64,${base64Image}` // Cambia a 'image/png' si es necesario
      };
    });

    // Log simplificado
    console.log("✅ Datos de la tabla Catalogos enviados:");
    catalogos.forEach((catalogo) => {
    
    });

    res.json(catalogos); // Envía los datos con las imágenes en base64
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

// Ruta para obtener un escenario con sus opciones
app.get("/escenarios/:id", async (req, res) => {  // Quitar el prefijo /api/
  const { id } = req.params;

  try {
    const escenarioQuery = `
      SELECT e.id_escenario, e.titulo, e.descripcion
      FROM escenarios e
      WHERE e.id_escenario = $1
    `;
    const opcionesQuery = `
      SELECT o.id_opcion, o.descripcion, o.solucion, o.retroalimentacion
      FROM opciones o
      WHERE o.id_escenario = $1
    `;

    const escenarioResult = await pool.query(escenarioQuery, [id]);
    const opcionesResult = await pool.query(opcionesQuery, [id]);

    if (escenarioResult.rows.length === 0) {
      return res.status(404).json({ error: "Escenario no encontrado" });
    }

    // Formatear la respuesta según lo que espera el cliente
    const response = {
      escenario: {
        id_escenario: escenarioResult.rows[0].id_escenario,
        titulo: escenarioResult.rows[0].titulo,
        descripcion: escenarioResult.rows[0].descripcion
      },
      opciones: opcionesResult.rows
    };

    res.json(response);
  } catch (error) {
    console.error("Error al obtener el escenario:", error);
    res.status(500).json({ error: "Error del servidor" });
  }
});

const bcrypt = require("bcrypt");

app.post("/api/register", async (req, res) => {
  const { nombre, apellido_paterno, apellido_materno, email, password, id_rol } = req.body;
  console.log("Datos recibidos:", req.body);

  try {
    // Verificar si el correo ya existe
    const emailCheck = await pool.query("SELECT id_usuario FROM usuario WHERE correo = $1", [email]);
    console.log("Resultado de la verificación de correo:", emailCheck.rows);

    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    // Verificar si el rol existe
    const rolCheck = await pool.query("SELECT id_rol FROM rol WHERE id_rol = $1", [id_rol]);
    console.log("Resultado de la verificación de rol:", rolCheck.rows);

    if (rolCheck.rows.length === 0) {
      return res.status(400).json({ message: "El rol especificado no existe" });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Contraseña hasheada:", hashedPassword);

    // Insertar usuario en la base de datos y obtener el ID del nuevo usuario
    const insertResult = await pool.query(
      "INSERT INTO usuario (nombre, apellido_paterno, apellido_materno, correo, contraseña, id_rol) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id_usuario",
      [nombre, apellido_paterno, apellido_materno, email, hashedPassword, id_rol]
    );
    console.log("Resultado de la inserción:", insertResult.rows);

    const userId = insertResult.rows[0].id_usuario;
    res.json({ success: true, message: "Usuario registrado exitosamente", userId });
  } catch (error) {
    console.error("Error en el registro:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});




app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar usuario en la BD
    const result = await pool.query("SELECT id_usuario, correo, contraseña FROM usuario WHERE correo = $1", [email]);

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Correo o contraseña incorrectos" });
    }

    const user = result.rows[0];

    // Verificar contraseña
    const passwordMatch = await bcrypt.compare(password, user.contraseña);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Correo o contraseña incorrectos" });
    }

    res.json({ success: true, message: "Inicio de sesión exitoso", userId: user.id_usuario });
  } catch (error) {
    console.error("Error en el login:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});