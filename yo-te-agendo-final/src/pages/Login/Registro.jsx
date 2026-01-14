// Registro.jsx
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/firebaseConfig";
import { Link, useNavigate } from "react-router-dom";

function Registro() {
  const [role, setRole] = useState("usuario");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Campos empresa
  const [nombreEmpresa, setNombreEmpresa] = useState("");
  const [razonSocial, setRazonSocial] = useState("");
  const [rutEmpresa, setRutEmpresa] = useState("");
  const [nombreRepresentante, setNombreRepresentante] = useState("");
  const [usuarioEmpresa, setUsuarioEmpresa] = useState("");
  const [rubro, setRubro] = useState("");
  const [categoria, setCategoria] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      if (role === "empresa") {
        const empresaData = {
          rol: "empresa",
          email,
          nombreEmpresa,
          razonSocial,
          rutEmpresa,
          representanteLegal: nombreRepresentante,
          usuarioEmpresa,
          rubro,
          categoria,
          descripcion: "",
          direccion: "",
          horarios: [],
          contacto: { instagram: "", facebook: "", telefono: "" },
          servicios: [],
          fotoPerfil: "",
          fotoPortada: ""
        };

        await setDoc(doc(db, "empresas", uid), empresaData);
      } else {
        const usuarioData = {
          rol: "usuario",
          email,
          nombre,
        };

        await setDoc(doc(db, "usuarios", uid), usuarioData);
      }

      alert("Registro exitoso");
      navigate("/login");
    } catch (err) {
      console.error("Error de autenticación:", err.code);
      switch (err.code) {
        case "auth/email-already-in-use":
          setError("Este correo ya está registrado.");
          break;
        case "auth/invalid-email":
          setError("El correo electrónico no es válido.");
          break;
        case "auth/weak-password":
          setError("La contraseña debe tener al menos 6 caracteres.");
          break;
        default:
          setError("Error al registrar usuario. Intenta nuevamente.");
      }
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-indigo-600 mb-6">
          Registro {role === "empresa" ? "Empresa" : "Usuario"}
        </h2>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full mb-4 p-3 border rounded">
          <option value="usuario">Usuario</option>
          <option value="empresa">Empresa</option>
        </select>

        {role === "usuario" ? (
          <input type="text" placeholder="Nombre completo" className="w-full mb-4 p-3 border rounded" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        ) : (
          <>
            <input type="text" placeholder="Nombre Empresa" className="w-full mb-4 p-3 border rounded" value={nombreEmpresa} onChange={(e) => setNombreEmpresa(e.target.value)} required />
            <input type="text" placeholder="Razón Social" className="w-full mb-4 p-3 border rounded" value={razonSocial} onChange={(e) => setRazonSocial(e.target.value)} required />
            <input type="text" placeholder="RUT Empresa" className="w-full mb-4 p-3 border rounded" value={rutEmpresa} onChange={(e) => setRutEmpresa(e.target.value)} required />
            <input type="text" placeholder="Representante Legal" className="w-full mb-4 p-3 border rounded" value={nombreRepresentante} onChange={(e) => setNombreRepresentante(e.target.value)} required />
            <input type="text" placeholder="Usuario Empresa" className="w-full mb-4 p-3 border rounded" value={usuarioEmpresa} onChange={(e) => setUsuarioEmpresa(e.target.value)} required />
            <input type="text" placeholder="Rubro" className="w-full mb-4 p-3 border rounded" value={rubro} onChange={(e) => setRubro(e.target.value)} required />
            <input type="text" placeholder="Categoría" className="w-full mb-4 p-3 border rounded" value={categoria} onChange={(e) => setCategoria(e.target.value)} required />
          </>
        )}

        <input type="email" placeholder="Correo electrónico" className="w-full mb-4 p-3 border rounded" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Contraseña" className="w-full mb-6 p-3 border rounded" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
          Registrarse
        </button>

        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-gray-600 hover:text-indigo-600 hover:underline">
            ← Regresar a Inicio
          </Link>
        </div>
      </form>
    </section>
  );
}

export default Registro;
