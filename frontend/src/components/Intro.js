import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const IntroContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
  background: linear-gradient(to right, #1d3557, #457b9d);
  color: white;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
  font-weight: bold;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  max-width: 600px;
  margin-bottom: 1.5rem;
`;

const SearchBar = styled.input`
  width: 300px;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  text-align: center;
  outline: none;
`;

const ResultsContainer = styled.div`
  margin-top: 20px;
  max-height: 200px;
  overflow-y: auto;
  width: 300px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ResultItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  color: #333;
  border-bottom: 1px solid #eee;
  cursor: pointer;

  &:hover {
    background: #f1f1f1;
  }
`;

const ResultImage = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 10px;
  object-fit: cover;
`;

const ResultText = styled.span`
  font-size: 0.9rem;
`;

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

function IntroSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();

  // Verificar si el usuario está autenticado (puedes implementar tu propia lógica aquí)
  const isAuthenticated = localStorage.getItem("userId") !== null;

  const handleSearch = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term) {
      try {
        const response = await fetch(`http://localhost:5000/api/searchCategories?term=${term}`);
        if (!response.ok) {
          throw new Error("Error en la respuesta del servidor");
        }
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error("Error al buscar catálogos:", error);
        setResults([]);
      }
    } else {
      setResults([]);
    }
  };

  const handleCatalogClick = async (id_catalogo) => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    try {
      // Obtener el primer escenario del catálogo
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
      console.error("Error al obtener el primer escenario:", error);
    }
  };

  const handleLoginRedirect = () => {
    navigate("/login");
    setShowLoginModal(false);
  };

  return (
    <div>
      <IntroContainer id="inicio">
        <Title>Secrufy</Title>
        <Subtitle>
          Conoce las categorías diseñadas para situaciones realistas en las cuales tendrás que pensar y actuar.
        </Subtitle>
        <SearchBar
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={handleSearch}
        />

        {results.length > 0 && (
          <ResultsContainer>
            {results.map((catalogo) => (
              <ResultItem 
                key={catalogo.id_catalogo}
                onClick={() => handleCatalogClick(catalogo.id_catalogo)}
              >
                <ResultImage
                  src={catalogo.imagen}
                  alt={`Imagen de ${catalogo.nombre}`}
                  onError={(e) => {
                    console.error("Error al cargar la imagen:", e);
                    e.target.style.display = "none";
                  }}
                />
                <ResultText>{catalogo.nombre}</ResultText>
              </ResultItem>
            ))}
          </ResultsContainer>
        )}
      </IntroContainer>

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
}

export default IntroSection;