import React from "react";

export default function MinimalistaTrabajadorCard({ trabajador, onEdit, onDelete }) {
  const [showDetails, setShowDetails] = React.useState(false);
  // Modal responsive para editar (solo si onEdit abre un modal)
  // Si usas un modal externo, asegúrate de que tenga estas clases:
  // "fixed inset-0 z-50 flex items-center justify-center bg-black/30"
  // Y el contenido:
  // "bg-white rounded-2xl shadow-lg w-full max-w-md mx-auto p-4 sm:p-8 overflow-y-auto max-h-[90vh]"
  // Si el modal está en otro archivo, aplica estas clases allí.
  return (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 sm:p-6 flex flex-col gap-3 min-w-[220px] sm:min-w-[340px] w-full sm:max-w-2xl mx-auto max-h-[90vh] overflow-y-auto relative">
      {/* Botón cerrar para modal (solo si está en modo edición/modal) */}
      <button className="absolute top-2 right-2 bg-gray-100 rounded-full p-2 text-gray-600 shadow hover:bg-gray-200 z-10" onClick={onDelete} title="Cerrar">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
      {/* Datos personales */}
  <div className="flex flex-col items-center gap-2 pb-2 border-b border-gray-100 w-full">
        <div className="relative group mb-2">
          {trabajador.fotoPerfil ? (
            <img
              src={trabajador.fotoPerfil}
              alt={trabajador.nombre + ' ' + trabajador.apellido}
              className="w-16 h-16 rounded-full object-cover border border-gray-200 shadow cursor-pointer"
              onClick={() => document.getElementById(`file-input-${trabajador.id}`).click()}
            />
          ) : (
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-center bg-gradient-to-r from-indigo-200 via-purple-100 to-pink-100 p-2 cursor-pointer border border-gray-200 shadow"
              onClick={() => document.getElementById(`file-input-${trabajador.id}`).click()}
            >
              <span className="text-gray-400 text-base sm:text-lg">Sin foto</span>
            </div>
          )}
          <input
            id={`file-input-${trabajador.id}`}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={e => {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = ev => {
                  if (ev.target.result) {
                    if (typeof onEdit === 'function') {
                      onEdit({ ...trabajador, fotoPerfil: ev.target.result });
                    }
                  }
                };
                reader.readAsDataURL(file);
              }
            }}
          />
          <span className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow group-hover:scale-110 transition-transform cursor-pointer" onClick={() => document.getElementById(`file-input-${trabajador.id}`).click()}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13zm-6 6h18" />
            </svg>
          </span>
        </div>
        <div className="font-semibold text-base text-gray-900 text-center">{trabajador.nombre} {trabajador.apellido}</div>
        <div className="text-xs text-gray-600 text-center">{trabajador.especialidad}</div>
        <div className="text-xs text-gray-500 flex items-center justify-center gap-1"><span className="material-icons text-base align-middle">call</span> {trabajador.telefono}</div>
      </div>
      {/* Botones de acción */}
  <div className="flex gap-2 items-center justify-center pb-2 border-b border-gray-100 w-full">
        <button
          className="p-2 rounded-full bg-blue-100 text-gray-700 shadow hover:scale-105 hover:shadow-lg transition-transform"
          title={showDetails ? "Ocultar detalles" : "Ver detalles"}
          onClick={() => setShowDetails(v => !v)}
        >
          <span className="w-5 h-5 flex items-center justify-center">
            {showDetails ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0 1 12 19c-5 0-9-7-9-7s2.1-3.5 5.4-5.7" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7Z" />
              </svg>
            )}
          </span>
        </button>
        <button
          className="p-2 rounded-full bg-green-100 text-gray-700 shadow hover:scale-105 hover:shadow-lg transition-transform"
          title="Editar"
          onClick={onEdit}
        >
          <span className="w-5 h-5 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 5.487a2.1 2.1 0 1 1 2.97 2.97L8.5 19.79l-4 1 1-4 11.362-11.303Z" />
            </svg>
          </span>
        </button>
        <button
          className="p-2 rounded-full bg-red-100 text-gray-700 shadow hover:scale-105 hover:shadow-lg transition-transform"
          title="Eliminar"
          onClick={onDelete}
        >
          <span className="w-5 h-5 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </span>
        </button>
      </div>
      {/* Detalles expandibles */}
      {showDetails && (
        <div className="mt-2 space-y-3 w-full">
          {/* Servicios */}
          <div className="pb-2 border-b border-gray-100">
            <div className="font-medium text-xs text-gray-700 mb-1">Servicios:</div>
            <ul className="flex flex-wrap gap-1 mt-1">
              {(trabajador.servicios && trabajador.servicios.length > 0)
                ? trabajador.servicios.map((serv, i) => (
                    <li key={i} className="bg-gray-50 border border-gray-100 text-gray-700 px-2 py-1 rounded text-xs">{serv}</li>
                  ))
                : <li className="text-xs text-gray-400">Sin servicios asignados</li>
              }
            </ul>
          </div>
          {/* Horarios */}
          <div>
            <div className="font-medium text-xs text-gray-700 mb-1">Horarios:</div>
            <ul className="flex flex-row flex-wrap gap-1 mt-1 max-h-24 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {(trabajador.horarios && trabajador.horarios.length > 0)
        ? trabajador.horarios.map((h, i) => (
          <li key={i} className="bg-gray-50 border border-gray-100 text-gray-700 px-1 py-1 rounded text-xs flex flex-row items-center gap-2 flex-nowrap overflow-x-auto">
            <span className="font-semibold truncate w-20 text-center">{h.dia ? h.dia : <span className="text-gray-400">Sin día</span>}</span>
            <span className="w-14 text-center">{h.horaInicio ? h.horaInicio : '--'}</span>
            <span className="w-4 text-center">-</span>
            <span className="w-14 text-center">{h.horaFin ? h.horaFin : '--'}</span>
            <span className="ml-2 px-2 py-0.5 rounded text-xs font-semibold w-16 text-center" style={{ background: h.habilitado !== false ? '#d1fae5' : '#fee2e2', color: h.habilitado !== false ? '#065f46' : '#991b1b' }}>{h.habilitado !== false ? 'Activo' : 'Inactivo'}</span>
            <button className="text-red-500 text-xs px-1" title="Eliminar" onClick={() => onDelete && onDelete(i)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </li>
                  ))
                : <li className="text-xs text-gray-400">Sin horarios asignados</li>
              }
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
