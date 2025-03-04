import React from "react";
import styled from "styled-components";
import logo from "../img/logo.png"; // Importa la imagen

const NavbarContainer = styled.nav`
  background-color: #ffffff; /* Fondo blanco */
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Sombra suave */
  flex-wrap: wrap; /* Permite que los elementos se envuelvan en pantallas pequeñas */
`;

const Logo = styled.img`
  height: 80px; /* Logo más grande */
  margin-right: 0.75rem;

  @media (max-width: 768px) {
    height: 60px; /* Reducimos el tamaño en pantallas pequeñas */
  }
`;

const IconsContainer = styled.div`
  display: flex;
  gap: 1.5rem; /* Espacio entre los íconos */

  @media (max-width: 768px) {
    gap: 1rem; /* Reducimos el espacio en pantallas pequeñas */
  }
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: #3b82f6; /* Azul */
  font-size: 1.5rem;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #1d4ed8; /* Azul más oscuro al hacer hover */
  }

  @media (max-width: 768px) {
    font-size: 1.25rem; /* Reducimos el tamaño en pantallas pequeñas */
  }
`;

function Navbar() {
  return (
    <NavbarContainer>
      <div>
        <Logo src={logo} alt="Logo" /> {/* Logo más grande */}
      </div>
      <IconsContainer>
        <IconButton>👤</IconButton> {/* Ícono de usuario */}
        <IconButton>⚙️</IconButton> {/* Ícono de configuración */}
      </IconsContainer>
    </NavbarContainer>
  );
}

export default Navbar;