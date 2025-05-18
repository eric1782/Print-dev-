import { useState } from "react";               // Hook de React para manejar el estado
import { Calendar } from "lucide-react";        // Icono de calendario desde lucide
import { Link } from "react-router-dom";        // Link para navegación sin recargar página

function Header() {
  const [menuOpen, setMenuOpen] = useState(false); // Estado para mostrar u ocultar el menú móvil

  return (
    <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
        
        {/* Logo y título */}
        <div className="flex items-center gap-2">
          <Calendar className="w-12 h-12 text-indigo-600" /> {/* Icono */}
          <div className="text-2xl font-bold text-indigo-600">
            Yo Te Agendo
          </div>
        </div>

        {/* Menú de navegación en escritorio */}
        <nav className="hidden md:flex space-x-8 items-center">
          {/* Enlaces hacia secciones internas */}
          <a href="#quienes-somos" className="text-gray-600 hover:text-indigo-600 transition">
            ¿Quiénes Somos?
          </a>
          <a href="#servicios" className="text-gray-600 hover:text-indigo-600 transition">
            Servicios
          </a>
          <a href="#contacto" className="text-gray-600 hover:text-indigo-600 transition">
            Contacto
          </a>

          {/* Link a la ruta /login con <Link /> para no recargar */}
          <Link
            to="/login"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Iniciar Sesión
          </Link>
        </nav>

        {/* Botón para abrir menú en móvil */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
      </div>

      {/* Menú desplegable para móviles */}
      {menuOpen && (
        <div className="bg-white shadow-md md:hidden flex flex-col space-y-4 p-4">
          <a href="#quienes-somos" className="text-gray-600 hover:text-indigo-600">
            ¿Quiénes Somos?
          </a>
          <a href="#servicios" className="text-gray-600 hover:text-indigo-600">
            Servicios
          </a>
          <a href="#contacto" className="text-gray-600 hover:text-indigo-600">
            Contacto
          </a>

          {/* También usamos <Link> en móvil para el login */}
          <Link
            to="/login"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Iniciar Sesión
          </Link>
        </div>
      )}
    </header>
  );
}

export default Header;


