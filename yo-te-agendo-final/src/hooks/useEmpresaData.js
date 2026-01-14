import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { normalizarDia } from '../utils/dayUtils';

/**
 * Hook para obtener datos completos de la empresa
 * Incluye horarios del local, servicios y configuración
 */
export const useEmpresaData = (empresaId) => {
  const [empresaData, setEmpresaData] = useState(null);
  const [horariosLocal, setHorariosLocal] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!empresaId) {
      setLoading(false);
      return;
    }

    const cargarDatosEmpresa = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Obtener datos básicos de la empresa
        const empresaRef = doc(db, 'empresas', empresaId);
        const empresaSnap = await getDoc(empresaRef);
        
        if (!empresaSnap.exists()) {
          throw new Error('Empresa no encontrada');
        }

        const empresa = { id: empresaSnap.id, ...empresaSnap.data() };
        setEmpresaData(empresa);

        // 2. Obtener horarios del local desde la empresa
        if (empresa.horarios && Array.isArray(empresa.horarios)) {
          // Normalizar horarios de la empresa
          const horariosNormalizados = empresa.horarios.map(h => ({
            ...h,
            rangos: Array.isArray(h.rangos) && h.rangos.length > 0
              ? h.rangos
              : (h.desde || h.hasta)
                ? [{ horaInicio: h.desde || "", horaFin: h.hasta || "" }]
                : []
          }));
          setHorariosLocal(horariosNormalizados);
        } else {
          // Usar horarios por defecto si no existen
          const horariosDefault = [
            { dia: 'Lunes', rangos: [{ horaInicio: '09:00', horaFin: '18:00' }] },
            { dia: 'Martes', rangos: [{ horaInicio: '09:00', horaFin: '18:00' }] },
            { dia: 'Miércoles', rangos: [{ horaInicio: '09:00', horaFin: '18:00' }] },
            { dia: 'Jueves', rangos: [{ horaInicio: '09:00', horaFin: '18:00' }] },
            { dia: 'Viernes', rangos: [{ horaInicio: '09:00', horaFin: '18:00' }] },
            { dia: 'Sábado', rangos: [{ horaInicio: '09:00', horaFin: '18:00' }] },
            { dia: 'Domingo', rangos: [{ horaInicio: '09:00', horaFin: '18:00' }] }
          ];
          setHorariosLocal(horariosDefault);
        }

        // 3. Obtener servicios desde la empresa
        if (empresa.servicios && Array.isArray(empresa.servicios)) {
          setServicios(empresa.servicios);
        } else {
          setServicios([]);
        }


      } catch (err) {
        console.error('[useEmpresaData] Error cargando datos:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    cargarDatosEmpresa();
  }, [empresaId]);


  // Función para verificar si el local está abierto en un día específico
  const estaAbiertoElDia = (diaSemana) => {
    const diaNormalizado = normalizarDia(diaSemana);
    const horarioDia = horariosLocal.find(h => h.dia === diaNormalizado);
    return horarioDia && horarioDia.rangos && horarioDia.rangos.length > 0;
  };

  // Función para obtener horarios de apertura de un día
  const obtenerHorariosDelDia = (diaSemana) => {
    const diaNormalizado = normalizarDia(diaSemana);
    const horarioDia = horariosLocal.find(h => h.dia === diaNormalizado);
    return horarioDia ? horarioDia.rangos : [];
  };

  // Función para verificar si una hora está dentro del horario del local
  const estaDentroDelHorarioLocal = (hora, diaSemana) => {
    const rangos = obtenerHorariosDelDia(diaSemana);
    return rangos.some(rango => {
      const inicio = rango.horaInicio;
      const fin = rango.horaFin;
      return hora >= inicio && hora <= fin;
    });
  };

  return {
    empresaData,
    horariosLocal,
    servicios,
    loading,
    error,
    estaAbiertoElDia,
    obtenerHorariosDelDia,
    estaDentroDelHorarioLocal
  };
};
