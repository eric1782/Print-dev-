import React from 'react';

/**
 * Componente para seleccionar el profesional
 */
const SeleccionProfesional = ({ 
  personal, 
  profesionalSeleccionado, 
  onSeleccionarProfesional, 
  empresa, 
  servicio, 
  diaSeleccionado,
  loading,
  verificarDisponibilidadPersonal 
}) => {
  if (loading) {
    return (
      <div className="bg-blue-50 rounded-xl p-4 space-y-3">
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">Cargando personal...</p>
        </div>
      </div>
    );
  }

  if (personal.length === 0) {
    return (
      <div className="bg-blue-50 rounded-xl p-4 space-y-3">
        <div className="text-center py-6 bg-yellow-50 rounded-lg border border-yellow-200">
          <svg className="w-12 h-12 mx-auto mb-3 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <p className="text-yellow-800 font-medium mb-2">No hay personal registrado</p>
          <p className="text-yellow-600 text-sm mb-4">Esta empresa aún no ha agregado personal a su equipo</p>
          <button
            onClick={() => onSeleccionarProfesional('empresa-general')}
            className={`p-3 rounded-lg border text-left transition-all duration-200 w-full ${
              profesionalSeleccionado === 'empresa-general'
                ? 'border-blue-500 bg-blue-100 text-blue-700'
                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
            }`}
          >
            <p className="font-medium">{empresa.nombreEmpresa || 'Reservar con la empresa'}</p>
            <p className="text-sm text-gray-500">Reserva general - la empresa asignará personal disponible</p>
          </button>
        </div>
      </div>
    );
  }

  const personalParaMostrar = personal.filter(p => {
    const puedeHacerServicio = !p.servicios || 
      p.servicios.length === 0 || 
      p.servicios.includes(servicio.id) || 
      p.servicios.includes(servicio.nombre);
    return puedeHacerServicio;
  });

  if (personalParaMostrar.length === 0) {
    return (
      <div className="bg-blue-50 rounded-xl p-4 space-y-3">
        <div className="text-center py-6 bg-orange-50 rounded-lg border border-orange-200">
          <svg className="w-12 h-12 mx-auto mb-3 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <p className="text-orange-800 font-medium mb-2">Personal no disponible para este servicio</p>
          <p className="text-orange-600 text-sm mb-4">Ningún empleado está asignado a realizar "{servicio.nombre}"</p>
          <button
            onClick={() => onSeleccionarProfesional('empresa-general')}
            className={`p-3 rounded-lg border text-left transition-all duration-200 w-full ${
              profesionalSeleccionado === 'empresa-general'
                ? 'border-blue-500 bg-blue-100 text-blue-700'
                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
            }`}
          >
            <p className="font-medium">Reservar con {empresa.nombreEmpresa || 'la empresa'}</p>
            <p className="text-sm text-gray-500">La empresa coordinará el servicio internamente</p>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-gray-900 flex items-center">
          <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Selecciona el profesional
        </h4>
        <div className="text-xs text-gray-500">
          Personal cargado: {personal.length}
        </div>
      </div>
      
      <div className="grid gap-2">
        {personalParaMostrar.map((prof) => {
          const tieneDisponibilidad = verificarDisponibilidadPersonal(prof.horarios, empresa.horarios, diaSeleccionado?.dia);
          return (
            <button
              key={prof.id}
              onClick={() => onSeleccionarProfesional(prof.id)}
              disabled={!tieneDisponibilidad}
              className={`p-3 rounded-lg border text-left transition-all duration-200 ${
                !tieneDisponibilidad
                  ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed opacity-60'
                  : profesionalSeleccionado === prof.id
                  ? 'border-blue-500 bg-blue-100 text-blue-700'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-medium">{prof.nombre}</p>
                  <p className="text-sm text-gray-500">
                    {prof.especialidad || 'Profesional disponible'}
                  </p>
                  {prof.horarios && diaSeleccionado && (
                    <p className="text-xs text-gray-400 mt-1">
                      {prof.horarios.find(h => h.dia === diaSeleccionado.dia)
                        ?.rangos?.map(r => `${r.inicio || r.horaInicio}-${r.fin || r.horaFin}`).join(', ') || 'Horario flexible'}
                    </p>
                  )}
                </div>
                <div className="flex-shrink-0 ml-2">
                  {tieneDisponibilidad ? (
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  ) : (
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  )}
                </div>
              </div>
              {!tieneDisponibilidad && (
                <div className="mt-2">
                  <p className="text-xs text-red-500">No disponible este día</p>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SeleccionProfesional;
