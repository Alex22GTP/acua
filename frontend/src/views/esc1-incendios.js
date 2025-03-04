import React from "react";
import "./esc1-incendios.css";
import oficinallamas from "../img/oficinallamas.png";

const EscenarioIncendios1 = () => {
  return (
    <div className="container">
      {/* Pregunta */}
      <h2 className="question">Imagina que estás en tu oficina trabajando cuando, de repente, suena la alarma de incendio. Notas que hay humo saliendo de una de las salas cercanas y la situación comienza a volverse caótica.</h2>

      {/* Espacio para la imagen */}
      <div className="image-container">
      <img src={oficinallamas} alt="Incendio" />
      </div>

      {/* Opciones */}
      <div className="options-container">
        <button className="option">Mantén la calma, evacúa siguiendo la ruta de emergencia y usa las salidas señalizadas.</button>
        <button className="option">Corre de inmediato hacia el extintor más cercano e intenta apagar el fuego sin evacuar.</button>
        <button className="option">Cierra con llave la oficina para evitar que el fuego se propague y espera a que lleguen los bomberos.</button>
        <button className="option">Entra al área incendiada para intentar recuperar objetos importantes antes de evacuar.</button>
      </div>
    </div>
  );
};

export default EscenarioIncendios1;