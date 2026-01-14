import { useState, useEffect } from "react";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";

function MisDatosUsuario() {
  const [datos, setDatos] = useState({ nombre: "", correo: "" });
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerDatos = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const ref = doc(db, "usuarios", uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setDatos(snap.data());
        setCargando(false);
      }
    };
    obtenerDatos();
  }, []);

  const guardarCambios = async () => {
    const uid = auth.currentUser?.uid;
    const ref = doc(db, "usuarios", uid);
    await updateDoc(ref, datos);
    alert("Datos actualizados correctamente.");
  };

  if (cargando) return <p className="p-6">Cargando...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-indigo-700 mb-6">Mis Datos</h1>
      <div className="bg-white p-6 rounded shadow-md space-y-4">
        <input
          type="text"
          value={datos.nombre}
          onChange={(e) => setDatos({ ...datos, nombre: e.target.value })}
          className="w-full border p-3 rounded"
          placeholder="Nombre"
        />
        <input
          type="email"
          value={datos.correo}
          readOnly
          className="w-full border p-3 rounded bg-gray-100"
          placeholder="Correo"
        />
        <button onClick={guardarCambios} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
          Guardar Cambios
        </button>
      </div>
    </div>
  );
}

export default MisDatosUsuario;
