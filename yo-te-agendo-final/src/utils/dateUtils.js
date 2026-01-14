import { 
  format, 
  parseISO, 
  addDays, 
  setMinutes, 
  setHours, 
  addMinutes, 
  isBefore, 
  isAfter, 
  startOfWeek, 
  addWeeks, 
  subWeeks 
} from "date-fns";
import { es } from "date-fns/locale";

/**
 * Utilidades para manejo de fechas y horarios
 */

// Formatear fecha a string legible, soporta Firestore Timestamp
export const formatearFecha = (fecha) => {
  if (!fecha) return "";
  if (typeof fecha.toDate === "function") {
    fecha = fecha.toDate();
  }
  const d = fecha instanceof Date ? fecha : new Date(fecha);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString('es-CL', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

// Formatear fecha para input datetime-local
export const formatDateForInput = (date) => {
  if (!date || isNaN(date.getTime())) return "";
  // Ajusta a zona local para evitar desfase
  const tzOffset = date.getTimezoneOffset() * 60000;
  const localISO = new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
  return localISO;
};

// Convertir Firestore Timestamp a Date
export const timestampToDate = (timestamp) => {
  if (!timestamp) return null;
  if (typeof timestamp.toDate === "function") {
    return timestamp.toDate();
  }
  return new Date(timestamp);
};

// Verificar si una fecha es hoy
export const esHoy = (fecha) => {
  const hoy = new Date();
  const fechaComparar = fecha instanceof Date ? fecha : new Date(fecha);
  return fechaComparar.toDateString() === hoy.toDateString();
};

// Verificar si una fecha es en el futuro
export const esFuturo = (fecha) => {
  const ahora = new Date();
  const fechaComparar = fecha instanceof Date ? fecha : new Date(fecha);
  return fechaComparar.getTime() > ahora.getTime();
};

// Calcular horas restantes hasta una fecha
export const calcularHorasRestantes = (fecha) => {
  const ahora = new Date();
  const fechaComparar = fecha instanceof Date ? fecha : new Date(fecha);
  return (fechaComparar.getTime() - ahora.getTime()) / (1000 * 60 * 60);
};

// Generar días de la semana a partir de una fecha de inicio
export const generarDiasSemana = (semanaActual, diasSemana, empresaHorarios) => {
  return diasSemana.map((dia, index) => {
    const fecha = addDays(semanaActual, index);
    const horarioDia = empresaHorarios?.find(h => h.dia === dia.dia);
    return {
      ...dia,
      fecha: format(fecha, 'yyyy-MM-dd'),
      fechaObj: fecha,
      disponible: !!(horarioDia?.rangos?.length) && fecha >= new Date().setHours(0, 0, 0, 0),
      horario: horarioDia
    };
  });
};

// Navegación de semanas
export const irSemanaAnterior = (semanaActual) => {
  return subWeeks(semanaActual, 1);
};

export const irSemanaSiguiente = (semanaActual) => {
  return addWeeks(semanaActual, 1);
};

// Crear fecha completa con hora
export const crearFechaCompleta = (fechaSeleccionada, horaSeleccionada) => {
  const [hora, minuto] = horaSeleccionada.split(':');
  
  // Parsear la fecha correctamente para evitar problemas de zona horaria
  const [año, mes, dia] = fechaSeleccionada.split('-');
  const fechaCompleta = new Date(parseInt(año), parseInt(mes) - 1, parseInt(dia));
  fechaCompleta.setHours(parseInt(hora), parseInt(minuto), 0, 0);
  
  return fechaCompleta;
};

// Función para normalizar hora a formato 24h
const normalizarHora = (hora) => {
  if (!hora) return null;
  
  // Si ya está en formato 24h (HH:MM), devolverlo tal como está
  if (/^\d{1,2}:\d{2}$/.test(hora)) {
    const [h, m] = hora.split(':').map(Number);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  }
  
  // Si está en formato 12h (H:MM AM/PM), convertir a 24h
  const match = hora.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (match) {
    let [, h, m, period] = match;
    h = parseInt(h, 10);
    m = parseInt(m, 10);
    
    if (period.toUpperCase() === 'PM' && h !== 12) {
      h += 12;
    } else if (period.toUpperCase() === 'AM' && h === 12) {
      h = 0;
    }
    
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  }
  
  return null;
};

// Verificar si un horario está ocupado
export const verificarHorarioOcupado = (hora, reservas, duracionServicio, fechaSeleccionada) => {
  const ahora = new Date();
  const [horaH, horaM] = hora.split(":").map(Number);
  const inicioNuevoServicio = setMinutes(setHours(parseISO(fechaSeleccionada), horaH), horaM);
  
  // 1. Verificar si la hora ya pasó (solo para hoy)
  const esHoy = parseISO(fechaSeleccionada).toDateString() === ahora.toDateString();
  if (esHoy && isBefore(inicioNuevoServicio, ahora)) {
    return true; // Ya pasó el tiempo
  }
  
  // 2. Verificar conflictos con reservas existentes
  const finNuevoServicio = addMinutes(inicioNuevoServicio, duracionServicio);
  
  for (const reserva of reservas) {
    // Obtener hora de la reserva y normalizarla a formato 24h
    let horaReserva = reserva.hora;
    if (!horaReserva && reserva.fechaReserva) {
      const fechaReserva = reserva.fechaReserva.toDate ? reserva.fechaReserva.toDate() : new Date(reserva.fechaReserva);
      horaReserva = `${fechaReserva.getHours().toString().padStart(2, '0')}:${fechaReserva.getMinutes().toString().padStart(2, '0')}`;
    }
    
    // Normalizar la hora a formato 24h
    const horaNormalizada = normalizarHora(horaReserva);
    if (!horaNormalizada) continue;
    
    // Calcular inicio y fin de la reserva existente usando la hora normalizada
    const [h, m] = horaNormalizada.split(":").map(Number);
    const inicioReserva = setMinutes(setHours(parseISO(fechaSeleccionada), h), m);
    const duracionReserva = parseInt(reserva.duracionServicio || reserva.tiempo || 60, 10);
    const finReserva = addMinutes(inicioReserva, duracionReserva);
    
    // Verificar solapamiento: 
    // - El nuevo servicio no puede empezar mientras otro está en curso
    // - El nuevo servicio no puede terminar mientras otro está empezando
    const haySolapamiento = (
      (inicioNuevoServicio >= inicioReserva && inicioNuevoServicio < finReserva) ||
      (finNuevoServicio > inicioReserva && finNuevoServicio <= finReserva) ||
      (inicioNuevoServicio <= inicioReserva && finNuevoServicio >= finReserva)
    );
    
    if (haySolapamiento) {
      return true; // Hay conflicto
    }
  }
  
  return false;
};


// Obtener horarios bloqueados por una reserva específica
export const obtenerHorariosBloqueados = (horaReserva, duracionReserva, fechaSeleccionada) => {
  const horariosBloqueados = [];
  const [h, m] = horaReserva.split(":").map(Number);
  const inicioReserva = setMinutes(setHours(parseISO(fechaSeleccionada), h), m);
  
  for (let i = 0; i < duracionReserva; i += 30) { // Cada 30 minutos
    const horarioBloqueado = format(addMinutes(inicioReserva, i), "HH:mm");
    horariosBloqueados.push(horarioBloqueado);
  }
  
  return horariosBloqueados;
};
