import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { MdAccountCircle, MdSettings, MdLogout, MdHelp, MdManageAccounts, MdSecurity, MdMenu, MdClose } from "react-icons/md";
import logo from "../img/logo.png";

const NavbarContainer = styled.nav`
  background-color: #ffffff;
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
`;

const Logo = styled.img`
  height: 80px;
  margin-right: 0.75rem;
  transition: transform 0.3s ease;

  &:hover {
    transform: rotate(5deg);
  }

  @media (max-width: 768px) {
    height: 60px;
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
  color: ${({ color }) => color};

  &:hover {
    transform: scale(1.3);
    color: #1d3557;
  }

  @media (max-width: 768px) {
    font-size: 1.7rem;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
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
  color: #333;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: background 0.3s ease, color 0.3s ease;

  &:hover {
    background: #f0f0f0;
    color: #1d3557;
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

function Navbar() {
  const [activeMenu, setActiveMenu] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleMenu = (menu) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  return (
    <NavbarContainer>
      <div>
        <Logo src={logo} alt="Logo" />
      </div>
      <IconsContainer>
        <IconWrapper>
          <IconButton color="#1d3557" onClick={() => toggleMenu("user")}>
            <MdAccountCircle />
          </IconButton>
          <DropdownMenu isOpen={activeMenu === "user"}>
            <DropdownItem><MdManageAccounts /> Mi Perfil</DropdownItem>
            <DropdownItem><MdLogout /> Cerrar Sesión</DropdownItem>
          </DropdownMenu>
        </IconWrapper>

        <IconWrapper>
          <IconButton color="#457b9d" onClick={() => toggleMenu("settings")}>
            <MdSettings />
          </IconButton>
          <DropdownMenu isOpen={activeMenu === "settings"}>
            <DropdownItem><MdSecurity /> Seguridad</DropdownItem>
            <DropdownItem><MdHelp /> Soporte</DropdownItem>
          </DropdownMenu>
        </IconWrapper>
      </IconsContainer>
      <MobileMenuButton onClick={() => setSidebarOpen(true)}>
        <MdMenu />
      </MobileMenuButton>
      <Sidebar isOpen={isSidebarOpen}>
        <CloseButton onClick={() => setSidebarOpen(false)}>
          <MdClose />
        </CloseButton>
        <DropdownItem><MdManageAccounts /> Mi Perfil</DropdownItem>
        <DropdownItem><MdLogout /> Cerrar Sesión</DropdownItem>
        <DropdownItem><MdSecurity /> Seguridad</DropdownItem>
        <DropdownItem><MdHelp /> Soporte</DropdownItem>
      </Sidebar>
    </NavbarContainer>
  );
}

export default Navbar;
