import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

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

function App() {
  return (
    <Router>
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
              <Footer />
            </>
          }
        />
      </Routes>
    </Router>
  );
}
export default App;







