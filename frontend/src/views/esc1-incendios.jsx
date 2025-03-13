import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";  // Importa useNavigate
import "./esc1-incendios.css";
import oficinallamas from "../img/oficinallamas.png";
import tickSound from "../sounds/tick.mp3";
import alertSound from "../sounds/alert.mp3";

const EscenarioIncendios1 = () => {
  const navigate = useNavigate(); // Inicializa useNavigate para la navegación
  const { id_escenario } = useParams(); // Obtener ID del escenario desde la URL
  const [escenario, setEscenario] = useState(null);
  const [opciones, setOpciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(10); // Tiempo restante en segundos
  const [showModal, setShowModal] = useState(false);
  const [showSoundPermission, setShowSoundPermission] = useState(false); // Para mostrar la alerta de permiso de sonido
  const [timerRunning, setTimerRunning] = useState(false); // Para controlar si el temporizador está corriendo
  const [soundActivated, setSoundActivated] = useState(false); // Estado que guarda si el sonido ya fue activado
  const [selectedOption, setSelectedOption] = useState(null); // Nuevo estado para la opción seleccionada
  const tickAudio = useRef(new Audio(tickSound));
  const alertAudio = useRef(new Audio(alertSound));
  const secondHandRef = useRef(null);

  // Cargar el escenario y las opciones
  useEffect(() => {
    const fetchEscenario = async () => {
      try {
        const response = await fetch(`http://localhost:5000/escenarios/${id_escenario}`);
        if (!response.ok) throw new Error("Error al obtener el escenario");

        const data = await response.json();
        setEscenario(data.escenario);
        setOpciones(data.opciones);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEscenario();
  }, [id_escenario]);

  // Intentar reproducir el sonido al cargar la página para detectar si es necesario el permiso
  useEffect(() => {
    const tryPlaySound = async () => {
      try {
        await tickAudio.current.play();
        tickAudio.current.pause(); // Detenemos el sonido después de probarlo
      } catch (err) {
        console.error("Error al intentar reproducir sonido:", err);
        setShowSoundPermission(true); // Si no puede reproducir, mostramos la alerta
      }
    };

    if (!soundActivated) {
      tryPlaySound();
    }
  }, [soundActivated]);

  // Lógica para el temporizador
  useEffect(() => {
    if (!timerRunning) return; // No iniciar el temporizador si no está habilitado

    let angle = 0; // Ángulo inicial de la manecilla de segundos

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime > 1) {
          // Reproducir el sonido de tick
          tickAudio.current.currentTime = 0;
          tickAudio.current.play().catch((err) => console.error("Error en sonido:", err));

          // Rotar la manecilla de segundos
          angle += 360 / 10; // Ajustar para 10 segundos
          if (secondHandRef.current) {
            secondHandRef.current.style.transform = `rotate(${angle}deg)`;
          }

          return prevTime - 1;
        } else {
          clearInterval(timer);
          tickAudio.current.pause();
          alertAudio.current.play();
          setShowModal(true);
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timerRunning]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const handleSoundPermission = () => {
    setShowSoundPermission(false);
    try {
      tickAudio.current.play().catch((err) => console.error("Error al reproducir sonido:", err));
      setSoundActivated(true); // Marcar que el sonido fue activado
      setTimerRunning(true); // Iniciar el temporizador después de que el usuario active el sonido
    } catch (err) {
      console.error("Error al intentar activar sonido:", err);
    }
  };

  // Función para navegar al siguiente escenario
  const handleNextScenario = () => {
    tickAudio.current.pause(); // Detener el sonido del escenario 1
    navigate(`/escenarios/${parseInt(id_escenario) + 1}`);  // Redirige al escenario 2
  };

  // Definir la función handleOptionSelect
  const handleOptionSelect = (opcion) => {
    setSelectedOption(opcion);  // Actualiza el estado con la opción seleccionada
    setShowModal(true);  // Muestra el modal con la retroalimentación
    setTimerRunning(false);  // Detiene el temporizador cuando se selecciona una opción
    tickAudio.current.pause();  // Detiene el sonido "tick"
    alertAudio.current.pause();  // Detiene el sonido "alert"
  };

  if (loading) return <p>Cargando escenario...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container">
      {/* Título del escenario */}
      <h1 className="scenario-title">{escenario.titulo}</h1>

      {/* Reloj Analógico */}
      <div className="clock">
        <div className="clock-face">
          <div className="hand second-hand" ref={secondHandRef}></div>
        </div>
        <div className="second-text">{formatTime(timeLeft)}</div> {/* Mostrar el tiempo restante */}
      </div>

      {/* Pregunta */}
      <h2 className="question">{escenario.descripcion}</h2>

      {/* Imagen */}
      <div className="image-container">
        <img src={oficinallamas} alt="Incendio" />
        <h2 className="question1">¿Qué harías en esta situación?</h2>
      </div>

      {/* Opciones */}
      <div className="options-container">
        {opciones.map((opcion) => (
          <button
            key={opcion.id_opcion}
            className={`option ${selectedOption?.id_opcion === opcion.id_opcion ? "selected" : ""}`}
            onClick={() => handleOptionSelect(opcion)}
          >
            {opcion.descripcion}
          </button>
        ))}
      </div>

      {/* Modal que se muestra cuando el tiempo se agota */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
          <h2>
        {selectedOption
          ? selectedOption.solucion
            ? "✅ Opción Correcta"
            : "❌ Opción Incorrecta"
          : "⏳ Tiempo agotado"}
      </h2>
            <p>{selectedOption
                ? selectedOption.retroalimentacion
                : "Debes actuar rápido en una situación de emergencia."}</p>
            <button onClick={handleNextScenario} className="modal-button">
              Siguiente Escenario
            </button>
          </div>
        </div>
      )}

      {/* Modal para solicitar permiso de sonido */}
      {showSoundPermission && !soundActivated && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>🔊 Permiso de sonido</h2>
            <p>Esta aplicación requiere permiso para activar el sonido. ¿Deseas activarlo?</p>
            <button onClick={handleSoundPermission} className="modal-button">
              Activar sonido
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EscenarioIncendios1;