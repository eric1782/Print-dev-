import { useState } from "react";               // Hook de React para manejar el estado
import { Calendar } from "lucide-react";        // Icono de calendario desde lucide
import { Link } from "react-router-dom";        // Link para navegación sin recargar página

function Header() {
  const [menuOpen, setMenuOpen] = useState(false); // Estado para mostrar u ocultar el menú móvil

  return (
    <header className="absolute top-0 left-0 right-0 z-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center p-4">
            
            {/* Logo Yo Te Agendo */}
            <div className="flex items-center mb-4 md:mb-0">
              <Calendar className="w-8 h-8 text-indigo-600 mr-2" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Yo Te Agendo
              </h1>
            </div>
            
            {/* Menú de navegación en escritorio */}
            <nav className="hidden md:flex space-x-8 items-center">
              {/* Enlaces hacia secciones internas */}
              <a href="#quienes-somos" className="text-indigo-600 hover:text-indigo-800 transition font-medium">
                ¿Quiénes Somos?
              </a>
              <a href="#servicios" className="text-indigo-600 hover:text-indigo-800 transition font-medium">
                Servicios
              </a>
              <a href="#contacto" className="text-indigo-600 hover:text-indigo-800 transition font-medium">
                Contacto
              </a>

              {/* Link a la ruta /login con <Link /> para no recargar */}
              <Link
                to="/login"
                className="bg-white text-indigo-600 font-bold px-6 py-3 rounded-xl shadow-lg hover:bg-indigo-50 transition-all duration-300 transform hover:scale-105 border-2 border-indigo-600"
              >
                Iniciar Sesión
              </Link>
            </nav>

            {/* Botón para abrir menú en móvil */}
            <button 
              className="md:hidden absolute top-6 right-6 text-indigo-600 hover:text-indigo-800 transition"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              ☰
            </button>
          </div>

          {/* Menú desplegable para móviles */}
          {menuOpen && (
            <div className="md:hidden flex flex-col space-y-4 p-4 border-t border-indigo-100">
              {/* Logo en móvil */}
              <div className="flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-indigo-600 mr-2" />
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Yo Te Agendo
                </h1>
              </div>
              
              {/* Enlaces hacia secciones internas */}
              <a href="#quienes-somos" className="text-indigo-600 hover:text-indigo-800 font-medium">
                ¿Quiénes Somos?
              </a>
              <a href="#servicios" className="text-indigo-600 hover:text-indigo-800 font-medium">
                Servicios
              </a>
              <a href="#contacto" className="text-indigo-600 hover:text-indigo-800 font-medium">
                Contacto
              </a>

              {/* También usamos <Link> en móvil para el login */}
              <Link
                to="/login"
                className="bg-white text-indigo-600 font-bold px-6 py-3 rounded-xl shadow-lg hover:bg-indigo-50 transition-all duration-300 transform hover:scale-105 border-2 border-indigo-600 text-center"
              >
                Iniciar Sesión
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;

