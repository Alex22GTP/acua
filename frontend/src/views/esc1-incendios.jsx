import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./esc1-incendios.css";
import tickSound from "../sounds/tick.mp3";
import alertSound from "../sounds/alert.mp3";

const EscenarioIncendios1 = () => {
  const navigate = useNavigate();
  const { id_catalogo, id_escenario } = useParams(); // Captura ambos parámetros
  const [escenario, setEscenario] = useState(null);
  const [opciones, setOpciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(10);
  const [timerRunning, setTimerRunning] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [unansweredScenarios, setUnansweredScenarios] = useState(0); // Escenarios no contestados
  const [hasNext, setHasNext] = useState(null); // Inicialmente null
  const [showResults, setShowResults] = useState(false); // Controlar si se muestra el cuadro de resultados
  const secondHandRef = useRef(null);
  const tickAudio = useRef(new Audio(tickSound));
  const alertAudio = useRef(new Audio(alertSound));
  const timeUpHandled = useRef(false); // Para evitar que se ejecute múltiples veces

  // Formatear el tiempo
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  // Cargar escenario y opciones
  useEffect(() => {
    const fetchEscenario = async () => {
      try {
        const response = await fetch(`http://localhost:5000/escenarios/${id_catalogo}/${id_escenario}`);
        if (!response.ok) {
          if (response.status === 404) {
            setHasNext(false); // No hay más escenarios
            setLoading(false);
            return;
          }
          throw new Error("Error al obtener el escenario");
        }

        const data = await response.json();
        setEscenario(data.escenario);
        setOpciones(data.opciones);
        setHasNext(data.hasNext ?? false); // Si data.hasNext es undefined, usa false
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEscenario();
  }, [id_catalogo, id_escenario]);

  // Activar el temporizador y el sonido al cargar un nuevo escenario
  useEffect(() => {
    if (escenario && soundEnabled) {
      setTimerRunning(true); // Activar el temporizador
      tickAudio.current.play().catch((err) => console.warn("Error al reproducir sonido:", err));
    }
  }, [escenario, soundEnabled]);

  useEffect(() => {
    if (timeUp) {
      console.log("Tiempo agotado, verificando hasNext:", hasNext);
      console.log("selectedOption:", selectedOption);
    }
  }, [timeUp, hasNext, selectedOption]);

  // Temporizador
  useEffect(() => {
    if (!timerRunning) return;

    let angle = 0;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime > 0) {
          if (soundEnabled) {
            tickAudio.current.play().catch((err) => console.warn("Error al reproducir sonido:", err));
          }

          angle += 360 / 10;
          if (secondHandRef.current) {
            secondHandRef.current.style.transform = `rotate(${angle}deg)`;
          }

          return prevTime - 1;
        } else {
          clearInterval(timer);
          setTimeUp(true);
          alertAudio.current.play();

          if (!timeUpHandled.current) {
            timeUpHandled.current = true; // Evitar que se ejecute múltiples veces

            const guardarRespuestaAutomatica = async () => {
              const userId = localStorage.getItem("userId");
              if (!userId) {
                console.error("userId no encontrado en localStorage");
                return;
              }

              try {
                const response = await fetch("http://localhost:5000/api/guardar-respuesta", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    userId: userId,
                    id_escenario: id_escenario,
                    id_opcion: null,
                    respuesta_automatica: true,
                  }),
                });

                const data = await response.json();
                console.log("Respuesta automática guardada:", data);

                if (data.success) {
                  setUnansweredScenarios((prev) => prev + 1); // Incrementar el contador de escenarios no contestados
                }
              } catch (error) {
                console.error("Error al guardar la respuesta automática:", error);
              }
            };

            guardarRespuestaAutomatica();

            const verificarSiguienteEscenario = async () => {
              try {
                const response = await fetch(`http://localhost:5000/escenarios/${id_catalogo}/${parseInt(id_escenario) + 1}`);
                if (response.ok) {
                  setHasNext(true);
                } else {
                  setHasNext(false);
                }
              } catch (error) {
                console.error("Error al verificar el siguiente escenario:", error);
                setHasNext(false);
              }
            };

            verificarSiguienteEscenario();
          }

          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timerRunning, soundEnabled, id_escenario, id_catalogo]);


 // Restablecer timeUp y timeUpHandled al cargar un nuevo escenario
 useEffect(() => {
  if (escenario) {
    setTimeUp(false);
    timeUpHandled.current = false; // Reiniciar el flag
  }
}, [escenario]);


const handleNextScenario = async () => {
  console.log("handleNextScenario ejecutado");
  console.log("hasNext:", hasNext);
  console.log("timeUp:", timeUp);

  // Verificar si hay más escenarios en el mismo catálogo
  try {
    const response = await fetch(`http://localhost:5000/escenarios/${id_catalogo}/${parseInt(id_escenario) + 1}`);
    
    if (response.ok) {
      const data = await response.json();
      if (data.escenario) {
        console.log("Navegando al siguiente escenario");
        setSelectedOption(null);
        setTimeUp(false);
        setTimeLeft(10);
        setTimerRunning(true);
        
        if (soundEnabled) {
          tickAudio.current.play().catch((err) => console.warn("Error al reproducir sonido:", err));
        }
        
        navigate(`/escenarios/${id_catalogo}/${parseInt(id_escenario) + 1}`);
        return;
      }
    }
    
    // Si no hay más escenarios
    console.log("No hay más escenarios, mostrando resultados");
    setShowResults(true);
    setSelectedOption(null);
    setTimeUp(false);
    setTimerRunning(false);
    
  } catch (error) {
    console.error("Error al verificar siguiente escenario:", error);
    setShowResults(true);
  }
};

const handleOptionSelect = async (opcion) => {
  setSelectedOption(opcion);
  setTimerRunning(false);
  setTimeUp(false);
  tickAudio.current.pause();
  tickAudio.current.currentTime = 0;

  if (opcion.solucion) {
    setCorrectAnswers((prev) => prev + 1);
  } else {
    setIncorrectAnswers((prev) => prev + 1);
  }

  try {
    const userId = localStorage.getItem("userId");
    const response = await fetch("http://localhost:5000/api/guardar-respuesta", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
        id_escenario: id_escenario,
        id_opcion: opcion.id_opcion,
        respuesta_automatica: false,
      }),
    });

    const data = await response.json();
    console.log("Respuesta del servidor:", data);
    
    // Verificar manualmente si hay siguiente escenario
    const nextResponse = await fetch(`http://localhost:5000/escenarios/${id_catalogo}/${parseInt(id_escenario) + 1}`);
    setHasNext(nextResponse.ok);
    
  } catch (error) {
    console.error("Error al enviar la respuesta al servidor:", error);
    setHasNext(false);
  }
};

  const handleFinish = () => {
    navigate("/");
  };

  // Calcular la calificación y el mensaje de retroalimentación
  const totalEscenarios = correctAnswers + incorrectAnswers + unansweredScenarios;
  const calificacion = totalEscenarios > 0 ? Math.round((correctAnswers / totalEscenarios) * 100) : 0;

  let mensajeRetroalimentacion = "";
  if (calificacion >= 90) {
    mensajeRetroalimentacion = "¡Excelente! Has demostrado un gran conocimiento.";
  } else if (calificacion >= 70) {
    mensajeRetroalimentacion = "Bien, pero hay áreas en las que puedes mejorar.";
  } else if (calificacion >= 50) {
    mensajeRetroalimentacion = "Regular, necesitas repasar algunos conceptos.";
  } else {
    mensajeRetroalimentacion = "Debes esforzarte más. ¡Sigue practicando!";
  }

  if (loading) return <p>Cargando escenario...</p>;
  if (error) return <p>Error: {error}</p>;
  if (hasNext === null) return <p>Cargando información de escenarios...</p>; // Espera a que se cargue hasNext
  if (!escenario) return <p>No se encontró el escenario.</p>; // Validación adicional

  return (
    <div className="container">
      {/* Cuadro Emergente para activar sonido */}
      {!soundEnabled && (
        <>
          <div className="sound-overlay"></div>
          <div className="sound-alert">
            <h2>🔊 Permiso de sonido</h2>
            <p>Esta aplicación utiliza sonido para mejorar la experiencia. ¿Deseas activarlo?</p>
            <button
              className="sound-btn"
              onClick={() => {
                setSoundEnabled(true);
                setTimerRunning(true);
              }}
            >
              Activar Sonido
            </button>
          </div>
        </>
      )}

      {/* Título */}
      <h1 className="scenario-title">{escenario.titulo}</h1>

      {/* Reloj */}
      <div className="clock">
        <div className="clock-face">
          <div className="hand second-hand" ref={secondHandRef}></div>
        </div>
        <div className="second-text">{formatTime(timeLeft)}</div>
      </div>

      {/* Pregunta */}
      <h2 className="question">{escenario.descripcion}</h2>

      {/* Imagen */}
      <div className="image-container">
        {escenario.imagen && <img src={escenario.imagen} alt="Escenario" />}
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

      {/* Cuadro emergente con retroalimentación */}
      {selectedOption && !showResults && (
        <>
          <div className="feedback-overlay"></div>
          <div className="feedback-popup">
            <h2>{selectedOption.solucion ? "✅ Opción Correcta" : "❌ Opción Incorrecta"}</h2>
            <p>{selectedOption.retroalimentacion}</p>
            <button onClick={handleNextScenario} className="feedback-next-btn">
              Siguiente Escenario
            </button>
          </div>
        </>
      )}

      {/* Cuadro emergente cuando el tiempo se ha agotado */}
      {timeUp && !showResults && !selectedOption && (
        <>
          <div className="feedback-overlay"></div>
          <div className="feedback-popup">
            <h2>⏰ ¡Tiempo Agotado!</h2>
            <p>Debes actuar rápido en una situación de emergencia.</p>
            <button onClick={handleNextScenario} className="feedback-next-btn">
              Siguiente Escenario
            </button>
          </div>
        </>
      )}

      {/* Cuadro emergente con los resultados finales */}
      {showResults && (
        <>
          <div className="feedback-overlay2"></div>
          <div className="feedback-popup2">
            <h2>🏁 ¡Has completado todos los escenarios!</h2>
            <p>Respuestas correctas: {correctAnswers}</p>
            <p>Respuestas incorrectas: {incorrectAnswers}</p>
            <p>Escenarios no contestados: {unansweredScenarios}</p>
            <p>Calificación: {calificacion}%</p>
            <p>{mensajeRetroalimentacion}</p>
            <button onClick={handleFinish} className="feedback-next-btn2">
              Volver al Inicio
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default EscenarioIncendios1;