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
app.get("/escenarios/:id_catalogo/:id", async (req, res) => {
  const { id_catalogo, id } = req.params;
  console.log(`Solicitando escenario con id_catalogo: ${id_catalogo}, id_escenario: ${id}`);


  try {
    const escenarioQuery = `
      SELECT e.id_escenario, e.titulo, e.descripcion, e.imagen
      FROM escenarios e
      WHERE e.id_escenario = $1 AND e.id_catalogo = $2
    `;
    const opcionesQuery = `
      SELECT o.id_opcion, o.descripcion, o.solucion, o.retroalimentacion
      FROM opciones o
      WHERE o.id_escenario = $1
    `;

    const escenarioResult = await pool.query(escenarioQuery, [id, id_catalogo]);
    console.log("Resultado de la consulta:", escenarioResult.rows);
    const opcionesResult = await pool.query(opcionesQuery, [id]);

    if (escenarioResult.rows.length === 0) {
      console.error("Escenario no encontrado en la BD");
      return res.status(404).json({ error: "Escenario no encontrado" });
    }

    // Convertir la imagen BYTEA a base64
    const imagenBase64 = escenarioResult.rows[0].imagen
      ? Buffer.from(escenarioResult.rows[0].imagen).toString("base64")
      : null;

    // Formatear la respuesta según lo que espera el cliente
    const response = {
      escenario: {
        id_escenario: escenarioResult.rows[0].id_escenario,
        titulo: escenarioResult.rows[0].titulo,
        descripcion: escenarioResult.rows[0].descripcion,
        imagen: imagenBase64 ? `data:image/png;base64,${imagenBase64}` : null, // Devuelve la imagen como data URL
      },
      opciones: opcionesResult.rows,
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
    const result = await pool.query(
      "SELECT id_usuario, nombre, correo, contraseña, id_rol FROM usuario WHERE correo = $1", 
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Correo o contraseña incorrectos" });
    }

    const user = result.rows[0];

    // Verificar contraseña
    const passwordMatch = await bcrypt.compare(password, user.contraseña);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Correo o contraseña incorrectos" });
    }

    // Devolver el nombre del usuario, userId y id_rol
    res.json({ 
      success: true, 
      message: "Inicio de sesión exitoso", 
      userId: user.id_usuario, 
      nombre: user.nombre, // Añadir el nombre del usuario
      id_rol: user.id_rol  // Añadir el id_rol del usuario
    });
  } catch (error) {
    console.error("Error en el login:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

app.put("/api/editar-perfil/:userId", async (req, res) => {
  const { userId } = req.params;
  const { nombre, apellido_paterno, apellido_materno, correo, contraseña } = req.body;

  try {
      const hashedPassword = await bcrypt.hash(contraseña, 10);
      await pool.query(
          "UPDATE Usuario SET nombre = $1, apellido_paterno = $2, apellido_materno = $3, correo = $4, contraseña = $5 WHERE id_usuario = $6",
          [nombre, apellido_paterno, apellido_materno, correo, hashedPassword, userId]
      );
      res.json({ success: true, message: "Perfil actualizado correctamente" });
  } catch (error) {
      console.error("Error al editar perfil:", error);
      res.status(500).json({ message: "Error en el servidor" });
  }
});


app.get("/api/estadisticas/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
      // Obtener el número de escenarios resueltos correctamente
      const result = await pool.query(
          "SELECT COUNT(*) AS correctos FROM Escenarios_resultados WHERE id_usuario = $1 AND resultado = true",
          [userId]
      );

      // Obtener el número total de intentos
      const totalIntentos = await pool.query(
          "SELECT COUNT(*) AS total FROM Escenarios_resultados WHERE id_usuario = $1",
          [userId]
      );

      res.json({
          correctos: result.rows[0].correctos,
          total: totalIntentos.rows[0].total
      });
  } catch (error) {
      console.error("Error al obtener estadísticas:", error);
      res.status(500).json({ message: "Error en el servidor" });
  }
});

app.post("/api/guardar-respuesta", async (req, res) => {
  const { userId, id_escenario, id_opcion, respuesta_automatica } = req.body;
  console.log("Datos recibidos:", { userId, id_escenario, id_opcion, respuesta_automatica });

  try {
    let resultado = false; // Por defecto, asumimos que la respuesta es incorrecta

    // Si no es una respuesta automática (tiempo agotado), verificamos si la opción seleccionada es correcta
    if (!respuesta_automatica) {
      const opcionCorrecta = await pool.query(
        "SELECT solucion FROM Opciones WHERE id_opcion = $1",
        [id_opcion]
      );

      resultado = opcionCorrecta.rows[0]?.solucion ? true : false;
    }

    console.log("Resultado:", resultado);

    // Obtener el último intento del usuario en el escenario actual
    const ultimoIntento = await pool.query(
      "SELECT MAX(intento) AS max_intento FROM Escenarios_resultados WHERE id_usuario = $1 AND id_escenario = $2",
      [userId, id_escenario]
    );

    const nuevoIntento = (ultimoIntento.rows[0].max_intento || 0) + 1;
    console.log("Nuevo intento:", nuevoIntento);

    // Guardar el resultado con el intento actualizado
    await pool.query(
      "INSERT INTO Escenarios_resultados (id_usuario, id_escenario, id_opcion, resultado, intento, respuesta_automatica) VALUES ($1, $2, $3, $4, $5, $6)",
      [userId, id_escenario, id_opcion, resultado, nuevoIntento, respuesta_automatica]
    );

    // Verificar si hay un siguiente escenario
    const siguienteEscenario = await pool.query(
      "SELECT id_escenario FROM Escenarios WHERE id_escenario > $1 ORDER BY id_escenario ASC LIMIT 1",
      [id_escenario]
    );

    const hasNext = siguienteEscenario.rows.length > 0; // Si hay un siguiente escenario

    res.json({ success: true, message: "Respuesta guardada correctamente", hasNext });
  } catch (error) {
    console.error("Error al guardar respuesta:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

app.get("/api/respuestas/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      "SELECT e.titulo, o.descripcion, er.resultado, er.fecha, er.respuesta_automatica " +
      "FROM Escenarios_resultados er " +
      "JOIN Escenarios e ON er.id_escenario = e.id_escenario " +
      "LEFT JOIN Opciones o ON er.id_opcion = o.id_opcion " + // Usamos LEFT JOIN por si id_opcion es NULL
      "WHERE er.id_usuario = $1",
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener respuestas:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

app.get("/api/verificar-respuesta-automatica", async (req, res) => {
  const { userId, id_escenario } = req.query;
  console.log("Verificando respuesta automática para:", { userId, id_escenario });

  try {
    // Obtener el último intento del usuario en el escenario actual
    const ultimoIntento = await pool.query(
      "SELECT MAX(intento) AS max_intento FROM Escenarios_resultados WHERE id_usuario = $1 AND id_escenario = $2",
      [userId, id_escenario]
    );

    const nuevoIntento = (ultimoIntento.rows[0].max_intento || 0) + 1;
    console.log("Nuevo intento:", nuevoIntento);

    // Guardar la respuesta automática
    await pool.query(
      "INSERT INTO Escenarios_resultados (id_usuario, id_escenario, id_opcion, resultado, intento, respuesta_automatica) VALUES ($1, $2, $3, $4, $5, $6)",
      [userId, id_escenario, null, false, nuevoIntento, true]
    );

    res.json({ success: true, message: "Respuesta automática guardada correctamente" });
  } catch (error) {
    console.error("Error al guardar la respuesta automática:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});



// Otras rutas existentes...

// Obtener los datos del usuario
app.get("/api/user/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT nombre, apellido_paterno, apellido_materno, correo FROM usuario WHERE id_usuario = $1",
      [id]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    console.error("Error al obtener los datos del usuario:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// Actualizar los datos del usuario
app.put("/api/user/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido_paterno, apellido_materno, correo } = req.body;
  try {
    const result = await pool.query(
      "UPDATE usuario SET nombre = $1, apellido_paterno = $2, apellido_materno = $3, correo = $4 WHERE id_usuario = $5 RETURNING *",
      [nombre, apellido_paterno, apellido_materno, correo, id]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    console.error("Error al actualizar los datos del usuario:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// Cambiar la contraseña del usuario
app.put("/api/user/:id/change-password", async (req, res) => {
  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;
  try {
    // Verificar la contraseña actual
    const user = await pool.query("SELECT contraseña FROM usuario WHERE id_usuario = $1", [id]);
    if (user.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const passwordMatch = await bcrypt.compare(currentPassword, user.rows[0].contraseña);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Contraseña actual incorrecta" });
    }

    // Hashear la nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar la contraseña
    await pool.query("UPDATE usuario SET contraseña = $1 WHERE id_usuario = $2", [hashedPassword, id]);
    res.json({ message: "Contraseña actualizada exitosamente" });
  } catch (error) {
    console.error("Error al cambiar la contraseña:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// Obtener estadísticas del usuario
app.get("/api/user/:id/statistics", async (req, res) => {
  const { id } = req.params;
  try {
    // Obtener el número de escenarios resueltos correctamente
    const correctos = await pool.query(
      "SELECT COUNT(*) AS correctos FROM Escenarios_resultados WHERE id_usuario = $1 AND resultado = true",
      [id]
    );

    // Obtener el número total de intentos
    const totalIntentos = await pool.query(
      "SELECT COUNT(*) AS total FROM Escenarios_resultados WHERE id_usuario = $1",
      [id]
    );

    res.json({
      correctos: correctos.rows[0].correctos,
      total: totalIntentos.rows[0].total,
    });
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// Obtener respuestas del usuario
app.get("/api/user/:id/responses", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT e.titulo, o.descripcion, er.resultado, er.fecha " +
      "FROM Escenarios_resultados er " +
      "JOIN Escenarios e ON er.id_escenario = e.id_escenario " +
      "JOIN Opciones o ON er.id_opcion = o.id_opcion " +
      "WHERE er.id_usuario = $1",
      [id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener respuestas:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});


app.get("/api/searchCategories", async (req, res) => {
  const searchTerm = req.query.term;

  if (!searchTerm) {
    return res.status(400).json({ error: "El término de búsqueda es requerido" });
  }

  try {
    const query = `
      SELECT id_catalogo, nombre, imagen 
      FROM Catalogos 
      WHERE nombre ILIKE $1
    `;
    const result = await pool.query(query, [`%${searchTerm}%`]); // Corrección en la consulta

    console.log("Resultados de la consulta:", result.rows);

    const catalogos = result.rows.map((catalogo) => {
      let base64Image = null;

      if (catalogo.imagen) {
        base64Image = `data:image/png;base64,${catalogo.imagen.toString('base64')}`;
      }

      return {
        id_catalogo: catalogo.id_catalogo,
        nombre: catalogo.nombre,
        imagen: base64Image, // Se asigna null si no hay imagen
      };
    });

    res.json(catalogos);
  } catch (error) {
    console.error("Error al buscar catálogos:", error);
    res.status(500).json({ error: "Error al buscar catálogos" });
  }
});



app.get("/api/admin/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT id_usuario, nombre, correo, id_rol FROM usuario");
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

app.delete("/api/admin/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM usuario WHERE id_usuario = $1", [id]);
    res.json({ success: true, message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

app.get("/api/admin/catalogos", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.id_catalogo, c.nombre, COUNT(er.id_caso) AS intentos
      FROM Catalogos c
      LEFT JOIN Escenarios e ON c.id_catalogo = e.id_catalogo
      LEFT JOIN Escenarios_resultados er ON e.id_escenario = er.id_escenario
      GROUP BY c.id_catalogo
    `);

    // Convertir el campo "intentos" a número
    const catalogos = result.rows.map((catalogo) => ({
      ...catalogo,
      intentos: parseInt(catalogo.intentos, 10), // Convertir a número
    }));

    console.log("Resultado de la consulta:", catalogos); // Verifica la respuesta
    res.json(catalogos); // Envía la respuesta como JSON
  } catch (error) {
    console.error("Error al obtener catálogos:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

app.delete("/api/admin/catalogos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM Catalogos WHERE id_catalogo = $1", [id]);
    res.json({ success: true, message: "Catálogo eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar catálogo:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

app.post("/api/admin/catalogos", async (req, res) => {
  const { nombre, imagen } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO Catalogos (nombre, imagen) VALUES ($1, $2) RETURNING *",
      [nombre, imagen]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al crear catálogo:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

app.get("/api/admin/catalogos/:id/escenarios", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      SELECT e.id_escenario, e.titulo, 
             COUNT(er.id_caso) AS intentos,
             ROUND(AVG(CASE WHEN er.resultado = true THEN 1 ELSE 0 END) * 100, 2) AS porcentaje_correctos
      FROM Escenarios e
      LEFT JOIN Escenarios_resultados er ON e.id_escenario = er.id_escenario
      WHERE e.id_catalogo = $1
      GROUP BY e.id_escenario
    `, [id]);
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener escenarios:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

app.get("/escenarios/:id_catalogo", async (req, res) => {
  const { id_catalogo } = req.params;
  console.log(`Solicitando escenarios para el catálogo: ${id_catalogo}`);

  try {
    const escenariosQuery = `
      SELECT e.id_escenario, e.titulo, e.descripcion, e.imagen
      FROM escenarios e
      WHERE e.id_catalogo = $1
    `;
    const escenariosResult = await pool.query(escenariosQuery, [id_catalogo]);
    console.log("Resultado de la consulta:", escenariosResult.rows);

    if (escenariosResult.rows.length === 0) {
      console.error("No se encontraron escenarios para este catálogo");
      return res.status(404).json({ error: "No se encontraron escenarios para este catálogo" });
    }

    res.json({ escenarios: escenariosResult.rows });
  } catch (error) {
    console.error("Error al obtener los escenarios:", error);
    res.status(500).json({ error: "Error del servidor" });
  }
});



// Obtener todos los usuarios
app.get('/api/admin/users', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id_usuario, nombre, apellido_paterno, apellido_materno, correo, id_rol 
      FROM usuario
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});


// Crear nuevo usuario
app.post('/api/admin/users', async (req, res) => {
  const { nombre, apellido_paterno, apellido_materno, correo, password, id_rol } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO usuario 
      (nombre, apellido_paterno, apellido_materno, correo, contraseña, id_rol) 
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [nombre, apellido_paterno, apellido_materno, correo, hashedPassword, id_rol]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});


// Eliminar usuario
app.delete('/api/admin/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM usuario WHERE id_usuario = $1', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});