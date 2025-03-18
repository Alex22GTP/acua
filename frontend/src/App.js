import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './views/Home';
import EscenarioIncendios1 from './views/esc1-incendios';
import Img from './views/Img';
import Carrucel from './views/Carrucel';
import Login from './views/Login';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/escenarios/:id_escenario" element={<EscenarioIncendios1 />} />
        <Route path="/img" element={<Img />} />
        <Route path="/login" element={<Login />} />
        <Route path="/carrucel" element={<Carrucel />} />


      </Routes>
    </Router>
  );
}

export default App;
