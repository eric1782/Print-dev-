import { useState, useEffect, useCallback } from 'react';
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
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { DIAS_SEMANA } from '../utils/constants';
import { generarDiasSemana, verificarHorarioOcupado } from '../utils/dateUtils';
import { obtenerDiaSemana, normalizarDia } from '../utils/dayUtils';
import { useEmpresaData } from './useEmpresaData';

/**
 * Hook personalizado para manejar la lógica de horarios y disponibilidad
 */
export const useHorarios = (empresaId, profesionalId = null) => {
  const [horariosDisponibles, setHorariosDisponibles] = useState([]);
  const [semanaActual, setSemanaActual] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [diasCalendario, setDiasCalendario] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener datos de la empresa (horarios del local, servicios, etc.)
  const {
    empresaData,
    horariosLocal,
    servicios,
    estaAbiertoElDia,
    obtenerHorariosDelDia,
    estaDentroDelHorarioLocal,
    loading: loadingEmpresaData
  } = useEmpresaData(empresaId);

  // Generar días del calendario
  const actualizarDiasCalendario = useCallback((empresaHorarios) => {
    const dias = generarDiasSemana(semanaActual, DIAS_SEMANA, empresaHorarios);
    setDiasCalendario(dias);
  }, [semanaActual]);

  // Generar horarios disponibles para una fecha y profesional específicos
  const generarHorariosDisponibles = useCallback(async (fechaSeleccionada, profesionalSeleccionado, empresa, servicio, personal, forzarActualizacion = false) => {
    if (!fechaSeleccionada || !profesionalSeleccionado || !empresa || !servicio) {
      setHorariosDisponibles([]);
      return;
    }

    // Esperar a que se carguen los datos de la empresa
    if (loadingEmpresaData) {
      setHorariosDisponibles([]);
      return;
    }

    // Verificar si el local está abierto en el día seleccionado
    // Obtener día de la semana usando la función centralizada
    const diaSemana = obtenerDiaSemana(fechaSeleccionada);
    
    // TEMPORAL: Si useEmpresaData no está funcionando, asumir que el local está abierto
    const localAbierto = horariosLocal.length > 0 ? estaAbiertoElDia(diaSemana) : true;
    
    if (!localAbierto) {
      setHorariosDisponibles([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const diaSeleccionado = diasCalendario.find(d => d.fecha === fechaSeleccionada);
      if (!diaSeleccionado || !diaSeleccionado.horario) {
        setHorariosDisponibles([]);
        return;
      }

      // Buscar el personal seleccionado o usar horarios de empresa
      let horariosParaUsar = [];
      if (profesionalSeleccionado === 'empresa-general') {
        // Si no hay horarios del local, usar horarios por defecto
        if (horariosLocal.length === 0) {
          horariosParaUsar = [{ horaInicio: '09:00', horaFin: '18:00' }];
        } else {
          horariosParaUsar = diaSeleccionado.horario.rangos || [];
        }
      } else {
        const personalSeleccionado = personal.find(p => p.id === profesionalSeleccionado);
        if (!personalSeleccionado) {
          setHorariosDisponibles([]);
          return;
        }

        // Verificar si el personal puede realizar este servicio
        // El personal tiene servicios como IDs, no como nombres
        const puedeRealizarServicio = personalSeleccionado.servicios && 
          Array.isArray(personalSeleccionado.servicios) && 
          personalSeleccionado.servicios.includes(servicio.id);
        
        if (!puedeRealizarServicio) {
          setHorariosDisponibles([]);
          return;
        }

        // Usar la función centralizada de normalización de días
        const horarioPersonalDia = personalSeleccionado.horarios?.find(h => 
          normalizarDia(h.dia) === normalizarDia(diaSeleccionado.dia)
        );
        
        // Los horarios del personal se guardan como { dia, horaInicio, horaFin, habilitado }
        if (horarioPersonalDia?.horaInicio && horarioPersonalDia?.horaFin) {
          horariosParaUsar = [{
            horaInicio: horarioPersonalDia.horaInicio,
            horaFin: horarioPersonalDia.horaFin
          }];
        } else {
          // Si no tiene horarios específicos, usar horarios del local
          horariosParaUsar = diaSeleccionado.horario.rangos || [];
        }
            
      }

      if (!horariosParaUsar.length) {
        setHorariosDisponibles([]);
        return;
      }

      const duracionServicio = parseInt(servicio.tiempo, 10);

      // Obtener reservas existentes para verificar disponibilidad
      const inicioDia = new Date(fechaSeleccionada);
      inicioDia.setHours(0, 0, 0, 0);
      const finDia = new Date(fechaSeleccionada);
      finDia.setHours(23, 59, 59, 999);

      let reservas = [];
      
      try {
        // Consulta de Firebase: Obtener TODAS las reservas de la empresa para el día
        const q = query(
          collection(db, "reservas"),
          where("empresaId", "==", empresa.id),
          where("fecha", "==", fechaSeleccionada)
        );
        
        const querySnapshot = await getDocs(q);
        const todasLasReservas = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Filtrar por trabajador si está seleccionado uno específico
        if (profesionalSeleccionado && profesionalSeleccionado !== 'empresa-general') {
          reservas = todasLasReservas.filter(reserva => 
            reserva.profesionalId === profesionalSeleccionado
          );
        } else {
          reservas = todasLasReservas;
        }
        
      } catch (error) {
        console.error('Error obteniendo reservas de Firebase:', error);
        reservas = [];
      }

      const horasDisponibles = [];
      const hoy = new Date();
      const esHoy = parseISO(fechaSeleccionada).toDateString() === hoy.toDateString();

      horariosParaUsar.forEach((rango, index) => {
        const inicioHora = rango.inicio || rango.horaInicio;
        const finHora = rango.fin || rango.horaFin;

        const [inicioH, inicioM] = inicioHora.split(":").map(Number);
        const [finH, finM] = finHora.split(":").map(Number);

        let horaActual = setMinutes(setHours(parseISO(fechaSeleccionada), inicioH), inicioM);
        const horaFin = setMinutes(setHours(parseISO(fechaSeleccionada), finH), finM);

        // Generar horarios cada 30 minutos
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
            // Verificar si la hora está dentro del horario del local
            const estaDentroDelLocal = estaDentroDelHorarioLocal(horaString, diaSemana);
            
            if (!estaDentroDelLocal) {
              console.log(`[DEBUG] Hora ${horaString} fuera del horario del local`);
              horaActual = addMinutes(horaActual, 30);
              continue;
            }

            // Verificar si todos los minutos necesarios están libres
            // IMPORTANTE: Usar la duración del servicio que se está intentando reservar
            // Esto asegura que si un trabajador tiene una reserva de 90min a las 10:00,
            // estará ocupado hasta las 11:30 para TODOS sus servicios
            const estaOcupado = verificarHorarioOcupado(horaString, reservas, duracionServicio, fechaSeleccionada);
            
            // Debug para horarios problemáticos (solo si hay reservas)
            if (reservas.length > 0 && (horaString === '11:00' || horaString === '12:00' || horaString === '13:00')) {
              // Debug silenciado para producción
            }
            
            horasDisponibles.push({
              hora: horaString,
              horaFin: format(finServicio, "HH:mm"),
              ocupado: estaOcupado || yaPaso
            });
          }
          // Avanzar 30 minutos
          horaActual = addMinutes(horaActual, 30);
        }
      });

      setHorariosDisponibles(horasDisponibles);
    } catch (error) {
      console.error('Error generando horarios:', error);
      setHorariosDisponibles([]);
    } finally {
      setLoading(false);
    }
  }, [diasCalendario, loadingEmpresaData, horariosLocal, estaAbiertoElDia, obtenerHorariosDelDia, estaDentroDelHorarioLocal]);

  // Navegación de semanas
  const irSemanaAnterior = useCallback(() => {
    const nuevaSemana = subWeeks(semanaActual, 1);
    setSemanaActual(nuevaSemana);
  }, [semanaActual]);

  const irSemanaSiguiente = useCallback(() => {
    const nuevaSemana = addWeeks(semanaActual, 1);
    setSemanaActual(nuevaSemana);
  }, [semanaActual]);

  // Ir a la semana actual
  const irSemanaActual = useCallback(() => {
    const semanaHoy = startOfWeek(new Date(), { weekStartsOn: 1 });
    setSemanaActual(semanaHoy);
  }, []);

  // Actualizar horarios cada minuto para marcar como no disponibles los que ya pasaron
  useEffect(() => {
    const interval = setInterval(() => {
      if (horariosDisponibles.length > 0) {
        // Re-generar horarios para actualizar el estado de disponibilidad
        setHorariosDisponibles(prev => 
          prev.map(horario => ({
            ...horario,
            ocupado: verificarHorarioOcupado(horario.hora, [], 60, new Date().toISOString().split('T')[0])
          }))
        );
      }
    }, 60000); // Cada minuto

    return () => clearInterval(interval);
  }, [horariosDisponibles.length]); // Solo depende de la longitud de horariosDisponibles

  // Seleccionar día
  const seleccionarDia = (dia) => {
    if (dia.disponible) {
      return dia.fecha;
    }
    return null;
  };

  return {
    horariosDisponibles,
    semanaActual,
    diasCalendario,
    loading: loading || loadingEmpresaData,
    error,
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
  };
};
