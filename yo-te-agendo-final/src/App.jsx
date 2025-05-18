import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Hero from "./components/Hero";
import QuienesSomos from "./pages/Landing/QuienesSomos";
import Servicios from "./pages/Landing/Servicios";
import Contacto from "./pages/Landing/Contacto";
import Footer from "./components/Footer";
import Login from "./pages/Login/Login";
import Registro from "./pages/Login/Registro"; // ← corregido el nombre

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta principal (landing page con header y footer) */}
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

        {/* Login sin header/footer */}
        <Route path="/login" element={<Login />} />

        {/* Registro sin header/footer */}
        <Route path="/registro" element={<Registro />} />
      </Routes>
    </Router>
  );
}

export default App;
