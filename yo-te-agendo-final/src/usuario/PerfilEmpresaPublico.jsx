import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useEffect, useState } from "react";

function PerfilEmpresaPublico() {
  const { id } = useParams();
  const [empresa, setEmpresa] = useState(null);
  const [seccion, setSeccion] = useState("servicios");

  useEffect(() => {
    const fetchEmpresa = async () => {
      try {
        const docRef = doc(db, "empresas", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setEmpresa(docSnap.data());
        } else {
          console.error("Empresa no encontrada");
        }
      } catch (error) {
        console.error("Error al cargar empresa:", error);
      }
    };

    fetchEmpresa();
  }, [id]);

  if (!empresa) return <p className="text-center mt-10 text-gray-500">Cargando empresa...</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Portada */}
      <div className="relative h-56 sm:h-72 md:h-96 bg-gray-300">
        {empresa.fotoPortada && (
          <img
            src={empresa.fotoPortada}
            alt="Portada"
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute -bottom-10 left-6">
          {empresa.fotoPerfil ? (
            <img
              src={empresa.fotoPerfil}
              alt="Perfil"
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white object-cover"
            />
          ) : (
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-200 rounded-full border-4 border-white flex items-center justify-center text-gray-500 font-bold">
              LOGO
            </div>
          )}
        </div>
      </div>

      {/* Contenido */}
      <div className="mt-16 max-w-5xl mx-auto px-6 pb-12">
        <h1 className="text-2xl sm:text-3xl font-bold text-indigo-700 mb-6">
          {empresa.nombreEmpresa || "Nombre Empresa"}
        </h1>

        {/* Menú de secciones */}
        <div className="flex flex-wrap gap-4 mb-8 border-b pb-2">
          {["servicios", "descripcion", "contacto", "direccion"].map((item) => (
            <button
              key={item}
              onClick={() => setSeccion(item)}
              className={`capitalize text-sm sm:text-base font-medium px-4 py-2 rounded-full ${
                seccion === item
                  ? "bg-indigo-600 text-white"
                  : "bg-indigo-100 text-indigo-600"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Contenido dinámico */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          {seccion === "servicios" && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-indigo-600">Servicios</h2>
              {empresa.servicios?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {empresa.servicios.map((s, i) => (
                    <div key={i} className="bg-indigo-50 p-4 rounded-lg">
                      {s.imagen && (
                        <img src={s.imagen} alt={s.nombre} className="w-full h-32 object-cover rounded mb-2" />
                      )}
                      <h3 className="font-bold text-indigo-700">{s.nombre}</h3>
                      <p className="text-sm text-gray-700">{s.descripcion}</p>
                      <p className="text-sm text-indigo-600 font-medium mt-1">${s.precio}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No hay servicios registrados.</p>
              )}
            </div>
          )}

          {seccion === "descripcion" && (
            <div>
              <h2 className="text-xl font-semibold mb-2 text-indigo-600">Descripción</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{empresa.descripcion || "Sin descripción."}</p>
            </div>
          )}

          {seccion === "contacto" && (
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-indigo-600">Contacto</h2>
              <p><strong>Instagram:</strong> {empresa.contacto?.instagram || "No disponible"}</p>
              <p><strong>Facebook:</strong> {empresa.contacto?.facebook || "No disponible"}</p>
              <p><strong>Teléfono:</strong> {empresa.contacto?.telefono || "No disponible"}</p>
            </div>
          )}

          {seccion === "direccion" && (
            <div>
              <h2 className="text-xl font-semibold mb-2 text-indigo-600">Dirección</h2>
              <p className="text-gray-700">{empresa.direccion || "No disponible"}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PerfilEmpresaPublico;
