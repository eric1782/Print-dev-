import { useEffect, useState, useCallback } from "react";
import { collection, query, where, getDocs, deleteDoc, doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { formatearFecha, timestampToDate } from "../utils/dateUtils";
import { ESTADOS_RESERVA } from "../utils/constants";

function HomeEmpresaAgenda({ empresaId: empresaIdProp, personal, servicios }) {
  const [reservas, setReservas] = useState([]);
  const [empresaId, setEmpresaId] = useState(empresaIdProp || "");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('week'); // 'week', 'month'
  const [selectedReserva, setSelectedReserva] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    if (empresaIdProp) {
      setEmpresaId(empresaIdProp);
      setError(null);
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setEmpresaId(user.uid);
      } else {
        setError("No hay usuario autenticado.");
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [empresaIdProp]);

  // Utilidades para fechas
  const formatDate = (date) => {
    return date.toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  const formatTime = (timeStr) => {
    return timeStr;
  };

  const formatMonthYear = (date) => {
    return date.toLocaleDateString('es-CL', { month: 'long', year: 'numeric' });
  };

  const formatDay = (date) => {
    return date.getDate();
  };

  const formatWeekday = (date) => {
    return date.toLocaleDateString('es-CL', { weekday: 'short' });
  };

  // Obtener días del mes
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Días del mes anterior
    const prevMonth = new Date(year, month - 1, 0);
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push(new Date(year, month - 1, prevMonth.getDate() - i));
    }
    
    // Días del mes actual
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    // Días del mes siguiente para completar la cuadrícula
    const remainingDays = 42 - days.length; // 6 semanas x 7 días
    for (let day = 1; day <= remainingDays; day++) {
      days.push(new Date(year, month + 1, day));
    }
    
    return days;
  };

  // Obtener días de la semana
  const getWeekDays = (date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  // Obtener reservas para una fecha específica
  const getReservasForDate = (date) => {
    return reservas.filter(reserva => {
      const reservaDate = timestampToDate(reserva.fechaReserva);
      if (!reservaDate) return false;
      
      return reservaDate.getDate() === date.getDate() &&
             reservaDate.getMonth() === date.getMonth() &&
             reservaDate.getFullYear() === date.getFullYear();
    });
  };

  // Obtener color para el estado de la reserva
  const getReservaColor = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'pendiente':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'confirmada':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'cancelada':
        return 'bg-red-100 border-red-300 text-red-800';
      case 'completada':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      default:
        return 'bg-purple-100 border-purple-300 text-purple-800';
    }
  };

  const fetchReservas = useCallback(async () => {
    if (!empresaId) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Traer todas las reservas de la empresa
      const reservasRef = collection(db, "reservas");
      const q = query(
        reservasRef,
        where("empresaId", "==", empresaId)
      );
      const querySnapshot = await getDocs(q);
      let fetchedReservas = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      // No filtrar por fechas aquí, cargar todas las reservas del mes
      // El filtrado se hará en el frontend según la vista seleccionada

      const userIds = [...new Set(fetchedReservas.map(r => r.clienteId))];
      const serviceIds = [...new Set(fetchedReservas.map(r => r.servicioId))];

      let usersData = {};
      if (userIds.length > 0) {
        const usersRef = collection(db, "usuarios");
        const userPromises = userIds
          .filter(uid => !!uid)
          .map(uid => getDoc(doc(usersRef, uid)));
        const userSnaps = await Promise.all(userPromises);
        userSnaps.forEach(snap => {
          if (snap.exists()) {
            usersData[snap.id] = snap.data();
          }
        });
      }

      let servicesData = {};
      if (serviceIds.length > 0) {
        const empresaDocRef = doc(db, "empresas", empresaId);
        const empresaDocSnap = await getDoc(empresaDocRef);
        if (empresaDocSnap.exists() && empresaDocSnap.data().servicios) {
          empresaDocSnap.data().servicios.forEach(service => {
            servicesData[service.id] = service;
          });
        }
      }

      const populatedReservas = fetchedReservas.map(reserva => ({
        ...reserva,
        cliente: reserva.clienteNombre ? { nombre: reserva.clienteNombre, telefono: reserva.telefono || "" } : (usersData[reserva.clienteId] || { nombre: "Desconocido" }),
        servicio: reserva.servicio ? { nombre: reserva.servicio } : (servicesData[reserva.servicioId] || { nombre: "Servicio Desconocido" }),
        personalNombre: reserva.personal || reserva.personalNombre || "-",
        fechaReserva: reserva.fechaReserva || reserva.fecha,
        estado: reserva.estado || 'confirmada'
      }));

      setReservas(populatedReservas);

    } catch (err) {
      console.error("Error al cargar reservas:", err);
      setError("Error al cargar las reservas. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }, [empresaId, currentDate]);

  useEffect(() => {
    fetchReservas();
  }, [fetchReservas]);

  // Forzar actualización de reservas cada vez que se monta el componente
  useEffect(() => {
    // Limpiar reservas primero
    setReservas([]);
    // Luego cargar desde Firebase
    fetchReservas();
  }, [empresaId]);


  // Navegación del calendario
  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const navigateWeek = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + (direction * 7));
      return newDate;
    });
  };

  // Navegación inteligente según la vista
  const navigateCalendar = (direction) => {
    if (viewMode === 'week') {
      navigateWeek(direction);
    } else {
      navigateMonth(direction);
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="w-full mx-auto p-1 sm:p-2">
      {/* Header del calendario */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 mb-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          {/* Título y navegación */}
          <div className="flex items-center gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
              Agenda
            </h2>
            <button
              onClick={() => {
                setReservas([]);
                fetchReservas();
              }}
              className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
            >
              🔄 Actualizar
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigateCalendar(-1)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title={viewMode === 'week' ? 'Semana anterior' : 'Mes anterior'}
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={goToToday}
                className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-semibold text-sm hover:bg-purple-200 transition-colors"
              >
                Hoy
              </button>
              <button
                onClick={() => navigateCalendar(1)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title={viewMode === 'week' ? 'Semana siguiente' : 'Mes siguiente'}
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Selector de vista */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600">
              {viewMode === 'week' 
                ? `${formatDate(getWeekDays(currentDate)[0])} - ${formatDate(getWeekDays(currentDate)[6])}`
                : formatMonthYear(currentDate)
              }
            </span>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('week')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'week' 
                    ? 'bg-white text-purple-700 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Semana
              </button>
              <button
                onClick={() => setViewMode('month')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'month' 
                    ? 'bg-white text-purple-700 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Mes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Calendario */}
      {loading ? (
        <div className="text-center text-gray-500 py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p>Cargando reservas...</p>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-16">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-lg">{error}</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {viewMode === 'month' ? (
            /* Vista mensual */
            <>
              {/* Días de la semana */}
              <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
                {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
                  <div key={day} className="p-4 text-center font-semibold text-gray-600 text-sm">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Días del calendario */}
              <div className="grid grid-cols-7">
                {getDaysInMonth(currentDate).map((day, index) => {
                  const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                  const isToday = day.toDateString() === new Date().toDateString();
                  const dayReservas = getReservasForDate(day);
                  
            return (
                    <div
                      key={index}
                      className={`min-h-[140px] border-r border-b border-gray-200 p-2 ${
                        isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                      } ${isToday ? 'bg-purple-50' : ''}`}
                    >
                      <div className={`text-sm font-medium mb-1 ${
                        isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                      } ${isToday ? 'text-purple-700' : ''}`}>
                        {formatDay(day)}
                      </div>
                      
                      <div className="space-y-1">
                        {dayReservas.slice(0, 2).map((reserva, idx) => (
                          <div
                            key={reserva.id || idx}
                            className={`text-xs p-2 rounded cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-2 ${getReservaColor(reserva.estado)}`}
                            onClick={() => setSelectedReserva(reserva)}
                            title={`${reserva.servicio.nombre} - ${reserva.cliente.nombre} - ${formatTime(reserva.horaInicio || reserva.hora)}`}
                          >
                            <div className="font-medium text-xs whitespace-nowrap">{formatTime(reserva.horaInicio || reserva.hora)}</div>
                            <div className="truncate text-xs">{reserva.servicio.nombre}</div>
                          </div>
                        ))}
                        {dayReservas.length > 2 && (
                          <div className="text-xs text-gray-500 text-center">
                            +{dayReservas.length - 2} más
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            /* Vista semanal */
            <>
              {/* Días de la semana */}
              <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
                {getWeekDays(currentDate).map((day, index) => {
                  const isToday = day.toDateString() === new Date().toDateString();
                  return (
                    <div key={index} className={`p-4 text-center ${isToday ? 'bg-purple-100' : ''}`}>
                      <div className="text-sm font-medium text-gray-600 mb-1">
                        {formatWeekday(day)}
                      </div>
                      <div className={`text-lg font-bold ${isToday ? 'text-purple-700' : 'text-gray-900'}`}>
                        {formatDay(day)}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Contenido de la semana */}
              <div className="grid grid-cols-7 min-h-[400px]">
                {getWeekDays(currentDate).map((day, index) => {
                  const dayReservas = getReservasForDate(day);
                  const isToday = day.toDateString() === new Date().toDateString();
                  
                      return (
                    <div
                      key={index}
                      className={`border-r border-gray-200 p-3 ${isToday ? 'bg-purple-50' : 'bg-white'}`}
                    >
                      <div className="space-y-2">
                        {dayReservas.map((reserva, idx) => (
                        <div
                          key={reserva.id || idx}
                            className={`p-3 rounded-lg cursor-pointer hover:shadow-md transition-shadow flex items-center gap-3 ${getReservaColor(reserva.estado)}`}
                            onClick={() => setSelectedReserva(reserva)}
                          >
                            <div className="flex-shrink-0">
                              <div className="font-semibold text-sm">
                                {formatTime(reserva.horaInicio || reserva.hora)}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium truncate">
                                {reserva.servicio.nombre}
                              </div>
                              <div className="text-xs opacity-80 truncate">
                                {reserva.cliente.nombre}
                              </div>
                              <div className="text-xs opacity-60 truncate">
                                {reserva.personalNombre}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                        </div>
                      );
                    })}
                  </div>
            </>
          )}
        </div>
      )}

      {/* Modal de detalles de reserva */}
      {selectedReserva && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-900">Detalles de la Reserva</h3>
              <button
                onClick={() => setSelectedReserva(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Servicio</label>
                <p className="text-lg font-semibold text-gray-900">{selectedReserva.servicio.nombre}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Cliente</label>
                <p className="text-lg text-gray-900">{selectedReserva.cliente.nombre}</p>
                {selectedReserva.cliente.telefono && (
                  <p className="text-sm text-gray-600">{selectedReserva.cliente.telefono}</p>
                )}
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Fecha y Hora</label>
                <p className="text-lg text-gray-900">
                  {formatearFecha(selectedReserva.fechaReserva)} a las {formatTime(selectedReserva.horaInicio || selectedReserva.hora)}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Personal</label>
                <p className="text-lg text-gray-900">{selectedReserva.personalNombre}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Estado</label>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getReservaColor(selectedReserva.estado)}`}>
                  {selectedReserva.estado || 'Confirmada'}
                </span>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setSelectedReserva(null)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomeEmpresaAgenda;
