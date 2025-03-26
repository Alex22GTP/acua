import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MdAdd, MdDelete, MdEdit, MdImage, MdArrowBack, MdClose, MdCheck } from 'react-icons/md';
import Navbar from '../components/NavbarAdmin';

// Estilos
const AdminContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-top: 100px;
  font-family: 'Poppins', sans-serif;
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

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
`;

const Card = styled.div`
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const CardImageContainer = styled.div`
  height: 180px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
`;

const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const NoImagePlaceholder = styled.div`
  height: 180px;
  background-color: #e0e0e0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #666;
`;

const CardContentWrapper = styled.div`
  padding: 1.5rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const CardTitle = styled.h4`
  color: #1d3557;
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
`;

const CardContent = styled.div`
  color: #333;
  margin-bottom: 1rem;
  flex-grow: 1;
`;

const CardActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: auto;
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
`;

const FormContainer = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
  transition: all 0.3s ease;

  &:focus {
    border-color: #1d3557;
    box-shadow: 0 0 0 2px rgba(29, 53, 87, 0.2);
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #a8dadc;
  border-radius: 4px;
  outline: none;
  font-size: 1rem;
  color: #1d3557;
  margin-bottom: 1rem;
  min-height: 100px;
  resize: vertical;
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

const ImagePreview = styled.img`
  max-width: 100%;
  max-height: 200px;
  border-radius: 4px;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
`;

const ImageContainer = styled.div`
  margin: 1rem 0;
  text-align: center;
`;

const MaxOptionsMessage = styled.div`
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1.5rem;
  text-align: center;
  color: #457b9d;
  border-left: 4px solid #e63946;
`;

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
  display: flex;
  align-items: center;
  gap: 0.5rem;

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

  &.success {
    background-color: #2a9d8f;
    color: white;

    &:hover {
      background-color: #1d7870;
    }
  }
`;

const ScenarioManagement = () => {
  const [scenarios, setScenarios] = useState([]);
  const [options, setOptions] = useState([]);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    id_catalogo: '',
    imagen: null,
    imagenPrevia: null
  });
  const [optionForm, setOptionForm] = useState({
    descripcion: '',
    solucion: false,
    retroalimentacion: ''
  });
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState('');

  // Obtener escenarios
  const fetchScenarios = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/admin/escenarios');
      
      if (!response.ok) {
        throw new Error(`Error HTTP! estado: ${response.status}`);
      }
      
      const data = await response.json();
      // Asegurarse de que cada escenario tenga la propiedad 'imagen'
      const scenariosWithImageFlag = data.map(scenario => ({
        ...scenario,
        imagen: scenario.imagen !== null // Convertir a booleano para saber si tiene imagen
      }));
      setScenarios(scenariosWithImageFlag);
    } catch (error) {
      console.error('Error al obtener escenarios:', error);
      showModalMessage('Error', 'No se pudieron cargar los escenarios');
      setScenarios([]);
    } finally {
      setLoading(false);
    }
  };

  // Obtener opciones de un escenario
  const fetchOptions = async (scenarioId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/escenarios/${scenarioId}/opciones`);
      
      if (!response.ok) {
        throw new Error(`Error HTTP! estado: ${response.status}`);
      }
      
      const data = await response.json();
      setOptions(data);
      setSelectedScenario(scenarioId);
      
      if (data.length >= 4) {
        showModalMessage(
          'Información', 
          'Este escenario ya tiene el máximo de 4 opciones permitidas',
          true
        );
      }
    } catch (error) {
      console.error('Error al obtener opciones:', error);
      showModalMessage('Error', 'No se pudieron cargar las opciones');
      setOptions([]);
    }
  };

  useEffect(() => {
    fetchScenarios();
  }, []);

  // Mostrar modal
  const showModalMessage = (title, message, isSuccess = false, isConfirm = false) => {
    setModalContent({
      title,
      message,
      isSuccess,
      isConfirm
    });
    setShowModal(true);
  };

  // Cerrar modal
  const closeModal = () => {
    setShowModal(false);
    setItemToDelete(null);
    setDeleteType('');
  };

  // Confirmar eliminación
  const confirmDelete = (id, type) => {
    setItemToDelete(id);
    setDeleteType(type);
    showModalMessage(
      'Confirmar Eliminación',
      `¿Estás seguro de que deseas eliminar este ${type === 'scenario' ? 'escenario' : 'opción'}?`,
      false,
      true
    );
  };

  // Eliminar item después de confirmación
  const handleDelete = async () => {
    if (!itemToDelete || !deleteType) return;
    
    try {
      const endpoint = deleteType === 'scenario' 
        ? `http://localhost:5000/api/admin/escenarios/${itemToDelete}`
        : `http://localhost:5000/api/admin/opciones/${itemToDelete}`;

      const response = await fetch(endpoint, {
        method: "DELETE"
      });

      if (response.ok) {
        if (deleteType === 'scenario') {
          await fetchScenarios();
          setSelectedScenario(null);
        } else {
          await fetchOptions(selectedScenario);
        }
        showModalMessage(
          'Éxito',
          `${deleteType === 'scenario' ? 'Escenario' : 'Opción'} eliminado correctamente`,
          true
        );
      }
    } catch (error) {
      console.error(`Error al eliminar ${deleteType}:`, error);
      showModalMessage(
        'Error',
        `No se pudo eliminar el ${deleteType === 'scenario' ? 'escenario' : 'opción'}`
      );
    }
  };

  // Manejar cambios en formularios
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (e) => {
    const { name, value, type, checked } = e.target;
    setOptionForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Manejar cambio de imagen
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          imagen: file,
          imagenPrevia: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Crear/editar escenario
  const handleScenarioSubmit = async (e) => {
    e.preventDefault();
    
    // Validación de campos requeridos
    if (!formData.titulo || !formData.descripcion || !formData.id_catalogo) {
      showModalMessage('Error', 'Todos los campos son requeridos');
      return;
    }
    
    setLoading(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('titulo', formData.titulo);
      formDataToSend.append('descripcion', formData.descripcion);
      formDataToSend.append('id_catalogo', formData.id_catalogo);
      if (formData.imagen) {
        formDataToSend.append('imagen', formData.imagen);
      }

      const method = formData.id_escenario ? 'PUT' : 'POST';
      const url = formData.id_escenario 
        ? `http://localhost:5000/api/admin/escenarios/${formData.id_escenario}`
        : 'http://localhost:5000/api/admin/escenarios';

      const response = await fetch(url, {
        method,
        body: formDataToSend
      });

      if (response.ok) {
        await fetchScenarios();
        resetScenarioForm();
        showModalMessage(
          'Éxito',
          `Escenario ${formData.id_escenario ? 'actualizado' : 'creado'} correctamente`,
          true
        );
      } else {
        const errorData = await response.json();
        showModalMessage('Error', errorData.error || 'Error al procesar la solicitud');
      }
    } catch (error) {
      console.error('Error:', error);
      showModalMessage('Error', 'Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  // Crear/editar opción
  const handleOptionSubmit = async (e) => {
    e.preventDefault();
    
    // Validación de máximo de opciones
    if (options.length >= 4) {
      showModalMessage(
        'Límite alcanzado',
        'No se pueden agregar más de 4 opciones por escenario'
      );
      return;
    }
    
    setLoading(true);
    
    try {
      const method = optionForm.id_opcion ? 'PUT' : 'POST';
      const url = optionForm.id_opcion 
        ? `http://localhost:5000/api/admin/opciones/${optionForm.id_opcion}`
        : 'http://localhost:5000/api/admin/opciones';

      const dataToSend = {
        ...optionForm,
        id_escenario: selectedScenario
      };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });

      if (response.ok) {
        await fetchOptions(selectedScenario);
        resetOptionForm();
        showModalMessage(
          'Éxito',
          `Opción ${optionForm.id_opcion ? 'actualizada' : 'creada'} correctamente`,
          true
        );
      } else {
        const errorData = await response.json();
        showModalMessage('Error', errorData.message || 'Error al procesar la solicitud');
      }
    } catch (error) {
      console.error('Error:', error);
      showModalMessage('Error', 'Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  // Resetear formularios
  const resetScenarioForm = () => {
    setFormData({
      titulo: '',
      descripcion: '',
      id_catalogo: '',
      imagen: null,
      imagenPrevia: null
    });
  };

  const resetOptionForm = () => {
    setOptionForm({
      descripcion: '',
      solucion: false,
      retroalimentacion: ''
    });
    setSelectedOption(null);
  };

  // Editar escenario
  const editScenario = (scenario) => {
    setFormData({
      id_escenario: scenario.id_escenario,
      titulo: scenario.titulo,
      descripcion: scenario.descripcion,
      id_catalogo: scenario.id_catalogo,
      imagen: null,
      imagenPrevia: scenario.imagen ? 
        `http://localhost:5000/api/admin/escenarios/${scenario.id_escenario}/imagen` : null
    });
  };

  // Editar opción
  const editOption = (option) => {
    setSelectedOption(option.id_opcion);
    setOptionForm({
      id_opcion: option.id_opcion,
      descripcion: option.descripcion,
      solucion: option.solucion,
      retroalimentacion: option.retroalimentacion
    });
  };

  return (
    <>
      <Navbar />
      <AdminContainer>
        <Section>
          <SectionHeader>
            <MdImage /> Gestión de Escenarios
          </SectionHeader>

          {/* Lista de escenarios */}
          <CardGrid>
            {scenarios.map(scenario => (
              <Card key={scenario.id_escenario}>
                {scenario.imagen ? (
                  <CardImageContainer>
                    <CardImage
                      src={`http://localhost:5000/api/admin/escenarios/${scenario.id_escenario}/imagen`}
                      alt={scenario.titulo}
                      onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = 'https://via.placeholder.com/300x180?text=Imagen+no+disponible';
                      }}
                    />
                  </CardImageContainer>
                ) : (
                  <NoImagePlaceholder>
                    <MdImage size={48} />
                    <span style={{ marginTop: '10px' }}>Sin imagen</span>
                  </NoImagePlaceholder>
                )}
                
                <CardContentWrapper>
                  <CardTitle>{scenario.titulo}</CardTitle>
                  <CardContent>
                    <p>{scenario.descripcion}</p>
                    <p><strong>Catálogo ID:</strong> {scenario.id_catalogo}</p>
                  </CardContent>
                  <CardActions>
                    <ActionButton 
                      bgColor="#4CAF50" 
                      hoverColor="#45a049"
                      onClick={() => editScenario(scenario)}
                    >
                      <MdEdit /> Editar
                    </ActionButton>
                    <ActionButton 
                      bgColor="#f44336" 
                      hoverColor="#d32f2f"
                      onClick={() => confirmDelete(scenario.id_escenario, 'scenario')}
                    >
                      <MdDelete /> Eliminar
                    </ActionButton>
                    <ActionButton 
                      onClick={() => fetchOptions(scenario.id_escenario)}
                    >
                      Ver Opciones
                    </ActionButton>
                  </CardActions>
                </CardContentWrapper>
              </Card>
            ))}
          </CardGrid>

          {/* Formulario de escenario */}
          <FormContainer>
            <SectionHeader>
              <MdAdd /> {formData.id_escenario ? 'Editar' : 'Agregar'} Escenario
            </SectionHeader>
            <form onSubmit={handleScenarioSubmit}>
              <FormInput
                type="text"
                name="titulo"
                placeholder="Título"
                value={formData.titulo}
                onChange={handleInputChange}
                required
              />
              <FormTextarea
                name="descripcion"
                placeholder="Descripción"
                value={formData.descripcion}
                onChange={handleInputChange}
                required
              />
              <FormInput
                type="number"
                name="id_catalogo"
                placeholder="ID del Catálogo"
                value={formData.id_catalogo}
                onChange={handleInputChange}
                required
              />
              
              <FormInput
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />

              {formData.imagenPrevia && (
                <ImageContainer>
                  <ImagePreview 
                    src={formData.imagenPrevia} 
                    alt="Vista previa" 
                  />
                  <ActionButton
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, imagen: null, imagenPrevia: null }))}
                    bgColor="#f44336"
                    hoverColor="#d32f2f"
                  >
                    <MdDelete /> Eliminar imagen
                  </ActionButton>
                </ImageContainer>
              )}

              <FormButton type="submit" disabled={loading}>
                {formData.id_escenario ? <MdCheck /> : <MdAdd />}
                {loading ? 'Procesando...' : formData.id_escenario ? 'Actualizar' : 'Crear'}
              </FormButton>
              {formData.id_escenario && (
                <ActionButton 
                  type="button"
                  onClick={resetScenarioForm}
                  style={{ marginLeft: '0.5rem' }}
                >
                  <MdClose /> Cancelar
                </ActionButton>
              )}
            </form>
          </FormContainer>
        </Section>

        {/* Gestión de opciones */}
        {selectedScenario && (
          <Section>
            <SectionHeader>
              <MdArrowBack 
                onClick={() => setSelectedScenario(null)} 
                style={{ cursor: "pointer" }} 
              />{" "}
              Opciones del Escenario ({options.length}/4)
            </SectionHeader>

            {/* Lista de opciones */}
            <CardGrid>
              {options.map(option => (
                <Card key={option.id_opcion}>
                  <CardTitle>{option.descripcion}</CardTitle>
                  <CardContent>
                    <p><strong>Solución:</strong> {option.solucion ? 'Sí' : 'No'}</p>
                    <p><strong>Retroalimentación:</strong> {option.retroalimentacion}</p>
                  </CardContent>
                  <CardActions>
                    <ActionButton 
                      bgColor="#4CAF50" 
                      hoverColor="#45a049"
                      onClick={() => editOption(option)}
                    >
                      <MdEdit /> Editar
                    </ActionButton>
                    <ActionButton 
                      bgColor="#f44336" 
                      hoverColor="#d32f2f"
                      onClick={() => confirmDelete(option.id_opcion, 'option')}
                    >
                      <MdDelete /> Eliminar
                    </ActionButton>
                  </CardActions>
                </Card>
              ))}
            </CardGrid>

            {/* Formulario de opción - Solo se muestra si hay menos de 4 opciones */}
            {options.length < 4 ? (
              <FormContainer>
                <SectionHeader>
                  <MdAdd /> {selectedOption ? 'Editar' : 'Agregar'} Opción
                </SectionHeader>
                <form onSubmit={handleOptionSubmit}>
                  <FormInput
                    type="text"
                    name="descripcion"
                    placeholder="Descripción"
                    value={optionForm.descripcion}
                    onChange={handleOptionChange}
                    required
                  />
                  <div style={{ marginBottom: '1rem' }}>
                    <label>
                      <input
                        type="checkbox"
                        name="solucion"
                        checked={optionForm.solucion}
                        onChange={handleOptionChange}
                        style={{ marginRight: '0.5rem' }}
                      />
                      ¿Es solución correcta?
                    </label>
                  </div>
                  <FormTextarea
                    name="retroalimentacion"
                    placeholder="Retroalimentación"
                    value={optionForm.retroalimentacion}
                    onChange={handleOptionChange}
                    required
                  />
                  <FormButton type="submit" disabled={loading}>
                    {selectedOption ? <MdCheck /> : <MdAdd />}
                    {loading ? 'Procesando...' : selectedOption ? 'Actualizar' : 'Crear'}
                  </FormButton>
                  {selectedOption && (
                    <ActionButton 
                      type="button"
                      onClick={resetOptionForm}
                      style={{ marginLeft: '0.5rem' }}
                    >
                      <MdClose /> Cancelar
                    </ActionButton>
                  )}
                </form>
              </FormContainer>
            ) : (
              <MaxOptionsMessage>
                Este escenario ya tiene el máximo de 4 opciones permitidas.
              </MaxOptionsMessage>
            )}
          </Section>
        )}
      </AdminContainer>

      {/* Modal de confirmación */}
      <ModalOverlay className={showModal ? "active" : ""}>
        <ModalBox className={showModal ? "active" : ""}>
          <ModalTitle>{modalContent.title}</ModalTitle>
          <ModalText>{modalContent.message}</ModalText>
          <ModalActions>
            {modalContent.isConfirm ? (
              <>
                <ModalButton className="confirm" onClick={handleDelete}>
                  <MdCheck /> Confirmar
                </ModalButton>
                <ModalButton className="cancel" onClick={closeModal}>
                  <MdClose /> Cancelar
                </ModalButton>
              </>
            ) : (
              <ModalButton 
                className={modalContent.isSuccess ? "success" : "cancel"} 
                onClick={closeModal}
              >
                <MdCheck /> Aceptar
              </ModalButton>
            )}
          </ModalActions>
        </ModalBox>
      </ModalOverlay>
    </>
  );
};

export default ScenarioManagement;