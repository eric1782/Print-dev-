// Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/firebaseConfig.js";
import Footer from "../../components/Footer.jsx";

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

      // Buscar primero en 'usuarios'
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
        if (userData.rol === "empresa" || userData.rol === "admin" || !userData.rol) {
          navigate("/home-empresa");
          return;
        }
      }

      // Si no se encuentra el usuario, crear datos básicos
      try {
        const empresaData = {
          nombreEmpresa: "Empresa Nueva",
          email: email,
          rol: "empresa",
          descripcion: "Descripción de la empresa",
          telefono: "",
          direccion: "",
          fechaCreacion: new Date(),
          activo: true,
          redesSociales: { instagram: "", facebook: "", whatsapp: "" },
          horarios: [
            { dia: "Lunes", rangos: [{ horaInicio: "09:00", horaFin: "18:00" }] },
            { dia: "Martes", rangos: [{ horaInicio: "09:00", horaFin: "18:00" }] },
            { dia: "Miércoles", rangos: [{ horaInicio: "09:00", horaFin: "18:00" }] },
            { dia: "Jueves", rangos: [{ horaInicio: "09:00", horaFin: "18:00" }] },
            { dia: "Viernes", rangos: [{ horaInicio: "09:00", horaFin: "18:00" }] },
            { dia: "Sábado", rangos: [{ horaInicio: "10:00", horaFin: "14:00" }] },
            { dia: "Domingo", rangos: [] }
          ]
        };

        const docRef = doc(db, "empresas", uid);
        await setDoc(docRef, empresaData);
        navigate("/home-empresa");
        return;
      } catch (createError) {
        setError(`Error creando perfil: ${createError.message}`);
      }
    } catch (err) {
      switch (err.code) {
        case "auth/user-not-found":
          setError("El usuario no existe.");
          break;
        case "auth/wrong-password":
        case "auth/invalid-credential":
          setError("La contraseña es incorrecta.");
          break;
        case "auth/invalid-email":
          setError("El correo electrónico no es válido.");
          break;
        case "auth/too-many-requests":
          setError("Demasiados intentos fallidos. Intenta nuevamente más tarde.");
          break;
        case "permission-denied":
          setError("Error de permisos. Verifica las reglas de Firebase Firestore.");
          break;
        case "unavailable":
          setError("Servicio no disponible. Verifica tu conexión a internet.");
          break;
        default:
          setError(`Error al iniciar sesión: ${err.message}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-image flex flex-col">
      {/* Contenido principal - Ocupa toda la pantalla */}
      <main className="min-h-screen flex items-center justify-center px-6">
        <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 w-full max-w-md">
          <h2 className="text-3xl font-bold text-center text-indigo-600 mb-8">Iniciar Sesión</h2>

          {error && <p className="text-red-600 text-sm mb-6 p-3 bg-red-50 rounded-lg border border-red-200">{error}</p>}

          <div className="space-y-6">
            <input
              type="email"
              placeholder="Correo electrónico"
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Contraseña"
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-white text-indigo-600 font-bold py-4 px-8 rounded-xl shadow-lg hover:bg-indigo-50 transition-all duration-300 transform hover:scale-105 border-2 border-indigo-600 mt-8"
          >
            Ingresar
          </button>

          <div className="text-center mt-6">
            <Link to="/registro" className="text-indigo-600 hover:text-indigo-800 font-medium transition">
              ¿No tienes cuenta? Regístrate aquí
            </Link>
          </div>

          <div className="text-center mt-4">
            <Link to="/" className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline transition">
              ← Regresar a Inicio
            </Link>
          </div>
        </form>
      </main>

      {/* Footer - Solo aparece al hacer scroll */}
      <Footer />
    </div>
  );
}

export default Login;
