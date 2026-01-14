// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Landing Page
import Header from "./components/Header";
import Hero from "./components/Hero";
import QuienesSomos from "./pages/Landing/QuienesSomos";
import Servicios from "./pages/Landing/Servicios";
import Contacto from "./pages/Landing/Contacto";
import Footer from "./components/Footer";

// Autenticación
import Login from "./pages/Login/Login";
import Registro from "./pages/Login/Registro";

// Dashboards
import HomeUsuario from "./pages/Home/HomeUsuario";
import HomeEmpresa from "./pages/Home/HomeEmpresa";
import HomeEmpresaAgenda from "./empresa/HomeEmpresaAgenda";

// Perfil Empresa Público
import PerfilEmpresaPublico from "./usuario/PerfilEmpresaPublico";

// Páginas de usuario
import Ayuda from "./usuario/AyudaUsuario";
import Configuracion from "./usuario/ConfiguracionUsuario";
import MisDatos from "./usuario/MisDatosUsuario";

function App() {
  return (
    <Router>
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
              <Footer />
            </>
          }
        />

        {/* Autenticación */}
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />

        {/* Dashboards */}
        <Route path="/home-usuario" element={<HomeUsuario />} />
        <Route path="/home-empresa" element={<HomeEmpresa />} />
        <Route path="/home-empresa/agenda" element={<HomeEmpresaAgenda />} />

        {/* Perfil público empresa */}
        <Route path="/empresa/:id" element={<PerfilEmpresaPublico />} />

        {/* Vistas usuario */}
        <Route path="/usuario/ayuda" element={<Ayuda />} />
        <Route path="/usuario/configuracion" element={<Configuracion />} />
        <Route path="/usuario/mis-datos" element={<MisDatos />} />
      </Routes>
    </Router>
  );
}

export default App;
