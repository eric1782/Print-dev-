import Header from "./components/Header";
import Hero from "./components/Hero";
import QuienesSomos from "./pages/Landing/QuienesSomos";
import Servicios from "./pages/Landing/Servicios";
import Contacto from "./pages/Landing/Contacto";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop"; // 👈 Agrega esto

function App() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <Hero />
        <QuienesSomos />
        <Servicios />
        <Contacto />
      </main>
      <Footer />
      <ScrollToTop /> {/* 👈 Agrega el componente aquí */}
    </>
  );
}

export default App;






