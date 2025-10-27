import React from 'react';

/**
 * Componente para mostrar los horarios de la empresa
 */
const SeccionHorarios = ({ horarios }) => {
  return (
    <div className="space-y-3">
      {horarios?.length > 0 ? (
        horarios.map((h, idx) => (
          <div key={idx} className="flex justify-between items-center py-2">
            <span className="font-medium text-gray-700 text-sm">{h.dia}</span>
            <span className="text-gray-500 text-sm">
              {h.rangos && h.rangos.length > 0
                ? h.rangos.map((r, i) => (
                    <span key={i} className="block text-right">
                      {r.horaInicio} - {r.horaFin}
                    </span>
                  ))
                : <span className="text-gray-400">Cerrado</span>}
            </span>
          </div>
        ))
      ) : (
        <p className="text-gray-400 text-center py-4 text-sm">Sin horarios disponibles.</p>
      )}
    </div>
  );
};

export default SeccionHorarios;
