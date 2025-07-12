// src/usuario/PerfilEmpresaPublico.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import ReservarPopup from "../components/ReservarPopup";

function PerfilEmpresaPublico() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [empresaData, setEmpresaData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [popupServicio, setPopupServicio] = useState(null);

  useEffect(() => {
    const fetchEmpresaData = async () => {
      try {
        const docRef = doc(db, "empresas", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          const normalizedHorarios = data.horarios?.map(h => ({
            ...h,
            rangos: Array.isArray(h.rangos) && h.rangos.length > 0
              ? h.rangos
              : (h.desde || h.hasta)
                ? [{ horaInicio: h.desde || "", horaFin: h.hasta || "" }]
                : []
          })) || [];

          const servicesWithIds = data.servicios?.map((service, index) => ({
            ...service,
            id: service.id || `temp-service-${index}`
          })) || [];

          setEmpresaData({
            ...data,
            horarios: normalizedHorarios,
            servicios: servicesWithIds,
            id: docSnap.id
          });
        } else {
          setError("Empresa no encontrada.");
        }
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setError("Error al cargar información.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmpresaData();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Cargando empresa...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!empresaData) return null;

  return (
    <div className="max-w-5xl mx-auto p-4">
      {/* Botón Volver */}
      <div className="mb-4">
        <button
          onClick={() => navigate("/home-usuario")}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
        >
          ← Volver al inicio
        </button>
      </div>

      {/* Foto de portada */}
      <div className="relative h-64 bg-gray-200 rounded-lg overflow-hidden mb-8 shadow-md">
        {empresaData.fotoPortada ? (
          <img
            src={empresaData.fotoPortada}
            alt="Portada"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            Sin portada
          </div>
        )}
        <div className="absolute bottom-4 left-4 text-white text-3xl font-bold drop-shadow-md">
          {empresaData.nombreEmpresa}
        </div>
      </div>

      {/* Descripción */}
      <section className="bg-white rounded-lg shadow p-6 mb-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-indigo-700 mb-2">Sobre Nosotros</h2>
        <p className="text-gray-700">{empresaData.descripcion || "Sin descripción."}</p>
      </section>

      {/* Horarios */}
      <section className="bg-white rounded-lg shadow p-6 mb-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-indigo-700 mb-2">Horarios</h2>
        {empresaData.horarios?.length > 0 ? (
          <ul className="text-gray-800 space-y-1">
            {empresaData.horarios.map((h, idx) => (
              <li key={idx}>
                <strong>{h.dia}:</strong>{" "}
                {h.rangos.length > 0
                  ? h.rangos.map((r, i) => (
                      <span key={i}>
                        {r.horaInicio} - {r.horaFin}
                        {i < h.rangos.length - 1 ? ", " : ""}
                      </span>
                    ))
                  : "Cerrado"}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">Sin horarios disponibles.</p>
        )}
      </section>

      {/* Servicios */}
      <section className="bg-white rounded-lg shadow p-6 mb-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-indigo-700 mb-2">Servicios</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {empresaData.servicios.map((serv) => (
            <div
              key={serv.id}
              className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="text-4xl mb-2">{serv.icono || "🔧"}</div>
                <h3 className="text-lg font-bold text-indigo-700">{serv.nombre}</h3>
                <p className="text-gray-600 text-sm">{serv.descripcion}</p>
                <p className="text-gray-700 mt-1">🕒 {serv.tiempo} min</p>
                <p className="text-indigo-800 font-bold">💲{serv.precio}</p>
              </div>
              <button
                onClick={() => setPopupServicio(serv)}
                className="mt-4 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded transition"
              >
                Reservar Servicio
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Contacto */}
      <section className="bg-white rounded-lg shadow p-6 mb-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-indigo-700 mb-2">Contacto</h2>
        <ul className="text-gray-700 space-y-1">
          <li><strong>Instagram:</strong> {empresaData.contacto?.instagram || "No disponible"}</li>
          <li><strong>Facebook:</strong> {empresaData.contacto?.facebook || "No disponible"}</li>
          <li><strong>Teléfono:</strong> {empresaData.contacto?.telefono || "No disponible"}</li>
        </ul>
      </section>

      {/* Dirección y mapa */}
      <section className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-indigo-700 mb-2">Ubicación</h2>
        <p className="text-gray-700 mb-4">{empresaData.direccion || "No disponible"}</p>
        {empresaData.ubicacion?.lat && empresaData.ubicacion?.lng ? (
          <iframe
            className="w-full h-64 rounded shadow"
            src={`https://maps.google.com/maps?q=${empresaData.ubicacion.lat},${empresaData.ubicacion.lng}&hl=es&z=16&output=embed`}
            loading="lazy"
            allowFullScreen
            title="Mapa ubicación"
          />
        ) : (
          <p className="text-gray-500">No hay ubicación geográfica disponible.</p>
        )}
      </section>

      {/* Popup reserva */}
      {popupServicio && (
        <ReservarPopup
          servicio={popupServicio}
          empresa={empresaData}
          onClose={() => setPopupServicio(null)}
        />
      )}
    </div>
  );
}

export default PerfilEmpresaPublico;
