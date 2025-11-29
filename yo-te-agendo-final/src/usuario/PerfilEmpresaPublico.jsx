import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { usePerfilEmpresa, useScrollNavigation } from "../hooks";
import { LoadingSpinner, ErrorMessage } from "../components/common";
import ReservarPopup from "../components/ReservarPopup";
import { 
  HeaderEmpresa, 
  InformacionEmpresa, 
  NavegacionTabs, 
  ListaServicios, 
  SeccionHorarios, 
  SeccionContacto, 
  SeccionUbicacion 
} from "../components/PerfilEmpresa";

function PerfilEmpresaPublico() {
  const { id } = useParams(); //useParams es una funcion que se encarga de obtener los parametros de la url
  const [popupServicio, setPopupServicio] = useState(null); //useState es una funcion que se encarga de crear un estado

  // Hook para cargar datos de la empresa
  const { empresaData, servicios, personal, loading, error } = usePerfilEmpresa(id);

  // Configuración de las tabs
  const tabs = [
    { 
      id: "servicios", 
      label: "Servicios", 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    { 
      id: "horarios", 
      label: "Horarios", 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      id: "contacto", //id es el identificador de la pestaña
      label: "Contacto", //label es el texto que se muestra en la pestaña
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    },
    { 
      id: "ubicacion", 
      label: "Ubicación", 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    }
  ];

  // Hook para navegación por scroll
  const { activeTab, refs, scrollToSection } = useScrollNavigation(tabs);

  // Estados de carga y error
  if (loading) { //loading es un estado que se encarga de verificar si la empresa esta cargando
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <LoadingSpinner 
          size="lg" 
          text="Cargando empresa..." 
        />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen px-4 bg-gray-50">
        <ErrorMessage 
          message={error}
          onRetry={() => window.location.reload()} //window.location.reload() es una funcion que se encarga de recargar la pagina
          className="max-w-md"
        />
      </div>
    );
  }
  
  if (!empresaData) return null; //si no hay datos de la empresa, se retorna null 

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-200 via-purple-100 to-pink-100">
      {/* Header con foto de portada */}
      <HeaderEmpresa empresaData={empresaData} />

      {/* Información básica */}
      <InformacionEmpresa empresaData={empresaData} />

      {/* Navegación por tabs */}
      <NavegacionTabs 
        tabs={tabs}
        activeTab={activeTab}
        onTabClick={scrollToSection}
      />

      {/* Contenido principal */}
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        
        {/* Servicios */}
        <section 
          ref={refs.servicios} 
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
          <ListaServicios 
            servicios={servicios}
            onServicioClick={setPopupServicio}
          />
        </section>

        {/* Horarios */}
        <section 
          ref={refs.horarios} 
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
          <SeccionHorarios horarios={empresaData.horarios} />
        </section>

        {/* Contacto */}
        <section 
          ref={refs.contacto} 
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
          <SeccionContacto contacto={empresaData.contacto} />
        </section>

        {/* Ubicación */}
        <section 
          ref={refs.ubicacion} 
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
          <SeccionUbicacion 
            direccion={empresaData.direccion}
            ubicacion={empresaData.ubicacion}
          />
        </section>
      </div>

      {/* Espacio inferior */}
      <div className="h-6"></div>

      {/* Popup reserva */}
      {popupServicio && (
        <ReservarPopup
          key={`${id}-${popupServicio.id || popupServicio.nombre}`}
          servicio={popupServicio}
          empresa={empresaData}
          onClose={() => setPopupServicio(null)}
        />
      )}
    </div>
  );
}

export default PerfilEmpresaPublico;