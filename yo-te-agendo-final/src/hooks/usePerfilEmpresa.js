import { useState, useEffect } from 'react';
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { useEmpresaData } from './useEmpresaData';

/**
 * Hook para manejar la carga de datos del perfil de empresa
 */
export const usePerfilEmpresa = (empresaId) => {
  const [personal, setPersonal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Usar useEmpresaData para obtener datos de la empresa y horarios
  const {
    empresaData,
    horariosLocal,
    servicios,
    loading: loadingEmpresaData,
    error: errorEmpresaData
  } = useEmpresaData(empresaId);

  useEffect(() => {
    if (!empresaId) return;

    const fetchPersonal = async () => {
      try {
        setLoading(true);
        setError(null);

        // Cargar personal
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
        setPersonal(personalData);

      } catch (err) {
        console.error("Error al cargar personal:", err);
        setError("Error al cargar personal.");
      } finally {
        setLoading(false);
      }
    };

    fetchPersonal();
  }, [empresaId]);

  return {
    empresaData: empresaData ? {
      ...empresaData,
      horarios: horariosLocal // Usar horarios de useEmpresaData
    } : null,
    servicios,
    personal,
    loading: loading || loadingEmpresaData,
    error: error || errorEmpresaData
  };
};
