import React from "react";
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

function IntroSection() {
  return (
    <div>
      <IntroContainer>
        <Title>Secrufy</Title>
        <Subtitle>
          Conoce las categorías diseñadas para situaciones realistas en las cuales tendrás que pensar y actuar.
        </Subtitle>
        <SearchBar type="text" placeholder="Buscar..." />
      </IntroContainer>
    </div>
  );
}

export default IntroSection;
