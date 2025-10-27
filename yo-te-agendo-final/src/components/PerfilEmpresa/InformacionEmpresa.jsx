import React from 'react';

/**
 * Componente para mostrar la información básica de la empresa
 */
const InformacionEmpresa = ({ empresaData }) => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-6">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center mr-3">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Información</h2>
        </div>
        <p className="text-gray-600 leading-relaxed text-sm">
          {empresaData.descripcion || "Sin descripción disponible."}
        </p>
      </div>
    </div>
  );
};

export default InformacionEmpresa;
