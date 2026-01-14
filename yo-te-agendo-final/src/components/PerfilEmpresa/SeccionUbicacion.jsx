import React from 'react';

/**
 * Componente para mostrar la ubicación de la empresa
 */
const SeccionUbicacion = ({ direccion, ubicacion }) => {
  return (
    <>
      <p className="text-gray-600 mb-4 text-sm">{direccion || "Dirección no disponible"}</p>
      {ubicacion?.lat && ubicacion?.lng ? (
        <div className="rounded-xl overflow-hidden border border-gray-100">
          <iframe
            className="w-full h-40 sm:h-48"
            src={`https://maps.google.com/maps?q=${ubicacion.lat},${ubicacion.lng}&hl=es&z=16&output=embed`}
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
    </>
  );
};

export default SeccionUbicacion;
