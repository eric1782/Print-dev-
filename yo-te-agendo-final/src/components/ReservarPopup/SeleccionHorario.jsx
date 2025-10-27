import React from 'react';

/**
 * Componente para seleccionar el horario
 */
const SeleccionHorario = ({ 
  horariosDisponibles, 
  horaSeleccionada, 
  onSeleccionarHora, 
  servicio,
  onActualizarHorarios
}) => {
  if (horariosDisponibles.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <p className="text-yellow-800 text-center">
          No hay horarios disponibles para este día con el profesional seleccionado.
        </p>
      </div>
    );
  }

  const todosOcupados = horariosDisponibles.every(h => h.ocupado);
  
  if (todosOcupados) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <p className="text-yellow-800 text-center">
          Todos los horarios están ocupados para este día. Prueba con otro día o profesional.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-purple-50 rounded-xl p-4 space-y-3">
      <h4 className="font-semibold text-gray-900 flex items-center">
        <svg className="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Horarios disponibles ({horariosDisponibles.filter(h => !h.ocupado).length})
      </h4>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-xs text-blue-800">
            <p className="font-medium mb-1">💡 Información importante:</p>
            <p>• Al reservar un servicio de <strong>{servicio.tiempo} minutos</strong>, se bloquearán automáticamente los horarios que se superpongan.</p>
            <p>• <strong>🔄 Sincronización:</strong> Si el trabajador tiene una reserva, estará ocupado para TODOS sus servicios durante esa duración.</p>
            <p>• <strong>Ejemplo:</strong> Si Juan tiene Manicure Rusa (90min) a las 10:00, estará ocupado hasta 11:30 para TODOS sus servicios.</p>
            <p>• Los horarios de hoy se marcan como no disponibles <strong>5 minutos</strong> después de su hora de inicio.</p>
            <p>• ⏰ = Hora ya pasó | ✕ = Ocupado por otra reserva</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
        {horariosDisponibles.map((horario) => {
          const estaOcupado = horario.ocupado;
          return (
            <button
              key={horario.hora}
              onClick={() => !estaOcupado && onSeleccionarHora(horario.hora)}
              disabled={estaOcupado}
              className={`p-2 rounded-lg text-sm transition-all duration-200 ${
                estaOcupado
                  ? 'bg-red-100 border border-red-200 text-red-500 cursor-not-allowed opacity-70'
                  : horaSeleccionada === horario.hora
                  ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                  : 'bg-white border border-purple-200 text-purple-700 hover:bg-purple-100'
              }`}
            >
              <div className="text-center">
                <div className={`font-semibold text-sm ${estaOcupado ? 'line-through' : ''}`}>
                  {horario.hora}
                </div>
                {estaOcupado && (
                  <div className="text-xs text-red-600 mt-0.5">
                    {horario.hora < new Date().toTimeString().slice(0, 5) ? '⏰' : '✕'}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SeleccionHorario;
