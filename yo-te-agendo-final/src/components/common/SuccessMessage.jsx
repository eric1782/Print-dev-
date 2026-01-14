import React from 'react';

/**
 * Componente reutilizable para mostrar mensajes de éxito
 */
const SuccessMessage = ({ 
  message, 
  onClose, 
  className = "" 
}) => {
  return (
    <div className={`bg-green-50 border border-green-200 rounded-xl p-4 ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-green-800">
            Éxito
          </h3>
          <div className="mt-2 text-sm text-green-700">
            <p>{message}</p>
          </div>
          {onClose && (
            <div className="mt-4">
              <button
                onClick={onClose}
                className="bg-green-100 text-green-800 px-3 py-1 rounded-md text-sm font-medium hover:bg-green-200 transition-colors"
              >
                Cerrar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuccessMessage;
