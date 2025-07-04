import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

function HomeUsuario() {
  const [empresas, setEmpresas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerEmpresas = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "empresas"));
        const listaEmpresas = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEmpresas(listaEmpresas);
      } catch (error) {
        console.error("Error al obtener empresas:", error);
      }
    };

    obtenerEmpresas();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        {/* Título */}
        <h2 className="text-3xl font-bold text-indigo-700 text-center">Empresas Registradas</h2>

        {/* Grid de empresas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {empresas.map((empresa) => (
            <div
              key={empresa.id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition cursor-pointer overflow-hidden"
              onClick={() => navigate(`/empresa/${empresa.id}`)}
            >
              {/* Portada */}
              <div className="h-32 bg-gray-200">
                {empresa.fotoPortada && (
                  <img
                    src={empresa.fotoPortada}
                    alt="Portada"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Foto de perfil */}
              <div className="relative -top-8 px-4 flex items-center gap-4">
                <div className="w-16 h-16 bg-white border-4 border-white rounded-full overflow-hidden shadow-md">
                  {empresa.fotoPerfil ? (
                    <img
                      src={empresa.fotoPerfil}
                      alt="Perfil"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center text-sm text-white">
                      LOGO
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-indigo-700">
                  {empresa.nombre || "Empresa sin nombre"}
                </h3>
              </div>

              {/* Descripción corta */}
              <div className="px-4 pb-4 text-sm text-gray-600">
                {empresa.descripcion?.slice(0, 100) || "Sin descripción disponible."}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomeUsuario;
