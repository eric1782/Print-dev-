import React, { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/firebaseConfig'; // Ajusta la ruta si es necesario
import { Calendar, Menu, X, LogOut, Building2 } from 'lucide-react';

const NavbarEmpresa = ({ activeTab, setActiveTab }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut(auth);
    window.location.href = "/";
  };

  // Botones específicos para la Empresa
  const menuItems = [
    { tab: 'perfil', label: 'Mis Datos' },
    { tab: 'agenda', label: 'Agenda' },
    { tab: 'trabajadores', label: 'Trabajadores' },
    { tab: 'notificaciones', label: 'Notificaciones' }
  ];

  return (
    // Usamos relative y mb-4 para que empuje el contenido hacia abajo (Opción recomendada)
    <header className="relative w-full z-50 p-4 mb-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center p-4">
            
            {/* --- LOGO Y TOGGLE MÓVIL --- */}
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                {/* Usamos el mismo icono pero podrías usar Building2 para diferenciar si quisieras */}
                <Calendar className="w-8 h-8 text-indigo-600 mr-2" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Yo Te Agendo
                </h1>
              </div>

              <button 
                className="md:hidden text-indigo-600 hover:text-indigo-800 transition p-2"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* --- MENÚ DESKTOP --- */}
            <nav className="hidden md:flex space-x-2 items-center">
              {menuItems.map(({ tab, label }) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-xl transition-all font-medium text-sm ${
                    activeTab === tab 
                      ? 'bg-indigo-50 text-indigo-700 font-bold shadow-sm ring-1 ring-indigo-200' 
                      : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                  }`}
                >
                  {label}
                </button>
              ))}

              <div className="h-6 w-px bg-gray-200 mx-2"></div>

              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold px-5 py-2 rounded-xl shadow hover:shadow-md hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
              >
                <LogOut size={18} />
                <span>Salir</span>
              </button>
            </nav>
          </div>

          {/* --- MENÚ MÓVIL --- */}
          {menuOpen && (
            <div className="md:hidden flex flex-col space-y-3 p-4 border-t border-indigo-50 animate-in slide-in-from-top-2 duration-200">
              {menuItems.map(({ tab, label }) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-colors font-medium ${
                    activeTab === tab 
                      ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-100' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {label}
                </button>
              ))}
              
              <div className="border-t border-gray-100 my-2 pt-2">
                <button
                  onClick={handleSignOut}
                  className="w-full flex justify-center items-center gap-2 bg-red-50 text-red-600 font-bold px-4 py-3 rounded-xl hover:bg-red-100 transition-all"
                >
                  <LogOut size={18} />
                  Salir
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavbarEmpresa;