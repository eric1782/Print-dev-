// Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/firebaseConfig.js";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Función para crear cuenta de prueba completa
  const crearCuentaPrueba = async () => {
    try {
      console.log("🧪 Creando cuenta de prueba...");
      setError("");
      
      const testEmail = "test@empresa.com";
      const testPassword = "123456";
      
      const { createUserWithEmailAndPassword } = await import("firebase/auth");
      
      const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
      const uid = userCredential.user.uid;
      
      console.log("✅ Cuenta creada, UID:", uid);
      
      await crearDatosPrueba(uid);
      
      console.log("🏠 Redirigiendo a home-empresa");
      navigate("/home-empresa");
      
    } catch (error) {
      console.error("❌ Error creando cuenta de prueba:", error);
      if (error.code === 'auth/email-already-in-use') {
        // Si la cuenta ya existe, intentar hacer login
        setEmail("test@empresa.com");
        setPassword("123456");
        setError("Cuenta de prueba ya existe. Haz clic en 'Usar Datos de Prueba' e 'Ingresar'.");
      } else {
        setError(`Error: ${error.message}`);
      }
    }
  };

  // Función para crear datos de prueba (temporal)
  const crearDatosPrueba = async (uid) => {
    try {
      console.log("Intentando crear datos de prueba para UID:", uid);
      
      // Intentar crear en la colección empresas
      const empresaData = {
        nombreEmpresa: "Empresa de Prueba",
        email: email,
        rol: "empresa",
        descripcion: "Una empresa de prueba para testing",
        telefono: "+56912345678",
        direccion: "Av. Providencia 1234, Santiago",
        fechaCreacion: new Date(),
        activo: true,
        redesSociales: { instagram: "", facebook: "", whatsapp: "" },
        horarios: [
          { dia: "Lunes", rangos: [{ inicio: "09:00", fin: "18:00" }] },
          { dia: "Martes", rangos: [{ inicio: "09:00", fin: "18:00" }] },
          { dia: "Miércoles", rangos: [{ inicio: "09:00", fin: "18:00" }] },
          { dia: "Jueves", rangos: [{ inicio: "09:00", fin: "18:00" }] },
          { dia: "Viernes", rangos: [{ inicio: "09:00", fin: "18:00" }] },
          { dia: "Sábado", rangos: [{ inicio: "10:00", fin: "14:00" }] },
          { dia: "Domingo", rangos: [] }
        ]
      };

      const { setDoc } = await import("firebase/firestore");
      const docRef = doc(db, "empresas", uid);
      await setDoc(docRef, empresaData);
      console.log("Datos de prueba creados exitosamente");
      
      return empresaData;
    } catch (error) {
      console.error("Error creando datos de prueba:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    console.log("🔐 Iniciando proceso de login...");
    console.log("📧 Email:", email);

    try {
      console.log("🔑 Intentando autenticar con Firebase Auth...");
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      console.log("✅ Autenticación exitosa. UID:", uid);

      // Buscar primero en 'usuarios'
      console.log("🔍 Buscando usuario en colección 'usuarios'...");
      let docRef = doc(db, "usuarios", uid);
      let docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("👤 Usuario encontrado en 'usuarios'");
        const userData = docSnap.data();
        console.log("📋 Datos del usuario:", userData);
        if (userData.rol === "usuario") {
          console.log("🏠 Redirigiendo a home-usuario");
          navigate("/home-usuario");
          return;
        }
      } else {
        console.log("❌ Usuario no encontrado en 'usuarios'");
      }

      // Si no está en 'usuarios', buscar en 'empresas'
      console.log("🏢 Buscando usuario en colección 'empresas'...");
      docRef = doc(db, "empresas", uid);
      docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("🏢 Empresa encontrada en 'empresas'");
        const userData = docSnap.data();
        console.log("📋 Datos de la empresa:", userData);
        if (userData.rol === "empresa" || userData.rol === "admin" || !userData.rol) {
          console.log("🏠 Redirigiendo a home-empresa");
          navigate("/home-empresa");
          return;
        }
      } else {
        console.log("❌ Empresa no encontrada en 'empresas'");
      }

      // Si no se encuentra el usuario, crear datos de prueba
      console.log("⚠️ Usuario no encontrado en ninguna colección, creando datos de prueba...");
      try {
        const userData = await crearDatosPrueba(uid);
        console.log("✅ Datos de prueba creados exitosamente");
        console.log("🏠 Redirigiendo a home-empresa");
        navigate("/home-empresa");
        return;
      } catch (createError) {
        console.error("❌ Error creando datos de prueba:", createError);
        setError(`Error creando perfil: ${createError.message}`);
      }
    } catch (err) {
      console.error("Error completo de Firebase:", err);
      console.error("Código de error:", err.code);
      console.error("Mensaje de error:", err.message);
      
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
          setError(`Error al iniciar sesión: ${err.message} (Código: ${err.code})`);
      }
    }
  };

  return (
    <section
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

        {/* Botones de prueba rápida */}
        <div className="grid grid-cols-2 gap-2 mt-2">
          <button 
            type="button"
            onClick={() => {
              setEmail("test@empresa.com");
              setPassword("123456");
            }}
            className="bg-green-600 text-white py-2 rounded hover:bg-green-700 text-sm"
          >
            🧪 Usar Datos
          </button>
          <button 
            type="button"
            onClick={crearCuentaPrueba}
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-sm"
          >
            ➕ Crear Cuenta Prueba
          </button>
        </div>

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
