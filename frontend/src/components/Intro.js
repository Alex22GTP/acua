import React, { useState } from "react";
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
  width: 30px; // Tamaño pequeño para la imagen
  height: 30px;
  border-radius: 50%; // Forma circular
  margin-right: 10px; // Espacio entre la imagen y el texto
  object-fit: cover; // Ajustar la imagen sin distorsionar
`;

const ResultText = styled.span`
  font-size: 0.9rem;
`;

function IntroSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);

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

  return (
    <div>
      <IntroContainer>
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
              <ResultItem key={catalogo.id_catalogo}>
                <ResultImage
                  src={catalogo.imagen}
                  alt={`Imagen de ${catalogo.nombre}`}
                  onError={(e) => {
                    console.error("Error al cargar la imagen:", e);
                    e.target.style.display = "none"; // Oculta la imagen si hay un error
                  }}
                />
                <ResultText>{catalogo.nombre}</ResultText>
              </ResultItem>
            ))}
          </ResultsContainer>
        )}
      </IntroContainer>
    </div>
  );
}

export default IntroSection;