import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { MdAdd, MdDelete, MdImage, MdArrowBack, MdRefresh } from "react-icons/md";
import Navbar from '../components/NavbarAdmin';

// Estilos basados en tu diseño
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

const AdminHeader = styled.h2`
  color: #1d3557;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const Section = styled.div`
  margin-bottom: 3rem;
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const SectionHeader = styled.h3`
  color: #457b9d;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CatalogGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
`;

const CatalogCard = styled.div`
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const CatalogImage = styled.img`
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-bottom: 1px solid #eee;
`;

const CatalogContent = styled.div`
  padding: 1rem;
`;

const CatalogName = styled.h4`
  color: #1d3557;
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
`;

const CatalogStats = styled.div`
  display: flex;
  justify-content: space-between;
  color: #457b9d;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const CatalogActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  background-color: ${({ bgColor }) => bgColor || "#457b9d"};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${({ hoverColor }) => hoverColor || "#1d3557"};
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const FormContainer = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
  transition: all 0.3s ease;

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
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    background-color: #1d3557;
    transform: translateY(-2px);
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

// Estilos del modal
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
  transition: all 0.3s ease;

  &.active {
    opacity: 1;
    visibility: visible;
  }
`;

const ModalBox = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  max-width: 500px;
  width: 90%;
  text-align: center;
  transform: translateY(-20px);
  transition: all 0.3s ease;

  .active & {
    transform: translateY(0);
  }
`;

const ModalTitle = styled.h3`
  color: #1d3557;
  margin-bottom: 1.5rem;
`;

const ModalText = styled.p`
  color: #333;
  margin-bottom: 2rem;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const ModalButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;

  &.confirm {
    background-color: #e63946;
    color: white;

    &:hover {
      background-color: #c1121f;
    }
  }

  &.cancel {
    background-color: #457b9d;
    color: white;

    &:hover {
      background-color: #1d3557;
    }
  }
`;

