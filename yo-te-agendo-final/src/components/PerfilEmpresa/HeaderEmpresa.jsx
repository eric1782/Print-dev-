import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Header con botón de volver y foto de portada
 */
const HeaderEmpresa = ({ empresaData }) => {
  const navigate = useNavigate();

  return (
    <>
      {/* Header con botón volver */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="px-4 py-3">
          <button
            onClick={() => navigate("/home-usuario")}
            className="flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors text-sm font-medium"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver
          </button>
        </div>
      </div>

      {/* Foto de portada */}
      <div className="relative h-40 sm:h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {empresaData.fotoPortada ? (
          <img
            src={empresaData.fotoPortada}
            alt="Portada"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="text-xl sm:text-2xl font-bold text-white drop-shadow-sm truncate">
            {empresaData.nombreEmpresa}
          </h1>
        </div>
      </div>
    </>
  );
};

export default HeaderEmpresa;
