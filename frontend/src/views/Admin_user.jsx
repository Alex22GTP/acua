import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MdPersonAdd, MdDelete, MdEdit, MdAdminPanelSettings, MdPerson } from 'react-icons/md';

// Estilos
const AdminContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Poppins', sans-serif;
`;

const SectionTitle = styled.h2`
  color: #1d3557;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const Th = styled.th`
  background-color: #457b9d;
  color: white;
  padding: 1rem;
  text-align: left;
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #ddd;
  color: #1d3557;
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
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #457b9d;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    correo: '',
    password: '',
    id_rol: '2' // Por defecto usuario normal
  });
  const [loading, setLoading] = useState(false);

  // Obtener todos los usuarios
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
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
        await fetchUsers(); // Actualizar lista de usuarios
        setFormData({
          nombre: '',
          apellido_paterno: '',
          apellido_materno: '',
          correo: '',
          password: '',
          id_rol: '2'
        });
        alert('Usuario creado exitosamente');
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Error al crear usuario');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  // Eliminar usuario
  const handleDelete = async (userId) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          await fetchUsers(); // Actualizar lista de usuarios
          alert('Usuario eliminado exitosamente');
        }
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
      }
    }
  };

  return (
    <AdminContainer>
      <SectionTitle>
        <MdPerson /> Gestión de Usuarios
      </SectionTitle>

      {/* Formulario para agregar usuarios */}
      <FormContainer>
        <h3>Agregar Nuevo Usuario</h3>
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
        <MdAdminPanelSettings /> Usuarios Registrados
      </SectionTitle>
      
      <Table>
        <thead>
          <tr>
            <Th>Nombre</Th>
            <Th>Apellidos</Th>
            <Th>Correo</Th>
            <Th>Tipo</Th>
            <Th>Acciones</Th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id_usuario}>
              <Td>{user.nombre}</Td>
              <Td>{user.apellido_paterno} {user.apellido_materno}</Td>
              <Td>{user.correo}</Td>
              <Td>
                {user.id_rol === 1 ? (
                  <span style={{ color: '#e63946', fontWeight: 'bold' }}>Administrador</span>
                ) : (
                  <span>Usuario</span>
                )}
              </Td>
              <Td>
                <Button className="danger" onClick={() => handleDelete(user.id_usuario)}>
                  <MdDelete /> Eliminar
                </Button>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </AdminContainer>
  );
};

export default UserManagement;