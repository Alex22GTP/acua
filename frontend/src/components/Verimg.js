import React, { useState, useEffect } from "react";

const MostrarCatalogos = () => {
  const [catalogos, setCatalogos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Hacer la solicitud al backend
    fetch("http://localhost:5000/api/getCategories")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error en la respuesta del servidor");
        }
        return response.json(); // Extraer los datos JSON
      })
      .then((data) => {
        console.log("📥 Respuesta del servidor:", data);
        setCatalogos(data); // Guardar los datos en el estado
        setCargando(false);
      })
      .catch((error) => {
        console.error("🚨 Error al cargar los datos:", error);
        setError(error.message);
        setCargando(false);
      });
  }, []);

  if (cargando) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Catálogos</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {catalogos.map((catalogo) => (
          <div key={catalogo.id_catalogo} style={{ border: "1px solid #ccc", padding: "10px", borderRadius: "8px" }}>
            <h2>{catalogo.nombre}</h2>
            {catalogo.imagen && (
              <img
                src={catalogo.imagen}
                alt={`Imagen de ${catalogo.nombre}`}
                style={{ maxWidth: "100%", height: "auto", borderRadius: "8px" }}
                onError={(e) => {
                  console.error("Error al cargar la imagen:", e);
                  e.target.style.display = "none"; // Oculta la imagen si hay un error
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MostrarCatalogos;