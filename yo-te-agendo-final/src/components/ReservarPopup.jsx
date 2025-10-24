import React, { useEffect, useState } from "react";
// importación duplicada eliminada
// ...existing code...
// importación duplicada eliminada
import { query, collection, where, getDocs } from "firebase/firestore";
import { doc, updateDoc, addDoc } from "firebase/firestore";
import { db, auth } from "../firebase/firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { format, parseISO, addDays, getDay, setMinutes, setHours, addMinutes, isBefore, isEqual, startOfWeek, addWeeks, subWeeks, isAfter } from "date-fns";
import { es } from "date-fns/locale";

function ReservarPopup({ servicio, empresa, onClose, modoModificacion = false, reservaAModificar = null }) {
  
  const [user, authLoading, authError] = useAuthState(auth);
  const [form, setForm] = useState({ nombre: "", rut: "", telefono: "", correo: "" });
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");
  const [semanaActual, setSemanaActual] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [horariosDisponibles, setHorariosDisponibles] = useState([]);
  const [profesionalSeleccionado, setProfesionalSeleccionado] = useState("");
  const [horaSeleccionada, setHoraSeleccionada] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [personal, setPersonal] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reservaRealizada, setReservaRealizada] = useState(0); // Counter para forzar recarga

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

  // Días de la semana
  const diasSemana = [
    { nombre: 'Lun', dia: 'Lunes' },
    { nombre: 'Mar', dia: 'Martes' },
    { nombre: 'Mié', dia: 'Miércoles' },
    { nombre: 'Jue', dia: 'Jueves' },
    { nombre: 'Vie', dia: 'Viernes' },
    { nombre: 'Sáb', dia: 'Sábado' },
    { nombre: 'Dom', dia: 'Domingo' }
  ];

  // Cargar personal de la empresa desde Firebase
  useEffect(() => {
    const cargarPersonal = async () => {
      if (!empresa?.id) return;
      
      setLoading(true);
      try {
        // Primero intentamos sin filtro de activo para ver si hay datos
        const personalQuery = query(
          collection(db, "personal"),
          where("empresaId", "==", empresa.id)
        );
        
        const personalSnap = await getDocs(personalQuery);
        const personalData = personalSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        const personalActivo = personalData.filter(p => p.activo !== false);
        setPersonal(personalActivo);
      } catch (error) {
  // ...existing code...
        setPersonal([]);
      } finally {
        setLoading(false);
      }
    };

    cargarPersonal();
  }, [empresa?.id]);

  // Función para verificar si el personal puede trabajar en el horario de la empresa
  const verificarDisponibilidadPersonal = (personalHorario, empresaHorario, dia) => {
    
    if (!personalHorario || !Array.isArray(personalHorario)) {
      return empresaHorario?.some(h => h.dia === dia && h.rangos?.length > 0) || false;
    }
    if (!empresaHorario || !Array.isArray(empresaHorario)) return false;
    const normalizarDia = d => (d || "").toLowerCase().trim();
    const horarioPersonalDia = personalHorario.find(h => normalizarDia(h.dia) === normalizarDia(dia));
    const horarioEmpresaDia = empresaHorario.find(h => normalizarDia(h.dia) === normalizarDia(dia));
    if (!horarioEmpresaDia?.rangos?.length) return false;
    if (!horarioPersonalDia?.rangos?.length) return true;
    return horarioPersonalDia.rangos.some(rangoPersonal =>
      horarioEmpresaDia.rangos.some(rangoEmpresa =>
        (rangoPersonal.inicio || rangoPersonal.horaInicio) < (rangoEmpresa.fin || rangoEmpresa.horaFin) &&
        (rangoPersonal.fin || rangoPersonal.horaFin) > (rangoEmpresa.inicio || rangoEmpresa.horaInicio)
      )
    );
  };

  // Función simplificada - ahora la lógica está en el render
  const obtenerPersonalDisponible = (dia) => {
    return personal.filter(p => {
      const tieneHorario = verificarDisponibilidadPersonal(p.horarios, empresa.horarios, dia);
      const puedeHacerServicio = !p.servicios || 
                                p.servicios.length === 0 || 
                                p.servicios.includes(servicio.id) || 
                                p.servicios.includes(servicio.nombre);
      return tieneHorario && puedeHacerServicio;
    });
  };

  // Generar días de la semana actual
  const generarDiasSemana = () => {
    return diasSemana.map((dia, index) => {
      const fecha = addDays(semanaActual, index);
      const horarioDia = empresa.horarios?.find(h => h.dia === dia.dia);
      return {
        ...dia,
        fecha: format(fecha, 'yyyy-MM-dd'),
        fechaObj: fecha,
        disponible: !!(horarioDia?.rangos?.length) && fecha >= new Date().setHours(0, 0, 0, 0),
        horario: horarioDia
      };
    });
  };

  const [diasCalendario, setDiasCalendario] = useState(generarDiasSemana());

  useEffect(() => {
    setDiasCalendario(generarDiasSemana());
  }, [semanaActual, empresa.horarios]);

  // Generar horarios cuando se selecciona fecha y profesional
  useEffect(() => {
    const generarHorarios = async () => {
      
      if (!fechaSeleccionada || !profesionalSeleccionado || !empresa || !servicio) {
        setHorariosDisponibles([]);
        return;
      }

      const diaSeleccionado = diasCalendario.find(d => d.fecha === fechaSeleccionada);
      if (!diaSeleccionado || !diaSeleccionado.horario) {
        setHorariosDisponibles([]);
        return;
      }

      // Buscar el personal seleccionado o usar horarios de empresa
      let horariosParaUsar = [];
      if (profesionalSeleccionado === 'empresa-general') {
        horariosParaUsar = diaSeleccionado.horario.rangos || [];
      } else {
        const personalSeleccionado = personal.find(p => p.id === profesionalSeleccionado);
        if (!personalSeleccionado) {
          setHorariosDisponibles([]);
          return;
        }
        const normalizarDia = d => (d || "").toLowerCase().trim();
        const horarioPersonalDia = personalSeleccionado.horarios?.find(h => normalizarDia(h.dia) === normalizarDia(diaSeleccionado.dia));
        horariosParaUsar = horarioPersonalDia?.rangos?.length
          ? horarioPersonalDia.rangos
          : horarioPersonalDia?.horaInicio && horarioPersonalDia?.horaFin
            ? [{ inicio: horarioPersonalDia.horaInicio, fin: horarioPersonalDia.horaFin }]
            : diaSeleccionado.horario.rangos || [];
      }
      if (!horariosParaUsar.length) {
        setHorariosDisponibles([]);
        return;
      }

      const duracionServicio = parseInt(servicio.tiempo, 10); // Duración en minutos

      // Obtener reservas existentes para verificar disponibilidad
      // Calcular el inicio y fin del día seleccionado
      const inicioDia = new Date(fechaSeleccionada);
      inicioDia.setHours(0, 0, 0, 0);
      const finDia = new Date(fechaSeleccionada);
      finDia.setHours(23, 59, 59, 999);


      // Verificar que el usuario esté autenticado
      if (!user) {
        setHorariosDisponibles([]);
        return;
      }

      let reservasQuery;
      if (profesionalSeleccionado === 'empresa-general') {
        // Para reservas generales, revisar todas las reservas del día
        reservasQuery = query(
          collection(db, "reservas"),
          where("empresaId", "==", empresa.id)
        );
      } else {
        // Para personal específico, solo sus reservas
        reservasQuery = query(
          collection(db, "reservas"),
          where("empresaId", "==", empresa.id),
          where("profesionalId", "==", profesionalSeleccionado)
        );
      }
      
      let reservas = [];
      try {
        const reservasSnap = await getDocs(reservasQuery);
        const todasLasReservas = reservasSnap.docs.map(d => d.data());
        
        // Filtrar reservas del día seleccionado
        reservas = todasLasReservas.filter(reserva => {
          
          // Primero intentar con fechaReserva (nuevo formato)
          if (reserva.fechaReserva) {
            let fechaReserva;
            if (reserva.fechaReserva.toDate) {
              fechaReserva = reserva.fechaReserva.toDate();
            } else {
              fechaReserva = new Date(reserva.fechaReserva);
            }
            
            const enRango = fechaReserva >= inicioDia && fechaReserva <= finDia;
            return enRango;
          }
          // Fallback: usar el campo fecha (formato string antiguo)
          else if (reserva.fecha) {
            const coincide = reserva.fecha === fechaSeleccionada;
            return coincide;
          }
          
          return false;
        });
        
      } catch (error) {
        reservas = []; // Continuar sin reservas (horarios aparecerán disponibles)
      }

      // Crear un Set con todos los minutos ocupados
      const minutosOcupados = new Set();
      
      reservas.forEach((reserva, index) => {
        
        // Obtener la hora de la reserva (puede estar en 'hora' o extraída de 'fechaReserva')
        let horaReserva = reserva.hora;
        if (!horaReserva && reserva.fechaReserva) {
          const fechaReserva = reserva.fechaReserva.toDate ? reserva.fechaReserva.toDate() : new Date(reserva.fechaReserva);
          horaReserva = `${fechaReserva.getHours().toString().padStart(2, '0')}:${fechaReserva.getMinutes().toString().padStart(2, '0')}`;
        }
        if (!horaReserva) return;
        const [h, m] = horaReserva.split(":").map(Number);
        let inicioReserva = setMinutes(setHours(parseISO(fechaSeleccionada), h), m);
        const duracionReserva = parseInt(reserva.duracionServicio, 10);
        if (reserva.profesionalId === profesionalSeleccionado || profesionalSeleccionado === 'empresa-general') {
          for (let i = 0; i < duracionReserva; i++) {
            minutosOcupados.add(format(addMinutes(inicioReserva, i), "HH:mm"));
          }
        }
      });


      const horasDisponibles = [];
      
      // Generar horarios por horas (no por bloques)
      const hoy = new Date();
      const esHoy = parseISO(fechaSeleccionada).toDateString() === hoy.toDateString();
      horariosParaUsar.forEach(rango => {
        const inicioHora = rango.inicio || rango.horaInicio;
        const finHora = rango.fin || rango.horaFin;

        // Convertir horas de inicio y fin
        const [inicioH, inicioM] = inicioHora.split(":").map(Number);
        const [finH, finM] = finHora.split(":").map(Number);

        let horaActual = setMinutes(setHours(parseISO(fechaSeleccionada), inicioH), inicioM);
        const horaFin = setMinutes(setHours(parseISO(fechaSeleccionada), finH), finM);

        // Generar horarios de hora en hora
        while (isBefore(horaActual, horaFin)) {
          const horaString = format(horaActual, "HH:mm");

          // Verificar si hay tiempo suficiente para completar el servicio
          const finServicio = addMinutes(horaActual, duracionServicio);

          // Si la fecha es hoy y la hora es menor o igual a la hora actual, marcar como ocupado
          let yaPaso = false;
          if (esHoy) {
            const ahora = new Date();
            if (isBefore(horaActual, ahora)) {
              yaPaso = true;
            }
          }

          // Debe terminar antes o al mismo tiempo que el horario de trabajo
          if (!isAfter(finServicio, horaFin)) {
            // Verificar si todos los minutos necesarios están libres
            let estaLibre = true;
            for (let i = 0; i < duracionServicio; i++) {
              const minutoAVerificar = format(addMinutes(horaActual, i), "HH:mm");
              if (minutosOcupados.has(minutoAVerificar)) {
                estaLibre = false;
                break;
              }
            }
            horasDisponibles.push({
              hora: horaString,
              horaFin: format(finServicio, "HH:mm"),
              ocupado: !estaLibre || yaPaso
            });
          }
          // Avanzar 1 hora
          horaActual = addMinutes(horaActual, 60);
        }
      });

      setHorariosDisponibles(horasDisponibles);
    };

    generarHorarios();
  }, [fechaSeleccionada, profesionalSeleccionado, empresa, servicio, diasCalendario, personal, reservaRealizada]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleReservar = async () => {
    // Validaciones diferentes para creación vs modificación
    if (!user?.uid) {
      setError("Debes iniciar sesión para reservar. Por favor, inicia sesión o regístrate.");
      return;
    }
    if (modoModificacion) {
      if (!horaSeleccionada || !profesionalSeleccionado) {
        setError("Debes seleccionar profesional y horario para modificar la reserva.");
        return;
      }
    } else {
      if (!form.nombre || !form.rut || !form.telefono || !form.correo || !horaSeleccionada || !profesionalSeleccionado) {
        setError("Todos los campos son obligatorios, incluyendo la selección de profesional.");
        return;
      }
    }

    setLoading(true);
    try {
      const [hora, minuto] = horaSeleccionada.split(':');
      const fechaCompleta = new Date(fechaSeleccionada);
      fechaCompleta.setHours(parseInt(hora), parseInt(minuto), 0, 0);

      if (modoModificacion && reservaAModificar) {
        await updateDoc(doc(db, "reservas", reservaAModificar.id), {
          profesionalId: profesionalSeleccionado,
          personal: profesionalSeleccionado === 'empresa-general' 
            ? empresa.nombreEmpresa || 'Empresa'
            : personal.find(p => p.id === profesionalSeleccionado)?.nombre || 'Profesional',
          fecha: fechaSeleccionada,
          hora: horaSeleccionada,
          fechaReserva: fechaCompleta,
          fechaModificacion: new Date(),
          modificadoPor: "usuario"
        });

        await addDoc(collection(db, "notificaciones"), {
          empresaId: empresa.id,
          usuarioId: user?.uid,
          tipo: "modificacion_reserva",
          titulo: "Reserva Modificada",
          mensaje: `El usuario ha modificado su reserva. Nueva fecha: ${fechaCompleta.toLocaleDateString("es-ES", { 
            weekday: "long", 
            year: "numeric", 
            month: "long", 
            day: "numeric", 
            hour: "2-digit", 
            minute: "2-digit" 
          })}`,
          reservaId: reservaAModificar.id,
          fechaCreacion: new Date(),
          leida: false
        });

        setMensaje(`¡Reserva modificada exitosamente! Nueva fecha: ${fechaSeleccionada} a las ${horaSeleccionada}. La empresa ha sido notificada del cambio.`);
      } else {
        const reservaRef = await addDoc(collection(db, "reservas"), {
          ...form,
          clienteNombre: form.nombre,
          usuarioId: user?.uid || null,
          clienteId: user?.uid || null,
          servicio: servicio.nombre,
          duracionServicio: servicio.tiempo,
          empresaId: empresa.id,
          profesionalId: profesionalSeleccionado,
          personal: profesionalSeleccionado === 'empresa-general' 
            ? empresa.nombreEmpresa || 'Empresa'
            : personal.find(p => p.id === profesionalSeleccionado)?.nombre || 'Profesional',
          fecha: fechaSeleccionada,
          hora: horaSeleccionada,
          fechaReserva: fechaCompleta,
          estado: 'pendiente',
          timestamp: new Date(),
        });

        let profesionalNombre;
        if (profesionalSeleccionado === 'empresa-general') {
          profesionalNombre = empresa.nombreEmpresa || 'la empresa';
        } else {
          profesionalNombre = personal.find(p => p.id === profesionalSeleccionado)?.nombre || 'Profesional';
        }

        setMensaje(`¡Reserva confirmada para el servicio ${servicio.nombre} el día ${fechaSeleccionada} a las ${horaSeleccionada} con ${profesionalNombre}. Si tienes dudas, contáctanos al +56 9 1234 5678!`);

        try {
          await addDoc(collection(db, "notificaciones"), {
            empresaId: empresa.id,
            usuarioId: user?.uid,
            tipo: "nueva_reserva",
            titulo: "Nueva Reserva",
            mensaje: `El usuario ha realizado una reserva para el servicio ${servicio.nombre} el día ${fechaSeleccionada} a las ${horaSeleccionada} con ${profesionalNombre}.`,
            reservaId: reservaRef.id,
            fechaCreacion: new Date(),
            leida: false
          });
        } catch (error) {
          setError("La reserva fue creada, pero no se pudo notificar a la empresa. Intenta avisar manualmente.");
        }

        setHoraSeleccionada("");
        setForm({ nombre: "", rut: "", telefono: "", correo: "" });
      }

      setTimeout(() => {
        setReservaRealizada(prev => prev + 1);
        if (modoModificacion) {
          setTimeout(() => {
            onClose();
          }, 2000);
        }
      }, 500);
    } catch (error) {
      setError(modoModificacion ? "Error al modificar la reserva. Intenta nuevamente." : "Error al guardar la reserva. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  // Navegación de semanas
  const irSemanaAnterior = () => {
    setSemanaActual(subWeeks(semanaActual, 1));
  };

  const irSemanaSiguiente = () => {
    setSemanaActual(addWeeks(semanaActual, 1));
  };

  // Seleccionar día
  const seleccionarDia = (dia) => {
    if (dia.disponible) {
      setFechaSeleccionada(dia.fecha);
      setProfesionalSeleccionado("");
      setHoraSeleccionada("");
      setHorariosDisponibles([]);
    }
  };

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
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Verificando sesión...</p>
          </div>
        )}

        {/* Contenido principal solo si está logueado */}
        {user && (
        <>

        {/* Navegación de semanas */}
        <div className="bg-gray-50 rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <button
              onClick={irSemanaAnterior}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h3 className="font-semibold text-gray-900">
              {format(semanaActual, 'MMMM yyyy', { locale: es })}
            </h3>
            <button
              onClick={irSemanaSiguiente}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Calendario semanal */}
          <div className="grid grid-cols-7 gap-2">
            {diasCalendario.map((dia, index) => (
              <div key={index} className="text-center">
                <p className="text-xs font-medium text-gray-500 mb-1">{dia.nombre}</p>
                <button
                  onClick={() => seleccionarDia(dia)}
                  disabled={!dia.disponible}
                  className={`w-full h-10 rounded-lg text-sm font-medium transition-all duration-200 ${
                    !dia.disponible
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : dia.fecha === fechaSeleccionada
                      ? 'bg-green-500 text-white shadow-lg shadow-green-500/30 scale-105'
                      : 'bg-green-100 text-green-700 hover:bg-green-200 hover:scale-105'
                  }`}
                >
                  {format(dia.fechaObj, 'd')}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Selección de profesional */}
        {fechaSeleccionada && (
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
            {loading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-sm text-gray-500 mt-2">Cargando personal...</p>
              </div>
            ) : (
              <div className="grid gap-2">
                {(() => {
                  const diaSeleccionado = diasCalendario.find(d => d.fecha === fechaSeleccionada);
                  if (personal.length === 0) {
                    return (
                      <div className="text-center py-6 bg-yellow-50 rounded-lg border border-yellow-200">
                        <svg className="w-12 h-12 mx-auto mb-3 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <p className="text-yellow-800 font-medium mb-2">No hay personal registrado</p>
                        <p className="text-yellow-600 text-sm mb-4">Esta empresa aún no ha agregado personal a su equipo</p>
                        <button
                          onClick={() => setProfesionalSeleccionado('empresa-general')}
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
                    );
                  }

                  // Mostrar todo el personal primero, después evaluar disponibilidad
                  const personalParaMostrar = personal.filter(p => {
                    const puedeHacerServicio = !p.servicios || 
                      p.servicios.length === 0 || 
                      p.servicios.includes(servicio.id) || 
                      p.servicios.includes(servicio.nombre);
                    return puedeHacerServicio;
                  });

                  if (personalParaMostrar.length === 0) {
                    return (
                      <div className="text-center py-6 bg-orange-50 rounded-lg border border-orange-200">
                        <svg className="w-12 h-12 mx-auto mb-3 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <p className="text-orange-800 font-medium mb-2">Personal no disponible para este servicio</p>
                        <p className="text-orange-600 text-sm mb-4">Ningún empleado está asignado a realizar "{servicio.nombre}"</p>
                        <button
                          onClick={() => setProfesionalSeleccionado('empresa-general')}
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
                    );
                  }
                  
                  return personalParaMostrar.map((prof) => {
                    const tieneDisponibilidad = verificarDisponibilidadPersonal(prof.horarios, empresa.horarios, diaSeleccionado?.dia);
                    return (
                      <button
                        key={prof.id}
                        onClick={() => setProfesionalSeleccionado(prof.id)}
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
                            <details className="mt-1">
                              {/* ...existing code... */}
                              <div className="text-xs text-gray-600 mt-1 bg-gray-50 p-2 rounded">
                                <p><strong>Servicios:</strong> {JSON.stringify(prof.servicios)}</p>
                                <p><strong>Horarios:</strong> {JSON.stringify(prof.horarios)}</p>
                                <p><strong>Día seleccionado:</strong> {diaSeleccionado?.dia}</p>
                              </div>
                            </details>
                          </div>
                        )}
                      </button>
                    );
                  });
                })()}
              </div>
            )}
          </div>
        )}

        {/* Horarios disponibles */}
        {profesionalSeleccionado && horariosDisponibles.length > 0 && (
          <div className="bg-purple-50 rounded-xl p-4 space-y-3">
            <h4 className="font-semibold text-gray-900 flex items-center">
              <svg className="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Horarios disponibles ({horariosDisponibles.length})
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {horariosDisponibles.map((horario) => {
                const estaOcupado = horario.ocupado;
                return (
                  <button
                    key={horario.hora}
                    onClick={() => !estaOcupado && setHoraSeleccionada(horario.hora)}
                    disabled={estaOcupado}
                    className={`p-3 rounded-lg text-sm transition-all duration-200 ${
                      estaOcupado
                        ? 'bg-red-100 border border-red-200 text-red-500 cursor-not-allowed opacity-70'
                        : horaSeleccionada === horario.hora
                        ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                        : 'bg-white border border-purple-200 text-purple-700 hover:bg-purple-100'
                    }`}
                  >
                    <div className="text-center">
                      <div className={`font-semibold ${estaOcupado ? 'line-through' : ''}`}>
                        {horario.hora}
                      </div>
                      <div className="text-xs opacity-75">
                        hasta {horario.horaFin}
                      </div>
                      <div className="text-xs opacity-60 mt-1">
                        {estaOcupado ? 'No disponible' : `(${servicio.tiempo} min)`}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {profesionalSeleccionado && fechaSeleccionada && 
         (horariosDisponibles.length === 0 || horariosDisponibles.every(h => h.ocupado)) && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <p className="text-yellow-800 text-center">
              {horariosDisponibles.length === 0 
                ? "No hay horarios disponibles para este día con el profesional seleccionado."
                : "Todos los horarios están ocupados para este día. Prueba con otro día o profesional."
              }
            </p>
          </div>
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
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Datos del cliente</h4>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ingresa tu nombre"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">RUT</label>
                <input
                  type="text"
                  name="rut"
                  value={form.rut}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="12.345.678-9"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input
                  type="tel"
                  name="telefono"
                  value={form.telefono}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+56 9 1234 5678"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
                <input
                  type="email"
                  name="correo"
                  value={form.correo}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="tu@email.com"
                />
              </div>
            </div>
          </div>
        )}

        {/* Resumen de modificación */}
        {modoModificacion && horaSeleccionada && reservaAModificar && (
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
              <span className="text-xl mr-2">🔄</span>
              Modificando Reserva
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Fecha Anterior:</p>
                <p className="font-medium text-red-600">
                  {(() => {
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
                  })()}
                </p>
                <p className="font-medium text-red-600">{reservaAModificar.horaOriginal}</p>
              </div>
              <div>
                <p className="text-gray-600">Nueva Fecha:</p>
                <p className="font-medium text-green-600">
                  {new Date(fechaSeleccionada).toLocaleDateString("es-ES", { 
                    weekday: "long", 
                    year: "numeric", 
                    month: "long", 
                    day: "numeric" 
                  })}
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
        )}



        {/* Mensajes de estado */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {mensaje && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-3">
            <p className="text-green-800 text-sm">{mensaje}</p>
          </div>
        )}

        {/* Botón de reservar */}
        {horaSeleccionada && (
          <button
            onClick={handleReservar}
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
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
