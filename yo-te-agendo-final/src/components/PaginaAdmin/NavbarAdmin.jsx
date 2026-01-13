import React, { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/firebaseConfig'; // Ruta ajustada
import { Calendar, Menu, X, LogOut, LayoutDashboard, Building2, Users, ShieldAlert } from 'lucide-react';

const NavbarAdmin = ({ activeTab, setActiveTab }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut(auth);
    window.location.href = "/";
  };

  const menuItems = [
    { tab: 'dashboard', label: 'Resumen', icon: <LayoutDashboard size={18} /> },
    { tab: 'empresas', label: 'Empresas', icon: <Building2 size={18} /> },
    { tab: 'usuarios', label: 'Usuarios', icon: <Users size={18} /> },
    { tab: 'admins', label: 'Administradores', icon: <ShieldAlert size={18} /> }
  ];

  return (
    <header className="relative w-full z-50 p-4 mb-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center p-4">
            
            {/* Logo y Título */}
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Calendar className="w-8 h-8 text-indigo-600 mr-2" />
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Yo Te Agendo
                  </h1>
                  <span className="text-xs font-bold text-purple-500 uppercase tracking-wider ml-1">Admin</span>
                </div>
              </div>

              <button 
                className="md:hidden text-indigo-600 p-2"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Menú Desktop */}
            <nav className="hidden md:flex space-x-2 items-center">
              {menuItems.map(({ tab, label, icon }) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-medium text-sm ${
                    activeTab === tab 
                      ? 'bg-indigo-50 text-indigo-700 font-bold shadow-sm ring-1 ring-indigo-200' 
                      : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                  }`}
                >
                  {icon}
                  {label}
                </button>
              ))}

              <div className="h-6 w-px bg-gray-200 mx-2"></div>

              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold px-5 py-2 rounded-xl shadow hover:shadow-md hover:scale-105 transition-all"
              >
                <LogOut size={18} />
                <span>Salir</span>
              </button>
            </nav>
          </div>

          {/* Menú Móvil */}
          {menuOpen && (
            <div className="md:hidden flex flex-col space-y-3 p-4 border-t border-indigo-50">
              {menuItems.map(({ tab, label, icon }) => (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setMenuOpen(false); }}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl font-medium ${
                    activeTab === tab ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-gray-600'
                  }`}
                >
                  {icon} {label}
                </button>
              ))}
               <button onClick={handleSignOut} className="flex items-center gap-3 w-full px-4 py-3 text-red-600 font-bold bg-red-50 rounded-xl">
                 <LogOut size={18} /> Salir
               </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavbarAdmin;