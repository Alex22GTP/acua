import React from "react";
import styled from "styled-components";

const SectionContainer = styled.section`
  padding: 6rem 2rem; /* Más espacio */
  background: linear-gradient(to right, #1d3557, #457b9d); /* Degradado lineal */
  text-align: center;
  color: white; /* Texto blanco para contrastar con el fondo */
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  color: white; /* Texto blanco */
  margin-bottom: 1.5rem;
`;

const SectionText = styled.p`
  font-size: 1.1rem;
  color: white; /* Texto blanco */
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.8;
`;

function QuienesSomos() {
  return (
    <SectionContainer id="quienes-somos">
      <SectionTitle>¿Quiénes somos?</SectionTitle>
      <SectionText>
        Secrufy es una plataforma innovadora diseñada para ayudar a los usuarios a
        practicar y evaluar sus conocimientos en situaciones de emergencia. Nuestra
        misión es proporcionar una herramienta interactiva que permita a los usuarios
        mejorar su preparación ante emergencias, mientras que los administradores
        pueden gestionar el contenido y monitorear el desempeño de los usuarios.
      </SectionText>
      <SectionText>
        Con un enfoque en la usabilidad y la eficiencia, Secrufy integra
        funcionalidades clave como la autenticación segura, la gestión de escenarios
        interactivos y un módulo de estadísticas detalladas. Todo esto respaldado por
        una base de datos robusta y segura que garantiza la integridad y disponibilidad
        de la información.
      </SectionText>
    </SectionContainer>
  );
}

export default QuienesSomos;