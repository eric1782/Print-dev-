import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

/**
 * Hook personalizado para manejar la lógica de personal/trabajadores
 */
export const usePersonal = (empresaId) => {
  const [personal, setPersonal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar personal de una empresa
  const cargarPersonal = async () => {
    if (!empresaId) {
      setPersonal([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const personalQuery = query(
        collection(db, "personal"),
        where("empresaId", "==", empresaId)
      );
      
      const personalSnap = await getDocs(personalQuery);
      const personalData = personalSnap.docs.map(doc => {
        const data = doc.data();
        // Limpiar servicios para asegurar que solo contenga strings válidos
        if (Array.isArray(data.servicios)) {
          data.servicios = data.servicios.filter(sid => typeof sid === 'string');
        }
        return {
          id: doc.id,
          ...data
        };
      });
      
      // Filtrar solo personal activo
      const personalActivo = personalData.filter(p => p.activo !== false);
      setPersonal(personalActivo);
    } catch (err) {
      console.error('Error cargando personal:', err);
      setError('Error al cargar el personal');
    } finally {
      setLoading(false);
    }
  };

  // Verificar si el personal puede trabajar en un horario específico
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
        (rangoPersonal.fin || rangoPersonal.horaFin) > (rangoEmpresa.inicio || rangoEmpresa.inicio)
      )
    );
  };

  // Obtener personal disponible para un servicio específico
  const obtenerPersonalDisponible = (servicioId, dia, empresaHorarios) => {
    return personal.filter(p => {
      const tieneHorario = verificarDisponibilidadPersonal(p.horarios, empresaHorarios, dia);
      const puedeHacerServicio = !p.servicios || 
                                p.servicios.length === 0 || 
                                p.servicios.includes(servicioId) || 
                                p.servicios.includes(servicioId);
      return tieneHorario && puedeHacerServicio;
    });
  };

  // Obtener personal por especialidad
  const obtenerPersonalPorEspecialidad = (especialidad) => {
    return personal.filter(p => 
      p.especialidad?.toLowerCase().includes(especialidad.toLowerCase())
    );
  };

  // Obtener personal disponible en un horario específico
  const obtenerPersonalDisponibleEnHorario = (dia, horaInicio, horaFin, empresaHorarios) => {
    return personal.filter(p => {
      const tieneHorario = verificarDisponibilidadPersonal(p.horarios, empresaHorarios, dia);
      if (!tieneHorario) return false;

      const horarioPersonalDia = p.horarios?.find(h => h.dia === dia);
      if (!horarioPersonalDia?.rangos) return true;

      return horarioPersonalDia.rangos.some(rango => {
        const inicio = rango.inicio || rango.horaInicio;
        const fin = rango.fin || rango.horaFin;
        return inicio <= horaInicio && fin >= horaFin;
      });
    });
  };

  useEffect(() => {
    cargarPersonal();
  }, [empresaId]);

  return {
    personal,
    loading,
    error,
    cargarPersonal,
    verificarDisponibilidadPersonal,
    obtenerPersonalDisponible,
    obtenerPersonalPorEspecialidad,
    obtenerPersonalDisponibleEnHorario
  };
};
