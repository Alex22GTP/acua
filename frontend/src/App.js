import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './views/Home';
import EscenarioIncendios1 from './views/esc1-incendios';
import Img from './views/Img';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/escIncendio1" element={<EscenarioIncendios1 />} />
        <Route path="/img" element={<Img />} />

      </Routes>
    </Router>
  );
}

export default App;
