import React from 'react';
import Navbar from '../components/Navbar'; // Importa el Navbar

const Home = () => {
  return (
    <div>
      <Navbar /> {/* Aquí se muestra el menú */}
      <h1>Bienvenido a Home</h1>
      <p>Esta es la página de inicio.</p>
    </div>
  );
};

export default Home;
