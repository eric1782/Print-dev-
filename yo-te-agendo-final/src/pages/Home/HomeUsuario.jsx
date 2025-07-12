import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import NavbarUsuario from "../../components/NavbarUsuario";

function HomeUsuario() {
  const [empresas, setEmpresas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerEmpresas = async () => {
      try {
        const snapshot = await getDocs(collection(db, "empresas"));
        const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setEmpresas(lista);
      } catch (error) {
        console.error("Error al obtener empresas:", error);
        alert("Ocurrió un error al cargar las empresas.");
      } finally {
        setLoading(false);
      }
    };

    obtenerEmpresas();
  }, []);

  const filtrarEmpresas = empresas.filter((empresa) => {
    const coincideBusqueda = empresa.nombreEmpresa?.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = categoriaSeleccionada
      ? empresa.categoria?.toLowerCase() === categoriaSeleccionada.toLowerCase()
      : true;
    return coincideBusqueda && coincideCategoria;
  });

  const categorias = [
    { nombre: "Peluquería", icono: "💇‍♀️" },
    { nombre: "Salón de Belleza", icono: "💅" },
    { nombre: "Manicure", icono: "💖" },
    { nombre: "Spa", icono: "🧖‍♀️" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 pb-10">
      <NavbarUsuario />

      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-indigo-700 text-center py-10">
          Empresas registradas
        </h2>

        <input
          type="text"
          placeholder="Buscar empresa..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full mb-6 p-3 rounded-lg border border-gray-300"
        />

        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {categorias.map((cat) => (
            <button
              key={cat.nombre}
              onClick={() => setCategoriaSeleccionada(cat.nombre)}
              className={`px-4 py-2 rounded-full text-sm font-medium border ${
                categoriaSeleccionada === cat.nombre
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-indigo-700 border-indigo-300"
              }`}
              aria-pressed={categoriaSeleccionada === cat.nombre}
            >
              {cat.icono} {cat.nombre}
            </button>
          ))}
          {categoriaSeleccionada && (
            <button
              onClick={() => setCategoriaSeleccionada("")}
              className="px-4 py-2 rounded-full text-sm font-medium bg-red-100 text-red-700 border border-red-300"
            >
              Limpiar filtro
            </button>
          )}
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Cargando empresas...</p>
        ) : filtrarEmpresas.length === 0 ? (
          <p className="text-center text-gray-500">No se encontraron empresas.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filtrarEmpresas.map((empresa) => (
              <div
                key={empresa.id}
                onClick={() => navigate(`/empresa/${empresa.id}`)}
                className="cursor-pointer bg-white rounded-xl shadow hover:shadow-lg transition p-4"
              >
                {empresa.fotoPortada ? (
                  <img
                    src={empresa.fotoPortada}
                    alt={`Portada de ${empresa.nombreEmpresa}`}
                    className="h-32 w-full object-cover rounded-t-lg"
                  />
                ) : (
                  <div className="h-32 w-full bg-gray-200 flex items-center justify-center rounded-t-lg text-gray-500">
                    Sin imagen de portada
                  </div>
                )}

                <div className="flex items-center mt-4 gap-4">
                  {empresa.fotoPerfil ? (
                    <img
                      src={empresa.fotoPerfil}
                      alt={`Perfil de ${empresa.nombreEmpresa}`}
                      className="w-16 h-16 rounded-full border-2 border-white object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold">
                      LOGO
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-indigo-800">
                      {empresa.nombreEmpresa || "Nombre Empresa"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {empresa.direccion || "Dirección no disponible"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <h3 className="text-xl font-bold text-indigo-700 mt-12 mb-4">Recomendados para ti</h3>
        <div className="bg-white p-6 rounded-lg shadow mb-10 text-gray-500 text-center">
          Próximamente recomendaciones personalizadas...
        </div>

        <h3 className="text-xl font-bold text-indigo-700 mb-4">Historial de Citas</h3>
        <div className="bg-white p-6 rounded-lg shadow text-gray-500 text-center">
          Aquí verás tus citas anteriores cuando agendes una.
        </div>
      </div>
    </div>
  );
}

export default HomeUsuario;
