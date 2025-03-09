import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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

  // Configuración del carrusel
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  if (cargando) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Catálogos</h1>
      <Slider {...settings}>
        {catalogos.map((catalogo) => (
          <div key={catalogo.id_catalogo} style={{ padding: "10px" }}>
            <div
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "10px",
                textAlign: "center",
              }}
            >
              <h2>{catalogo.nombre}</h2>
              {catalogo.imagen && (
                <img
                  src={catalogo.imagen}
                  alt={`Imagen de ${catalogo.nombre}`}
                  style={{
                    width: "100%", // Ajusta el ancho al 100% del contenedor
                    height: "200px", // Altura fija para todas las imágenes
                    objectFit: "cover", // Ajusta la imagen sin distorsionarla
                    borderRadius: "8px",
                  }}
                  onError={(e) => {
                    console.error("Error al cargar la imagen:", e);
                    e.target.style.display = "none"; // Oculta la imagen si hay un error
                  }}
                />
              )}
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default MostrarCatalogos;