// src/usuario/PerfilEmpresaPublico.jsx
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import ReservarPopup from "../components/ReservarPopup";

function PerfilEmpresaPublico() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [empresaData, setEmpresaData] = useState(null);
  const [servicios, setServicios] = useState([]);
  const [personal, setPersonal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [popupServicio, setPopupServicio] = useState(null);
  const [activeTab, setActiveTab] = useState("servicios");

  // Referencias para las secciones
  const sobreNosotrosRef = useRef(null);
  const horariosRef = useRef(null);
  const serviciosRef = useRef(null);
  const contactoRef = useRef(null);
  const personalRef = useRef(null);
  const ubicacionRef = useRef(null);

  useEffect(() => {
    console.log("🔄 PerfilEmpresaPublico: useEffect ejecutado para empresa ID:", id);
    const fetchEmpresaData = async () => {
      try {
        console.log("🔍 Cargando datos de empresa con ID:", id);
        
        // Cargar datos de empresa
        const docRef = doc(db, "empresas", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("📋 Datos de empresa cargados:", data);

          const normalizedHorarios = data.horarios?.map(h => ({
            ...h,
            rangos: Array.isArray(h.rangos) && h.rangos.length > 0
              ? h.rangos
              : (h.desde || h.hasta)
                ? [{ horaInicio: h.desde || "", horaFin: h.hasta || "" }]
                : []
          })) || [];

          console.log("📊 Datos de empresa cargados:", {
            horarios: normalizedHorarios,
            contacto: data.contacto,
            direccion: data.direccion,
            ubicacion: data.ubicacion
          });

          setEmpresaData({
            ...data,
            horarios: normalizedHorarios,
            id: docSnap.id
          });

          // Cargar servicios de la colección separada
          console.log("🔍 Cargando servicios para empresa:", id);
          try {
            const serviciosQuery = query(
              collection(db, "servicios"),
              where("empresaId", "==", id)
            );
            const serviciosSnap = await getDocs(serviciosQuery);
            const serviciosData = serviciosSnap.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            console.log("✅ Servicios cargados:", serviciosData);
            setServicios(serviciosData);
          } catch (serviciosError) {
            console.error("❌ Error cargando servicios:", serviciosError);
          }

          // Cargar personal de la colección separada
          console.log("🔍 Cargando personal para empresa:", id);
          try {
            const personalQuery = query(
              collection(db, "personal"),
              where("empresaId", "==", id)
            );
            const personalSnap = await getDocs(personalQuery);
            const personalData = personalSnap.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            console.log("✅ Personal cargado:", personalData);
            setPersonal(personalData);
          } catch (personalError) {
            console.error("❌ Error cargando personal:", personalError);
          }

        } else {
          console.log("❌ Empresa no encontrada");
          setError("Empresa no encontrada.");
        }
      } catch (err) {
        console.error("❌ Error al cargar datos:", err);
        setError("Error al cargar información.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmpresaData();
  }, [id]);

  // Función para scrollear suavemente a una sección
  const scrollToSection = (ref, tabName) => {
    setActiveTab(tabName);
    ref.current?.scrollIntoView({ 
      behavior: "smooth", 
      block: "start" 
    });
  };

  // Configuración de las tabs con iconos SVG minimalistas
  const tabs = [
    { 
      id: "servicios", 
      label: "Servicios", 
      ref: serviciosRef, 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    { 
      id: "horarios", 
      label: "Horarios", 
      ref: horariosRef, 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      id: "contacto", 
      label: "Contacto", 
      ref: contactoRef, 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    },
    { 
      id: "ubicacion", 
      label: "Ubicación", 
      ref: ubicacionRef, 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    }
  ];

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-gray-900 mx-auto mb-3"></div>
        <p className="text-gray-600 text-sm">Cargando empresa...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="flex justify-center items-center min-h-screen px-4 bg-gray-50">
      <div className="text-center bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <p className="text-gray-800 font-medium mb-4">{error}</p>
        <button
          onClick={() => navigate("/home-usuario")}
          className="px-6 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors text-sm font-medium"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
  
  if (!empresaData) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con botón volver */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="px-4 py-3">
          <button
            onClick={() => navigate("/home-usuario")}
            className="flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors text-sm font-medium"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver
          </button>
        </div>
      </div>

      {/* Foto de portada minimalista */}
      <div className="relative h-40 sm:h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {empresaData.fotoPortada ? (
          <img
            src={empresaData.fotoPortada}
            alt="Portada"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="text-xl sm:text-2xl font-bold text-white drop-shadow-sm truncate">
            {empresaData.nombreEmpresa}
          </h1>
        </div>
      </div>

      {/* Información de la empresa */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-6">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Información</h2>
          </div>
          <p className="text-gray-600 leading-relaxed text-sm">
            {empresaData.descripcion || "Sin descripción disponible."}
          </p>
        </div>
      </div>

      {/* Navegación por tabs moderna */}
      <nav className="sticky top-16 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex px-4 py-2 gap-2 justify-center">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => scrollToSection(tab.ref, tab.id)}
                className={`flex items-center px-4 py-3 text-sm font-medium transition-all duration-300 whitespace-nowrap rounded-full transform ${
                  activeTab === tab.id
                    ? "bg-gray-900 text-white shadow-lg scale-105"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800 hover:scale-102"
                }`}
                style={{ scrollBehavior: 'smooth' }}
              >
                <span className="mr-2 transition-transform duration-300">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
        <style jsx>{`
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </nav>

      {/* Contenido principal */}
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        
        {/* Servicios */}
        <section 
          ref={serviciosRef} 
          className="bg-white rounded-2xl p-6 border border-gray-100"
        >
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Servicios</h2>
          </div>
          <div className="space-y-3">
            {servicios.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <p className="text-lg font-medium text-gray-400 mb-2">No hay servicios disponibles</p>
                <p className="text-sm text-gray-400">Esta empresa aún no ha configurado sus servicios</p>
              </div>
            ) : (
              servicios.map((serv) => (
                <div
                  key={serv.id}
                  onClick={() => setPopupServicio(serv)}
                  className="bg-gray-50 border border-gray-100 p-4 rounded-xl transition-all duration-300 cursor-pointer hover:bg-gradient-to-r hover:from-white hover:to-gray-50 hover:shadow-xl hover:border-gray-300 hover:scale-105 hover:-translate-y-1 active:scale-100 active:translate-y-0"
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05) translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                  e.currentTarget.style.background = 'linear-gradient(to right, #ffffff, #f9fafb)';
                  e.currentTarget.style.borderColor = '#d1d5db';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1) translateY(0)';
                  e.currentTarget.style.boxShadow = '';
                  e.currentTarget.style.background = '#f9fafb';
                  e.currentTarget.style.borderColor = '#f3f4f6';
                }}
              >
                <div className="flex items-start space-x-3">
                  {/* Foto del servicio */}
                  <div className="flex-shrink-0">
                    {serv.foto ? (
                      <img
                        src={serv.foto}
                        alt={serv.nombre}
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 shadow-sm"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-sm border-2 border-gray-200">
                        <span className="text-lg">{serv.icono || "⚡"}</span>
                      </div>
                    )}
                  </div>

                  {/* Contenido del servicio */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 mr-4">
                        <h3 className="font-semibold text-gray-900 text-sm mb-1 transition-colors hover:text-gray-700">{serv.nombre}</h3>
                        <p className="text-gray-500 text-xs leading-relaxed transition-colors hover:text-gray-700">{serv.descripcion}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="flex items-center justify-end text-sm mb-1 transition-colors">
                          <div className="w-5 h-5 mr-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text font-semibold">
                            {serv.tiempo} min
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900 transition-all hover:text-black hover:text-base">${serv.precio}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Indicador visual de que es clickeable */}
                <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-center">
                  <span className="text-xs text-gray-400 flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Clic para reservar
                  </span>
                </div>
              </div>
              ))
            )}
          </div>
        </section>

        {/* Horarios */}
        <section 
          ref={horariosRef} 
          className="bg-white rounded-2xl p-6 border border-gray-100"
        >
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Horarios</h2>
          </div>
          {empresaData.horarios?.length > 0 ? (
            <div className="space-y-3">
              {empresaData.horarios.map((h, idx) => (
                <div key={idx} className="flex justify-between items-center py-2">
                  <span className="font-medium text-gray-700 text-sm">{h.dia}</span>
                  <span className="text-gray-500 text-sm">
                    {h.rangos && h.rangos.length > 0
                      ? h.rangos.map((r, i) => (
                          <span key={i} className="block text-right">
                            {r.horaInicio} - {r.horaFin}
                          </span>
                        ))
                      : <span className="text-gray-400">Cerrado</span>}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-4 text-sm">Sin horarios disponibles.</p>
          )}
        </section>

        {/* Contacto */}
        <section 
          ref={contactoRef} 
          className="bg-white rounded-2xl p-6 border border-gray-100"
        >
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Contacto</h2>
          </div>
          <div className="space-y-3">
            {empresaData.contacto?.instagram && (
              <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987c6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM12.017 2.48c5.252 0 9.507 4.255 9.507 9.507s-4.255 9.507-9.507 9.507s-9.507-4.255-9.507-9.507S6.765 2.48 12.017 2.48z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Instagram</p>
                  <p className="text-sm text-gray-900 font-medium">{empresaData.contacto.instagram}</p>
                </div>
              </div>
            )}
            {empresaData.contacto?.facebook && (
              <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Facebook</p>
                  <p className="text-sm text-gray-900 font-medium">{empresaData.contacto.facebook}</p>
                </div>
              </div>
            )}
            {empresaData.contacto?.telefono && (
              <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Teléfono</p>
                  <p className="text-sm text-gray-900 font-medium">{empresaData.contacto.telefono}</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Ubicación */}
        <section 
          ref={ubicacionRef} 
          className="bg-white rounded-2xl p-6 border border-gray-100"
        >
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Ubicación</h2>
          </div>
          <p className="text-gray-600 mb-4 text-sm">{empresaData.direccion || "Dirección no disponible"}</p>
          {empresaData.ubicacion?.lat && empresaData.ubicacion?.lng ? (
            <div className="rounded-xl overflow-hidden border border-gray-100">
              <iframe
                className="w-full h-40 sm:h-48"
                src={`https://maps.google.com/maps?q=${empresaData.ubicacion.lat},${empresaData.ubicacion.lng}&hl=es&z=16&output=embed`}
                loading="lazy"
                allowFullScreen
                title="Mapa ubicación"
              />
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl p-6 text-center border border-gray-100">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <p className="text-gray-400 text-sm">No hay ubicación geográfica disponible</p>
            </div>
          )}
        </section>
      </div>

      {/* Espacio inferior */}
      <div className="h-6"></div>

      {/* Popup reserva */}
      {popupServicio && (
        <ReservarPopup
          key={`${id}-${popupServicio.id || popupServicio.nombre}`} // Forzar re-mount cuando cambie empresa o servicio
          servicio={popupServicio}
          empresa={empresaData}
          onClose={() => setPopupServicio(null)}
        />
      )}
    </div>
  );
}

export default PerfilEmpresaPublico;