function AdminDashboard() {
  const [catalogos, setCatalogos] = useState([]);
  const [selectedCatalog, setSelectedCatalog] = useState(null);
  const [escenarios, setEscenarios] = useState([]);
  const [newCatalogName, setNewCatalogName] = useState("");
  const [newCatalogImage, setNewCatalogImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const [catalogToDelete, setCatalogToDelete] = useState(null);

  // Obtener lista de catálogos
  const fetchCatalogos = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/admin/catalogos");
      const data = await response.json();
      setCatalogos(data);
    } catch (error) {
      console.error("Error al obtener catálogos:", error);
      showModalMessage("Error", "No se pudieron cargar los catálogos");
    }
  };

  useEffect(() => {
    fetchCatalogos();
  }, []);

  // Obtener escenarios de un catálogo
  const fetchEscenarios = async (catalogId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/catalogos/${catalogId}/escenarios`);
      const data = await response.json();
      setEscenarios(data);
      setSelectedCatalog(catalogId);
    } catch (error) {
      console.error("Error al obtener escenarios:", error);
      showModalMessage("Error", "No se pudieron cargar los escenarios");
    }
  };

  // Mostrar modal
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
    setCatalogToDelete(null);
  };

  // Confirmar eliminación
  const confirmDelete = (catalogId) => {
    setCatalogToDelete(catalogId);
    setModalContent({
      title: "Confirmar Eliminación",
      message: "¿Estás seguro de que deseas eliminar este catálogo? Esta acción no se puede deshacer.",
      isConfirm: true
    });
    setShowModal(true);
  };

  // Eliminar catálogo
  const handleDeleteCatalog = async () => {
    if (!catalogToDelete) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/admin/catalogos/${catalogToDelete}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchCatalogos();
        showModalMessage("Éxito", "Catálogo eliminado correctamente", true);
      }
    } catch (error) {
      console.error("Error al eliminar catálogo:", error);
      showModalMessage("Error", "No se pudo eliminar el catálogo");
    }
  };

  // Crear nuevo catálogo
  // Actualiza la función handleCreateCatalog
const handleCreateCatalog = async () => {
  if (!newCatalogName.trim()) {
    showModalMessage("Advertencia", "Por favor ingresa un nombre para el catálogo");
    return;
  }

  if (!newCatalogImage) {
    showModalMessage("Advertencia", "Por favor selecciona una imagen para el catálogo");
    return;
  }

  setLoading(true);
  
  try {
    const formData = new FormData();
    formData.append('nombre', newCatalogName.trim());
    formData.append('imagen', newCatalogImage);

    const response = await fetch("http://localhost:5000/api/admin/catalogos", {
      method: "POST",
      body: formData
      // No establezcas Content-Type manualmente, fetch lo hará automáticamente
    });

    if (response.ok) {
      const data = await response.json();
      setCatalogos([...catalogos, data]);
      setNewCatalogName("");
      setNewCatalogImage(null);
      showModalMessage("Éxito", "Catálogo creado correctamente", true);
    } else {
      const errorData = await response.json();
      showModalMessage("Error", errorData.message || "Error al crear catálogo");
    }
  } catch (error) {
    console.error("Error al crear catálogo:", error);
    showModalMessage("Error", "Error al conectar con el servidor");
  } finally {
    setLoading(false);
  }
};

  return (
    <>
      <Navbar />
      <AdminContainer>
        <AdminHeader>
          <MdImage /> Gestión de Catálogos
        </AdminHeader>

        {/* Listado de catálogos */}
        <Section>
          <SectionHeader>
            <MdImage /> Catálogos Disponibles
            <ActionButton 
              bgColor="#4CAF50" 
              hoverColor="#45a049" 
              onClick={fetchCatalogos}
              style={{ marginLeft: 'auto' }}
            >
              <MdRefresh /> Actualizar
            </ActionButton>
          </SectionHeader>
          
          <CatalogGrid>
            {catalogos.map((catalog) => (
              <CatalogCard key={catalog.id_catalogo}>
                <CatalogImage 
                  src={`http://localhost:5000/imagen/${catalog.id_catalogo}`} 
                  alt={catalog.nombre} 
                />
                <CatalogContent>
                  <CatalogName>{catalog.nombre}</CatalogName>
                  <CatalogStats>
                    <span>Intentos: {catalog.intentos || 0}</span>
                  </CatalogStats>
                  <CatalogActions>
                    <ActionButton 
                      bgColor="#f44336" 
                      hoverColor="#d32f2f" 
                      onClick={() => confirmDelete(catalog.id_catalogo)}
                    >
                      <MdDelete /> Eliminar
                    </ActionButton>
                    <ActionButton 
                      onClick={() => fetchEscenarios(catalog.id_catalogo)}
                    >
                      Ver Detalles
                    </ActionButton>
                  </CatalogActions>
                </CatalogContent>
              </CatalogCard>
            ))}
          </CatalogGrid>
        </Section>

        {/* Detalles de escenarios */}
{selectedCatalog && (
  <Section>
    <SectionHeader>
      <MdArrowBack 
        onClick={() => setSelectedCatalog(null)} 
        style={{ cursor: "pointer" }} 
      />{" "}
      Escenarios del Catálogo
    </SectionHeader>
    
    <CatalogGrid>
      {escenarios.map((escenario) => (
        <CatalogCard key={escenario.id_escenario}>
          <CatalogContent>
            <CatalogName>{escenario.titulo}</CatalogName>
            <CatalogStats>
              <span>Intentos: {escenario.intentos}</span>
              <span>Correctos: {escenario.porcentaje_correctos}%</span>
            </CatalogStats>
          </CatalogContent>
        </CatalogCard>
      ))}
    </CatalogGrid>
  </Section>
)}

        {/* Formulario para nuevo catálogo */}
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
    required
  />
  <FormInput
    type="file"
    accept="image/*"
    onChange={(e) => {
      if (e.target.files && e.target.files[0]) {
        setNewCatalogImage(e.target.files[0]);
      }
    }}
    required
  />
  
  {/* Vista previa de la imagen */}
  {newCatalogImage && (
    <div style={{ margin: '1rem 0', textAlign: 'center' }}>
      <img 
        src={URL.createObjectURL(newCatalogImage)} 
        alt="Vista previa" 
        style={{ 
          maxWidth: '100%', 
          maxHeight: '200px', 
          borderRadius: '4px',
          border: '1px solid #ddd'
        }} 
      />
      <ActionButton
        type="button"
        onClick={() => setNewCatalogImage(null)}
        bgColor="#f44336"
        hoverColor="#d32f2f"
        style={{ marginTop: '0.5rem' }}
      >
        <MdDelete /> Eliminar imagen
      </ActionButton>
    </div>
  )}

  <FormButton 
    onClick={handleCreateCatalog} 
    disabled={loading || !newCatalogName.trim() || !newCatalogImage}
  >
    <MdAdd /> {loading ? "Creando..." : "Crear Catálogo"}
  </FormButton>
</FormContainer>
        </Section>
      </AdminContainer>

      {/* Modal de confirmación */}
      <ModalOverlay className={showModal ? "active" : ""}>
        <ModalBox className={showModal ? "active" : ""}>
          <ModalTitle>{modalContent.title}</ModalTitle>
          <ModalText>{modalContent.message}</ModalText>
          <ModalActions>
            {modalContent.isConfirm ? (
              <>
                <ModalButton className="confirm" onClick={handleDeleteCatalog}>
                  Eliminar
                </ModalButton>
                <ModalButton className="cancel" onClick={closeModal}>
                  Cancelar
                </ModalButton>
              </>
            ) : (
              <ModalButton className="cancel" onClick={closeModal}>
                Aceptar
              </ModalButton>
            )}
          </ModalActions>
        </ModalBox>
      </ModalOverlay>
    </>
  );
}

export default AdminDashboard;