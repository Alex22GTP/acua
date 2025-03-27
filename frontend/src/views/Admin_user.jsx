import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MdPersonAdd, MdDelete, MdEdit, MdAdminPanelSettings, MdPerson, MdGroup, MdSecurity } from 'react-icons/md';
import Navbar from '../components/NavbarAdmin';

// Estilos basados en tu CSS
const AdminContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-top: 100px;
  font-family: 'Poppins', sans-serif;
  min-height: calc(100vh - 180px);
`;

const SectionTitle = styled.h2`
  color: #1d3557;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.8rem;
`;

const StatsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  flex: 1;
  min-width: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  color: #1d3557;
  margin: 0.5rem 0;
`;

const StatLabel = styled.div`
  color: #457b9d;
  font-weight: 500;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 2rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  background: white;
  border-radius: 8px;
  overflow: hidden;
`;

const Th = styled.th`
  background-color: #1d3557;
  color: white;
  padding: 1rem;
  text-align: left;
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #eee;
  color: #333;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 0.5rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  font-weight: 500;

  &.primary {
    background-color: #457b9d;
    color: white;
    &:hover {
      background-color: #1d3557;
    }
  }

  &.danger {
    background-color: #e63946;
    color: white;
    &:hover {
      background-color: #c1121f;
    }
  }

  &.success {
    background-color: #2a9d8f;
    color: white;
    &:hover {
      background-color: #1d7870;
    }
  }
`;

const FormContainer = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  animation: fadeIn 0.5s ease-in-out;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const FormTitle = styled.h3`
  color: #1d3557;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  text-align: left;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #1d3557;
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #457b9d;
  border-radius: 4px;
  font-size: 1rem;
  transition: 0.3s;

  &:focus {
    border-color: #1d3557;
    box-shadow: 0 0 0 2px rgba(29, 53, 87, 0.2);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #457b9d;
  border-radius: 4px;
  font-size: 1rem;
  transition: 0.3s;

  &:focus {
    border-color: #1d3557;
    box-shadow: 0 0 0 2px rgba(29, 53, 87, 0.2);
  }
`;

// Estilos del modal (basados en tu CSS)
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

const ModalTitle = styled.h3`
  color: #1d3557;
  margin-bottom: 1rem;
`;

const ModalText = styled.p`
  font-size: 16px;
  margin-bottom: 25px;
  color: #333;
`;

