// Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/firebaseConfig.js";
import Footer from "../../components/Footer.jsx";
import { XCircle } from "lucide-react";

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

      // 1. ADMINS 
      const adminRef = doc(db, "admins", uid);
      const adminSnap = await getDoc(adminRef);

      if (adminSnap.exists()) {
        navigate("/home-admin");
        return;
      }

      // 2. USUARIOS
      const usuarioRef = doc(db, "usuarios", uid);
      const usuarioSnap = await getDoc(usuarioRef);

      if (usuarioSnap.exists()) {
         const userData = usuarioSnap.data();
         
         // VERIFICAMOS SI ESTÁ BLOQUEADO
         if (userData.bloqueado) {
            await signOut(auth);
            setError("Tu cuenta ha sido bloqueada por un administrador. Por favor, contacta a soporte.");
            return;
         }

         navigate("/home-usuario");
         return;
      }

      // 3. EMPRESAS
      const empresaRef = doc(db, "empresas", uid);
      const empresaSnap = await getDoc(empresaRef);

      if (empresaSnap.exists()) {
        const userData = empresaSnap.data();

        if (userData.rol === "admin") {
           navigate("/home-admin");
           return;
        }

        // VERIFICAMOS SI ESTÁ BLOQUEADO
        if (userData.bloqueado) {
            await signOut(auth);
            setError("El acceso de esta empresa ha sido suspendido por la administración.");
            return;
        }

        if (userData.rol === "empresa" || !userData.rol) {
          navigate("/home-empresa");
          return;
        }
      }

      // 4. CREACIÓN DE NUEVA EMPRESA 
      try {
        const empresaData = {
          nombreEmpresa: "Empresa Nueva",
          email: email,
          rol: "empresa",
          descripcion: "Descripción de la empresa",
          fechaCreacion: new Date(),
          activo: true,
          // Al crearla ta desbloqueada de default
          bloqueado: false, 
          redesSociales: { instagram: "", facebook: "", whatsapp: "" },
          horarios: [ /* ... */ ]
        };
        await setDoc(doc(db, "empresas", uid), empresaData);
        navigate("/home-empresa");
        return;
      } catch (createError) {
        setError(`Error creando perfil: ${createError.message}`);
      }

    } catch (err) {
      // Manejo de errores
      if (err.message === "BLOCK_ACCESS") {
         return;
      }

      switch (err.code) {
        case "auth/user-not-found":
        case "auth/wrong-password":
        case "auth/invalid-credential":
          setError("Correo o contraseña incorrectos.");
          break;
        case "auth/too-many-requests":
          setError("Demasiados intentos. Intenta más tarde.");
          break;
        default:
          setError(`Error: ${err.message}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-image flex flex-col">
      <main className="min-h-screen flex items-center justify-center px-6">
        <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 w-full max-w-md">
          <h2 className="text-3xl font-bold text-center text-indigo-600 mb-8">Iniciar Sesión</h2>

          {/* MENSAJE DE ERROR / BLOQUEO */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 rounded-xl border border-red-200 flex items-start gap-3 animate-in slide-in-from-top-2">
              <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            <input
              type="email"
              placeholder="Correo electrónico"
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
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
      <Footer />
    </div>
  );
}

export default Login;