import React, { useEffect, useState } from "react";
import { auth, db, storage } from "../../firebase/firebaseConfig";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, collection, addDoc, getDocs, query, where, updateDoc, deleteDoc, orderBy, limit, onSnapshot } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import MiDatosEmpresa from "../../empresa/MiDatosEmpresa";
import NotificacionesEmpresa from "../../empresa/NotificacionesEmpresa";
import HomeEmpresaAgenda from "../../empresa/HomeEmpresaAgenda";
import MisTrabajadores from "../../empresa/MisTrabajadores";

function HomeEmpresa() {
  const [user, setUser] = useState(null);
  const [empresaData, setEmpresaData] = useState({});
  const [servicios, setServicios] = useState([]);
  const [personal, setPersonal] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [loadingReservas, setLoadingReservas] = useState(false);
  const [editandoPerfil, setEditandoPerfil] = useState(false);
  const [modalServicio, setModalServicio] = useState(false);
  const [modalPersonal, setModalPersonal] = useState(false);
  const [nuevoServicio, setNuevoServicio] = useState({ nombre: '', precio: '', tiempo: '', descripcion: '', foto: '' });
  const [nuevoPersonal, setNuevoPersonal] = useState({ nombre: '', apellido: '', especialidad: '', telefono: '', email: '', horarios: [], servicios: [] });
  const [editandoServicio, setEditandoServicio] = useState(null);
  const [editandoPersonal, setEditandoPersonal] = useState(null);
  const [activeTab, setActiveTab] = useState('perfil');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        // Cargar datos de la empresa, servicios y personal
        const fetchData = async () => {
          setLoading(true);
          try {
            // Empresa
            const empresaDoc = await getDoc(doc(db, "empresas", user.uid));
            if (empresaDoc.exists()) {
              const data = { id: empresaDoc.id, ...empresaDoc.data() };
              console.log("Datos de empresa cargados:", data);
              setEmpresaData(data);
            } else {
              console.log("No se encontró el documento de la empresa");
            }
            // Servicios
            const serviciosQuery = query(collection(db, "servicios"), where("empresaId", "==", user.uid));
            const serviciosSnapshot = await getDocs(serviciosQuery);
            const serviciosData = serviciosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            console.log("Servicios cargados:", serviciosData); // <-- Log para depuración
            setServicios(serviciosData);
            // Personal
            const personalQuery = query(collection(db, "personal"), where("empresaId", "==", user.uid));
            const personalSnapshot = await getDocs(personalQuery);
            const personalData = personalSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPersonal(personalData);
          } catch (error) {
            console.error("Error al cargar datos: ", error);
          }
          setLoading(false);
        };
        fetchData();
      } else {
        setUser(null);
        setEmpresaData({});
        setServicios([]);
        setPersonal([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Función para guardar todos los cambios del perfil
  const guardarPerfilEmpresa = async () => {
    if (!user?.uid) return;
    try {
      // Guardar datos generales, horarios, redes sociales y ubicación
      await setDoc(doc(db, "empresas", user.uid), {
        ...empresaData,
        horarios: empresaData.horarios || [],
        redesSociales: empresaData.redesSociales || {},
        ubicacion: empresaData.ubicacion || {},
      }, { merge: true });
      alert("Perfil actualizado correctamente");
    } catch (error) {
      alert("Error al guardar perfil: " + error.message);
    }
  };

  if (loading) return <div className="text-center py-8">Cargando datos...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-200 via-purple-100 to-pink-100">
      {/* Header fijo con logo y menú */}
      <div className="w-full flex flex-col sm:block py-2 sm:py-4 mb-2 sm:mb-6 px-0 sm:px-8 relative">
        {/* Logo y título*/}
        <div className="flex flex-row items-center w-full sm:w-auto mb-2 sm:mb-0 sm:pl-2">
          <svg className="w-10 h-10 sm:w-12 sm:h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <div className="text-xl sm:text-2xl font-bold text-indigo-600 ml-2">Yo Te Agendo</div>
        </div>
        
        {/* Menú horizontal principal */}
        <nav className="flex flex-row flex-wrap justify-center items-center text-center gap-2 sm:gap-4 px-2 sm:px-4 py-2 sm:py-3 rounded-2xl shadow-lg bg-white/80 backdrop-blur border border-white/40 max-w-2xl w-full sm:w-auto sm:absolute sm:left-1/2 sm:-translate-x-1/2">
          {[
            { tab: 'perfil', label: 'Mis Datos' },
            { tab: 'agenda', label: 'Agenda' },
            { tab: 'trabajadores', label: 'Trabajadores' },
            { tab: 'notificaciones', label: 'Notificaciones' }
          ].map(({ tab, label }) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-2 sm:px-4 py-1 sm:py-2 rounded-xl transition-all font-semibold text-xs sm:text-base whitespace-nowrap ${
                activeTab === tab 
                  ? 'bg-purple-500 text-white shadow' 
                  : 'text-purple-700 hover:bg-purple-100'
              }`}
            >
              {label}
            </button>
          ))}
          
          <button
            onClick={() => {
              signOut(auth);
              window.location.href = "/";
            }}
            className="px-2 sm:px-4 py-1 sm:py-2 rounded-xl font-semibold bg-gradient-to-r from-red-500 to-pink-500 text-white shadow transition-all hover:from-red-600 hover:to-pink-600 flex items-center gap-0 sm:gap-2 text-xs sm:text-base"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
            </svg>
            <span className="hidden sm:inline">Salir</span>
          </button>
        </nav>
      </div>

      {/* Contenido principal */}
      <div className="w-full mx-auto px-1 sm:px-2 pb-2 pt-20 sm:pt-24">
        {activeTab === "perfil" && (
          <div className="w-full max-w-md sm:max-w-3xl mx-auto px-2 sm:px-4">
            <MiDatosEmpresa empresaData={empresaData} servicios={servicios} personal={personal} />
          </div>
        )}
        {activeTab === "agenda" && (
          <HomeEmpresaAgenda empresaId={user?.uid} personal={personal} servicios={servicios} />
        )}
        {activeTab === "trabajadores" && (
          <div className="w-full max-w-md sm:max-w-3xl mx-auto px-2 sm:px-4">
            <MisTrabajadores personal={personal} servicios={servicios} />
          </div>
        )}
        {activeTab === "notificaciones" && (
          <div className="w-full max-w-md sm:max-w-3xl mx-auto px-2 sm:px-4">
            <NotificacionesEmpresa empresaId={user?.uid} />
          </div>
        )}
      </div>
    </div>
  );
}

export default HomeEmpresa;