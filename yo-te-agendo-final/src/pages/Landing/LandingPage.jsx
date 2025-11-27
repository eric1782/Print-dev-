// src/pages/Landing/LandingPage.jsx
import React from 'react';

// Importamos los componentes necesarios
import Header from "../../components/Header";
import Hero from "../../components/Hero";
import QuienesSomos from "./QuienesSomos"; // Ajusta la ruta si es necesario
import Servicios from "./Servicios";       // Ajusta la ruta si es necesario
import Contacto from "./Contacto";         // Ajusta la ruta si es necesario
import Footer from "../../components/Footer";

const LandingPage = () => {
  return (
    <>
      <Header />
      <Hero />
      <QuienesSomos />
      <Servicios />
      <Contacto />
      <Footer />
    </>
  );
};

export default LandingPage;