import React from 'react';
import Navbar from '../components/Navbar'; // Importa el Navbar
import Intro from '../components/Intro'; // Importa el Navbar

const Home = () => {
  return (
    <div>
      <Navbar /> {/* Aquí se muestra el menú */}
      <Intro /> 

    </div>
  );
};

export default Home;
