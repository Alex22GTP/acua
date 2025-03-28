import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styled from "styled-components";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

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

const SectionTitle = styled.h1`
  text-align: center;
  font-size: 2.5rem;
  color: #1d3557;
  margin-bottom: 10px;
`;

const SectionDescription = styled.p`
  text-align: center;
  font-size: 1.1rem;
  color: #457b9d;
  max-width: 800px;
  margin: 0 auto 30px;
  line-height: 1.6;
`;

// Estilos para el modal
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 400px;
  width: 90%;
  text-align: center;
`;

const ModalTitle = styled.h3`
  color: #1d3557;
  margin-bottom: 1rem;
`;

const ModalButton = styled.button`
  background-color: #457b9d;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1rem;
  transition: background-color 0.3s;

  &:hover {
    background-color: #1d3557;
  }
`;

const MostrarCatalogos = () => {
  const navigate = useNavigate();
  const [catalogos, setCatalogos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Verificar si el usuario está autenticado
  const isAuthenticated = localStorage.getItem("userId") !== null;

  // Función para manejar el clic en una imagen
  const handleClick = async (id_catalogo) => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    try {
      // Obtener todos los escenarios del catálogo
      const response = await fetch(`http://localhost:5000/escenarios/${id_catalogo}`);
      const data = await response.json();
  
      if (data.escenarios && data.escenarios.length > 0) {
        // Redirigir al primer escenario
        const primerEscenario = data.escenarios[0].id_escenario;
        navigate(`/escenarios/${id_catalogo}/${primerEscenario}`);
      } else {
        console.error("No hay escenarios para este catálogo");
      }
    } catch (error) {
      console.error("Error al obtener los escenarios:", error);
    }
  };

  const handleLoginRedirect = () => {
    navigate("/login");
    setShowLoginModal(false);
  };

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
    <div id="catalogos" style={{ padding: "20px", position: "relative" }}>
      {/* Título y descripción para "Catálogos" */}
      <SectionTitle>Catálogos</SectionTitle>
      <SectionDescription>
        Explora nuestras categorías diseñadas para ayudarte a prepararte en situaciones de emergencia.
      </SectionDescription>

      {/* Primer carrusel: Todos los catálogos */}
      <Slider {...settings}>
        {catalogos.map((catalogo) => (
          <div key={catalogo.id_catalogo} style={{ padding: "10px" }}>
            <CircleContainer onClick={() => handleClick(catalogo.id_catalogo)}>
              {catalogo.imagen && (
                <CircleImage
                  src={catalogo.imagen}
                  alt={`Imagen de ${catalogo.nombre}`}
                  onError={(e) => {
                    console.error("Error al cargar la imagen:", e);
                    e.target.style.display = "none";
                  }}
                />
              )}
              <CircleOverlay />
            </CircleContainer>
            <Title>{catalogo.nombre}</Title>
          </div>
        ))}
      </Slider>

      {/* Título y descripción para "Primeros 5 Catálogos" */}
      <SectionTitle style={{ marginTop: "60px" }}>Primeros 5 Catálogos</SectionTitle>
      <SectionDescription>
        Estos son los catálogos más populares. ¡Empieza por aquí!
      </SectionDescription>

      {/* Segundo carrusel: Solo los primeros 5 catálogos */}
      <Slider {...settings}>
        {primeros5Catalogos.map((catalogo) => (
          <div key={catalogo.id_catalogo} style={{ padding: "10px" }}>
            <CircleContainer onClick={() => handleClick(catalogo.id_catalogo)}>
              {catalogo.imagen && (
                <CircleImage
                  src={catalogo.imagen}
                  alt={`Imagen de ${catalogo.nombre}`}
                  onError={(e) => {
                    console.error("Error al cargar la imagen:", e);
                    e.target.style.display = "none";
                  }}
                />
              )}
              <CircleOverlay />
            </CircleContainer>
            <Title>{catalogo.nombre}</Title>
          </div>
        ))}
      </Slider>

      {/* Modal de inicio de sesión */}
      {showLoginModal && (
        <ModalOverlay>
          <ModalContent>
            <ModalTitle>Para acceder a los escenarios</ModalTitle>
            <p>Debes iniciar sesión primero. ¿Deseas ir a la página de inicio de sesión?</p>
            <ModalButton onClick={handleLoginRedirect}>
              Ir a Iniciar Sesión
            </ModalButton>
          </ModalContent>
        </ModalOverlay>
      )}
    </div>
  );
};

export default MostrarCatalogos;