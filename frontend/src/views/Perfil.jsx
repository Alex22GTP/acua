import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { MdEdit, MdLock, MdSave } from "react-icons/md";
import Navbar from '../components/Navbar1';

// Estilos para mantener consistencia con el Navbar
const ProfileContainer = styled.div`
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-top: 100px; /* Ajuste para evitar solapamiento con el Navbar */
  font-family: 'Poppins', sans-serif;
`;

const ProfileHeader = styled.h2`
  color: #1d3557;
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 2rem;
  font-weight: 600;
`;

const ProfileSection = styled.div`
  margin-bottom: 1.5rem;
`;

const ProfileLabel = styled.label`
  display: block;
  font-weight: 500;
  color: #457b9d;
  margin-bottom: 0.5rem;
  font-size: 1rem;
`;

const ProfileInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #a8dadc;
  border-radius: 4px;
  outline: none;
  font-size: 1rem;
  color: #1d3557;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &:focus {
    border-color: #1d3557;
    box-shadow: 0 0 0 2px rgba(29, 53, 87, 0.2);
  }

  &:disabled {
    background-color: #f0f0f0;
    cursor: not-allowed;
  }
`;

const ProfileButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: #457b9d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: background-color 0.3s ease, transform 0.2s ease;
  width: 100%; /* Botones de ancho completo */
  margin-bottom: 0.5rem; /* Espaciado entre botones */

  &:hover {
    background-color: #1d3557;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column; /* Botones en columna */
  gap: 0.5rem; /* Espaciado entre botones */
  margin-top: 1.5rem;
`;

const ActionButtonsContainer = styled.div`
  display: flex;
  gap: 1rem; /* Espaciado entre botones */
  margin-top: 1.5rem;
`;

function Profile() {
  const [userData, setUserData] = useState({
    nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    correo: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  // Obtener los datos del usuario desde el backend
  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem("userId");
      if (userId) {
        try {
          const response = await fetch(`http://localhost:5000/api/user/${userId}`);
          const data = await response.json();
          if (response.ok) {
            setUserData(data);
          } else {
            console.error("Error al obtener los datos del usuario:", data.message);
          }
        } catch (error) {
          console.error("Error al conectar con el servidor:", error);
        }
      } else {
        navigate("/login"); // Redirigir si no hay un usuario autenticado
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSave = async () => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      try {
        const response = await fetch(`http://localhost:5000/api/user/${userId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        });
        const data = await response.json();
        if (response.ok) {
          console.log("Datos actualizados:", data);
          setIsEditing(false);
        } else {
          console.error("Error al actualizar los datos:", data.message);
        }
      } catch (error) {
        console.error("Error al conectar con el servidor:", error);
      }
    }
  };

  return (
    <>
      <Navbar /> {/* Agregar el Navbar */}
      <ProfileContainer>
        <ProfileHeader>Mi Perfil</ProfileHeader>

        <ProfileSection>
          <ProfileLabel>Nombre:</ProfileLabel>
          <ProfileInput
            type="text"
            name="nombre"
            value={userData.nombre}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </ProfileSection>

        <ProfileSection>
          <ProfileLabel>Apellido Paterno:</ProfileLabel>
          <ProfileInput
            type="text"
            name="apellido_paterno"
            value={userData.apellido_paterno}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </ProfileSection>

        <ProfileSection>
          <ProfileLabel>Apellido Materno:</ProfileLabel>
          <ProfileInput
            type="text"
            name="apellido_materno"
            value={userData.apellido_materno}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </ProfileSection>

        <ProfileSection>
          <ProfileLabel>Correo Electrónico:</ProfileLabel>
          <ProfileInput
            type="email"
            name="correo"
            value={userData.correo}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </ProfileSection>

        <ButtonContainer>
          <ProfileButton onClick={() => setIsEditing(!isEditing)}>
            <MdEdit /> {isEditing ? "Cancelar Edición" : "Editar Perfil"}
          </ProfileButton>
          {isEditing && (
            <ProfileButton onClick={handleSave}>
              <MdSave /> Guardar Cambios
            </ProfileButton>
          )}
        </ButtonContainer>

        <ActionButtonsContainer>
          <ProfileButton onClick={() => navigate("/cambiarpass")}>
            <MdLock /> Cambiar Contraseña
          </ProfileButton>
        </ActionButtonsContainer>
      </ProfileContainer>
    </>
  );
}

export default Profile;