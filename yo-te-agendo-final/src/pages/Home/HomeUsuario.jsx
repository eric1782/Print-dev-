import { useEffect, useState } from "react";
import { collection, getDocs, query, where, doc, updateDoc, deleteDoc, orderBy, addDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { crearNotificacion } from "../../hooks/useCrearNotificacion";
import { db, auth } from "../../firebase/firebaseConfig";
import NotificacionesUsuario from "../../usuario/NotificacionesUsuario";
import { useNavigate } from "react-router-dom";
import ReservarPopup from "../../components/ReservarPopup";
import EditarCitaPopup from "../../components/EditarCitaPopup";
import { Calendar } from "lucide-react";

function HomeUsuario() {
  const navigate = useNavigate();
  const [empresas, setEmpresas] = useState([]);
  const [loadingEmpresas, setLoadingEmpresas] = useState(true);
  const [vistaActual, setVistaActual] = useState("empresas");
  const [busqueda, setBusqueda] = useState("");
  // Inicializa en 'proximas' para mostrar por defecto las próximas citas
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("proximas");
  const [modalModificar, setModalModificar] = useState(false);
  const [modalEditarCita, setModalEditarCita] = useState(false);
  // Solicitud de edición de cita
  const solicitarEdicionCita = ({ id, nuevaFecha, mensaje, empresaId, servicio }) => {
    // Notificación SOLO para la empresa, no para el usuario
    crearNotificacion({
      empresaId,
      reservaId: id,
      tipo: 'solicitud-edicion',
      mensaje: `El usuario solicita editar la reserva del servicio ${servicio} para el día ${nuevaFecha.toLocaleString('es-CL')}. ${mensaje ? 'Motivo: ' + mensaje : ''}`
    });
  };
  const [modalCancelar, setModalCancelar] = useState(false);
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
  const [mensajeCancelacion, setMensajeCancelacion] = useState("");
  const [loadingAccion, setLoadingAccion] = useState(false);
  const [reservas, setReservas] = useState([]);
  const [loadingReservas, setLoadingReservas] = useState(true);
  const user = auth.currentUser;

  // Función para cancelar reserva y notificar
  const cancelarReservaConMensaje = async () => {
    if (!reservaSeleccionada) return;
    setLoadingAccion(true);
    try {
      // Actualizar estado en Firestore: marcar como cancelada y guardar motivo
      await updateDoc(doc(db, "reservas", reservaSeleccionada.id), {
        cancelada: true,
        motivoCancelacion: mensajeCancelacion,
        estado: "cancelada"
      });
      // Limpiar estado y cerrar modal
      setModalCancelar(false);
      setMensajeCancelacion("");
      setLoadingAccion(false);
    } catch (error) {
      setLoadingAccion(false);
      // Manejo de error (opcional: mostrar mensaje de error)
    }
  }

  // Cargar reservas del usuario
  useEffect(() => {
    const cargarReservasUsuario = async () => {
      console.log("Ejecutando useEffect de reservas, user:", user?.uid);
      if (!user?.uid) {
        setReservas([]);
        return;
      }
      // Aquí va la lógica para cargar reservas desde Firestore
      const q = query(collection(db, "reservas"), where("usuarioId", "==", user.uid), orderBy("fechaReserva", "desc"));
      const querySnapshot = await getDocs(q);
      const reservasData = [];
      querySnapshot.forEach((doc) => {
        reservasData.push({ id: doc.id, ...doc.data() });
      });
      console.log('Reservas cargadas:', reservasData);
      setReservas(reservasData);
      setLoadingReservas(false);
    };

    cargarReservasUsuario();
  }, [user]);

  
  // Cargar empresas
  useEffect(() => {
    const cargarEmpresas = async () => {
      setLoadingEmpresas(true);
      const q = query(collection(db, "empresas"));
      const querySnapshot = await getDocs(q);
      const empresasData = [];
      querySnapshot.forEach((doc) => {
        empresasData.push({ id: doc.id, ...doc.data() });
      });
      setEmpresas(empresasData);
      setLoadingEmpresas(false);
    };
    cargarEmpresas();
  }, []);

  // Eliminar duplicados de empresas por id
  const empresasUnicas = Array.from(new Map(empresas.map(e => [e.id, e])).values());

  // Determina el estado de la reserva: "activa" (futura), "completada" (pasada), "cancelada" (cancelada)
  function obtenerEstadoReserva(reserva) {
    if (!reserva) return "";
    if (reserva.cancelada) return "cancelada";
    const ahora = new Date();
    let fechaReserva;
    if (typeof reserva.fechaReserva?.toDate === "function") {
      fechaReserva = reserva.fechaReserva.toDate();
    } else {
      fechaReserva = reserva.fechaReserva instanceof Date ? reserva.fechaReserva : new Date(reserva.fechaReserva);
    }
    // Si la fecha de reserva es en el futuro, está activa
    if (fechaReserva.getTime() > ahora.getTime()) return "activa";
    // Si la fecha de reserva es en el pasado y no está cancelada, está completada
    return "completada";
  }

  // Formatea la fecha a string legible, soporta Firestore Timestamp
  function formatearFecha(fecha) {
    if (!fecha) return "";
    if (typeof fecha.toDate === "function") {
      fecha = fecha.toDate();
    }
    const d = fecha instanceof Date ? fecha : new Date(fecha);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  // Adjuntar empresaData a cada reserva
  const reservasConEmpresa = reservas.map(reserva => ({
    ...reserva,
    empresaData: empresasUnicas.find(e => e.id === reserva.empresaId) || {}
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Logo y menú: disposición responsiva */}
      <div className="w-full flex flex-col sm:block py-4 sm:py-8 mb-2 sm:mb-6 px-0 sm:px-8 relative">
        {/* Logo y título a la izquierda */}
        <div className="flex flex-row items-center w-full sm:w-auto mb-2 sm:mb-0 sm:pl-2">
          <Calendar className="w-10 h-10 sm:w-12 sm:h-12 text-indigo-600" />
          <div className="text-xl sm:text-2xl font-bold text-indigo-600 ml-2">Yo Te Agendo</div>
        </div>
        {/* Menú horizontal principal centrado absoluto en desktop */}
        <nav className="flex flex-row flex-wrap justify-center items-center text-center gap-2 sm:gap-4 px-2 sm:px-4 py-2 sm:py-3 rounded-2xl shadow-lg bg-white/80 backdrop-blur border border-white/40 max-w-2xl w-full sm:w-auto sm:absolute sm:left-1/2 sm:-translate-x-1/2">
          { [
            { tab: 'empresas', label: 'Empresas' },
            { tab: 'misReservas', label: 'Mis Reservas' },
            { tab: 'notificaciones', label: 'Notificaciones' }
          ].map(({ tab, label }) => (
            <button
              key={tab}
              onClick={() => setVistaActual(tab)}
              className={`px-2 sm:px-4 py-1 sm:py-2 rounded-xl transition-all font-semibold text-xs sm:text-base whitespace-nowrap ${vistaActual === tab ? `bg-purple-500 text-white shadow` : `text-purple-700 hover:bg-purple-100`}`}
            >
              {label}
            </button>
          ))}
          <button
            onClick={async () => {
              await signOut(auth);
              window.location.href = "/";
            }}
            className="px-2 sm:px-4 py-1 sm:py-2 rounded-xl font-semibold bg-gradient-to-r from-red-500 to-pink-500 text-white shadow transition-all hover:from-red-600 hover:to-pink-600 flex items-center gap-0 sm:gap-2 text-xs sm:text-base"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" /></svg>
            <span className="hidden sm:inline">Salir</span>
          </button>
        </nav>
      </div>
      <div className="max-w-full sm:max-w-5xl mx-auto p-2 sm:p-6">
        {vistaActual === "misReservas" && (
          <div>
            <div className="text-center py-10">
              <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                Mis Reservas
              </h2>
              <p className="text-gray-600 text-lg">Gestiona tus citas y reservas</p>
            </div>
            {/* Sub menú visual */}
            <div className="flex justify-center gap-4 mb-8">
              <button
                className={`px-4 py-2 rounded-xl font-semibold text-sm ${categoriaSeleccionada === "proximas" ? "bg-purple-500 text-white shadow" : "bg-white text-purple-700 border border-purple-200"}`}
                onClick={() => setCategoriaSeleccionada("proximas")}
              >
                Próximas Citas
              </button>
              <button
                className={`px-4 py-2 rounded-xl font-semibold text-sm ${categoriaSeleccionada === "historial" ? "bg-purple-500 text-white shadow" : "bg-white text-purple-700 border border-purple-200"}`}
                onClick={() => setCategoriaSeleccionada("historial")}
              >
                Historial de Citas
              </button>
              <button
                className={`px-4 py-2 rounded-xl font-semibold text-sm ${categoriaSeleccionada === "canceladas" ? "bg-purple-500 text-white shadow" : "bg-white text-purple-700 border border-purple-200"}`}
                onClick={() => setCategoriaSeleccionada("canceladas")}
              >
                Citas Canceladas
              </button>
            </div>
            <div className="space-y-8">
              {loadingReservas ? (
                <div className="text-center py-16">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600 mb-4"></div>
                  <p className="text-gray-500 text-lg">Cargando reservas...</p>
                </div>
              ) : reservasConEmpresa.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">📋</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No tienes reservas aún</h3>
                  <p className="text-gray-500 text-lg mb-6">Explora las empresas y agenda tu primera cita</p>
                </div>
              ) : (
                <>
                  {/* Próximas citas */}
                  {categoriaSeleccionada === "proximas" && reservasConEmpresa.filter(reserva => obtenerEstadoReserva(reserva) === "activa").length > 0 && (
                    <div>
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4 flex items-center">
                        <span className="text-2xl mr-3">🗓️</span>
                        Próximas Citas
                      </h3>
                      <div className="grid gap-4">
                        {reservasConEmpresa
                          .filter(reserva => obtenerEstadoReserva(reserva) === "activa")
                          .map((reserva) => {
                            const empresa = reserva.empresaData;
                            let fechaReserva;
                            if (typeof reserva.fechaReserva?.toDate === "function") {
                              fechaReserva = reserva.fechaReserva.toDate();
                            } else {
                              fechaReserva = reserva.fechaReserva instanceof Date ? reserva.fechaReserva : new Date(reserva.fechaReserva);
                            }
                            const ahora = new Date();
                            const horasRestantes = (fechaReserva.getTime() - ahora.getTime()) / (1000 * 60 * 60);
                            const puedeCancelar = horasRestantes > 24;
                            const puedeEditar = horasRestantes > 12;
                            return (
                              <div key={reserva.id} className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50 flex flex-col items-center">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-4 mb-3">
                                      <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                        {empresa?.nombreEmpresa?.charAt(0) || "E"}
                                      </div>
                                      <div>
                                        <h4 className="font-bold text-lg text-gray-800">
                                          {empresa && empresa.nombreEmpresa ? empresa.nombreEmpresa : "Empresa"}
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
                                      {/* Horario eliminado, ya viene en la fecha */}
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
                                  <div className="flex flex-col sm:flex-row gap-2">
                                    <div className="flex flex-col gap-1">
                                      <button
                                        onClick={() => {
                                          if (!puedeEditar) return;
                                          setReservaSeleccionada(reserva);
                                          setModalEditarCita(true);
                                        }}
                                        disabled={!puedeEditar}
                                        className={`px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium ${puedeEditar ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                                        title={!puedeEditar ? 'Solo puedes editar la reserva hasta 12 horas antes. Si editas, la empresa debe aceptar el cambio.' : ''}
                                      >
                                        ✏️ Editar
                                      </button>
        {modalEditarCita && reservaSeleccionada && reservaSeleccionada.empresaData && (
          <EditarCitaPopup
            reserva={reservaSeleccionada}
            empresa={{ id: reservaSeleccionada.empresaId, ...reservaSeleccionada.empresaData }}
            onClose={() => setModalEditarCita(false)}
            onSolicitarEdicion={solicitarEdicionCita}
          />
        )}
                                      {!puedeEditar && (
                                        <span className="text-xs text-yellow-600 mt-1">Aviso: solo se puede cancelar o editar hasta 24 horas antes de tu reserva.</span>
                                      )}
                                      <button
                                        onClick={() => {
                                          if (!puedeCancelar) return;
                                          setReservaSeleccionada(reserva);
                                          setModalCancelar(true);
                                          crearNotificacion({
                                            empresaId: reserva.empresaId,
                                            tipo: 'cancelacion',
                                            mensaje: `El usuario ha cancelado la reserva del servicio ${reserva.servicio} para el día ${formatearFecha(reserva.fechaReserva)}.`
                                          });
                                        }}
                                        disabled={!puedeCancelar}
                                        className={`px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium ${puedeCancelar ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                                        title={!puedeCancelar ? 'Solo puedes cancelar la reserva hasta 24 horas antes del servicio.' : ''}
                                      >
                                        ❌ Cancelar
                                      </button>
                                      {!puedeCancelar && (
                                        <span className="text-xs text-red-600 mt-1">Aviso: solo se puede cancelar o editar hasta 24 horas antes de tu reserva.</span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}
                  {/* Historial de citas */}
                  {categoriaSeleccionada === "historial" && reservasConEmpresa.filter(reserva => obtenerEstadoReserva(reserva) === "completada").length > 0 && (
                    <div>
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-600 to-gray-700 bg-clip-text text-transparent mb-4 flex items-center">
                        <span className="text-2xl mr-3">📋</span>
                        Historial de Citas
                      </h3>
                      <div className="grid gap-4">
                        {reservasConEmpresa
                          .filter(reserva => obtenerEstadoReserva(reserva) === "completada")
                          .map((reserva) => {
                            const estado = obtenerEstadoReserva(reserva);
                            const empresa = reserva.empresaData;
                            const fechaReserva = reserva.fechaReserva instanceof Date ? reserva.fechaReserva : new Date(reserva.fechaReserva);
                            const ahora = new Date();
                            const horasRestantes = (fechaReserva - ahora) / (1000 * 60 * 60);
                            const puedeCancelar = horasRestantes > 24;
                            const puedeEditar = horasRestantes > 12;
                            return (
                              <div key={reserva.id} className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm bg-gradient-to-br from-green-400 to-emerald-500">
                                    {empresa?.nombreEmpresa?.charAt(0) || "E"}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <h4 className="font-bold text-lg text-gray-800">
                                        {empresa?.nombreEmpresa || "Empresa"}
                                      </h4>
                                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                        Completada
                                      </span>
                                    </div>
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
                            );
                          })}
                      </div>
                    </div>
                  )}
                  {/* Citas canceladas */}
                  {categoriaSeleccionada === "canceladas" && reservasConEmpresa.filter(reserva => obtenerEstadoReserva(reserva) === "cancelada").length > 0 && (
                    <div>
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-4 flex items-center">
                        <span className="text-2xl mr-3">❌</span>
                        Citas Canceladas
                      </h3>
                      <div className="grid gap-4">
                        {reservasConEmpresa
                          .filter(reserva => obtenerEstadoReserva(reserva) === "cancelada")
                          .map((reserva) => {
                            const empresa = reserva.empresaData;
                            return (
                              <div key={reserva.id} className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm bg-gradient-to-br from-red-400 to-red-500">
                                    {empresa?.nombreEmpresa?.charAt(0) || "E"}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <h4 className="font-bold text-lg text-gray-800">
                                        {empresa?.nombreEmpresa || "Empresa"}
                                      </h4>
                                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                        Cancelada
                                      </span>
                                    </div>
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
                            );
                          })}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
        {vistaActual === "notificaciones" && (
          <div className="py-10">
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 text-center">
              Notificaciones
            </h2>
            <NotificacionesUsuario />
          </div>
        )}
        {modalModificar && reservaSeleccionada && reservaSeleccionada.empresaData && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="relative">
              <ReservarPopup
                servicio={{
                  id: reservaSeleccionada.servicioId,
                  nombre: reservaSeleccionada.servicio,
                  duracion: reservaSeleccionada.duracion || 60,
                  precio: reservaSeleccionada.precio || 0
                }}
                empresa={{
                  id: reservaSeleccionada.empresaId,
                  ...reservaSeleccionada.empresaData
                }}
                onClose={cerrarModalModificar}
                modoModificacion={true}
                reservaAModificar={{
                  id: reservaSeleccionada.id,
                  fechaOriginal: reservaSeleccionada.fechaReserva,
                  personalOriginal: reservaSeleccionada.profesionalId,
                  horaOriginal: reservaSeleccionada.hora
                }}
              />
            </div>
          </div>
        )}
        {modalCancelar && reservaSeleccionada && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl border border-white/50">
              <div className="text-center mb-6">
                <div className="text-4xl mb-3">❌</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Cancelar Reserva</h3>
                <div className="bg-red-50 p-4 rounded-xl border border-red-200 mb-4">
                  <p className="text-sm text-red-600 font-medium">
                    Empresa: <span className="font-bold">{reservaSeleccionada.empresaData?.nombreEmpresa}</span>
                  </p>
                  <p className="text-sm text-red-600 font-medium">
                    Fecha: <span className="font-bold">{formatearFecha(reservaSeleccionada.fechaReserva)}</span>
                  </p>
                  <p className="text-sm text-red-600 font-medium">
                    Servicio: <span className="font-bold">{reservaSeleccionada.servicio}</span>
                  </p>
                </div>
                <textarea
                  value={mensajeCancelacion}
                  onChange={e => setMensajeCancelacion(e.target.value)}
                  placeholder="Motivo de la cancelación..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-red-200 focus:border-red-400 transition-all duration-300 resize-none mb-2"
                  rows={4}
                  maxLength={500}
                />
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setModalCancelar(false)}
                    className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all duration-300"
                    disabled={loadingAccion}
                  >
                    Volver
                  </button>
                  <button
                    onClick={cancelarReservaConMensaje}
                    disabled={!mensajeCancelacion.trim() || loadingAccion}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-all duration-300"
                  >
                    {loadingAccion ? (
                      <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v8l4 4m4-12h-8l-4 4m16 0v8l-4 4" />
                      </svg>
                    ) : (
                      "Cancelar Reserva"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {vistaActual === "empresas" && (
          <div>
            <div className="text-center py-10">
              <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                Empresas
              </h2>
              <p className="text-gray-600 text-lg">Explora y agenda con las empresas disponibles</p>
            </div>
            <div className="space-y-8">
              {loadingEmpresas ? (
                <div className="text-center py-16">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600 mb-4"></div>
                  <p className="text-gray-500 text-lg">Cargando empresas...</p>
                </div>
              ) : empresas.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">🏢</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No hay empresas disponibles</h3>
                  <p className="text-gray-500 text-lg mb-6">Vuelve más tarde o contacta soporte</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                  {empresas.map((empresa) => {
                    return (
                      <div key={empresa.id} className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50 flex flex-col items-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-3xl mb-4">
                          {empresa.nombreEmpresa?.charAt(0) || "E"}
                        </div>
                        <h4 className="font-bold text-xl text-gray-800 mb-2">{empresa.nombreEmpresa || "Empresa"}</h4>
                        <p className="text-gray-600 text-sm mb-4">{empresa.descripcion || "Sin descripción"}</p>
                        <button
                          onClick={() => navigate(`/empresa/${empresa.id}`)}
                          className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-all duration-300 text-sm font-medium"
                        >
                          Ver Empresa
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomeUsuario;
