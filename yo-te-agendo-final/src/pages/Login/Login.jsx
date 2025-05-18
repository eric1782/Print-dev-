import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/firebaseConfig.js";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      const docRef = doc(db, "usuarios", uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        setError("No se encontró información del usuario en la base de datos.");
        return;
      }

      const userData = docSnap.data();

      if (userData.rol === "usuario") {
        navigate("/home-usuario");
      } else if (userData.rol === "empresa") {
        navigate("/home-empresa");
      } else {
        setError("Rol desconocido. Contacta al administrador.");
      }

    } catch (err) {
      setError(err.message || "Credenciales inválidas o error de conexión.");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-indigo-600 mb-6">Iniciar Sesión</h2>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <input
          type="email"
          placeholder="Correo"
          className="w-full mb-4 p-3 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          className="w-full mb-4 p-3 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
          Ingresar
        </button>

        <div className="text-center mt-4">
          <Link to="/registro" className="text-indigo-600 hover:underline">
            ¿No tienes cuenta? Regístrate aquí
          </Link>
        </div>
      </form>
    </section>
  );
}

export default Login;

