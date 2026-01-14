import React from "react";

function MapaUbicacion({ lat, lng, Maps_API_KEY }) { // Agregado Maps_API_KEY como prop
  // CORRECCIÓN DE LA URL: Utiliza la API de Google Maps Embed con tu clave
  // Asegúrate de que Maps_API_KEY se pasa correctamente desde el componente padre
  const src = `https://www.google.com/maps/embed/v1/place?key=${Maps_API_KEY}&q=${lat},${lng}`;

  return (
    <div className="w-full h-64 rounded overflow-hidden">
      <iframe
        title="Ubicación de la empresa en el mapa" // Título más descriptivo para accesibilidad
        width="100%"
        height="100%"
        frameBorder="0"
        style={{ border: 0 }}
        src={src}
        allowFullScreen
        loading="lazy" // Carga diferida para mejor rendimiento
      ></iframe>
    </div>
  );
}

export default MapaUbicacion;
