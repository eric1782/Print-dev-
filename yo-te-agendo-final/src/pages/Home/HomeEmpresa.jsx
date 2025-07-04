import React, { useState, useEffect } from "react";
import { auth, db } from "../../firebase/firebaseConfig";
import { signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function HomeEmpresa() {
  const navigate = useNavigate();
  const [modoEdicion, setModoEdicion] = useState(false);
  const [direccion, setDireccion] = useState("");
  const [empresaData, setEmpresaData] = useState(null);
  const [uid, setUid] = useState(null);

  useEffect(() => {
    const fetchEmpresa = async () => {
      const user = auth.currentUser;
      if (!user) return;
      setUid(user.uid);
      const docRef = doc(db, "empresas", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const horarios = Array.isArray(data.horarios) ? data.horarios : [];
        setEmpresaData({ ...data, horarios });
        setDireccion(data.direccion || "");
      } else {
        const defaultData = {
          fotoPerfil: null,
          fotoPortada: null,
          horarios: [],
          descripcion: "",
          contacto: {
            instagram: "",
            facebook: "",
            telefono: "",
          },
          servicios: [],
          direccion: "",
        };
        await setDoc(docRef, defaultData);
        setEmpresaData(defaultData);
      }
    };
    fetchEmpresa();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const handleGuardar = async () => {
    if (!uid) return;
    try {
      await setDoc(doc(db, "empresas", uid), {
        ...empresaData,
        direccion,
      });
      setModoEdicion(false);
    } catch (error) {
      console.error("Error al guardar en Firestore:", error);
    }
  };

  const handleFotoUpload = (e, tipo) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setEmpresaData({ ...empresaData, [tipo]: url });
  };

  const handleChange = (field, value) => {
    setEmpresaData({ ...empresaData, [field]: value });
  };

  const handleContactoChange = (field, value) => {
    setEmpresaData({
      ...empresaData,
      contacto: { ...empresaData.contacto, [field]: value },
    });
  };

  if (!empresaData) return <p className="text-center p-4">Cargando datos...</p>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="relative h-56 bg-gray-200 rounded-lg overflow-hidden">
        {empresaData.fotoPortada && (
          <img src={empresaData.fotoPortada} alt="Portada" className="w-full h-full object-cover" />
        )}
        {modoEdicion && (
          <label className="absolute top-2 right-2 bg-white rounded-full p-2 cursor-pointer shadow">
            📷
            <input type="file" className="hidden" onChange={(e) => handleFotoUpload(e, "fotoPortada")} />
          </label>
        )}
        <div className="absolute bottom-[-30px] left-4 w-24 h-24 bg-white rounded-full overflow-hidden border-4 border-white">
          {empresaData.fotoPerfil && (
            <img src={empresaData.fotoPerfil} alt="Perfil" className="w-full h-full object-cover" />
          )}
          {modoEdicion && (
            <label className="absolute bottom-0 right-0 bg-indigo-500 text-white rounded-full p-1 text-xs cursor-pointer">
              +<input type="file" className="hidden" onChange={(e) => handleFotoUpload(e, "fotoPerfil")} />
            </label>
          )}
        </div>
      </div>

      <div className="mt-16 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-700">Mi Negocio</h1>
        <div className="flex gap-4">
          <button
            onClick={() => {
              if (modoEdicion) handleGuardar();
              else setModoEdicion(true);
            }}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            {modoEdicion ? "Guardar Cambios" : "Editar Perfil"}
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-2">HORARIOS</h2>
          {modoEdicion ? (
            empresaData.horarios.map((h, i) => (
              <input
                key={i}
                type="text"
                className="w-full mb-2 border rounded p-2"
                value={empresaData.horarios[i]}
                onChange={(e) => {
                  const nuevos = [...empresaData.horarios];
                  nuevos[i] = e.target.value;
                  setEmpresaData({ ...empresaData, horarios: nuevos });
                }}
              />
            ))
          ) : (
            empresaData.horarios.map((h, i) => <p key={i}>🕒 {h}</p>)
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-2">DESCRIPCIÓN</h2>
          {modoEdicion ? (
            <textarea
              className="w-full border rounded p-2"
              rows="4"
              value={empresaData.descripcion}
              onChange={(e) => handleChange("descripcion", e.target.value)}
            />
          ) : (
            <p className="text-gray-700">{empresaData.descripcion || "Sin descripción"}</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-2">CONTACTO</h2>
          {modoEdicion ? (
            <>
              <input
                type="text"
                placeholder="Instagram"
                value={empresaData.contacto.instagram}
                className="w-full border p-2 mb-2"
                onChange={(e) => handleContactoChange("instagram", e.target.value)}
              />
              <input
                type="text"
                placeholder="Facebook"
                value={empresaData.contacto.facebook}
                className="w-full border p-2 mb-2"
                onChange={(e) => handleContactoChange("facebook", e.target.value)}
              />
              <input
                type="text"
                placeholder="Teléfono"
                value={empresaData.contacto.telefono}
                className="w-full border p-2"
                onChange={(e) => handleContactoChange("telefono", e.target.value)}
              />
            </>
          ) : (
            <ul>
              <li>{empresaData.contacto.instagram}</li>
              <li>{empresaData.contacto.facebook}</li>
              <li>{empresaData.contacto.telefono}</li>
            </ul>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-4 col-span-1 md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">SERVICIOS</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {empresaData.servicios.map((serv, i) => (
              <div key={i} className="bg-gray-50 border rounded p-3 text-center">
                <div className="text-4xl">💈</div>
                <p className="text-sm mt-2">{serv.nombre}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4 mt-8">
        <h2 className="text-lg font-semibold mb-2">Dirección</h2>
        <input
          type="text"
          placeholder="Dirección exacta"
          className="w-full border rounded p-2 mb-2"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
        />
        {direccion && (
          <iframe
            title="Mapa"
            className="w-full h-64 rounded"
            src={`https://www.google.com/maps?q=${encodeURIComponent(direccion)}&output=embed`}
            allowFullScreen
            loading="lazy"
          />
        )}
      </div>
    </div>
  );
}

export default HomeEmpresa;
