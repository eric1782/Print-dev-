import React, { useState } from 'react';
import { formatearFecha } from '../../utils/dateUtils';
import { ESTADOS_RESERVA } from '../../utils/constants';
import { LoadingSpinner } from '../common';

/**
 * Componente para mostrar la lista de reservas del usuario
 */
const ListaReservas = ({ 
  reservas, 
  loading, 
  categoriaSeleccionada, 
  onCambiarCategoria,
  onModificarReserva,
  onEditarReserva,
  onCancelarReserva,
  obtenerEstadoReserva,
  resetearTodasLasReservas
}) => {
  const [isResetting, setIsResetting] = useState(false);

  // Función para reset completo
  const handleResetCompleto = async () => {
    if (!window.confirm('⚠️ ¿Estás seguro de que quieres eliminar TODAS las reservas?\n\nEsto eliminará:\n• Todas las reservas de Firebase\n• Todas las reservas de localStorage\n• No se puede deshacer')) {
      return;
    }

    setIsResetting(true);
    try {
      const resultado = await resetearTodasLasReservas();
      if (resultado.success) {
        alert('✅ Todas las reservas han sido eliminadas exitosamente');
      } else {
        alert(`❌ Error: ${resultado.error}`);
      }
    } catch (error) {
      alert(`❌ Error inesperado: ${error.message}`);
    } finally {
      setIsResetting(false);
    }
  };

  // Función para verificar si se puede editar (6 horas antes)
  const puedeEditar = (reserva) => {
    if (!reserva.fechaReserva) return false;
    
    const ahora = new Date();
    const fechaReserva = reserva.fechaReserva.toDate ? reserva.fechaReserva.toDate() : new Date(reserva.fechaReserva);
    const seisHorasAntes = new Date(fechaReserva.getTime() - (6 * 60 * 60 * 1000));
    
    return ahora < seisHorasAntes;
  };

  // Función para verificar si se puede cancelar (12 horas antes)
  const puedeCancelar = (reserva) => {
    if (!reserva.fechaReserva) return false;
    
    const ahora = new Date();
    const fechaReserva = reserva.fechaReserva.toDate ? reserva.fechaReserva.toDate() : new Date(reserva.fechaReserva);
    const doceHorasAntes = new Date(fechaReserva.getTime() - (12 * 60 * 60 * 1000));
    
    return ahora < doceHorasAntes;
  };
  if (loading) {
    return (
      <LoadingSpinner 
        size="lg" 
        text="Cargando reservas..." 
        className="py-16" 
      />
    );
  }

  if (reservas.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">📋</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No tienes reservas aún</h3>
        <p className="text-gray-500 text-lg mb-6">Explora las empresas y agenda tu primera cita</p>
      </div>
    );
  }

  const reservasPorCategoria = {
    proximas: reservas.filter(r => obtenerEstadoReserva(r) === ESTADOS_RESERVA.PENDIENTE),
    historial: reservas.filter(r => obtenerEstadoReserva(r) === ESTADOS_RESERVA.COMPLETADA),
    canceladas: reservas.filter(r => obtenerEstadoReserva(r) === ESTADOS_RESERVA.CANCELADA)
  };

  const categorias = [
    { key: 'proximas', label: 'Próximas Citas', icon: '🗓️', color: 'from-green-600 to-emerald-600' },
    { key: 'historial', label: 'Historial de Citas', icon: '📋', color: 'from-gray-600 to-gray-700' },
    { key: 'canceladas', label: 'Citas Canceladas', icon: '❌', color: 'from-red-600 to-pink-600' }
  ];

  return (
    <div>
      <div className="text-center py-10">
        <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Mis Reservas
        </h2>
        <p className="text-gray-600 text-lg">Gestiona tus citas y reservas</p>
        
        {/* Botón de Reset - Solo visible si hay reservas */}
        {reservas.length > 0 && (
          <div className="mt-4">
            <button
              onClick={handleResetCompleto}
              disabled={isResetting}
              className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                isResetting
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl'
              }`}
            >
              {isResetting ? (
                <>
                  <span className="animate-spin inline-block w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full mr-2"></span>
                  Eliminando...
                </>
              ) : (
                <>
                  🗑️ Eliminar Todas las Reservas
                </>
              )}
            </button>
            <p className="text-xs text-gray-500 mt-2">
              ⚠️ Esta acción elimina TODAS las reservas y no se puede deshacer
            </p>
          </div>
        )}
      </div>

      {/* Sub menú visual */}
      <div className="flex justify-center gap-4 mb-8">
        {categorias.map(({ key, label }) => {
          const reservasCategoria = reservasPorCategoria[key];
          const count = reservasCategoria.length;
          
          return (
            <button
              key={key}
              className={`px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-2 ${
                categoriaSeleccionada === key 
                  ? "bg-purple-500 text-white shadow" 
                  : "bg-white text-purple-700 border border-purple-200"
              }`}
              onClick={() => onCambiarCategoria(key)}
            >
              <span>{label}</span>
              {count > 0 && (
                <span className={`px-2 py-1 rounded-full text-xs ${
                  categoriaSeleccionada === key 
                    ? "bg-white/20 text-white" 
                    : "bg-purple-100 text-purple-600"
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="space-y-8">
        {/* Mostrar solo la categoría seleccionada */}
        {(() => {
          const categoria = categorias.find(c => c.key === categoriaSeleccionada);
          const reservasCategoria = reservasPorCategoria[categoriaSeleccionada];
          
          if (!categoria) return null;
          
          if (reservasCategoria.length === 0) {
            return (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">{categoria.icon}</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No hay {categoria.label.toLowerCase()}</h3>
                <p className="text-gray-500 text-lg">
                  {categoriaSeleccionada === 'proximas' 
                    ? 'No tienes citas programadas' 
                    : categoriaSeleccionada === 'historial'
                    ? 'No tienes citas completadas'
                    : 'No tienes citas canceladas'
                  }
                </p>
              </div>
            );
          }

          return (
            <div>
              <h3 className={`text-2xl font-bold bg-gradient-to-r ${categoria.color} bg-clip-text text-transparent mb-4 flex items-center`}>
                <span className="text-2xl mr-3">{categoria.icon}</span>
                {categoria.label}
              </h3>
              <div className="grid gap-4">
                {reservasCategoria.map((reserva) => {
                  const empresa = reserva.empresaData;
                  const estado = obtenerEstadoReserva(reserva);
                  
                  return (
                    <div key={reserva.id} className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50 flex flex-col items-center">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-3">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                              estado === ESTADOS_RESERVA.PENDIENTE ? 'bg-gradient-to-br from-green-400 to-emerald-500' :
                              estado === ESTADOS_RESERVA.COMPLETADA ? 'bg-gradient-to-br from-gray-400 to-gray-500' :
                              'bg-gradient-to-br from-red-400 to-red-500'
                            }`}>
                              {empresa?.nombreEmpresa?.charAt(0) || "E"}
                            </div>
                            <div>
                              <h4 className="font-bold text-lg text-gray-800">
                                {empresa?.nombreEmpresa || "Empresa"}
                              </h4>
                              <p className="text-sm text-gray-600">{reserva.servicio}</p>
                            </div>
                          </div>
                          <div className="space-y-1 text-sm text-gray-600">
                            <p className="flex items-center">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {formatearFecha(reserva.fechaReserva)}
                            </p>
                            <p className="flex items-center">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              {reserva.personal || reserva.profesional || "Sin asignar"}
                            </p>
                            {reserva.notas && (
                              <p className="flex items-start">
                                <svg className="w-4 h-4 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                {reserva.notas}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        {/* Botones de acción solo para reservas pendientes */}
                        {estado === ESTADOS_RESERVA.PENDIENTE && (
                          <div className="flex flex-col sm:flex-row gap-2">
                            {/* Botón Editar */}
                            {puedeEditar(reserva) ? (
                              <button
                                onClick={() => onEditarReserva(reserva)}
                                className="px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                              >
                                ✏️ Editar
                              </button>
                            ) : (
                              <div className="relative group">
                                <button
                                  disabled
                                  className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-400 cursor-not-allowed"
                                >
                                  ✏️ Editar
                                </button>
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                                  Solo se puede editar hasta 6 horas antes
                                </div>
                              </div>
                            )}
                            
                            {/* Botón Cancelar */}
                            {puedeCancelar(reserva) ? (
                              <button
                                onClick={() => onCancelarReserva(reserva)}
                                className="px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200"
                              >
                                ❌ Cancelar
                              </button>
                            ) : (
                              <div className="relative group">
                                <button
                                  disabled
                                  className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-400 cursor-not-allowed"
                                >
                                  ❌ Cancelar
                                </button>
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                                  Solo se puede cancelar hasta 12 horas antes
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
};

export default ListaReservas;
