import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { MdAccountCircle, MdSettings, MdLogout, MdHelp, MdManageAccounts, MdSecurity, MdMenu, MdClose } from "react-icons/md";
import { Link } from "react-scroll"; // Importa Link de react-scroll
import { motion } from "framer-motion"; // Importa motion de framer-motion
import logo from "../img/logoss.png";
import { createGlobalStyle } from 'styled-components';

// Importar la fuente de Google Fonts
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');
`;

const NavbarContainer = styled.nav`
  background-color: ${({ scrolled }) => (scrolled ? "#1d3557" : "#ffffff")};
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  flex-wrap: wrap;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  transition: background-color 0.3s ease;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Logo = styled.img`
  height: 80px;
  cursor: pointer;
  transition: transform 0.3s ease;

  @media (max-width: 768px) {
    height: 60px;
  }
`;

const LogoText = styled.span`
  font-size: 2rem;
  font-weight: 600;
  color: ${({ scrolled }) => (scrolled ? "#ffffff" : "#1d3557")};
  font-family: 'Poppins', sans-serif;
  transition: color 0.3s ease;

  -webkit-text-stroke: ${({ scrolled }) => (scrolled ? "0px" : "1px #1d3557")};
  text-stroke: ${({ scrolled }) => (scrolled ? "0px" : "2px #1d3557")};

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const IconsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-right: 1.5rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const IconWrapper = styled.div`
  position: relative;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  transition: transform 0.3s ease, color 0.3s ease;
  color: ${({ scrolled }) => (scrolled ? "#a8dadc" : "#1d3557")}; // Cambia el color según el scroll

  &:hover {
    transform: scale(1.3);
    color: ${({ scrolled }) => (scrolled ? "#ffffff" : "#1d3557")}; // Cambia el hover según el scroll
  }

  @media (max-width: 768px) {
    font-size: 1.7rem;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: ${({ scrolled }) => (scrolled ? "#1d3557" : "#ffffff")}; // Fondo según el scroll
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  overflow: hidden;
  display: ${({ isOpen }) => (isOpen ? "block" : "none")};
  min-width: 180px;
  z-index: 10;
  animation: fadeIn 0.3s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const DropdownItem = styled.button`
  width: 100%;
  background: none;
  border: none;
  padding: 12px 16px;
  text-align: left;
  color: ${({ scrolled }) => (scrolled ? "#ffffff" : "#333")}; // Color del texto según el scroll
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: background 0.3s ease, color 0.3s ease;

  &:hover {
    background: ${({ scrolled }) => (scrolled ? "#457b9d" : "#f0f0f0")}; // Fondo hover según el scroll
    color: ${({ scrolled }) => (scrolled ? "#ffffff" : "#1d3557")}; // Color hover según el scroll
  }
`;

const MobileMenuButton = styled.button`
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  display: none;
  color: #333;
  position: absolute;
  top: 1.7rem;
  right: 3rem;

  @media (max-width: 768px) {
    display: block;
  }
`;

const Sidebar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 250px;
  height: 100%;
  background: #ffffff;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease-in-out;
  transform: ${({ isOpen }) => (isOpen ? "translateX(0)" : "translateX(-100%)")};
  display: flex;
  flex-direction: column;
  padding: 1rem;
  z-index: 1000;

  @media (min-width: 769px) {
    display: none;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 2rem;
  align-self: flex-end;
  cursor: pointer;
`;

const MenuItem = styled(motion.div)` /* Usamos motion para animar los elementos */
  color: ${({ scrolled }) => (scrolled ? "#ffffff" : "#333")}; /* Cambia el color del texto al hacer scroll */
  text-decoration: none;
  font-size: 1rem;
  padding: 12px 16px;
  cursor: pointer;
  transition: color 0.3s ease;
  position: relative;
  font-family: 'Poppins', sans-serif; /* Cambiamos la fuente */

  &:hover {
    color: ${({ scrolled }) => (scrolled ? "#a8dadc" : "#1d3557")}; /* Cambia el color del hover al hacer scroll */
  }

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: ${({ scrolled }) => (scrolled ? "#a8dadc" : "#1d3557")}; /* Cambia el color del subrayado al hacer scroll */
    transform: scaleX(0);
    transform-origin: bottom right;
    transition: transform 0.3s ease;
  }

  &:hover::after {
    transform: scaleX(1);
    transform-origin: bottom left;
  }
`;

const CatalogosMenuItem = styled(MenuItem)`
  margin-left: 20px; /* Separación adicional para "Catálogos" */
`;

function Navbar() {
  const [activeMenu, setActiveMenu] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleMenu = (menu) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  // Efecto para detectar el scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <GlobalStyle /> {/* Aplica la fuente globalmente */}
      <NavbarContainer scrolled={scrolled}>
      <LogoContainer>
          <Link to="inicio" smooth={true} duration={500} offset={-80}>
            <Logo src={logo} alt="Logo" />
          </Link>
          <LogoText scrolled={scrolled}>SECRUFY</LogoText>
        </LogoContainer>

                <IconsContainer>



                <MenuItem
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            scrolled={scrolled}
          >
            <Link
              to="inicio"
              smooth={true}
              duration={500}
              offset={-80} // Ajusta el offset si el navbar es fijo
            >
              Inicio
            </Link>
          </MenuItem>

          {/* Enlace a "Catálogos" con animación */}
          <CatalogosMenuItem
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            scrolled={scrolled}
          >
            <Link
              to="catalogos"
              smooth={true}
              duration={500}
              offset={-80} // Ajusta el offset si el navbar es fijo
            >
              Catálogos
            </Link>
          </CatalogosMenuItem>

          {/* Enlace a "¿Quiénes somos?" con animación */}
          <MenuItem
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            scrolled={scrolled}
          >
            <Link
              to="quienes-somos"
              smooth={true}
              duration={500}
              offset={-80} // Ajusta el offset si el navbar es fijo
            >
              ¿Quiénes somos?
            </Link>
          </MenuItem>

          {/* Enlace a "Nuestros servicios" con animación */}
          <MenuItem
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            scrolled={scrolled}
          >
            <Link
              to="servicios"
              smooth={true}
              duration={500}
              offset={-80} // Ajusta el offset si el navbar es fijo
            >
              Nuestros servicios
            </Link>
          </MenuItem>

          {/* Menú de usuario */}
          <IconWrapper>
  <IconButton scrolled={scrolled} onClick={() => toggleMenu("user")}>
    <MdAccountCircle />
  </IconButton>
  <DropdownMenu isOpen={activeMenu === "user"} scrolled={scrolled}>
    <DropdownItem scrolled={scrolled}><MdManageAccounts /> Mi Perfil</DropdownItem>
    <DropdownItem scrolled={scrolled}><MdLogout /> Cerrar Sesión</DropdownItem>
  </DropdownMenu>
</IconWrapper>

<IconWrapper>
  <IconButton scrolled={scrolled} onClick={() => toggleMenu("settings")}>
    <MdSettings />
  </IconButton>
  <DropdownMenu isOpen={activeMenu === "settings"} scrolled={scrolled}>
    <DropdownItem scrolled={scrolled}><MdSecurity /> Seguridad</DropdownItem>
    <DropdownItem scrolled={scrolled}><MdHelp /> Soporte</DropdownItem>
  </DropdownMenu>
</IconWrapper>
        </IconsContainer>

        {/* Botón de menú móvil */}
        <MobileMenuButton onClick={() => setSidebarOpen(true)}>
          <MdMenu />
        </MobileMenuButton>

        {/* Sidebar para móviles */}
        <Sidebar isOpen={isSidebarOpen}>
          <CloseButton onClick={() => setSidebarOpen(false)}>
            <MdClose />
          </CloseButton>
          {/* Enlaces en el sidebar */}
          <MenuItem>
            <Link
              to="quienes-somos"
              smooth={true}
              duration={500}
              offset={-80}
              onClick={() => setSidebarOpen(false)} // Cierra el sidebar al hacer clic
            >
              ¿Quiénes somos?
            </Link>
          </MenuItem>
          <MenuItem>
            <Link
              to="servicios"
              smooth={true}
              duration={500}
              offset={-80}
              onClick={() => setSidebarOpen(false)} // Cierra el sidebar al hacer clic
            >
              Nuestros servicios
            </Link>
          </MenuItem>
          <MenuItem>
            <Link
              to="catalogos"
              smooth={true}
              duration={500}
              offset={-80}
              onClick={() => setSidebarOpen(false)} // Cierra el sidebar al hacer clic
            >
              Catálogos
            </Link>
          </MenuItem>
          <DropdownItem><MdManageAccounts /> Mi Perfil</DropdownItem>
          <DropdownItem><MdLogout /> Cerrar Sesión</DropdownItem>
          <DropdownItem><MdSecurity /> Seguridad</DropdownItem>
          <DropdownItem><MdHelp /> Soporte</DropdownItem>
        </Sidebar>
      </NavbarContainer>
    </>
  );
}

export default Navbar;