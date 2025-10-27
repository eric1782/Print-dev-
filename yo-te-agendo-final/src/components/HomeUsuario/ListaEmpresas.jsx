import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '../common';

/**
 * Componente para mostrar la lista de empresas
 */
const ListaEmpresas = ({ empresas, loading, busqueda, onBuscar }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <LoadingSpinner 
        size="lg" 
        text="Cargando empresas..." 
        className="py-16" 
      />
    );
  }

  if (empresas.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🏢</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No hay empresas disponibles</h3>
        <p className="text-gray-500 text-lg mb-6">Vuelve más tarde o contacta soporte</p>
      </div>
    );
  }

  return (
    <div>
      {/* Barra de búsqueda */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Buscar empresas..."
          value={busqueda}
          onChange={(e) => onBuscar(e.target.value)}
          className="w-full max-w-md mx-auto px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-300"
        />
      </div>

      {/* Lista de empresas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {empresas.map((empresa) => (
          <div key={empresa.id} className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50 flex flex-col items-center">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-3xl mb-4">
              {empresa.nombreEmpresa?.charAt(0) || "E"}
            </div>
            <h4 className="font-bold text-xl text-gray-800 mb-2">{empresa.nombreEmpresa || "Empresa"}</h4>
            <p className="text-gray-600 text-sm mb-4 text-center">{empresa.descripcion || "Sin descripción"}</p>
            <button
              onClick={() => navigate(`/empresa/${empresa.id}`)}
              className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-all duration-300 text-sm font-medium"
            >
              Ver Empresa
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListaEmpresas;
