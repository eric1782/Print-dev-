import React from 'react';

/**
 * Componente para mostrar la lista de servicios
 */
const ListaServicios = ({ servicios, onServicioClick }) => {
  return (
    <div className="space-y-3">
      {servicios.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p className="text-lg font-medium text-gray-400 mb-2">No hay servicios disponibles</p>
          <p className="text-sm text-gray-400">Esta empresa aún no ha configurado sus servicios</p>
        </div>
      ) : (
        servicios.map((serv) => (
          <div
            key={serv.id}
            onClick={() => onServicioClick(serv)}
            className="bg-gray-50 border border-gray-100 p-4 rounded-xl transition-all duration-300 cursor-pointer hover:bg-gradient-to-r hover:from-white hover:to-gray-50 hover:shadow-xl hover:border-gray-300 hover:scale-105 hover:-translate-y-1 active:scale-100 active:translate-y-0"
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05) translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
              e.currentTarget.style.background = 'linear-gradient(to right, #ffffff, #f9fafb)';
              e.currentTarget.style.borderColor = '#d1d5db';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1) translateY(0)';
              e.currentTarget.style.boxShadow = '';
              e.currentTarget.style.background = '#f9fafb';
              e.currentTarget.style.borderColor = '#f3f4f6';
            }}
          >
            <div className="flex items-start space-x-3">
              {/* Foto del servicio */}
              <div className="flex-shrink-0">
                {serv.foto ? (
                  <img
                    src={serv.foto}
                    alt={serv.nombre}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 shadow-sm"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-sm border-2 border-gray-200">
                    <span className="text-lg">{serv.icono || "⚡"}</span>
                  </div>
                )}
              </div>

              {/* Contenido del servicio */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div className="flex-1 mr-4">
                    <h3 className="font-semibold text-gray-900 text-sm mb-1 transition-colors hover:text-gray-700">{serv.nombre}</h3>
                    <p className="text-gray-500 text-xs leading-relaxed transition-colors hover:text-gray-700">{serv.descripcion}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center justify-end text-sm mb-1 transition-colors">
                      <div className="w-5 h-5 mr-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text font-semibold">
                        {serv.tiempo} min
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 transition-all hover:text-black hover:text-base">${serv.precio}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Indicador visual de que es clickeable */}
            <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-center">
              <span className="text-xs text-gray-400 flex items-center">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Clic para reservar
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ListaServicios;
