import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebaseConfig"; // Ajusta esta ruta si tu carpeta firebase está en src/firebase
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import NavbarAdmin from "../../components/PaginaAdmin/NavbarAdmin"; // Ruta ajustada
import { Edit, Ban, CheckCircle, Search, Save, X } from "lucide-react";

function HomeAdmin() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para búsqueda y edición
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  // ... imports

  // Cargar datos
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Cargar Usuarios
        const usersSnapshot = await getDocs(collection(db, "usuarios"));
        setUsers(usersSnapshot.docs.map(d => ({ id: d.id, ...d.data() })));

        // 2. Cargar Empresas (Ya no filtramos por rol, traemos todas las empresas reales)
        const companiesSnapshot = await getDocs(collection(db, "empresas"));
        setCompanies(companiesSnapshot.docs.map(d => ({ id: d.id, ...d.data() })));

        // 3. Cargar Admins (Desde su PROPIA colección)
        const adminsSnapshot = await getDocs(collection(db, "admins"));
        setAdmins(adminsSnapshot.docs.map(d => ({ id: d.id, ...d.data() })));

      } catch (error) {
        console.error("Error cargando datos:", error);
      }
      setLoading(false);
    };
    fetchData();
  }, []);
  
  // ... resto del código

  // Función para bloquear/desbloquear
  const toggleBlock = async (collectionName, id, currentStatus) => {
    try {
      const ref = doc(db, collectionName, id);
      await updateDoc(ref, { bloqueado: !currentStatus });
      
      // Actualizar estado local
      if (collectionName === "usuarios") {
        setUsers(users.map(u => u.id === id ? { ...u, bloqueado: !currentStatus } : u));
      } else {
        setCompanies(companies.map(c => c.id === id ? { ...c, bloqueado: !currentStatus } : c));
      }
    } catch (error) {
      alert("Error al actualizar estado: " + error.message);
    }
  };

  // Iniciar edición
  const startEdit = (item) => {
    setEditingId(item.id);
    setEditForm({ ...item });
  };

  // Guardar edición (Solo empresas por ahora funcional)
  const saveEdit = async (collectionName) => {
    try {
      const ref = doc(db, collectionName, editingId);
      // Solo actualizamos campos permitidos
      const dataToUpdate = {
        nombreEmpresa: editForm.nombreEmpresa,
        descripcion: editForm.descripcion
      };
      
      await updateDoc(ref, dataToUpdate);

      // Actualizar local
      setCompanies(companies.map(c => c.id === editingId ? { ...c, ...dataToUpdate } : c));
      setEditingId(null);
    } catch (error) {
      alert("Error al guardar: " + error.message);
    }
  };

  // Renderizado de Tablas
  const renderTable = (data, type) => {
    const filteredData = data.filter(item => {
        const term = searchTerm.toLowerCase();
        // Intentamos buscar por varios campos posibles
        const name = (item.nombreEmpresa || item.nombre || item.email || "").toLowerCase();
        return name.includes(term);
    });

    return (
      <div className="bg-white/80 backdrop-blur rounded-2xl shadow-lg border border-white/40 overflow-hidden">
        {/* Barra de búsqueda */}
        <div className="p-4 border-b border-gray-100 flex items-center gap-2">
            <Search className="text-gray-400" size={20}/>
            <input 
                type="text" 
                placeholder="Buscar por nombre o correo..." 
                className="bg-transparent outline-none w-full text-gray-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-indigo-50 text-indigo-700">
              <tr>
                <th className="p-4 font-bold">Nombre / Email</th>
                <th className="p-4 font-bold">Estado</th>
                <th className="p-4 font-bold text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-indigo-50/30 transition">
                  <td className="p-4">
                    {/* Modo Edición para Empresas */}
                    {editingId === item.id && type === 'empresas' ? (
                        <div className="flex flex-col gap-2">
                            <input 
                                className="border rounded p-1 text-sm" 
                                value={editForm.nombreEmpresa || ''} 
                                onChange={e => setEditForm({...editForm, nombreEmpresa: e.target.value})}
                                placeholder="Nombre Empresa"
                            />
                            <textarea 
                                className="border rounded p-1 text-sm" 
                                value={editForm.descripcion || ''} 
                                onChange={e => setEditForm({...editForm, descripcion: e.target.value})}
                                placeholder="Descripción"
                            />
                        </div>
                    ) : (
                        <div>
                            <div className="font-bold text-gray-800">
                                {item.nombreEmpresa || item.nombre || "Sin Nombre"}
                            </div>
                            <div className="text-sm text-gray-500">{item.email}</div>
                            {item.descripcion && <div className="text-xs text-gray-400 mt-1 truncate max-w-xs">{item.descripcion}</div>}
                        </div>
                    )}
                  </td>
                  
                  <td className="p-4">
                    {item.bloqueado ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Bloqueado
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Activo
                      </span>
                    )}
                  </td>

                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                        {type === 'admins' ? (
                            <span className="text-xs text-gray-400 italic">Solo lectura</span>
                        ) : (
                            <>
                                {/* Botones Edición */}
                                {editingId === item.id ? (
                                    <>
                                        <button onClick={() => saveEdit('empresas')} className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600" title="Guardar">
                                            <Save size={16} />
                                        </button>
                                        <button onClick={() => setEditingId(null)} className="p-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500" title="Cancelar">
                                            <X size={16} />
                                        </button>
                                    </>
                                ) : (
                                    <button 
                                        onClick={() => {
                                            if(type === 'empresas') startEdit(item);
                                            // Si es usuario, no hace nada visualmente como pedido
                                        }} 
                                        className={`p-2 rounded-lg transition ${type === 'usuarios' ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'}`}
                                        title={type === 'usuarios' ? "Edición no disponible" : "Editar"}
                                    >
                                        <Edit size={16} />
                                    </button>
                                )}

                                {/* Botón Bloqueo */}
                                <button 
                                    onClick={() => toggleBlock(type === 'usuarios' ? 'usuarios' : 'empresas', item.id, item.bloqueado)}
                                    className={`p-2 rounded-lg text-white transition ${item.bloqueado ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
                                    title={item.bloqueado ? "Desbloquear" : "Bloquear"}
                                >
                                    {item.bloqueado ? <CheckCircle size={16} /> : <Ban size={16} />}
                                </button>
                            </>
                        )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                    <td colSpan="3" className="p-8 text-center text-gray-500">No se encontraron resultados</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-indigo-600 font-bold">Cargando panel de administración...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-200 via-purple-100 to-pink-100">
      <NavbarAdmin activeTab={activeTab} setActiveTab={(tab) => { setActiveTab(tab); setSearchTerm(""); }} />

      <div className="max-w-7xl mx-auto px-4 pb-8">
        
        {/* VISTA DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in zoom-in duration-300">
            {[
              { label: "Empresas Registradas", count: companies.length, color: "text-blue-600", bg: "bg-blue-50" },
              { label: "Usuarios Registrados", count: users.length, color: "text-purple-600", bg: "bg-purple-50" },
              { label: "Administradores", count: admins.length, color: "text-pink-600", bg: "bg-pink-50" },
            ].map((stat, idx) => (
              <div key={idx} className="bg-white/90 backdrop-blur rounded-2xl shadow-lg border border-white/40 p-6 flex flex-col items-center justify-center">
                <div className={`text-4xl font-bold ${stat.color} mb-2`}>{stat.count}</div>
                <div className={`text-sm font-semibold uppercase tracking-wide px-3 py-1 rounded-full ${stat.bg} ${stat.color}`}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* VISTAS DE LISTAS */}
        {activeTab === "empresas" && (
            <div className="animate-in slide-in-from-bottom-4 duration-300">
                <h2 className="text-xl font-bold text-indigo-900 mb-4">Gestión de Empresas</h2>
                {renderTable(companies, 'empresas')}
            </div>
        )}

        {activeTab === "usuarios" && (
            <div className="animate-in slide-in-from-bottom-4 duration-300">
                <h2 className="text-xl font-bold text-indigo-900 mb-4">Gestión de Usuarios</h2>
                {renderTable(users, 'usuarios')}
            </div>
        )}

        {activeTab === "admins" && (
            <div className="animate-in slide-in-from-bottom-4 duration-300">
                <h2 className="text-xl font-bold text-indigo-900 mb-4">Listado de Administradores</h2>
                {renderTable(admins, 'admins')}
            </div>
        )}

      </div>
    </div>
  );
}

export default HomeAdmin;