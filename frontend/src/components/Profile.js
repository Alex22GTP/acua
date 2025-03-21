import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { MdEdit, MdLock, MdSave } from "react-icons/md";

const ProfileContainer = styled.div`
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-top: 80px; /* Añadir margen superior para evitar que el contenido se solape con el Navbar */
`;

const ProfileHeader = styled.h2`
  color: #1d3557;
  text-align: center;
  margin-bottom: 1.5rem;
`;

const ProfileSection = styled.div`
  margin-bottom: 1.5rem;
`;

const ProfileLabel = styled.label`
  display: block;
  font-weight: bold;
  color: #457b9d;
  margin-bottom: 0.5rem;
`;

const ProfileInput = styled.input`
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

const ProfileButton = styled.button`
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
              type="correo"
              name="correo"
              value={userData.correo}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </ProfileSection>
  
          <ProfileSection>
            <ProfileButton onClick={() => setIsEditing(!isEditing)}>
              <MdEdit /> {isEditing ? "Cancelar Edición" : "Editar Perfil"}
            </ProfileButton>
            {isEditing && (
              <ProfileButton onClick={handleSave}>
                <MdSave /> Guardar Cambios
              </ProfileButton>
            )}
          </ProfileSection>
  
          <ProfileSection>
            <ProfileButton onClick={() => navigate("/change-password")}>
              <MdLock /> Cambiar Contraseña
            </ProfileButton>
          </ProfileSection>
        </ProfileContainer>
      </>
    );
  }
  

export default Profile;