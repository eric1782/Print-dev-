import { useState, useEffect } from 'react';
import { collection, query, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

/**
 * Hook personalizado para manejar la lógica de empresas
 */
export const useEmpresas = () => {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar todas las empresas
  const cargarEmpresas = async () => { //asynca sirve para esperar a que se carguen las empresas
    setLoading(true);
    setError(null);

    try {
      const q = query(collection(db, "empresas")); //query es una funcion que se encarga de buscar las empresas en la base de datos
      const querySnapshot = await getDocs(q); //getDocs es una funcion que se encarga de obtener los datos de las empresas
      const empresasData = querySnapshot.docs.map(doc => ({ //map es una funcion que se encarga de mapear los datos de las empresas
        id: doc.id,
        ...doc.data()
      }));
      //setEmpresas es una funcion que se encarga de setear los datos de las empresas en el estado
      setEmpresas(empresasData);
    } catch (err) { //catch es una funcion que se encarga de manejar los errores
      console.error('Error cargando empresas:', err); //console.error es una funcion que se encarga de mostrar los errores en la consola
      setError('Error al cargar las empresas'); //setError es una funcion que se encarga de setear el error en el estado
    } finally { //finally es una funcion que se encarga de ejecutar el codigo finalmente
      setLoading(false);  
    }
  };

  // Cargar una empresa específica
  const cargarEmpresa = async (empresaId) => {
    try {
      const empresaDoc = await getDoc(doc(db, "empresas", empresaId));
      if (empresaDoc.exists()) {
        return { id: empresaDoc.id, ...empresaDoc.data() };
      }
      return null;
    } catch (err) {
      console.error('Error cargando empresa:', err);
      return null;
    }
  };

  // Filtrar empresas por búsqueda
  const buscarEmpresas = (termino) => { 
    if (!termino.trim()) return empresas; //trim es una funcion que se encarga de eliminar los espacios en blanco al inicio y al final de la cadena
    
    const terminoLower = termino.toLowerCase();
    return empresas.filter(empresa => 
      empresa.nombreEmpresa?.toLowerCase().includes(terminoLower) ||
      empresa.descripcion?.toLowerCase().includes(terminoLower) ||
      empresa.telefono?.includes(termino) ||
      empresa.direccion?.toLowerCase().includes(terminoLower)
    );
  };

  // Obtener empresas activas
  const obtenerEmpresasActivas = () => {
    return empresas.filter(empresa => empresa.activo !== false); //filter es una funcion que se encarga de filtrar los datos de las empresas
  };

  useEffect(() => {
    cargarEmpresas(); //cargarEmpresas es una funcion que se encarga de cargar las empresas
  }, []);

  return {
    empresas,
    loading,
    error,
    cargarEmpresas,
    cargarEmpresa,
    buscarEmpresas,
    obtenerEmpresasActivas
  };
};
