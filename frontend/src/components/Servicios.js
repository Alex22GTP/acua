import React from "react";
import styled from "styled-components";

const SectionContainer = styled.section`
  padding: 6rem 2rem; /* Más espacio */
  background-color: #ffffff; /* Fondo blanco */
  text-align: center;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  color: #1d3557;
  margin-bottom: 1.5rem;
`;

const ServiceList = styled.ul`
  list-style: none;
  padding: 0;
  max-width: 800px;
  margin: 0 auto;
`;

const ServiceItem = styled.li`
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 1rem;
  line-height: 1.8;
  text-align: left;
`;

function NuestrosServicios() {
  return (
    <SectionContainer id="servicios">
      <SectionTitle>Nuestros servicios</SectionTitle>
      <ServiceList>
        <ServiceItem>
          <strong>Autenticación y registro de usuarios:</strong> Los usuarios pueden
          registrarse y autenticarse de manera segura, con contraseñas almacenadas
          mediante técnicas de hashing para garantizar la privacidad.
        </ServiceItem>
        <ServiceItem>
          <strong>Gestión de categorías y escenarios:</strong> Los administradores
          pueden crear y gestionar categorías y escenarios que representan situaciones
          de emergencia, incluyendo preguntas, opciones de respuesta y retroalimentación
          detallada.
        </ServiceItem>
        <ServiceItem>
          <strong>Interacción con escenarios:</strong> Los usuarios pueden interactuar
          con los escenarios, seleccionar respuestas y recibir retroalimentación
          inmediata para mejorar su preparación.
        </ServiceItem>
        <ServiceItem>
          <strong>Módulo de estadísticas:</strong> Los usuarios pueden visualizar su
          desempeño en los escenarios resueltos, con detalles sobre respuestas
          correctas e incorrectas, y un historial completo de sus interacciones.
        </ServiceItem>
        <ServiceItem>
          <strong>Gestión de imágenes:</strong> La plataforma permite subir y visualizar
          imágenes asociadas a las categorías y escenarios, enriqueciendo la experiencia
          de aprendizaje.
        </ServiceItem>
        <ServiceItem>
          <strong>Notificaciones:</strong> Los usuarios reciben notificaciones sobre
          nuevos escenarios, actualizaciones y eventos importantes.
        </ServiceItem>
      </ServiceList>
    </SectionContainer>
  );
}

export default NuestrosServicios;