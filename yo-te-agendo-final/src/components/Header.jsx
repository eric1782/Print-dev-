import { useState } from "react";
import { Calendar } from 'lucide-react';
import { Link } from "react-router-dom";

function Header() {
const [menuOpen, setMenuOpen] = useState(false);

return (
    // Barra superior de navegación
    <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
    <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
         {/* Logo + nombre del sitio */}
<div className="flex items-center gap-2">
    <Calendar className="w-12 h-12 text-indigo-600" />
    <div className="text-2xl font-bold text-indigo-600">
    Yo Te Agendo
    </div>
</div>
  {/* Menú de navegación */}
        <nav className="hidden md:flex space-x-8 items-center">
          <a href="#quienes-somos" className="text-gray-600 hover:text-indigo-600 transition">¿Quiénes Somos?</a>
          <a href="#servicios" className="text-gray-600 hover:text-indigo-600 transition">Servicios</a>
          <a href="#contacto" className="text-gray-600 hover:text-indigo-600 transition">Contacto</a>
          <Link
            to="/home"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Iniciar Sesión
          </Link>
        </nav>

        {/* boton celu */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
        </button>
    </div>

      {/* Menu celu */}
    {menuOpen && (
        <div className="bg-white shadow-md md:hidden flex flex-col space-y-4 p-4">
          <a href="#quienes-somos" className="text-gray-600 hover:text-indigo-600">¿Quiénes Somos?</a>
          <a href="#servicios" className="text-gray-600 hover:text-indigo-600">Servicios</a>
          <a href="#contacto" className="text-gray-600 hover:text-indigo-600">Contacto</a>

          {/* ✅ También aquí se reemplaza */}
          <Link
            to="/home"
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

 