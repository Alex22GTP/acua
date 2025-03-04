import React, { useState, useEffect } from "react";
import "./esc1-incendios.css";
import oficinallamas from "../img/oficinallamas.png";
import tickSound from "../sounds/tick.mp3";  // Sonido por cada segundo
import alertSound from "../sounds/alert.mp3"; // Sonido al finalizar el tiempo

const EscenarioIncendios1 = () => {
  const [timeLeft, setTimeLeft] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [tickAudio] = useState(new Audio(tickSound));
  const [alertAudio] = useState(new Audio(alertSound));

  useEffect(() => {
    // Configurar volumen y bucle para el tic-tac
    tickAudio.loop = false;
    tickAudio.volume = 1; 

    alertAudio.volume = 1; // Volumen de la alerta

    // Iniciar el temporizador
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime > 1) {
          tickAudio.currentTime = 0;  // Reiniciar sonido
          tickAudio.play().catch((err) => console.error("Error reproduciendo sonido:", err));
          return prevTime - 1;
        } else {
          clearInterval(timer);
          tickAudio.pause(); // Detener tic-tac
          tickAudio.currentTime = 0;
          alertAudio.play();
          setShowModal(true);
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="container">
      <div className="timer">Tiempo restante: {timeLeft}s</div>

      <h2 className="question">
        Imagina que estás en tu oficina trabajando cuando, de repente, suena la alarma de incendio. 
        Notas que hay humo saliendo de una de las salas cercanas y la situación comienza a volverse caótica.
      </h2>

      <div className="image-container">
        <img src={oficinallamas} alt="Incendio" />
        <h2 className="question1">¿Qué harías en esta situación?</h2>
      </div>

      <div className="options-container">
        <button className="option">Mantén la calma, evacúa siguiendo la ruta de emergencia y usa las salidas señalizadas.</button>
        <button className="option">Corre de inmediato hacia el extintor más cercano e intenta apagar el fuego sin evacuar.</button>
        <button className="option">Cierra con llave la oficina para evitar que el fuego se propague y espera a que lleguen los bomberos.</button>
        <button className="option">Entra al área incendiada para intentar recuperar objetos importantes antes de evacuar.</button>
      </div>

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
    </div>
  );
};

export default EscenarioIncendios1;