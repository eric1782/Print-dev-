import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/firebaseConfig';
import { Calendar } from 'lucide-react';

/**
 * Componente de navegación para el usuario
 */
const NavbarUsuario = ({ vistaActual, onCambiarVista }) => {
  const handleSignOut = async () => {
    await signOut(auth);
    window.location.href = "/";
  };

  return (
    <div className="w-full flex flex-col sm:block py-4 sm:py-8 mb-2 sm:mb-6 px-0 sm:px-8 relative">
      {/* Logo y título a la izquierda */}
      <div className="flex flex-row items-center w-full sm:w-auto mb-2 sm:mb-0 sm:pl-2">
        <Calendar className="w-10 h-10 sm:w-12 sm:h-12 text-indigo-600" />
        <div className="text-xl sm:text-2xl font-bold text-indigo-600 ml-2">Yo Te Agendo</div>
      </div>
      
      {/* Menú horizontal principal centrado absoluto en desktop */}
      <nav className="flex flex-row flex-wrap justify-center items-center text-center gap-2 sm:gap-4 px-2 sm:px-4 py-2 sm:py-3 rounded-2xl shadow-lg bg-white/80 backdrop-blur border border-white/40 max-w-2xl w-full sm:w-auto sm:absolute sm:left-1/2 sm:-translate-x-1/2">
        {[
          { tab: 'empresas', label: 'Empresas' },
          { tab: 'misReservas', label: 'Mis Reservas' },
          { tab: 'notificaciones', label: 'Notificaciones' }
        ].map(({ tab, label }) => (
          <button
            key={tab}
            onClick={() => onCambiarVista(tab)}
            className={`px-2 sm:px-4 py-1 sm:py-2 rounded-xl transition-all font-semibold text-xs sm:text-base whitespace-nowrap ${
              vistaActual === tab 
                ? 'bg-purple-500 text-white shadow' 
                : 'text-purple-700 hover:bg-purple-100'
            }`}
          >
            {label}
          </button>
        ))}
        
        <button
          onClick={handleSignOut}
          className="px-2 sm:px-4 py-1 sm:py-2 rounded-xl font-semibold bg-gradient-to-r from-red-500 to-pink-500 text-white shadow transition-all hover:from-red-600 hover:to-pink-600 flex items-center gap-0 sm:gap-2 text-xs sm:text-base"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
          </svg>
          <span className="hidden sm:inline">Salir</span>
        </button>
      </nav>
    </div>
  );
};

export default NavbarUsuario;
