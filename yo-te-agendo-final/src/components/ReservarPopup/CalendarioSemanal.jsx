import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Componente para mostrar el calendario semanal
 */
const CalendarioSemanal = ({ 
  diasCalendario, 
  fechaSeleccionada, 
  onSeleccionarDia, 
  semanaActual, 
  onSemanaAnterior, 
  onSemanaSiguiente,
  onIrHoy 
}) => {
  return (
    <div className="bg-gray-50 rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <button
          onClick={onSemanaAnterior}
          aria-label="Semana anterior"
          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-gray-900">
            {format(semanaActual, 'MMMM yyyy', { locale: es })}
          </h3>
          <button
            onClick={onIrHoy}
            className="px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded-full hover:bg-blue-600 transition-colors"
          >
            Hoy
          </button>
        </div>
        <button
          onClick={onSemanaSiguiente}
          aria-label="Semana siguiente"
          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Calendario semanal */}
      <div className="grid grid-cols-7 gap-2">
        {diasCalendario.map((dia, index) => (
          <div key={index} className="text-center">
            <p className="text-xs font-medium text-gray-500 mb-1">{dia.nombre}</p>
            <button
              onClick={() => onSeleccionarDia(dia)}
              disabled={!dia.disponible}
              className={`w-full h-10 rounded-lg text-sm font-medium transition-all duration-200 ${
                !dia.disponible
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : dia.fecha === fechaSeleccionada
                  ? 'bg-green-500 text-white shadow-lg shadow-green-500/30 scale-105'
                  : 'bg-green-100 text-green-700 hover:bg-green-200 hover:scale-105'
              }`}
            >
              {format(dia.fechaObj, 'd')}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarioSemanal;
