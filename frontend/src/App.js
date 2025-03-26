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
import Admin from './views/Admin';
import AdminUser from './views/Admin_user';
import AdminEsc from './views/Admin-escenario';



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
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin-user" element={<AdminUser/>} />
        <Route path="/admin-esc" element={<AdminEsc/>} />


      </Routes>
    </Router>
  );
}

export default App;
