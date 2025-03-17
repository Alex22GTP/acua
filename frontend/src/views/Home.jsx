import React from 'react';
import Navbar from '../components/Navbar'; // Importa el Navbar
import Intro from '../components/Intro'; // Importa el Navbar
import Carrucel from '../components/CategoryCarousel'; // Importa el Navbar

const Home = () => {
  return (
    <div>
      <Navbar /> {/* Aquí se muestra el menú */}
      <Intro /> 
      <Carrucel />
    </div>
  );
};

export default Home;
