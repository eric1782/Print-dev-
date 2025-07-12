import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { auth } from "../firebase/firebaseConfig";
import { signOut } from "firebase/auth";

function NavbarUsuario() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const cerrarSesion = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <h1
        onClick={() => navigate("/home-usuario")}
        className="text-xl font-bold text-indigo-700 cursor-pointer"
      >
        LOGO
      </h1>

      <div className="flex items-center gap-4">
        <button
          onClick={cerrarSesion}
          className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
        >
          Salir
        </button>

        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
          >
            Perfil
          </button>
          {open && (
            <div className="absolute right-0 mt-2 w-48 bg-white border shadow rounded z-10">
              <button
                onClick={() => navigate("/usuario/ayuda")}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Ayuda
              </button>
              <button
                onClick={() => navigate("/usuario/configuracion")}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Configuración
              </button>
              <button
                onClick={() => navigate("/usuario/mis-datos")}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Mis datos
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavbarUsuario;
