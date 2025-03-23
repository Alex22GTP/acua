import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { MdAccountCircle,  MdLogout,  MdManageAccounts,  MdMenu, MdClose, MdBarChart, MdHome } from "react-icons/md";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../img/logoss.png";
import { createGlobalStyle } from 'styled-components';

// Cargar la fuente de Google Fonts
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');

  body {
    font-family: 'Poppins', sans-serif;
  }
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

const MenuItem = styled(motion.div)`
  color: ${({ scrolled }) => (scrolled ? "#ffffff" : "#333")};
  text-decoration: none;
  font-size: 1rem;
  padding: 12px 16px;
  cursor: pointer;
  transition: color 0.3s ease;
  position: relative;
  font-family: 'Poppins', sans-serif;

  &:hover {
    color: ${({ scrolled }) => (scrolled ? "#a8dadc" : "#1d3557")};
  }

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: ${({ scrolled }) => (scrolled ? "#a8dadc" : "#1d3557")};
    transform: scaleX(0);
    transform-origin: bottom right;
    transition: transform 0.3s ease;
  }

  &:hover::after {
    transform: scaleX(1);
    transform-origin: bottom left;
  }
`;

const UserName = styled.span`
  font-size: 1rem;
  color: ${({ scrolled }) => (scrolled ? "#ffffff" : "#1d3557")};
  font-family: 'Poppins', sans-serif;
`;

function Navbar() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

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

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const storedUserName = localStorage.getItem("userName");
    if (userId) {
      setIsLoggedIn(true);
      setUserName(storedUserName || "Usuario");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    setIsLoggedIn(false);
    setUserName("");
    navigate("/login");
  };

  return (
    <>
      <GlobalStyle />
      <NavbarContainer scrolled={scrolled}>
        <LogoContainer>
          <RouterLink to="/">
            <Logo src={logo} alt="Logo" />
          </RouterLink>
          <LogoText scrolled={scrolled}>SECRUFY</LogoText>
        </LogoContainer>

        <IconsContainer>
  {/* Opción: Estadísticas */}
  <MenuItem
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.1 }}
    scrolled={scrolled}
  >
    <RouterLink to="/estadistica" style={{ textDecoration: "none", color: "inherit" }}>
      <MdBarChart /> Estadísticas
    </RouterLink>
  </MenuItem>

  {!isLoggedIn && (
    <MenuItem
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      scrolled={scrolled}
    >
      <RouterLink to="/login" style={{ textDecoration: "none", color: "inherit" }}>
        <MdAccountCircle /> Iniciar sesión
      </RouterLink>
    </MenuItem>
  )}

  {isLoggedIn && (
    <>
      <MenuItem
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        scrolled={scrolled}
      >
        <RouterLink to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <MdHome /> <UserName scrolled={scrolled}>Volver al Inicio</UserName>
        </RouterLink>
      </MenuItem>

      <MenuItem
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        scrolled={scrolled}
        onClick={handleLogout}
      >
        <MdLogout /> <UserName scrolled={scrolled}>Cerrar Sesión</UserName>
      </MenuItem>
    </>
  )}
</IconsContainer>

        <MobileMenuButton onClick={() => setSidebarOpen(true)}>
          <MdMenu />
        </MobileMenuButton>

        <Sidebar isOpen={isSidebarOpen}>
          <CloseButton onClick={() => setSidebarOpen(false)}>
            <MdClose />
          </CloseButton>

          {/* Opción: Estadísticas en el menú móvil */}
          <MenuItem>
            <RouterLink to="/estadisticas" style={{ textDecoration: "none", color: "inherit" }} onClick={() => setSidebarOpen(false)}>
              <MdBarChart /> Estadísticas
            </RouterLink>
          </MenuItem>

          {!isLoggedIn && (
            <MenuItem>
              <RouterLink to="/login" style={{ textDecoration: "none", color: "inherit" }} onClick={() => setSidebarOpen(false)}>
                <MdAccountCircle /> Iniciar sesión
              </RouterLink>
            </MenuItem>
          )}

          {isLoggedIn && (
            <>
              <MenuItem onClick={() => navigate("/perfil")}>
                <MdManageAccounts /> Mi Perfil
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <MdLogout /> Cerrar Sesión
              </MenuItem>
            </>
          )}
        </Sidebar>
      </NavbarContainer>
    </>
  );
}

export default Navbar;