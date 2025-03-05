import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";  // Importa useNavigate
import "./esc1-incendios.css";
import oficinallamas from "../img/oficinallamas.png";
import tickSound from "../sounds/tick.mp3";
import alertSound from "../sounds/alert.mp3";

const EscenarioIncendios1 = () => {
  const navigate = useNavigate(); // Inicializa useNavigate para la navegación
  const [timeLeft, setTimeLeft] = useState(10); // Tiempo restante en segundos
  const [showModal, setShowModal] = useState(false);
  const [showSoundPermission, setShowSoundPermission] = useState(false); // Para mostrar la alerta de permiso de sonido
  const [timerRunning, setTimerRunning] = useState(false); // Para controlar si el temporizador está corriendo
  const [soundActivated, setSoundActivated] = useState(false); // Estado que guarda si el sonido ya fue activado
  const tickAudio = useRef(new Audio(tickSound));
  const alertAudio = useRef(new Audio(alertSound));
  const secondHandRef = useRef(null);

  // Intentar reproducir el sonido al cargar la página para detectar si es necesario el permiso
  useEffect(() => {
    if (soundActivated) return; // Si el sonido ya está activado, no mostrar alerta

    const tryPlaySound = async () => {
      try {
        await tickAudio.current.play();
        tickAudio.current.pause(); // Detenemos el sonido después de probarlo
      } catch (err) {
        console.error("Error al intentar reproducir sonido:", err);
        setShowSoundPermission(true); // Si no puede reproducir, mostramos la alerta
      }
    };

    tryPlaySound();
  }, [soundActivated]);

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
    navigate("/escIncendio2");  // Redirige al escenario 2
  };

  return (
    <div className="container">
      {/* Reloj Analógico */}
      <div className="clock">
        <div className="clock-face">
          <div className="hand second-hand" ref={secondHandRef}></div>
        </div>
        <div className="second-text">{formatTime(timeLeft)}</div> {/* Mostrar el tiempo restante */}
      </div>

      {/* Pregunta */}
      <h2 className="question">
        Imagina que estás en tu oficina trabajando cuando, de repente, suena la alarma de incendio. Notas que hay humo saliendo de una de las salas cercanas y la situación comienza a volverse caótica.
      </h2>

      {/* Imagen */}
      <div className="image-container">
        <img src={oficinallamas} alt="Incendio" />
        <h2 className="question1">¿Qué harías en esta situación?</h2>
      </div>

      {/* Opciones */}
      <div className="options-container">
        <button className="option">Mantén la calma, evacúa siguiendo la ruta de emergencia y usa las salidas señalizadas.</button>
        <button className="option">Corre de inmediato hacia el extintor más cercano e intenta apagar el fuego sin evacuar.</button>
        <button className="option">Cierra con llave la oficina para evitar que el fuego se propague y espera a que lleguen los bomberos.</button>
        <button className="option">Entra al área incendiada para intentar recuperar objetos importantes antes de evacuar.</button>
      </div>

      {/* Botón de siguiente escenario */}
      <div className="next-button-container">
        <button onClick={handleNextScenario} className="next-button">Siguiente Escenario</button>
      </div>

      {/* Modal que se muestra cuando el tiempo se agota */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>⏳ Tiempo agotado</h2>
            <p>Debes actuar rápido en una situación de emergencia.</p>
            <button onClick={() => setShowModal(false)} className="modal-button">
              Aceptar
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