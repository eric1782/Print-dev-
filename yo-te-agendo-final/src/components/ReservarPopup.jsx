import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/firebaseConfig";
import { useReservas, useForm, usePersonal, useHorarios } from "../hooks";
import { crearFechaCompleta } from "../utils/dateUtils";
import { MENSAJES } from "../utils/constants";
import { obtenerDiaSemana } from "../utils/dayUtils";
import { LoadingSpinner, ErrorMessage, SuccessMessage } from "./common";

// Componentes
import CalendarioSemanal from "./ReservarPopup/CalendarioSemanal";
import SeleccionProfesional from "./ReservarPopup/SeleccionProfesional";
import SeleccionHorario from "./ReservarPopup/SeleccionHorario";
import FormularioCliente from "./ReservarPopup/FormularioCliente";
import ResumenModificacion from "./ReservarPopup/ResumenModificacion";

function ReservarPopup({ servicio, empresa, onClose, modoModificacion = false, reservaAModificar = null }) {
  const [user, authLoading, authError] = useAuthState(auth);
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");
  const [profesionalSeleccionado, setProfesionalSeleccionado] = useState("");
  const [horaSeleccionada, setHoraSeleccionada] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [isReservando, setIsReservando] = useState(false);

  // Hook para manejar el formulario
  const form = useForm(
    { nombre: "", rut: "", telefono: "", correo: "" }, 
    'reserva',
    user?.email
  );

  // Limpiar errores cuando el usuario esté autenticado
  useEffect(() => {
    if (user?.email && form.errors.correo) {
      form.setError('correo', '');
      // Forzar re-validación
      form.validate();
    }
  }, [user?.email, form.errors.correo]);

  // Hooks personalizados
  const { crearReserva, modificarReserva } = useReservas();
  const { personal, loading: loadingPersonal, verificarDisponibilidadPersonal } = usePersonal(empresa?.id);
  
  const {
    horariosDisponibles,
    semanaActual,
    diasCalendario,
    loading: loadingHorarios,
    error: errorHorarios,
    generarHorariosDisponibles,
    actualizarDiasCalendario,
    irSemanaAnterior,
    irSemanaSiguiente,
    irSemanaActual,
    seleccionarDia,
    // Datos de la empresa
    empresaData,
    horariosLocal,
    servicios,
    estaAbiertoElDia,
    obtenerHorariosDelDia,
    estaDentroDelHorarioLocal
  } = useHorarios(empresa?.id, profesionalSeleccionado);

  // Inicializar datos para modo modificación
  useEffect(() => {
    if (modoModificacion && reservaAModificar) {
      const fechaOriginal = reservaAModificar.fechaOriginal?.toDate
        ? reservaAModificar.fechaOriginal.toDate()
        : new Date(reservaAModificar.fechaOriginal);
      setFechaSeleccionada(fechaOriginal.toISOString().split('T')[0]);
      setProfesionalSeleccionado(reservaAModificar.personalOriginal || "");
      setHoraSeleccionada(reservaAModificar.horaOriginal || "");
    }
  }, [modoModificacion, reservaAModificar]);

  // Ir a la semana actual cuando se abre el popup
  useEffect(() => {
    if (servicio && empresa) {
      irSemanaActual();
    }
  }, [servicio, empresa]); // Removido irSemanaActual de las dependencias

  // Actualizar días del calendario cuando cambian los horarios de la empresa
  useEffect(() => {
    if (empresa?.horarios) {
      actualizarDiasCalendario(empresa.horarios);
    }
  }, [empresa?.horarios]); // Removido actualizarDiasCalendario de las dependencias

  // Generar horarios cuando se selecciona fecha y profesional
  useEffect(() => {
    if (fechaSeleccionada && profesionalSeleccionado && empresa && servicio) {
      generarHorariosDisponibles(fechaSeleccionada, profesionalSeleccionado, empresa, servicio, personal);
    }
  }, [fechaSeleccionada, profesionalSeleccionado, empresa, servicio, personal]); // Removido generarHorariosDisponibles de las dependencias

  // Handlers
  const handleChange = (e) => {
    form.handleChange(e);
    setError("");
  };

  const handleSeleccionarDia = (dia) => {
    const fecha = seleccionarDia(dia);
    if (fecha) {
      setFechaSeleccionada(fecha);
      setProfesionalSeleccionado("");
      setHoraSeleccionada("");
    }
  };

  const handleSeleccionarProfesional = (profesionalId) => {
    setProfesionalSeleccionado(profesionalId);
    setHoraSeleccionada("");
  };

  const handleSeleccionarHora = (hora) => {
    setHoraSeleccionada(hora);
  };

  const handleReservar = async () => {
    // Validaciones
    if (!user?.uid) {
      setError(MENSAJES.ERROR.USUARIO_NO_AUTENTICADO);
      return;
    }

    setIsReservando(true);
    setError("");

    // Validaciones antes de proceder
    if (modoModificacion) {
      if (!horaSeleccionada || !profesionalSeleccionado) {
        setError("Debes seleccionar profesional y horario para modificar la reserva.");
        setIsReservando(false);
        return;
      }
    } else {
      
      if (!form.validate()) {
        setError("Por favor corrige los errores en el formulario.");
        setIsReservando(false);
        return;
      }
      if (!horaSeleccionada || !profesionalSeleccionado) {
        setError("Debes seleccionar profesional y horario.");
        setIsReservando(false);
        return;
      }
    }

    try {
      const fechaCompleta = crearFechaCompleta(fechaSeleccionada, horaSeleccionada);
      const nombreProfesional = profesionalSeleccionado === 'empresa-general' 
        ? empresa.nombreEmpresa || 'Empresa'
        : personal.find(p => p.id === profesionalSeleccionado)?.nombre || 'Profesional';

      if (modoModificacion && reservaAModificar) {
        const resultado = await modificarReserva(reservaAModificar.id, {
          profesionalId: profesionalSeleccionado,
          personal: nombreProfesional,
          fecha: fechaSeleccionada,
          hora: horaSeleccionada,
          fechaReserva: fechaCompleta,
          empresaId: empresa.id
        });

        if (resultado.success) {
        setMensaje(`¡Reserva modificada exitosamente! Nueva fecha: ${fechaSeleccionada} a las ${horaSeleccionada}. La empresa ha sido notificada del cambio.`);
          setTimeout(() => onClose(), 2000);
        } else {
          setError(resultado.error || "Error al modificar la reserva");
        }
      } else {
        const datosReserva = {
          ...form.values,
          clienteNombre: form.values.nombre,
          servicio: servicio.nombre,
          duracionServicio: servicio.tiempo,
          empresaId: empresa.id,
          profesionalId: profesionalSeleccionado,
          personal: nombreProfesional,
          fecha: fechaSeleccionada,
          hora: horaSeleccionada,
          fechaReserva: fechaCompleta
        };

        const resultado = await crearReserva(datosReserva);
        
        if (resultado.success) {
          setMensaje(`¡Reserva confirmada para el servicio ${servicio.nombre} el día ${fechaSeleccionada} a las ${horaSeleccionada} con ${nombreProfesional}. Si tienes dudas, contáctanos al +56 9 1234 5678!`);
          setHoraSeleccionada("");
          form.reset();
          
          // Actualizar horarios disponibles inmediatamente después de crear la reserva
          setTimeout(async () => {
            if (fechaSeleccionada && profesionalSeleccionado && empresa && servicio) {
              await generarHorariosDisponibles(fechaSeleccionada, profesionalSeleccionado, empresa, servicio, personal, true);
            }
          }, 1000);
        } else {
          setError(resultado.error || "Error al crear la reserva");
        }
      }
    } catch (err) {
      setError(modoModificacion ? "Error al modificar la reserva. Intenta nuevamente." : "Error al guardar la reserva. Intenta nuevamente.");
    } finally {
      setIsReservando(false);
    }
  };

  // Obtener día seleccionado para el profesional
  const diaSeleccionado = diasCalendario.find(d => d.fecha === fechaSeleccionada);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl p-6 space-y-5 relative border border-gray-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {modoModificacion ? "Modificar Reserva" : "Reservar Servicio"}
            </h2>
            <p className="text-sm text-gray-500">{servicio.nombre}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Mensaje para usuarios no logueados */}
        {!user && !authLoading && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <h3 className="text-blue-800 font-semibold mb-2">🔐 Inicia sesión para reservar</h3>
            <p className="text-blue-700 text-sm mb-3">
              Para hacer una reserva necesitas tener una cuenta. Esto nos permite gestionar mejor tus citas.
            </p>
            <button
              onClick={() => window.location.href = '/login'}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium"
            >
              Ir a iniciar sesión
            </button>
          </div>
        )}

        {authLoading && (
          <LoadingSpinner 
            size="lg" 
            text="Verificando sesión..." 
            className="py-4" 
          />
        )}

        {/* Contenido principal solo si está logueado */}
        {user && (
        <>
          {/* Mostrar error si hay problemas con los datos de la empresa */}
          {errorHorarios && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Error cargando datos de la empresa
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{errorHorarios}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Calendario semanal */}
            <CalendarioSemanal
              diasCalendario={diasCalendario}
              fechaSeleccionada={fechaSeleccionada}
              onSeleccionarDia={handleSeleccionarDia}
              semanaActual={semanaActual}
              onSemanaAnterior={irSemanaAnterior}
              onSemanaSiguiente={irSemanaSiguiente}
              onIrHoy={irSemanaActual}
            />

        {/* Selección de profesional */}
        {fechaSeleccionada && (
              <SeleccionProfesional
                personal={personal}
                profesionalSeleccionado={profesionalSeleccionado}
                onSeleccionarProfesional={handleSeleccionarProfesional}
                empresa={empresa}
                servicio={servicio}
                diaSeleccionado={diaSeleccionado}
                loading={loadingPersonal}
                verificarDisponibilidadPersonal={verificarDisponibilidadPersonal}
              />
        )}

        {/* Horarios disponibles */}
            {profesionalSeleccionado && (
              <>
                {/* Validar si el local está abierto en el día seleccionado */}
                {fechaSeleccionada && (() => {
                  // Obtener día de la semana usando la función centralizada
                  const diaSemana = obtenerDiaSemana(fechaSeleccionada);
                  const estaAbierto = estaAbiertoElDia(diaSemana);
                  
                  console.log(`[DEBUG] Fecha seleccionada: ${fechaSeleccionada}`);
                  console.log(`[DEBUG] Día de la semana: ${diaSemana}`);
                  console.log(`[DEBUG] Local abierto: ${estaAbierto}`);
                  
                  if (!estaAbierto) {
                    return (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-yellow-800">
                              Local cerrado
                            </h3>
                            <div className="mt-2 text-sm text-yellow-700">
                              <p>El local no está abierto los {diaSemana}. Selecciona otro día.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  
                  return (
            <SeleccionHorario
              horariosDisponibles={horariosDisponibles}
              horaSeleccionada={horaSeleccionada}
              onSeleccionarHora={handleSeleccionarHora}
              servicio={servicio}
              onActualizarHorarios={() => {
                if (fechaSeleccionada && profesionalSeleccionado && empresa && servicio) {
                  generarHorariosDisponibles(fechaSeleccionada, profesionalSeleccionado, empresa, servicio, personal, true);
                }
              }}
            />
                  );
                })()}
              </>
        )}

        {/* Información del servicio */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center text-gray-600">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {servicio.tiempo} minutos
            </div>
            <span className="font-semibold text-gray-900">${servicio.precio}</span>
          </div>
        </div>

            {/* Formulario de datos del cliente (solo en modo creación) */}
            {horaSeleccionada && !modoModificacion && (
              <FormularioCliente
                form={form.values}
                onChange={handleChange}
                validaciones={form.errors}
                userEmail={user?.email}
              />
            )}

        {/* Resumen de modificación */}
        {modoModificacion && horaSeleccionada && reservaAModificar && (
              <ResumenModificacion
                reservaAModificar={reservaAModificar}
                fechaSeleccionada={fechaSeleccionada}
                horaSeleccionada={horaSeleccionada}
              />
            )}

            {/* Mensajes de estado */}
            {error && (
              <ErrorMessage 
                message={error} 
                className="mb-4" 
              />
            )}

            {mensaje && (
              <SuccessMessage 
                message={mensaje} 
                className="mb-4" 
              />
            )}

        {/* Botón de reservar */}
        {horaSeleccionada && (
          <button
            onClick={handleReservar}
            disabled={isReservando}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isReservando ? (
              <>
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                {modoModificacion ? "Modificando..." : "Reservando..."}
              </>
            ) : (
              modoModificacion ? "Confirmar Modificación" : "Confirmar Reserva"
            )}
          </button>
        )}

        {!fechaSeleccionada && (
          <div className="text-center py-4">
            <p className="text-gray-500">Selecciona un día disponible para continuar</p>
          </div>
        )}
        </>
        )}
      </div>
    </div>
  );
}

export default ReservarPopup;