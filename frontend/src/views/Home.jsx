import React from 'react';
import Navbar from '../components/Navbar';
import Intro from '../components/Intro';
import MostrarCatalogos from '../components/CategoryCarousel'; // Importa el componente de catálogos
import QuienesSomos from '../components/Somos';
import NuestrosServicios from '../components/Servicios';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div>
      <Navbar /> {/* Menú de navegación */}
      <br/>
      <Intro /> {/* Sección de introducción */}
      <MostrarCatalogos id="catalogos" /> {/* Sección de catálogos */}
      <br/><br/>
      <QuienesSomos /> {/* Sección "¿Quiénes somos?" */}
      <NuestrosServicios /> {/* Sección "Nuestros servicios" */}
      <Footer /> {/* Pie de página */}
    </div>
  );
};

export default Home;