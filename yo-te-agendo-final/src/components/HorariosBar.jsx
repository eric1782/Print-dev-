// HorariosBar.jsx
import React from "react";

function HorariosBar({ horarios }) {
  if (!horarios || horarios.length === 0) return <p>No hay horarios registrados.</p>;

  return (
    <div className="space-y-3">
      {horarios.map((dia, index) => (
        <div key={index}>
          <p className="font-medium text-indigo-700">
            {dia.dia}:
          </p>
          {/* Asegura que 'rangos' exista y tenga elementos */}
          {dia.rangos && dia.rangos.length > 0 ? (
            <ul className="list-disc list-inside text-gray-700">
              {dia.rangos.map((rango, i) => (
                <li key={i}>
                  {rango.horaInicio} - {rango.horaFin}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">Cerrado</p>
          )}
        </div>
      ))}
    </div>
  );
}

export default HorariosBar;