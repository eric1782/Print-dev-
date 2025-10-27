import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy, doc, updateDoc, addDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/firebaseConfig';
import { formatearFecha, timestampToDate } from '../utils/dateUtils';
import { ESTADOS_RESERVA, TIPOS_NOTIFICACION } from '../utils/constants';

/**
 * Hook personalizado para manejar la lógica de reservas
 */
export const useReservas = (empresaId = null) => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar reservas
  const cargarReservas = async () => {
    if (!auth.currentUser?.uid) {
      setReservas([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let q;
      
      if (empresaId) {
        // Cargar reservas de una empresa específica
        q = query(
          collection(db, "reservas"),
          where("empresaId", "==", empresaId),
          orderBy("fechaReserva", "desc")
        );
      } else {
        // Cargar reservas del usuario actual
        q = query(
          collection(db, "reservas"),
          where("usuarioId", "==", auth.currentUser.uid),
          orderBy("fechaReserva", "desc")
        );
      }

      const querySnapshot = await getDocs(q);
      const reservasData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));


      setReservas(reservasData);
    } catch (err) {
      console.error('Error cargando reservas:', err);
      setError('Error al cargar las reservas');
    } finally {
      setLoading(false);
    }
  };

  // Crear nueva reserva
  const crearReserva = async (datosReserva) => {
    try {
      const reservaRef = await addDoc(collection(db, "reservas"), {
        ...datosReserva,
        usuarioId: auth.currentUser?.uid,
        estado: ESTADOS_RESERVA.PENDIENTE,
        timestamp: new Date(),
      });


      // Crear notificación para la empresa
      await addDoc(collection(db, "notificaciones"), {
        empresaId: datosReserva.empresaId,
        usuarioId: auth.currentUser?.uid,
        tipo: TIPOS_NOTIFICACION.NUEVA_RESERVA,
        titulo: "Nueva Reserva",
        mensaje: `El usuario ha realizado una reserva para el servicio ${datosReserva.servicio} el día ${formatearFecha(datosReserva.fechaReserva)} a las ${datosReserva.hora} con ${datosReserva.personal}.`,
        reservaId: reservaRef.id,
        fechaCreacion: new Date(),
        leida: false
      });

      // Recargar reservas
      await cargarReservas();
      
      return { success: true, reservaId: reservaRef.id };
    } catch (err) {
      console.error('Error creando reserva:', err);
      return { success: false, error: err.message };
    }
  };

  // Modificar reserva
  const modificarReserva = async (reservaId, nuevosDatos) => {
    try {
      await updateDoc(doc(db, "reservas", reservaId), {
        ...nuevosDatos,
        fechaModificacion: new Date(),
        modificadoPor: "usuario"
      });

      // Crear notificación para la empresa
      await addDoc(collection(db, "notificaciones"), {
        empresaId: nuevosDatos.empresaId,
        usuarioId: auth.currentUser?.uid,
        tipo: TIPOS_NOTIFICACION.MODIFICACION_RESERVA,
        titulo: "Reserva Modificada",
        mensaje: `El usuario ha modificado su reserva. Nueva fecha: ${formatearFecha(nuevosDatos.fechaReserva)}`,
        reservaId: reservaId,
        fechaCreacion: new Date(),
        leida: false
      });

      // Recargar reservas
      await cargarReservas();
      
      return { success: true };
    } catch (err) {
      console.error('Error modificando reserva:', err);
      return { success: false, error: err.message };
    }
  };

  // Cancelar reserva
  const cancelarReserva = async (reservaId, motivo) => {
    try {
      await updateDoc(doc(db, "reservas", reservaId), {
        cancelada: true,
        motivoCancelacion: motivo,
        estado: ESTADOS_RESERVA.CANCELADA
      });

      // Recargar reservas
      await cargarReservas();
      
      return { success: true };
    } catch (err) {
      console.error('Error cancelando reserva:', err);
      return { success: false, error: err.message };
    }
  };

  // Determinar estado de la reserva
  const obtenerEstadoReserva = (reserva) => {
    if (!reserva) return "";
    
    // Si está cancelada, está cancelada (prioridad máxima)
    if (reserva.cancelada) return ESTADOS_RESERVA.CANCELADA;
    
    const ahora = new Date();
    const fechaReserva = timestampToDate(reserva.fechaReserva);
    
    if (!fechaReserva) return "";
    
    // Comparar fecha y hora completa
    const tiempoReserva = fechaReserva.getTime();
    const tiempoAhora = ahora.getTime();
    
    // Si la fecha y hora de reserva es en el futuro, está pendiente
    if (tiempoReserva > tiempoAhora) {
      return ESTADOS_RESERVA.PENDIENTE;
    }
    
    // Si la fecha y hora de reserva es en el pasado y no está cancelada, está completada
    return ESTADOS_RESERVA.COMPLETADA;
  };

  // Filtrar reservas por estado
  const filtrarReservasPorEstado = (estado) => {
    return reservas.filter(reserva => obtenerEstadoReserva(reserva) === estado);
  };

  useEffect(() => {
    cargarReservas();
  }, [empresaId]);

  return {
    reservas,
    loading,
    error,
    cargarReservas,
    crearReserva,
    modificarReserva,
    cancelarReserva,
    obtenerEstadoReserva,
    filtrarReservasPorEstado
  };
};
