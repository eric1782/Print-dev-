import React, { useState, useEffect } from "react";
import { auth, db } from "../../firebase/firebaseConfig"; // 'storage' ya no se importa aquí para carga local
import { signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
// Ya no se necesitan 'ref', 'uploadBytes', 'getDownloadURL' para carga local
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

// ¡IMPORTANTE! Reemplaza con tu API Key de Google Maps
const Maps_API_KEY = 'AIzaSyBOHDjSyttXWaTejNB9o-uTMcsx0_AvZNI'; // ¡Esta es tu clave de API real!

function HomeEmpresa() {
  const navigate = useNavigate();
  const [modoEdicion, setModoEdicion] = useState(false);
  const [empresaData, setEmpresaData] = useState(null);
  const [uid, setUid] = useState(null);
  const [direccion, setDireccion] = useState("");
  const [loadingGeocode, setLoadingGeocode] = useState(false);
  const [geocodeError, setGeocodeError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false); // Mantener para el estado de carga (aunque ahora es más rápido)

  // Hook para monitorear el estado de autenticación y cargar datos de la empresa
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid);
        const docRef = doc(db, "empresas", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          
          const normalizedHorarios = data.horarios?.map(h => ({
            ...h,
            rangos: Array.isArray(h.rangos) && h.rangos.length > 0
              ? h.rangos
              : (h.desde || h.hasta) ? [{ horaInicio: h.desde || "", horaFin: h.hasta || "" }] : []
          })) || [];

          const initialUbicacion = data.ubicacion === undefined ? null : data.ubicacion;

          setEmpresaData({ ...data, horarios: normalizedHorarios, ubicacion: initialUbicacion });
          setDireccion(data.direccion || "");
        } else {
          setEmpresaData({
            nombreEmpresa: "",
            descripcion: "",
            fotoPortada: "",
            horarios: [],
            contacto: { instagram: "", facebook: "", telefono: "" },
            servicios: [],
            direccion: "",
            ubicacion: null,
          });
        }
        setLoading(false);
      } else {
        console.log("No hay usuario autenticado, redirigiendo a login.");
        navigate("/login");
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Se elimina el useEffect para mostrar el token de ID, ya no es necesario.

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const geocodeAddress = async (address) => {
    setLoadingGeocode(true);
    setGeocodeError(null);
    try {
      if (!address.trim()) {
        setGeocodeError("La dirección no puede estar vacía.");
        return null;
      }
      const encodedAddress = encodeURIComponent(address);
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${Maps_API_KEY}&region=cl`
      );

      if (response.data.status === 'OK' && response.data.results.length > 0) {
        const { lat, lng } = response.data.results[0].geometry.location;
        return { lat, lng };
      } else if (response.data.status === 'ZERO_RESULTS') {
        setGeocodeError("No se encontró la dirección. Intenta ser más específico.");
        return null;
      } else {
        setGeocodeError(`Error al geocodificar: ${response.data.error_message || response.data.status}`);
        return null;
      }
    } catch (error) {
      console.error("Error al conectar con la API de geocodificación:", error);
      setGeocodeError("Error de red o del servicio de geocodificación.");
      return null;
    } finally {
      setLoadingGeocode(false);
    }
  };

  const handleGuardar = async () => {
    if (!uid) {
      alert("No se pudo obtener el ID de usuario para guardar los cambios.");
      return;
    }

    let nuevaUbicacion = empresaData.ubicacion;
    
    if (modoEdicion && direccion !== (empresaData?.direccion || "") && direccion.trim()) {
      const coords = await geocodeAddress(direccion);
      if (coords) {
        nuevaUbicacion = coords;
      } else {
        alert("No se pudo verificar la dirección. Por favor, corrígela antes de guardar.");
        return;
      }
    } else if (modoEdicion && !direccion.trim()) {
        nuevaUbicacion = null;
    }

    try {
      await setDoc(doc(db, "empresas", uid), {
        ...empresaData,
        nombreEmpresa: empresaData.nombreEmpresa || "",
        direccion,
        ubicacion: nuevaUbicacion,
        horarios: empresaData.horarios.map(h => ({
            dia: h.dia,
            rangos: h.rangos
        })),
        contacto: empresaData.contacto || { instagram: "", facebook: "", telefono: "" },
      }, { merge: true });

      setModoEdicion(false);
      setGeocodeError(null);
      alert("¡Cambios guardados con éxito!");
    } catch (error) {
      console.error("Error al guardar empresa:", error);
      alert("Error al guardar los cambios: " + error.message);
    }
  };

  // --- Funciones para manejar la foto de portada (AHORA LOCAL) ---
  const handleFotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true); // Activa el estado de carga
    try {
      // Crea una URL de objeto para la previsualización local
      const localURL = URL.createObjectURL(file);
      
      // Actualiza el estado local con la URL local
      setEmpresaData((prevData) => ({ ...prevData, fotoPortada: localURL }));
      
      alert("Foto de portada cargada localmente para previsualización.");
    } catch (error) {
      console.error("Error al cargar la imagen localmente:", error);
      alert("Error al cargar la foto de portada localmente: " + error.message);
    } finally {
      setUploadingImage(false); // Desactiva el estado de carga
    }
  };

  // --- Funciones para manejar Horarios ---
  const handleAgregarHorario = () => {
    const nuevo = [...(empresaData.horarios || []), { dia: "Lunes", rangos: [{ horaInicio: "", horaFin: "" }] }];
    setEmpresaData({ ...empresaData, horarios: nuevo });
  };

  const handleEliminarHorario = (index) => {
    const nuevos = empresaData.horarios.filter((_, i) => i !== index);
    setEmpresaData({ ...empresaData, horarios: nuevos });
  };

  const handleActualizarHorario = (index, field, value) => {
    const nuevos = [...empresaData.horarios];
    if (field === "desde" || field === "hasta") { 
      if (!nuevos[index].rangos || nuevos[index].rangos.length === 0) {
        nuevos[index].rangos = [{ horaInicio: "", horaFin: "" }];
      }
      if (field === "desde") nuevos[index].rangos[0].horaInicio = value;
      if (field === "hasta") nuevos[index].rangos[0].horaFin = value;
    } else {
      nuevos[index][field] = value;
    }
    setEmpresaData({ ...empresaData, horarios: nuevos });
  };

  // --- Funciones para manejar Contacto ---
  const handleContactoChange = (field, value) => {
    setEmpresaData((prevData) => ({
      ...prevData,
      contacto: { ...(prevData.contacto || {}), [field]: value },
    }));
  };

  // --- Funciones para manejar Servicios ---
  const handleAgregarServicio = () => {
    const nuevoServicio = {
      id: uuidv4(),
      nombre: "",
      descripcion: "",
      tiempo: "", 
      precio: "",
      icono: "✂️",
      imagen: "",
    };
    setEmpresaData({ ...empresaData, servicios: [...(empresaData.servicios || []), nuevoServicio] });
  };

  const handleActualizarServicio = (index, field, value) => {
    const nuevos = [...empresaData.servicios];
    nuevos[index][field] = value;
    setEmpresaData({ ...empresaData, servicios: nuevos });
  };

  const handleEliminarServicio = (index) => {
    const nuevos = empresaData.servicios.filter((_, i) => i !== index);
    setEmpresaData({ ...empresaData, servicios: nuevos });
  };

  // --- Renderizado Condicional ---
  if (loading || !empresaData) {
    return <p className="text-center mt-10 text-gray-500">Cargando datos de la empresa...</p>;
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      {/* Sección de Portada */}
      <div className="relative h-56 bg-gray-200 rounded-lg overflow-hidden mb-16 shadow-md">
        {empresaData.fotoPortada ? (
          <img src={empresaData.fotoPortada} alt="Portada de la empresa" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
            Cargar foto de portada
          </div>
        )}
        {modoEdicion && (
          <label className="absolute top-4 right-4 bg-white rounded-full p-3 cursor-pointer shadow-lg hover:bg-gray-50 transition">
            {uploadingImage ? 'Cargando...' : '📷'}
            <input 
              type="file" 
              className="hidden" 
              onChange={handleFotoUpload} 
              accept="image/*" 
              disabled={uploadingImage}
            />
          </label>
        )}
      </div>

      {/* Botones de Acción */}
      <div className="flex flex-wrap gap-4 mb-8">
        <button
          onClick={() => {
            if (modoEdicion) handleGuardar();
            else setModoEdicion(true);
          }}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition shadow-md flex items-center justify-center min-w-[150px]"
          disabled={loadingGeocode || uploadingImage}
        >
          {modoEdicion ? (loadingGeocode ? "Verificando Dirección..." : "Guardar Cambios") : "Editar Perfil"}
        </button>

        {uid && (
          <Link
            to={`/empresa/${uid}`}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition shadow-md flex items-center justify-center min-w-[150px]"
          >
            Ver mi Perfil Público
          </Link>
        )}

        <button
          onClick={() => navigate("/home-empresa/agenda")}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition shadow-md flex items-center justify-center min-w-[150px]"
        >
          Ver agenda
        </button>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition shadow-md flex items-center justify-center min-w-[150px]"
        >
          Cerrar sesión
        </button>
      </div>

      {geocodeError && (
          <p className="text-red-600 text-sm mt-2 mb-4 p-2 bg-red-100 rounded border border-red-200">{geocodeError}</p>
      )}

      {/* Descripción de la Empresa */}
      <div className="bg-white rounded-lg shadow p-6 mb-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-3 text-gray-800">Descripción</h2>
        {modoEdicion ? (
          <textarea
            className="w-full border border-gray-300 rounded-md p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
            rows="4"
            value={empresaData.descripcion || ""}
            onChange={(e) => setEmpresaData({ ...empresaData, descripcion: e.target.value })}
            placeholder="Escribe una descripción de tu empresa..."
          />
        ) : (
          <p className="text-gray-700 whitespace-pre-wrap">{empresaData.descripcion || "Sin descripción."}</p>
        )}
      </div>

      {/* Horarios de Atención */}
      <div className="bg-white rounded-lg shadow p-6 mb-6 border border-gray-200">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold text-gray-800">Horarios de Atención</h2>
          {modoEdicion && (
            <button 
              onClick={handleAgregarHorario} 
              className="text-indigo-600 font-semibold flex items-center gap-1 hover:text-indigo-800 transition"
            >
              + Agregar Horario
            </button>
          )}
        </div>
        {empresaData.horarios.length === 0 && <p className="text-gray-600">No hay horarios registrados.</p>}
        {empresaData.horarios.map((h, i) => (
          <div key={i} className="flex flex-wrap items-center gap-3 mb-3 p-2 bg-gray-50 rounded-md border border-gray-100">
            {modoEdicion ? (
              <>
                <select
                  value={h.dia}
                  className="border border-gray-300 p-2 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  onChange={(e) => handleActualizarHorario(i, "dia", e.target.value)}
                >
                  {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"].map((dia) => (
                    <option key={dia} value={dia}>{dia}</option>
                  ))}
                </select>
                <input
                  type="time"
                  value={h.rangos[0]?.horaInicio || ""} 
                  onChange={(e) => handleActualizarHorario(i, "desde", e.target.value)}
                  className="border border-gray-300 p-2 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span>-</span>
                <input
                  type="time"
                  value={h.rangos[0]?.horaFin || ""}
                  onChange={(e) => handleActualizarHorario(i, "hasta", e.target.value)}
                  className="border border-gray-300 p-2 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button 
                  onClick={() => handleEliminarHorario(i)} 
                  className="text-red-600 hover:text-red-800 transition text-xl p-1" 
                  title="Eliminar horario"
                >
                  🗑️
                </button>
              </>
            ) : (
              <p className="text-gray-700">
                🕒 <span className="font-semibold">{h.dia}:</span>{" "}
                {h.rangos.length > 0 ? `${h.rangos[0].horaInicio} - ${h.rangos[0].horaFin}` : "Cerrado"}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Información de Contacto */}
      <div className="bg-white rounded-lg shadow p-6 mb-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-3 text-gray-800">Información de Contacto</h2>
        {modoEdicion ? (
          <div className="space-y-3">
            <input
              placeholder="Instagram (ej. @miempresa)"
              value={empresaData.contacto?.instagram || ""}
              className="w-full border border-gray-300 p-3 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => handleContactoChange("instagram", e.target.value)}
            />
            <input
              placeholder="Facebook (ej. MiEmpresaOficial)"
              value={empresaData.contacto?.facebook || ""}
              className="w-full border border-gray-300 p-3 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => handleContactoChange("facebook", e.target.value)}
            />
            <input
              placeholder="Teléfono (ej. +56912345678)"
              value={empresaData.contacto?.telefono || ""}
              className="w-full border border-gray-300 p-3 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => handleContactoChange("telefono", e.target.value)}
            />
          </div>
        ) : (
          <ul className="text-gray-700 space-y-2">
            <li><strong>Instagram:</strong> {empresaData.contacto?.instagram || "No disponible"}</li>
            <li><strong>Facebook:</strong> {empresaData.contacto?.facebook || "No disponible"}</li>
            <li><strong>Teléfono:</strong> {empresaData.contacto?.telefono || "No disponible"}</li>
          </ul>
        )}
      </div>

      {/* Sección de Servicios */}
      <div className="bg-white rounded-lg shadow p-6 mb-6 border border-gray-200">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold text-gray-800">Nuestros Servicios</h2>
          {modoEdicion && (
            <button 
              onClick={handleAgregarServicio} 
              className="text-indigo-600 font-semibold flex items-center gap-1 hover:text-indigo-800 transition"
            >
              + Agregar Servicio
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {empresaData.servicios.length === 0 && !modoEdicion && <p className="col-span-full text-gray-600">No hay servicios registrados.</p>}
          {empresaData.servicios.map((s, i) => (
            <div key={s.id || i} className="border border-indigo-100 rounded-xl p-4 bg-indigo-50 relative shadow-sm">
              {modoEdicion ? (
                <>
                  <button 
                    onClick={() => handleEliminarServicio(i)} 
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition text-xl"
                    title="Eliminar servicio"
                  >
                    🗑️
                  </button>
                  <label className="block mb-2">
                    <span className="text-gray-600 text-sm">Ícono (Emoji):</span>
                    <input
                      value={s.icono || ""}
                      onChange={(e) => handleActualizarServicio(i, "icono", e.target.value)}
                      className="text-3xl w-full p-2 border border-gray-300 rounded-md bg-white text-center"
                      placeholder="Ej. ✂️"
                    />
                  </label>
                  <label className="block mb-2">
                    <span className="text-gray-600 text-sm">Nombre:</span>
                    <input
                      placeholder="Nombre del servicio"
                      value={s.nombre || ""}
                      onChange={(e) => handleActualizarServicio(i, "nombre", e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </label>
                  <label className="block mb-2">
                    <span className="text-gray-600 text-sm">Duración (min):</span>
                    <input
                      placeholder="Tiempo en minutos"
                      value={s.tiempo || ""}
                      onChange={(e) => handleActualizarServicio(i, "tiempo", e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      type="number"
                    />
                  </label>
                  <label className="block mb-2">
                    <span className="text-gray-600 text-sm">Precio ($):</span>
                    <input
                      placeholder="Precio del servicio"
                      value={s.precio || ""}
                      onChange={(e) => handleActualizarServicio(i, "precio", e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      type="number"
                    />
                  </label>
                   <label className="block mb-2">
                    <span className="text-gray-600 text-sm">Descripción:</span>
                    <textarea
                      placeholder="Breve descripción del servicio"
                      value={s.descripcion || ""}
                      onChange={(e) => handleActualizarServicio(i, "descripcion", e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
                    />
                  </label>
                </>
              ) : (
                <>
                  <div className="text-4xl mb-2">{s.icono || "✨"}</div>
                  <h3 className="font-bold text-lg text-indigo-700">{s.nombre || "Servicio"}</h3>
                  <p className="text-sm text-gray-600">{s.descripcion || "Sin descripción."}</p>
                  <p className="text-sm text-gray-700 mt-2">🕒 {s.tiempo || "N/A"} min</p>
                  <p className="text-base text-indigo-800 font-bold">💲{s.precio || "N/A"}</p>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Dirección y Ubicación */}
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-3 text-gray-800">Dirección y Ubicación</h2>
        {modoEdicion ? (
          <>
            <input
              placeholder="Dirección completa (ej. Av. Siempre Viva 742, Springfield)"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={loadingGeocode}
            />
          </>
        ) : (
          <p className="text-gray-700">{empresaData.direccion || "No disponible"}</p>
        )}

        {empresaData.ubicacion?.lat && empresaData.ubicacion?.lng && (
            <div className="mt-6">
              <p className="text-gray-700 mb-2">Ubicación en el mapa:</p>
              {/* URL CORREGIDA para el iframe de Google Maps Embed API */}
              <iframe
                className="w-full h-64 rounded-lg shadow-md"
                // Usa la API de Maps Embed: https://developers.google.com/maps/documentation/embed/get-started
                // q= para búsqueda de dirección/latlng, key= tu_api_key
                src={`https://www.google.com/maps/embed/v1/place?key=${Maps_API_KEY}&q=${empresaData.ubicacion.lat},${empresaData.ubicacion.lng}`}
                loading="lazy"
                allowFullScreen
                title="mapa de ubicación de la empresa"
              />
            </div>
        )}
        {!modoEdicion && (!empresaData.ubicacion?.lat || !empresaData.ubicacion?.lng) && (
            <p className="text-gray-600 mt-4">Ubicación en el mapa no disponible.</p>
        )}
      </div>
    </div>
  );
}

export default HomeEmpresa;