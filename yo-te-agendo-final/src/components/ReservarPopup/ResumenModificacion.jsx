import React from 'react';

/**
 * Componente para mostrar el resumen de modificación de reserva
 */
const ResumenModificacion = ({ 
  reservaAModificar, 
  fechaSeleccionada, 
  horaSeleccionada 
}) => {
  const formatearFechaOriginal = () => {
    let fechaOriginal;
    if (reservaAModificar.fechaOriginal?.toDate) {
      fechaOriginal = reservaAModificar.fechaOriginal.toDate();
    } else {
      fechaOriginal = new Date(reservaAModificar.fechaOriginal);
    }
    return fechaOriginal.toLocaleDateString("es-ES", { 
      weekday: "long", 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    });
  };

  const formatearFechaNueva = () => {
    return new Date(fechaSeleccionada).toLocaleDateString("es-ES", { 
      weekday: "long", 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    });
  };

  return (
    <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
      <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
        <span className="text-xl mr-2">🔄</span>
        Modificando Reserva
      </h4>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-600">Fecha Anterior:</p>
          <p className="font-medium text-red-600">
            {formatearFechaOriginal()}
          </p>
          <p className="font-medium text-red-600">{reservaAModificar.horaOriginal}</p>
        </div>
        <div>
          <p className="text-gray-600">Nueva Fecha:</p>
          <p className="font-medium text-green-600">
            {formatearFechaNueva()}
          </p>
          <p className="font-medium text-green-600">{horaSeleccionada}</p>
        </div>
      </div>
      <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-amber-800 text-xs">
          <strong>Nota:</strong> La empresa será notificada automáticamente del cambio de horario.
        </p>
      </div>
    </div>
  );
};

export default ResumenModificacion;
