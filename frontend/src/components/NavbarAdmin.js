import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { MdAccountCircle, MdSettings, MdLogout, MdHelp, MdManageAccounts, MdSecurity, MdMenu, MdClose, MdBarChart, MdAdminPanelSettings } from "react-icons/md";
import { Link as ScrollLink } from "react-scroll";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../img/logoss.png";
import { createGlobalStyle } from 'styled-components';

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
  color: ${({ scrolled }) => (scrolled ? "#a8dadc" : "#1d3557")};
  display: flex; /* Añadir display flex */
  align-items: center; /* Alinear verticalmente */
  gap: 0.5rem; /* Espacio entre el ícono y el nombre */

  &:hover {
    transform: scale(1.3);
    color: ${({ scrolled }) => (scrolled ? "#ffffff" : "#1d3557")};
  }

  @media (max-width: 768px) {
    font-size: 1.7rem;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: ${({ scrolled }) => (scrolled ? "#1d3557" : "#ffffff")};
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
  color: ${({ scrolled }) => (scrolled ? "#ffffff" : "#333")};
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: background 0.3s ease, color 0.3s ease;

  &:hover {
    background: ${({ scrolled }) => (scrolled ? "#457b9d" : "#f0f0f0")};
    color: ${({ scrolled }) => (scrolled ? "#ffffff" : "#1d3557")};
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

const CatalogosMenuItem = styled(MenuItem)`
  margin-left: 20px;
`;

const UserName = styled.span`
  font-size: 1rem;
  color: ${({ scrolled }) => (scrolled ? "#ffffff" : "#1d3557")};
  font-family: 'Poppins', sans-serif;
`;


function Navbar() {
  const [activeMenu, setActiveMenu] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState(null); // Nuevo estado para el rol del usuario
  const navigate = useNavigate();

  const toggleMenu = (menu) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

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
    const storedUserRole = localStorage.getItem("userRole"); // Obtener el rol del usuario
    if (userId) {
      setIsLoggedIn(true);
      setUserName(storedUserName || "Usuario");
      setUserRole(storedUserRole); // Establecer el rol del usuario
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole"); // Eliminar el rol al cerrar sesión
    setIsLoggedIn(false);
    setUserName("");
    setUserRole(null);
    navigate("/login");
  };

  return (
    <>
      <GlobalStyle />
      <NavbarContainer scrolled={scrolled}>
        <LogoContainer>
          <ScrollLink to="inicio" smooth={true} duration={500} offset={-80}>
            <Logo src={logo} alt="Logo" />
          </ScrollLink>
          <LogoText scrolled={scrolled}>SECRUFY</LogoText>
        </LogoContainer>

        <IconsContainer>
          <MenuItem
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            scrolled={scrolled}
          >
            <ScrollLink to="inicio" smooth={true} duration={500} offset={-80}>
              Inicio
            </ScrollLink>
          </MenuItem>

          <CatalogosMenuItem
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            scrolled={scrolled}
          >
            <ScrollLink to="catalogos" smooth={true} duration={500} offset={-80}>
              Catálogos
            </ScrollLink>
          </CatalogosMenuItem>

          <MenuItem
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            scrolled={scrolled}
          >
            <ScrollLink to="quienes-somos" smooth={true} duration={500} offset={-80}>
              ¿Quiénes somos?
            </ScrollLink>
          </MenuItem>

          <MenuItem
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            scrolled={scrolled}
          >
            <ScrollLink to="servicios" smooth={true} duration={500} offset={-80}>
              Nuestros servicios
            </ScrollLink>
          </MenuItem>

          {!isLoggedIn && (
            <MenuItem
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              scrolled={scrolled}
            >
              <RouterLink to="/login" style={{ textDecoration: "none", color: "inherit" }}>
                Iniciar sesión
              </RouterLink>
            </MenuItem>
          )}

          {isLoggedIn && (
            <>
              <IconWrapper>
                <IconButton scrolled={scrolled} onClick={() => toggleMenu("user")}>
                  <MdAccountCircle />
                  {userName && <UserName scrolled={scrolled}>{userName}</UserName>}
                </IconButton>
                <DropdownMenu isOpen={activeMenu === "user"} scrolled={scrolled}>
                  <DropdownItem 
                    scrolled={scrolled} 
                    onClick={() => navigate("/perfil")}
                  >
                    <MdManageAccounts /> Mi Perfil
                  </DropdownItem>

                  <DropdownItem 
                    scrolled={scrolled}
                    onClick={() => navigate("/estadistica")}
                  >
                    <MdBarChart /> Ver Estadísticas
                  </DropdownItem>

                  {/* Opción de Administración (solo para administradores) */}
                  {userRole === "1" && ( // Si el rol es 1 (Administrador)
                    <DropdownItem
                      scrolled={scrolled}
                      onClick={() => navigate("/admin")}
                    >
                      <MdAdminPanelSettings /> Panel de Administración
                    </DropdownItem>
                  )}

                  <DropdownItem scrolled={scrolled} onClick={handleLogout}>
                    <MdLogout /> Cerrar Sesión
                  </DropdownItem>
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
          <MenuItem>
            <ScrollLink to="quienes-somos" smooth={true} duration={500} offset={-80} onClick={() => setSidebarOpen(false)}>
              ¿Quiénes somos?
            </ScrollLink>
          </MenuItem>
          <MenuItem>
            <ScrollLink to="servicios" smooth={true} duration={500} offset={-80} onClick={() => setSidebarOpen(false)}>
              Nuestros servicios
            </ScrollLink>
          </MenuItem>
          <MenuItem>
            <ScrollLink to="catalogos" smooth={true} duration={500} offset={-80} onClick={() => setSidebarOpen(false)}>
              Catálogos
            </ScrollLink>
          </MenuItem>

          {!isLoggedIn && (
            <MenuItem>
              <RouterLink to="/login" style={{ textDecoration: "none", color: "inherit" }} onClick={() => setSidebarOpen(false)}>
                Iniciar sesión
              </RouterLink>
            </MenuItem>
          )}

          {isLoggedIn && (
            <>
              <DropdownItem><MdManageAccounts /> Mi Perfil</DropdownItem>
              <DropdownItem onClick={handleLogout}><MdLogout /> Cerrar Sesión</DropdownItem>
              <DropdownItem><MdSecurity /> Seguridad</DropdownItem>
              <DropdownItem><MdHelp /> Soporte</DropdownItem>
              {userRole === "1" && (
                <DropdownItem onClick={() => navigate("/admin")}>
                  <MdAdminPanelSettings /> Panel de Administración
                </DropdownItem>
              )}
            </>
          )}
        </Sidebar>
      </NavbarContainer>
    </>
  );
}

export default Navbar;