import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";

function Registro() {
  const [role, setRole] = useState("usuario");

  // Comunes
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Solo empresa
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

      const userData =
        role === "empresa"
          ? {
              rol: "empresa",
              email,
              nombreEmpresa,
              razonSocial,
              rutEmpresa,
              representanteLegal: nombreRepresentante,
              usuarioEmpresa,
              rubro,
              categoria,
            }
          : {
              rol: "usuario",
              email,
              nombre,
            };

      await setDoc(doc(db, "usuarios", uid), userData);

      alert("Registro exitoso");
      navigate("/login");
    } catch (err) {
      setError(err.message || "Error al registrar usuario");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-indigo-600 mb-6">
          Registro {role === "empresa" ? "Empresa" : "Usuario"}
        </h2>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full mb-4 p-3 border rounded"
        >
          <option value="usuario">Usuario</option>
          <option value="empresa">Empresa</option>
        </select>

        {role === "usuario" ? (
          <>
            <input
              type="text"
              placeholder="Nombre completo"
              className="w-full mb-4 p-3 border rounded"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Nombre Empresa"
              className="w-full mb-4 p-3 border rounded"
              value={nombreEmpresa}
              onChange={(e) => setNombreEmpresa(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Razón Social"
              className="w-full mb-4 p-3 border rounded"
              value={razonSocial}
              onChange={(e) => setRazonSocial(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="RUT Empresa"
              className="w-full mb-4 p-3 border rounded"
              value={rutEmpresa}
              onChange={(e) => setRutEmpresa(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Representante Legal"
              className="w-full mb-4 p-3 border rounded"
              value={nombreRepresentante}
              onChange={(e) => setNombreRepresentante(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Usuario Empresa"
              className="w-full mb-4 p-3 border rounded"
              value={usuarioEmpresa}
              onChange={(e) => setUsuarioEmpresa(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Rubro"
              className="w-full mb-4 p-3 border rounded"
              value={rubro}
              onChange={(e) => setRubro(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Categoría"
              className="w-full mb-4 p-3 border rounded"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              required
            />
          </>
        )}

        <input
          type="email"
          placeholder="Correo electrónico"
          className="w-full mb-4 p-3 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          className="w-full mb-6 p-3 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
          Registrarse
        </button>
      </form>
    </section>
  );
}

export default Registro;

