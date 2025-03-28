import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { MdSave } from "react-icons/md";

// Estilos basados en el login
const AuthContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #457b9d, #1d3557);
`;

const AuthBox = styled.div`
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  text-align: center;
  animation: fadeIn 0.5s ease-in-out;
`;

const AuthHeader = styled.h2`
  color: #1d3557;
  margin-bottom: 1.5rem;
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  text-align: left;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InputGroup = styled.div`
  text-align: left;
`;

const Label = styled.label`
  display: block;
  color: #10415f;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #457b9d;
  border-radius: 4px;
  outline: none;
  font-size: 1rem;
  color: #1d3557;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &:focus {
    border-color: #1d3557;
    box-shadow: 0 0 0 2px rgba(29, 53, 87, 0.2);
  }
`;

const AuthButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  color: white;
  background-color: #457b9d;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: background-color 0.3s ease, transform 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background-color: #1d3557;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

// Estilos para el modal
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.5s ease, visibility 0.5s ease;

  &.active {
    opacity: 1;
    visibility: visible;
  }
`;

const ModalBox = styled.div`
  background-color: #ffffff;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  max-width: 400px;
  width: 90%;
  text-align: center;
  transform: translateY(-30px);
  opacity: 0;
  transition: transform 0.5s ease, opacity 0.5s ease;

  .active & {
    transform: translateY(0);
    opacity: 1;
  }
`;

const ModalTitle = styled.h2`
  color: #1d3557;
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const ModalMessage = styled.p`
  font-size: 1rem;
  margin-bottom: 1.5rem;
  color: #333333;
  font-weight: 500;
`;

const ModalButton = styled.button`
  background-color: #457b9d;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: background-color 0.3s ease, transform 0.3s ease;

  &:hover {
    background-color: #1d3557;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({}); // Objeto para manejar errores por campo
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState(""); // Título del modal
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!currentPassword) {
      newErrors.currentPassword = "La contraseña actual es requerida.";
    }
    if (!newPassword) {
      newErrors.newPassword = "La nueva contraseña es requerida.";
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirma tu nueva contraseña.";
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Retorna true si no hay errores
  };

  const handleSave = async () => {
    if (!validateForm()) return; // Validar el formulario antes de continuar

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
          setModalTitle("Éxito"); // Título del modal para éxito
          setModalMessage("Contraseña cambiada exitosamente.");
          setModalIsOpen(true);
          setTimeout(() => {
            navigate("/perfil");
          }, 2000); // Redirigir después de 2 segundos
        } else {
          setModalTitle("Error"); // Título del modal para error
          setModalMessage(data.message || "Error al cambiar la contraseña.");
          setModalIsOpen(true);
        }
      } catch (error) {
        console.error("Error al conectar con el servidor:", error);
        setModalTitle("Error"); // Título del modal para error
        setModalMessage("Error al conectar con el servidor.");
        setModalIsOpen(true);
      }
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <AuthContainer>
      <AuthBox>
        <AuthHeader>Cambiar Contraseña</AuthHeader>

        <Form onSubmit={(e) => e.preventDefault()}>
          <InputGroup>
            <Label>Contraseña Actual:</Label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            {errors.currentPassword && <ErrorMessage>{errors.currentPassword}</ErrorMessage>}
          </InputGroup>

          <InputGroup>
            <Label>Nueva Contraseña:</Label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            {errors.newPassword && <ErrorMessage>{errors.newPassword}</ErrorMessage>}
          </InputGroup>

          <InputGroup>
            <Label>Confirmar Nueva Contraseña:</Label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {errors.confirmPassword && <ErrorMessage>{errors.confirmPassword}</ErrorMessage>}
          </InputGroup>

          <AuthButton onClick={handleSave}>
            <MdSave /> Guardar Cambios
          </AuthButton>
        </Form>
      </AuthBox>

      {/* Modal para mensajes */}
      <ModalOverlay className={modalIsOpen ? "active" : ""}>
        <ModalBox>
          <ModalTitle>{modalTitle}</ModalTitle>
          <ModalMessage>{modalMessage}</ModalMessage>
          <ModalButton onClick={closeModal}>Cerrar</ModalButton>
        </ModalBox>
      </ModalOverlay>
    </AuthContainer>
  );
}

export default ChangePassword;