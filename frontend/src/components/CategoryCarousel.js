import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styled from "styled-components";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa"; // Importar íconos de flechas

// Estilos para el círculo y el efecto hover
const CircleContainer = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: scale(1.1);
  }
`;

const CircleImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const CircleOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
  border-radius: 50%;

  &:hover {
    opacity: 1;
  }
`;

const Title = styled.h3`
  text-align: center;
  margin-top: 10px;
  font-size: 1rem;
  color: #333;
`;

// Estilos personalizados para las flechas
const ArrowButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: white;
  font-size: 24px;
  padding: 10px;
  cursor: pointer;
  z-index: 1;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  transition: background 0.3s ease-in-out;

  &:hover {
    background: rgba(0, 0, 0, 0.8);
  }

  &.prev {
    left: -20px;
  }

  &.next {
    right: -20px;
  }
`;

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

  // Componentes personalizados para las flechas
  const PrevArrow = (props) => {
    const { onClick } = props;
    return (
      <ArrowButton className="prev" onClick={onClick}>
        <FaArrowLeft />
      </ArrowButton>
    );
  };

  const NextArrow = (props) => {
    const { onClick } = props;
    return (
      <ArrowButton className="next" onClick={onClick}>
        <FaArrowRight />
      </ArrowButton>
    );
  };

  // Configuración del carrusel
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4, // Mostrar 4 círculos a la vez
    slidesToScroll: 1,
    prevArrow: <PrevArrow />, // Flecha personalizada para retroceder
    nextArrow: <NextArrow />, // Flecha personalizada para avanzar
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  if (cargando) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  // Filtrar los primeros 5 elementos basados en su id
  const primeros5Catalogos = catalogos.slice(0, 5);

  return (
    <div style={{ padding: "20px", position: "relative" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Catálogos</h1>

      {/* Primer carrusel: Todos los catálogos */}
      <Slider {...settings}>
        {catalogos.map((catalogo) => (
          <div key={catalogo.id_catalogo} style={{ padding: "10px" }}>
            <CircleContainer>
              {catalogo.imagen && (
                <CircleImage
                  src={catalogo.imagen}
                  alt={`Imagen de ${catalogo.nombre}`}
                  onError={(e) => {
                    console.error("Error al cargar la imagen:", e);
                    e.target.style.display = "none"; // Oculta la imagen si hay un error
                  }}
                />
              )}
              <CircleOverlay /> {/* Overlay sin texto */}
            </CircleContainer>
            <Title>{catalogo.nombre}</Title> {/* Título debajo del círculo */}
          </div>
        ))}
      </Slider>

      {/* Segundo carrusel: Solo los primeros 5 catálogos */}
      <h2 style={{ textAlign: "center", marginTop: "40px", marginBottom: "20px" }}>
        Primeros 5 Catálogos
      </h2>
      <Slider {...settings}>
        {primeros5Catalogos.map((catalogo) => (
          <div key={catalogo.id_catalogo} style={{ padding: "10px" }}>
            <CircleContainer>
              {catalogo.imagen && (
                <CircleImage
                  src={catalogo.imagen}
                  alt={`Imagen de ${catalogo.nombre}`}
                  onError={(e) => {
                    console.error("Error al cargar la imagen:", e);
                    e.target.style.display = "none"; // Oculta la imagen si hay un error
                  }}
                />
              )}
              <CircleOverlay /> {/* Overlay sin texto */}
            </CircleContainer>
            <Title>{catalogo.nombre}</Title> {/* Título debajo del círculo */}
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default MostrarCatalogos;