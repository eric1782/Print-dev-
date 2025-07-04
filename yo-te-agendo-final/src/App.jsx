import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

        {/* Vista pública del perfil de empresa */}
        <Route path="/empresa/:id" element={<PerfilEmpresaPublico />} />
      </Routes>
    </Router>
  );
}

export default App;
