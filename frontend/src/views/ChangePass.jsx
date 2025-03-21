import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {  MdSave } from "react-icons/md";

const ChangePasswordContainer = styled.div`
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-top: 80px; /* Añadir margen superior para evitar que el contenido se solape con el Navbar */
`;
const ChangePasswordHeader = styled.h2`
  color: #1d3557;
  text-align: center;
  margin-bottom: 1.5rem;
`;

const ChangePasswordSection = styled.div`
  margin-bottom: 1.5rem;
`;

const ChangePasswordLabel = styled.label`
  display: block;
  font-weight: bold;
  color: #457b9d;
  margin-bottom: 0.5rem;
`;

const ChangePasswordInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #457b9d;
  border-radius: 4px;
  outline: none;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #1d3557;
  }
`;

const ChangePasswordButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #457b9d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #1d3557;
  }
`;

function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSave = async () => {
    if (newPassword !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    const userId = localStorage.getItem("userId");
    if (userId) {
      try {
        const response = await fetch(`http://localhost:5000/api/user/${userId}/change-password`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ currentPassword, newPassword }),
        });
        const data = await response.json();
        if (response.ok) {
          alert("Contraseña cambiada exitosamente");
          navigate("/profile");
        } else {
          alert(data.message || "Error al cambiar la contraseña");
        }
      } catch (error) {
        console.error("Error al conectar con el servidor:", error);
      }
    }
  };

  return (
    <>
      <ChangePasswordContainer>
        <ChangePasswordHeader>Cambiar Contraseña</ChangePasswordHeader>

        <ChangePasswordSection>
          <ChangePasswordLabel>Contraseña Actual:</ChangePasswordLabel>
          <ChangePasswordInput
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </ChangePasswordSection>

        <ChangePasswordSection>
          <ChangePasswordLabel>Nueva Contraseña:</ChangePasswordLabel>
          <ChangePasswordInput
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </ChangePasswordSection>

        <ChangePasswordSection>
          <ChangePasswordLabel>Confirmar Nueva Contraseña:</ChangePasswordLabel>
          <ChangePasswordInput
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </ChangePasswordSection>

        <ChangePasswordButton onClick={handleSave}>
          <MdSave /> Guardar Cambios
        </ChangePasswordButton>
      </ChangePasswordContainer>
    </>
  );
}

export default ChangePassword;