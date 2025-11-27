import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase/firebaseConfig"; // Ajusta rutas si es necesario
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, collection, getDocs, query, where } from "firebase/firestore";

// Importamos los componentes
import NavbarEmpresa from "../../components/PerfilEmpresa/NavbarEmpresa";
import MiDatosEmpresa from "../../empresa/MiDatosEmpresa";
import NotificacionesEmpresa from "../../empresa/NotificacionesEmpresa";
import HomeEmpresaAgenda from "../../empresa/HomeEmpresaAgenda";
import MisTrabajadores from "../../empresa/MisTrabajadores";

function HomeEmpresa() {
  const [user, setUser] = useState(null);
  const [empresaData, setEmpresaData] = useState({});
  const [servicios, setServicios] = useState([]);
  const [personal, setPersonal] = useState([]);
  const [activeTab, setActiveTab] = useState('perfil');
  const [loading, setLoading] = useState(true);

  // ... (Mantén tu useEffect y lógica de carga de datos exactamente igual que antes) ...
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        const fetchData = async () => {
          setLoading(true);
          try {
            const empresaDoc = await getDoc(doc(db, "empresas", user.uid));
            if (empresaDoc.exists()) {
              setEmpresaData({ id: empresaDoc.id, ...empresaDoc.data() });
            }
            
            const serviciosQuery = query(collection(db, "servicios"), where("empresaId", "==", user.uid));
            const serviciosSnapshot = await getDocs(serviciosQuery);
            setServicios(serviciosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

            const personalQuery = query(collection(db, "personal"), where("empresaId", "==", user.uid));
            const personalSnapshot = await getDocs(personalQuery);
            setPersonal(personalSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
          } catch (error) {
            console.error("Error al cargar datos: ", error);
          }
          setLoading(false);
        };
        fetchData();
      } else {
        setUser(null);
        setEmpresaData({});
      }
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="text-center py-8">Cargando datos...</div>;

return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-200 via-purple-100 to-pink-100">
      
      {/* Barra navegacion */}
      <NavbarEmpresa 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />

      {/* 2. Contenedor Principal del contenido */}
      <div className="w-full mx-auto px-1 sm:px-2 pb-6">
        
        {/* CASO A: Pestañas que necesitan verse "agrupadas" y centradas (Perfil, Trabajadores, Notificaciones) */}
        {activeTab === "perfil" && (
          // Regresamos al max-w-3xl original para que no se vea desparramado
          <div className="w-full max-w-md sm:max-w-3xl mx-auto px-2 sm:px-4 mt-4">
            <MiDatosEmpresa empresaData={empresaData} servicios={servicios} personal={personal} />
          </div>
        )}

        {/* CASO B: La Agenda necesita todo el ancho disponible */}
        {activeTab === "agenda" && (
          <div className="w-full mt-2">
            <HomeEmpresaAgenda empresaId={user?.uid} personal={personal} servicios={servicios} />
          </div>
        )}

        {/* CASO A: Trabajadores (Igual que perfil, centrado y compacto) */}
        {activeTab === "trabajadores" && (
          <div className="w-full max-w-md sm:max-w-3xl mx-auto px-2 sm:px-4 mt-4">
            <MisTrabajadores personal={personal} servicios={servicios} />
          </div>
        )}

        {/* CASO A: Notificaciones (Igual que perfil, centrado y compacto) */}
        {activeTab === "notificaciones" && (
          <div className="w-full max-w-md sm:max-w-3xl mx-auto px-2 sm:px-4 mt-4">
            <NotificacionesEmpresa empresaId={user?.uid} />
          </div>
        )}

      </div>
    </div>
  );
}

export default HomeEmpresa;