const ModalButton = styled.button`
  background-color: ${props => props.danger ? '#e63946' : '#457b9d'};
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
  margin: 0 0.5rem;

  &:hover {
    background-color: ${props => props.danger ? '#c1121f' : '#1d3557'};
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    correo: '',
    password: '',
    id_rol: '2'
  });
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const [userToDelete, setUserToDelete] = useState(null);

  // Estadísticas
  const totalUsers = users.length;
  const adminUsers = users.filter(user => user.id_rol === 1).length;
  const regularUsers = totalUsers - adminUsers;

  // Obtener todos los usuarios
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      showModalMessage('Error', 'No se pudieron cargar los usuarios');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Mostrar modal con mensaje
  const showModalMessage = (title, message, isSuccess = false) => {
    setModalContent({
      title,
      message,
      isSuccess
    });
    setShowModal(true);
  };

  // Cerrar modal
  const closeModal = () => {
    setShowModal(false);
    setUserToDelete(null);
  };

  // Crear nuevo usuario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        await fetchUsers();
        setFormData({
          nombre: '',
          apellido_paterno: '',
          apellido_materno: '',
          correo: '',
          password: '',
          id_rol: '2'
        });
        showModalMessage('Éxito', 'Usuario creado exitosamente', true);
      } else {
        const errorData = await response.json();
        showModalMessage('Error', errorData.message || 'Error al crear usuario');
      }
    } catch (error) {
      console.error('Error:', error);
      showModalMessage('Error', 'Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  // Confirmar eliminación de usuario
  const confirmDelete = (userId) => {
    setUserToDelete(userId);
    setModalContent({
      title: 'Confirmar Eliminación',
      message: '¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.',
      isConfirm: true
    });
    setShowModal(true);
  };

  // Eliminar usuario después de confirmación
  const handleDelete = async () => {
    if (!userToDelete) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${userToDelete}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchUsers();
        showModalMessage('Éxito', 'Usuario eliminado exitosamente', true);
      }
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      showModalMessage('Error', 'No se pudo eliminar el usuario');
    }
  };

  return (
    
    <AdminContainer>
            <Navbar />
      
      <SectionTitle>
        <MdSecurity /> Panel de Administración
      </SectionTitle>

      {/* Estadísticas */}
      <StatsContainer>
        <StatCard>
          <MdGroup size={24} color="#1d3557" />
          <StatValue>{totalUsers}</StatValue>
          <StatLabel>Usuarios Totales</StatLabel>
        </StatCard>
        
        <StatCard>
          <MdAdminPanelSettings size={24} color="#1d3557" />
          <StatValue>{adminUsers}</StatValue>
          <StatLabel>Administradores</StatLabel>
        </StatCard>
        
        <StatCard>
          <MdPerson size={24} color="#1d3557" />
          <StatValue>{regularUsers}</StatValue>
          <StatLabel>Usuarios Normales</StatLabel>
        </StatCard>
      </StatsContainer>

      {/* Formulario para agregar usuarios */}
      <FormContainer>
        <FormTitle>
          <MdPersonAdd /> Agregar Nuevo Usuario
        </FormTitle>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Nombre:</Label>
            <Input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Apellido Paterno:</Label>
            <Input
              type="text"
              name="apellido_paterno"
              value={formData.apellido_paterno}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Apellido Materno:</Label>
            <Input
              type="text"
              name="apellido_materno"
              value={formData.apellido_materno}
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <Label>Correo Electrónico:</Label>
            <Input
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Contraseña:</Label>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
            />
          </FormGroup>

          <FormGroup>
            <Label>Tipo de Usuario:</Label>
            <Select
              name="id_rol"
              value={formData.id_rol}
              onChange={handleChange}
            >
              <option value="1">Administrador</option>
              <option value="2">Usuario Normal</option>
            </Select>
          </FormGroup>

          <Button type="submit" className="primary" disabled={loading}>
            <MdPersonAdd /> {loading ? 'Creando...' : 'Crear Usuario'}
          </Button>
        </form>
      </FormContainer>

      {/* Tabla de usuarios */}
      <SectionTitle>
        <MdGroup /> Usuarios Registrados
      </SectionTitle>
      
      <Table>
        <thead>
          <tr>
            <Th>Nombre</Th>
            <Th>Correo</Th>
            <Th>Tipo</Th>
            <Th>Acciones</Th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id_usuario}>
              <Td>{user.nombre}</Td>
              <Td>{user.correo}</Td>
              <Td>
                {user.id_rol === 1 ? (
                  <span style={{ color: '#e63946', fontWeight: 'bold' }}>Administrador</span>
                ) : (
                  <span>Usuario</span>
                )}
              </Td>
              <Td>
                <Button className="danger" onClick={() => confirmDelete(user.id_usuario)}>
                  <MdDelete /> Eliminar
                </Button>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal */}
      <ModalOverlay className={showModal ? 'active' : ''}>
        <ModalBox className={showModal ? 'active' : ''}>
          <ModalTitle>{modalContent.title}</ModalTitle>
          <ModalText>{modalContent.message}</ModalText>
          
          {modalContent.isConfirm ? (
            <div>
              <ModalButton danger onClick={handleDelete}>
                Eliminar
              </ModalButton>
              <ModalButton onClick={closeModal}>
                Cancelar
              </ModalButton>
            </div>
          ) : (
            <ModalButton 
              onClick={closeModal} 
              style={{ background: modalContent.isSuccess ? '#2a9d8f' : '#457b9d' }}
            >
              Aceptar
            </ModalButton>
          )}
        </ModalBox>
      </ModalOverlay>
    </AdminContainer>
  );
};

export default UserManagement;