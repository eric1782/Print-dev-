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

      // Primero buscar en 'usuarios'
      let docRef = doc(db, "usuarios", uid);
      let docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        if (userData.rol === "usuario") {
          navigate("/home-usuario");
          return;
        }
      }

      // Si no está en 'usuarios', buscar en 'empresas'
      docRef = doc(db, "empresas", uid);
      docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        if (userData.rol === "empresa" || userData.rol === "admin") {
          navigate("/home-empresa");
          return;
        }
      }

      setError("No se encontró información del usuario en la base de datos.");

    } catch (err) {
      console.error("Error de Firebase:", err.code, err.message);
      const errorCode = err.code;

      switch (errorCode) {
        case "auth/user-not-found":
          setError("El usuario no existe.");
          break;
        case "auth/wrong-password":
          setError("La contraseña es incorrecta.");
          break;
        case "auth/invalid-email":
          setError("El correo electrónico no es válido.");
          break;
        case "auth/too-many-requests":
          setError("Demasiados intentos fallidos. Intenta nuevamente más tarde.");
          break;
        default:
          setError("Ocurrió un error al iniciar sesión. Intenta de nuevo.");
      }
    }
  };

  return (
    <section
      data-aos="fade-up"
      className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6"
      id="hero"
    >
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

        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-gray-600 hover:text-indigo-600 hover:underline">
            ← Regresar a Inicio
          </Link>
        </div>
      </form>
    </section>
  );
}

export default Login;
