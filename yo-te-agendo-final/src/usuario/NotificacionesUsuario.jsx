import React from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import useNotificacionesUsuario from "../hooks/useNotificacionesUsuario";
import { auth } from "../firebase/firebaseConfig";

export default function NotificacionesUsuario() {
  const user = auth.currentUser;
  const { notificaciones, loading } = useNotificacionesUsuario(user?.uid);

  // Marcar notificación como leída
  const marcarLeida = async (id) => {
    try {
      await updateDoc(doc(db, "notificaciones", id), { leida: true });
    } catch (err) {
      console.error("Error marcando notificación como leída:", err);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8 p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold mb-4 text-indigo-700">🔔 Tus Notificaciones</h2>
      {loading ? (
        <div className="text-center text-gray-500 py-8">Cargando notificaciones...</div>
      ) : notificaciones.length === 0 ? (
        <div className="text-center text-gray-400 py-8">No tienes notificaciones aún.</div>
      ) : (
        <ul className="space-y-4">
          {notificaciones.map((notif) => (
            <li
              key={notif.id}
              className={`relative p-4 rounded-xl shadow flex items-center gap-3 cursor-pointer ${notif.leida ? "bg-gray-50" : "bg-indigo-50 border-l-4 border-indigo-400"}`}
              onClick={() => !notif.leida && marcarLeida(notif.id)}
              title={notif.leida ? "Leída" : "Marcar como leída"}
            >
              {/* Botón eliminar (X) */}
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-lg font-bold"
                title="Eliminar notificación"
                onClick={e => {
                  e.stopPropagation();
                  import("firebase/firestore").then(({ doc, deleteDoc }) => deleteDoc(doc(db, "notificaciones", notif.id)));
                }}
              >×</button>
              <div className="flex-1">
                <div className="font-semibold text-indigo-800 text-sm mb-1">{notif.tipo.replace(/_/g, " ")}</div>
                <div className="text-gray-700 text-base">{notif.mensaje}</div>
                <div className="text-xs text-gray-400 mt-1">{notif.fecha?.toDate ? notif.fecha.toDate().toLocaleString("es-CL") : String(notif.fecha)}</div>
              </div>
              {!notif.leida && <span className="inline-block w-3 h-3 rounded-full bg-indigo-500" title="No leída"></span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
