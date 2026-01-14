// src/usuario/Empresas.jsx
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

import { useNavigate } from "react-router-dom";

function Empresas() {
  const [empresas, setEmpresas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmpresas = async () => {
      const snapshot = await getDocs(collection(db, "empresas"));
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEmpresas(lista);
    };
    fetchEmpresas();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Empresas registradas</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {empresas.map((empresa) => (
          <div
            key={empresa.id}
            onClick={() => navigate(`/perfil-empresa/${empresa.id}`)}
            className="cursor-pointer border rounded shadow hover:shadow-lg transition"
          >
            <div className="h-40 overflow-hidden bg-gray-200">
              {empresa.fotoPortada && (
                <img src={empresa.fotoPortada} alt="Portada" className="w-full h-full object-cover" />
              )}
            </div>
            <div className="p-4 flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-white border">
                {empresa.fotoPerfil && (
                  <img src={empresa.fotoPerfil} alt="Perfil" className="w-full h-full object-cover" />
                )}
              </div>
              <div>
                <p className="font-bold text-lg">{empresa.nombreEmpresa || "Empresa sin nombre"}</p>
                <p className="text-sm text-gray-600">{empresa.descripcion?.slice(0, 50) || "Sin descripción"}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Empresas;
