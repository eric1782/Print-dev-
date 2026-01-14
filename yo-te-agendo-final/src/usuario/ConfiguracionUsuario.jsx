import { useState } from "react";

function ConfiguracionUsuario() {
  const [notificaciones, setNotificaciones] = useState(true);
  const [temaOscuro, setTemaOscuro] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold text-indigo-700 mb-6">Configuración</h1>

      <div className="bg-white p-6 rounded shadow-md max-w-xl space-y-4">
        <div className="flex justify-between items-center">
          <span>Notificaciones por correo</span>
          <input type="checkbox" checked={notificaciones} onChange={() => setNotificaciones(!notificaciones)} />
        </div>

        <div className="flex justify-between items-center">
          <span>Modo oscuro</span>
          <input type="checkbox" checked={temaOscuro} onChange={() => setTemaOscuro(!temaOscuro)} />
        </div>

        <div>
          <h2 className="text-lg font-semibold mt-4 mb-2">Preferencias de servicios</h2>
          <textarea
            rows="4"
            placeholder="Ej: Me interesa peluquería, manicure y agendamientos rápidos..."
            className="w-full border p-2 rounded"
          />
        </div>
      </div>
    </div>
  );
}

export default ConfiguracionUsuario;
