import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Importar Framer Motion
import "./esc1-incendios.css";
import oficinallamas from "../img/cocinaLlamas.png";
import tickSound from "../sounds/tick.mp3";
import alertSound from "../sounds/alert.mp3";

const EscenarioIncendios2 = ({ onNextScenario }) => {
  const [timeLeft, setTimeLeft] = useState(10); // Tiempo restante en segundos
  const [showModal, setShowModal] = useState(false);
  const [showSoundPermission, setShowSoundPermission] = useState(false); // Para mostrar la alerta de permiso de sonido
  const [timerRunning, setTimerRunning] = useState(false); // Para controlar si el temporizador está corriendo
  const [soundActivated, setSoundActivated] = useState(false); // Estado que guarda si el sonido ya fue activado
  const tickAudio = useRef(new Audio(tickSound));
  const alertAudio = useRef(new Audio(alertSound));
  const secondHandRef = useRef(null);

  // Reproducir sonido de tick y comenzar el temporizador cuando el componente se monte
  useEffect(() => {
    const tryPlaySound = async () => {
      try {
        await tickAudio.current.play();
        tickAudio.current.pause(); // Detenemos el sonido después de probarlo
        setSoundActivated(true); // Activamos el sonido
        setTimerRunning(true); // Iniciamos el temporizador
      } catch (err) {
        console.error("Error al intentar reproducir sonido:", err);
        setShowSoundPermission(true); // Si no puede reproducir, mostramos la alerta
      }
    };

    tryPlaySound();

    // Limpiar los recursos cuando el componente se desmonte
    return () => {
      tickAudio.current.pause(); // Detener el sonido
      tickAudio.current.currentTime = 0; // Resetear el sonido al inicio
    };
  }, []);

  // Manejo del temporizador
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
          tickAudio.current.pause(); // Detener el sonido de tick
          alertAudio.current.play(); // Reproducir sonido de alerta
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

  return (
    <AnimatePresence>
    <motion.div
      className="container"
      initial={{ opacity: 0, x: 50 }} // Inicia desde la derecha con opacidad 0
      animate={{ opacity: 1, x: 0 }} // Se hace visible y se mueve a su posición normal
      exit={{ opacity: 0, x: -50 }} // Se desvanece y se desliza hacia la izquierda
      transition={{ duration: 0.5 }} // Duración de la animación
    >
      {/* Reloj Analógico */}
      <div className="clock">
        <div className="clock-face">
          <div className="hand second-hand" ref={secondHandRef}></div>
        </div>
        <div className="second-text">{formatTime(timeLeft)}</div> {/* Mostrar el tiempo restante */}
      </div>

      {/* Pregunta */}
      <h2 className="question">
        Estás en tu hogar y, de repente, un olor a quemado te alerta. Al investigar, descubres que hay fuego en la cocina debido a un aceite que se ha derramado y hay fuego en la estufa.
      </h2>

      {/* Imagen */}
      <div className="image-container">
        <img src={oficinallamas} alt="Incendio" />
        <h2 className="question1">¿Qué harías en esta situación?</h2>
      </div>

      {/* Opciones */}
      <div className="options-container">
        <button className="option">Intenta sofocar las llamas con un trapo mojado o una toalla.</button>
        <button className="option">Abre la ventana de la cocina para dejar salir el humo.</button>
        <button className="option">Apaga el fuego utilizando una tapa o una olla para cubrir la sartén en llamas y cortar el suministro de oxígeno.</button>
        <button className="option">Echar agua sobre el fuego para apagarlo rápidamente.</button>
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
    </motion.div>
    </AnimatePresence>
  );
};

export default EscenarioIncendios2;