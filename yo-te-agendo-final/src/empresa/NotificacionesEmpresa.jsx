import React from "react";
import useNotificacionesEmpresa from "../hooks/useNotificacionesEmpresa";
import { auth } from "../firebase/firebaseConfig";
import { updateDoc, doc } from "firebase/firestore";
import { crearNotificacion } from "../hooks/useCrearNotificacion";
import { db } from "../firebase/firebaseConfig";

function NotificacionesEmpresa() {
  const user = auth.currentUser;
  const empresaId = user?.uid;
  const [updateError, setUpdateError] = React.useState(null);
  const { notificaciones, loading, error } = useNotificacionesEmpresa(empresaId);
  const [notificacionesLocal, setNotificacionesLocal] = React.useState([]);

  React.useEffect(() => {
    setNotificacionesLocal(notificaciones);
  }, [notificaciones]);
  console.log("[NotificacionesEmpresa.jsx] empresaId:", empresaId);
  console.log("[NotificacionesEmpresa.jsx] notificaciones:", notificaciones);
  console.log("[NotificacionesEmpresa.jsx] error:", error);

  // Marcar notificación como leída
  const marcarLeida = async (id) => {
    const noti = notificaciones.find(n => n.id === id);
    console.log("[marcarLeida] notificación:", noti);
    try {
      await updateDoc(doc(db, "notificaciones", id), { leida: true });
      setUpdateError(null);
    } catch (err) {
      setUpdateError("Error marcando como leída: " + err.message);
      console.error("Error marcando notificación como leída:", err);
    }
  };

  // Eliminar notificación
  const eliminarNotificacion = async (id) => {
    try {
      await import("firebase/firestore").then(({ doc, deleteDoc }) => deleteDoc(doc(db, "notificaciones", id)));
      setNotificacionesLocal(prev => prev.filter(n => n.id !== id));
      setUpdateError(null);
    } catch (err) {
      setUpdateError("Error eliminando notificación: " + err.message);
      console.error("Error eliminando notificación:", err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Notificaciones</h2>
      {updateError && <div className="text-red-500 mb-2">{updateError}</div>}
      {loading ? (
        <div className="text-gray-500">Cargando notificaciones...</div>
      ) : error ? (
        <div className="text-red-500">{error && typeof error === 'string' ? error : 'Error al cargar notificaciones'}<br />
          {error && error.message ? <span className="text-xs">{error.message}</span> : null}
        </div>
      ) : notificacionesLocal.length === 0 ? (
        <div className="text-gray-400">No tienes notificaciones recientes.</div>
      ) : (
        <ul className="space-y-3">
          {notificacionesLocal.map((noti) => (
            <li
              key={noti.id}
              className={`relative p-4 rounded-lg border shadow-sm flex flex-col gap-1 ${!noti.leida ? 'bg-yellow-50 border-yellow-200' : 'bg-white border-gray-100'}`}
              onClick={() => !noti.leida && marcarLeida(noti.id)}
              title={noti.leida ? "Leída" : "Marcar como leída"}
            >
              {/* Botón eliminar (X) */}
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-lg font-bold"
                title="Eliminar notificación"
                onClick={e => {
                  e.stopPropagation();
                  eliminarNotificacion(noti.id);
                }}
              >×</button>
              <span className="font-semibold text-indigo-700 text-sm">{noti.tipo === "reserva" ? "Nueva reserva" : noti.tipo === "cancelacion" ? "Reserva cancelada" : noti.tipo === "edicion" ? "Reserva editada" : "Notificación"}</span>
              <span className="text-gray-800">{noti.mensaje}</span>
              <span className="text-xs text-gray-500">{
                noti.fecha && noti.fecha.seconds
                  ? new Date(noti.fecha.seconds * 1000).toLocaleString("es-CL")
                  : "Sin fecha"
              }</span>
              {!noti.leida && <span className="text-xs text-yellow-700 font-bold">No leída</span>}
              {noti.tipo === "solicitud-edicion" && (
                <div className="flex gap-2 mt-2">
                  <button
                    className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs border border-green-300 hover:bg-green-200"
                    onClick={async e => {
                      e.stopPropagation();
                      // Aceptar: Actualiza la reserva y notifica al cliente
                      console.log("[ACEPTAR] noti:", noti);
                      if (!noti.reservaId || !noti.usuarioId) {
                        alert("Faltan datos de la reserva o usuario");
                        return;
                      }
                      await updateDoc(doc(db, "reservas", noti.reservaId), {
                        fechaReserva: noti.nuevaFecha ? noti.nuevaFecha : noti.fecha,
                        estado: "editado"
                      });
                      await crearNotificacion({
                        tipo: "edicion-aceptada",
                        mensaje: "La empresa aceptó el cambio de fecha/hora de tu reserva.",
                        usuarioId: noti.usuarioId,
                        reservaId: noti.reservaId
                      });
                      alert("Solicitud aceptada y notificación enviada.");
                    }}
                  >Aceptar</button>
                  <button
                    className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs border border-red-300 hover:bg-red-200"
                    onClick={async e => {
                      e.stopPropagation();
                      // Rechazar: Notifica al cliente
                      if (!noti.usuarioId) return alert("Falta usuarioId");
                      await crearNotificacion({
                        tipo: "edicion-rechazada",
                        mensaje: "La empresa rechazó el cambio de fecha/hora de tu reserva.",
                        usuarioId: noti.usuarioId,
                        empresaId: empresaId,
                        reservaId: noti.reservaId
                      });
                      alert("Solicitud rechazada y notificación enviada.");
                    }}
                  >Rechazar</button>
                  <button
                    className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs border border-blue-300 hover:bg-blue-200"
                    onClick={async e => {
                      e.stopPropagation();
                      // Proponer otro horario: prompt simple
                      if (!noti.reservaId || !noti.usuarioId) return alert("Faltan datos de la reserva o usuario");
                      const nuevaFechaStr = prompt("Proponer nueva fecha/hora (YYYY-MM-DD HH:mm)");
                      if (!nuevaFechaStr) return;
                      const nuevaFecha = new Date(nuevaFechaStr.replace(" ", "T"));
                      if (isNaN(nuevaFecha.getTime())) return alert("Fecha inválida");
                      await updateDoc(doc(db, "reservas", noti.reservaId), {
                        fechaReserva: nuevaFecha
                      });
                      await crearNotificacion({
                        tipo: "edicion-propuesta",
                        mensaje: `La empresa propone nueva fecha/hora: ${nuevaFecha.toLocaleString("es-CL")}`,
                        usuarioId: noti.usuarioId,
                        empresaId: empresaId,
                        reservaId: noti.reservaId
                      });
                      alert("Propuesta enviada y reserva actualizada.");
                    }}
                  >Proponer otro horario</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default NotificacionesEmpresa;
