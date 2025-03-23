import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { MdAdd, MdDelete, MdImage, MdArrowBack } from "react-icons/md";
import Navbar from '../components/NavbarAdmin';

// Estilos basados en las interfaces anteriores
const AdminContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-top: 100px; /* Ajuste para evitar solapamiento con el Navbar */
  font-family: 'Poppins', sans-serif;
`;

const AdminHeader = styled.h2`
  color: #1d3557;
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 2rem;
  font-weight: 600;
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const SectionHeader = styled.h3`
  color: #457b9d;
  margin-bottom: 1rem;
  font-size: 1.5rem;
  font-weight: 600;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
`;

const TableHeader = styled.th`
  background-color: #457b9d;
  color: white;
  padding: 1rem;
  text-align: left;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f0f0f0;
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  color: #1d3557;
  border-bottom: 1px solid #ddd;
`;

const ActionButton = styled.button`
  background-color: ${({ bgColor }) => bgColor || "#457b9d"};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  margin-right: 0.5rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${({ hoverColor }) => hoverColor || "#1d3557"};
  }
`;

const FormContainer = styled.div`
  margin-top: 1.5rem;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #a8dadc;
  border-radius: 4px;
  outline: none;
  font-size: 1rem;
  color: #1d3557;
  margin-bottom: 1rem;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &:focus {
    border-color: #1d3557;
    box-shadow: 0 0 0 2px rgba(29, 53, 87, 0.2);
  }
`;

const FormButton = styled.button`
  background-color: #457b9d;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: #1d3557;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

function AdminDashboard() {
  const [catalogos, setCatalogos] = useState([]);
  const [selectedCatalog, setSelectedCatalog] = useState(null);
  const [escenarios, setEscenarios] = useState([]);
  const [newCatalogName, setNewCatalogName] = useState("");
  const [newCatalogImage, setNewCatalogImage] = useState(null);

  // Obtener lista de catálogos con el número de intentos
  useEffect(() => {
    const fetchCatalogos = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/admin/catalogos");
        const data = await response.json();
        setCatalogos(data);
      } catch (error) {
        console.error("Error al obtener catálogos:", error);
      }
    };

    fetchCatalogos();
  }, []);

  // Obtener escenarios de un catálogo específico
  const fetchEscenarios = async (catalogId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/catalogos/${catalogId}/escenarios`);
      const data = await response.json();
      setEscenarios(data);
      setSelectedCatalog(catalogId);
    } catch (error) {
      console.error("Error al obtener escenarios:", error);
    }
  };

  // Eliminar catálogo
  const handleDeleteCatalog = async (catalogId) => {
    try {
      await fetch(`http://localhost:5000/api/admin/catalogos/${catalogId}`, {
        method: "DELETE",
      });
      setCatalogos(catalogos.filter((catalog) => catalog.id_catalogo !== catalogId));
    } catch (error) {
      console.error("Error al eliminar catálogo:", error);
    }
  };

  // Crear nuevo catálogo
  const handleCreateCatalog = async () => {
    if (!newCatalogName || !newCatalogImage) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    const formData = new FormData();
    formData.append("nombre", newCatalogName);
    formData.append("imagen", newCatalogImage);

    try {
      const response = await fetch("http://localhost:5000/api/admin/catalogos", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setCatalogos([...catalogos, data]);
        setNewCatalogName("");
        setNewCatalogImage(null);
        alert("Catálogo creado correctamente.");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error al crear catálogo:", error);
      alert("Error al crear catálogo. Inténtalo de nuevo.");
    }
  };

  return (
    <>
      <Navbar /> {/* Agregar el Navbar */}
      <AdminContainer>
        <AdminHeader>Panel de Administración</AdminHeader>

        {/* Gestión de Catálogos */}
        <Section>
          <SectionHeader>
            <MdImage /> Catálogos
          </SectionHeader>
          <Table>
            <thead>
              <TableRow>
                <TableHeader>Nombre</TableHeader>
                <TableHeader>Intentos</TableHeader>
                <TableHeader>Acciones</TableHeader>
              </TableRow>
            </thead>
            <tbody>
              {catalogos.map((catalog) => (
                <TableRow key={catalog.id_catalogo}>
                  <TableCell>
                    <a href="#" onClick={() => fetchEscenarios(catalog.id_catalogo)}>
                      {catalog.nombre}
                    </a>
                  </TableCell>
                  <TableCell>{catalog.intentos || 0}</TableCell>
                  <TableCell>
                    <ActionButton bgColor="#f44336" hoverColor="#d32f2f" onClick={() => handleDeleteCatalog(catalog.id_catalogo)}>
                      <MdDelete /> Eliminar
                    </ActionButton>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </Section>

        {/* Detalles de Escenarios */}
        {selectedCatalog && (
          <Section>
            <SectionHeader>
              <MdArrowBack onClick={() => setSelectedCatalog(null)} style={{ cursor: "pointer" }} />{" "}
              Escenarios del Catálogo
            </SectionHeader>
            <Table>
              <thead>
                <TableRow>
                  <TableHeader>Título</TableHeader>
                  <TableHeader>Intentos</TableHeader>
                  <TableHeader>% Correctos</TableHeader>
                </TableRow>
              </thead>
              <tbody>
                {escenarios.map((escenario) => (
                  <TableRow key={escenario.id_escenario}>
                    <TableCell>{escenario.titulo}</TableCell>
                    <TableCell>{escenario.intentos}</TableCell>
                    <TableCell>{escenario.porcentaje_correctos}%</TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          </Section>
        )}

        {/* Crear Nuevo Catálogo */}
        <Section>
          <SectionHeader>
            <MdAdd /> Crear Nuevo Catálogo
          </SectionHeader>
          <FormContainer>
            <FormInput
              type="text"
              placeholder="Nombre del catálogo"
              value={newCatalogName}
              onChange={(e) => setNewCatalogName(e.target.value)}
            />
            <FormInput
              type="file"
              accept="image/*"
              onChange={(e) => setNewCatalogImage(e.target.files[0])}
            />
            <FormButton onClick={handleCreateCatalog}>
              <MdAdd /> Crear Catálogo
            </FormButton>
          </FormContainer>
        </Section>
      </AdminContainer>
    </>
  );
}

export default AdminDashboard;