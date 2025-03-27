import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { MdAccountCircle, MdLogout, MdManageAccounts, MdMenu, MdClose, MdBarChart, MdHome, MdSecurity, MdHelp } from "react-icons/md";
import { Link as RouterLink, useNavigate, useLocation  } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../img/logoss.png";
import { createGlobalStyle } from 'styled-components';

// Estilos globales
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');
  body {
    font-family: 'Poppins', sans-serif;
  }
`;

// Componentes de estilo
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
  transition: all 0.3s ease;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Logo = styled.img`
  height: 60px;
  cursor: pointer;
  transition: transform 0.3s ease;
  @media (max-width: 768px) {
    height: 50px;
  }
`;

const LogoText = styled.span`
  font-size: 1.8rem;
  font-weight: 600;
  color: ${({ scrolled }) => (scrolled ? "#ffffff" : "#1d3557")};
  font-family: 'Poppins', sans-serif;
  transition: color 0.3s ease;
  @media (max-width: 768px) {
    font-size: 1.4rem;
  }
`;

const IconsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-right: 1rem;
  @media (max-width: 768px) {
    display: none;
  }
`;

const MenuItem = styled(motion.div)`
  color: ${({ scrolled }) => (scrolled ? "#ffffff" : "#1d3557")};
  padding: 0.8rem 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Poppins', sans-serif;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 6px;
  font-size: 0.95rem;

  &:hover {
    background-color: ${({ scrolled }) => (scrolled ? "rgba(168, 218, 220, 0.2)" : "#f0f8ff")};
    color: ${({ scrolled }) => (scrolled ? "#a8dadc" : "#457b9d")};
  }

  svg {
    font-size: 1.3rem;
    transition: color 0.3s;
  }
`;

const MobileMenuButton = styled.button`
  background: none;
  border: none;
  font-size: 1.8rem;
  cursor: pointer;
  display: none;
  color: ${({ scrolled }) => (scrolled ? "#ffffff" : "#1d3557")};
  position: absolute;
  top: 1.2rem;
  right: 2.3rem;
  z-index: 1001;
  transition: all 0.3s;
  padding: 0.5rem;
  border-radius: 50%;

  &:hover {
    background-color: ${({ scrolled }) => (scrolled ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)")};
  }

  @media (max-width: 768px) {
    display: block;
  }
`;

const Sidebar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 280px;
  height: 100%;
  background: #ffffff;
  box-shadow: 2px 0 10px rgba(29, 53, 87, 0.1);
  transition: transform 0.3s ease-in-out;
  transform: ${({ isOpen }) => (isOpen ? "translateX(0)" : "translateX(-100%)")};
  display: flex;
  flex-direction: column;
  z-index: 1000;
  overflow-y: auto;
`;

const SidebarHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem 1rem 1rem;
  position: relative;
  border-bottom: 1px solid #eee;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  position: absolute;
  right: 1rem;
  top: 1rem;
  color: #1d3557;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s;

  &:hover {
    background-color: rgba(0,0,0,0.05);
    color: #e63946;
  }
`;

const MobileMenuItem = styled.div`
  padding: 1rem 1.5rem;
  color: #1d3557;
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 1rem;
  font-family: 'Poppins', sans-serif;
  background-color: ${({ active }) => (active ? '#f0f8ff' : 'transparent')};

  &:hover {
    background-color: #f0f8ff;
    color: #457b9d;
  }

  svg {
    font-size: 1.3rem;
    color: #457b9d;
    transition: color 0.3s;
  }

  &:hover svg {
    color: #1d3557;
  }
`;

const MobileSubmenuHeader = styled.div`
  padding: 1rem 1.5rem 0.5rem;
  color: #457b9d;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 0.5rem;
  border-top: 1px solid #eee;
  font-family: 'Poppins', sans-serif;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  cursor: pointer;
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  transition: opacity 0.3s;
  opacity: ${({ isOpen }) => (isOpen ? '1' : '0')};
`;
function Navbar() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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
    if (userId) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    navigate("/login");
    setSidebarOpen(false);
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
            <RouterLink to="/perfil" style={{ textDecoration: "none", color: "inherit" }}>
              <MdManageAccounts /> Ver Perfil
            </RouterLink>
          </MenuItem>



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
                  <MdHome /> Volver al Inicio
                </RouterLink>
              </MenuItem>

              <MenuItem
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                scrolled={scrolled}
                onClick={handleLogout}
              >
                <MdLogout /> Cerrar Sesión
              </MenuItem>
            </>
          )}
        </IconsContainer>

        <MobileMenuButton scrolled={scrolled} onClick={() => setSidebarOpen(true)}>
          <MdMenu />
        </MobileMenuButton>

        {/* Overlay para cerrar el menú */}
        <Overlay isOpen={isSidebarOpen} onClick={() => setSidebarOpen(false)} />

        {/* Menú móvil optimizado */}
        <Sidebar isOpen={isSidebarOpen}>
                <SidebarHeader>
                  <Logo src={logo} alt="Logo" style={{ height: '60px', marginBottom: '0.5rem' }} />
                  <LogoText style={{ color: '#1d3557', fontSize: '1.5rem' }}>SECRUFY</LogoText>
                  <CloseButton onClick={() => setSidebarOpen(false)}>
                    <MdClose />
                  </CloseButton>
                </SidebarHeader>
      
                <MobileMenuItem 
                  onClick={() => { navigate("/"); setSidebarOpen(false); }}
                  active={location.pathname === '/'}
                >
                  <MdHome /> Inicio
                </MobileMenuItem>
      
                <MobileMenuItem 
                  onClick={() => { navigate("/estadistica"); setSidebarOpen(false); }}
                  active={location.pathname === '/estadistica'}
                >
                  <MdBarChart /> Estadísticas
                </MobileMenuItem>
      
                {isLoggedIn && (
                  <>
                    <MobileSubmenuHeader>Mi Cuenta</MobileSubmenuHeader>
                    <MobileMenuItem 
                      onClick={() => { navigate("/perfil"); setSidebarOpen(false); }}
                      active={location.pathname === '/perfil'}
                    >
                      <MdManageAccounts /> Mi Perfil
                    </MobileMenuItem>
                    
                    <MobileMenuItem 
                      onClick={() => { navigate("/seguridad"); setSidebarOpen(false); }}
                      active={location.pathname === '/seguridad'}
                    >
                      <MdSecurity /> Seguridad
                    </MobileMenuItem>
                  
                  </>
                )}
      
                {isLoggedIn ? (
                  <MobileMenuItem onClick={handleLogout}>
                    <MdLogout /> Cerrar Sesión
                  </MobileMenuItem>
                ) : (
                  <MobileMenuItem 
                    onClick={() => { navigate("/login"); setSidebarOpen(false); }}
                    active={location.pathname === '/login'}
                  >
                    <MdAccountCircle /> Iniciar Sesión
                  </MobileMenuItem>
                )}
              </Sidebar>
      </NavbarContainer>
    </>
  );
}

export default Navbar;