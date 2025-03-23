import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './views/Home';
import EscenarioIncendios1 from './views/esc1-incendios';
import Img from './views/Img';
import Carrucel from './views/Carrucel';
import Login from './views/Login';
import Perfil from './views/Perfil';
import CambiarPass from './views/ChangePass';
import Estadistica from './views/Estadistica';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/escenarios/:id_catalogo/:id_escenario" element={<EscenarioIncendios1 />} />
        <Route path="/img" element={<Img />} />
        <Route path="/login" element={<Login />} />
        <Route path="/carrucel" element={<Carrucel />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/cambiarpass" element={<CambiarPass />} />
        <Route path="/estadistica" element={<Estadistica />} />


      </Routes>
    </Router>
  );
}

export default App;
