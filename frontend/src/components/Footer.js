import React from "react";
import styled from "styled-components";

const FooterContainer = styled.footer`
  background-color: #1d3557;
  color: white;
  padding: 4rem 2rem; /* Más espacio */
  text-align: center;
  margin-top: auto;
`;

const FooterText = styled.p`
  margin: 0;
  font-size: 0.9rem;
`;

const FooterLink = styled.a`
  color: white;
  text-decoration: none;
  margin: 0 0.5rem;
  transition: color 0.3s ease;

  &:hover {
    color: #a8dadc;
  }
`;

const FooterDescription = styled.p`
  font-size: 0.9rem;
  max-width: 800px;
  margin: 1rem auto;
  line-height: 1.6;
`;

function Footer() {
  return (
    <FooterContainer>
      <FooterText>
        © 2025 Secrufy. Todos los derechos reservados.
      </FooterText>
      <FooterDescription>
        Secrufy es una plataforma integral para la capacitación en primeros auxilios y
        manejo de emergencias. Desarrollada con tecnologías modernas y una base de datos
        robusta, nuestra plataforma garantiza una experiencia de usuario fluida y segura.
      </FooterDescription>
      <div>
        <FooterLink href="#quienes-somos">¿Quiénes somos?</FooterLink>
        <FooterLink href="#servicios">Nuestros servicios</FooterLink>
        <FooterLink href="#contacto">Contacto</FooterLink>
      </div>
    </FooterContainer>
  );
}

export default Footer;