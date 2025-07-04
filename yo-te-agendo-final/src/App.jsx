import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
<<<<<<< HEAD
import Header from "./components/Header";
import Hero from "./components/Hero";
import QuienesSomos from "./pages/Landing/QuienesSomos";
import Servicios from "./pages/Landing/Servicios";
import Contacto from "./pages/Landing/Contacto";
import Footer from "./components/Footer";

import Login from "./pages/Login/Login";
import Registro from "./pages/Login/Registro";
import HomeUsuario from "./pages/Home/HomeUsuario";
import HomeEmpresa from "./pages/Home/HomeEmpresa";
import PerfilEmpresaPublico from "./usuario/PerfilEmpresaPublico";
=======

import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

import QuienesSomos from "./pages/Landing/QuienesSomos";
import Servicios from "./pages/Landing/Servicios";
import Contacto from "./pages/Landing/Contacto";

import HomeUsuario from "./pages/Home/HomeUsuario"; // Import HomeUsuario

function LandingPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <section id="quienes-somos">
          <QuienesSomos />
        </section>
        <section id="servicios">
          <Servicios />
        </section>
        <section id="contacto">
          <Contacto />
        </section>
      </main>
      <Footer />
    </>
  );
}
>>>>>>> d8b8c7cb6550cbfdf48db52ccb3ff40c4194ce44

function App() {
  return (
    <Router>
<<<<<<< HEAD
      <Routes>
        {/* Landing Page */}
        <Route
          path="/"
          element={
            <>
              <Header />
              <Hero />
              <QuienesSomos />
              <Servicios />
              <Contacto />
=======
      <ScrollToTop />
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Página después de iniciar sesión */}
        <Route
          path="/home"
          element={
            <>
              <Header />
              <main className="pt-20">
                <HomeUsuario />
              </main>
>>>>>>> d8b8c7cb6550cbfdf48db52ccb3ff40c4194ce44
              <Footer />
            </>
          }
        />
<<<<<<< HEAD

        {/* Autenticación */}
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />

        {/* Dashboards */}
        <Route path="/home-usuario" element={<HomeUsuario />} />
        <Route path="/home-empresa" element={<HomeEmpresa />} />

        {/* Vista pública del perfil de empresa */}
        <Route path="/empresa/:id" element={<PerfilEmpresaPublico />} />
=======
>>>>>>> d8b8c7cb6550cbfdf48db52ccb3ff40c4194ce44
      </Routes>
    </Router>
  );
}
<<<<<<< HEAD

export default App;
=======
export default App;







>>>>>>> d8b8c7cb6550cbfdf48db52ccb3ff40c4194ce44
