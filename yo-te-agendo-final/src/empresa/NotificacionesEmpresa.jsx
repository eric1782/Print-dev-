import React from "react";
import { useNotificacionesEmpresa, crearNotificacion } from "../hooks";
import { auth } from "../firebase/firebaseConfig";
import { updateDoc, doc } from "firebase/firestore";
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
        <div className="space-y-4">
          {notificacionesLocal.map((noti) => (
            <div
              key={noti.id}
              className={`relative bg-white rounded-2xl shadow-lg border p-4 hover:shadow-md transition-shadow ${!noti.leida ? 'border-yellow-200 bg-yellow-50' : 'border-gray-100'}`}
              onClick={() => !noti.leida && marcarLeida(noti.id)}
              title={noti.leida ? "Leída" : "Marcar como leída"}
            >
              <div className="flex items-start gap-4">
                {/* Icono de tipo de notificación */}
                <div className="flex-shrink-0">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    noti.tipo === "reserva" ? 'bg-green-100 text-green-700' :
                    noti.tipo === "cancelacion" ? 'bg-red-100 text-red-700' :
                    noti.tipo === "edicion" ? 'bg-blue-100 text-blue-700' :
                    'bg-purple-100 text-purple-700'
                  }`}>
                    {noti.tipo === "reserva" ? (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    ) : noti.tipo === "cancelacion" ? (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    ) : noti.tipo === "edicion" ? (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.862 5.487a2.1 2.1 0 1 1 2.97 2.97L8.5 19.79l-4 1 1-4 11.362-11.303Z" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h6v-6H4v6z" />
                      </svg>
                    )}
                  </div>
                </div>

                {/* Contenido principal */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900 text-sm">
                      {noti.tipo === "reserva" ? "Nueva reserva" : 
                       noti.tipo === "cancelacion" ? "Reserva cancelada" : 
                       noti.tipo === "edicion" ? "Reserva editada" : 
                       "Notificación"}
                    </h3>
                    {!noti.leida && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                        No leída
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-2 leading-relaxed">
                    {noti.mensaje}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {noti.fecha && noti.fecha.seconds
                        ? new Date(noti.fecha.seconds * 1000).toLocaleString("es-CL")
                        : "Sin fecha"}
                    </div>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="flex-shrink-0 flex flex-col gap-2">
                  <button
                    className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                    title="Eliminar notificación"
                    onClick={e => {
                      e.stopPropagation();
                      eliminarNotificacion(noti.id);
                    }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              {noti.tipo === "solicitud-edicion" && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex flex-wrap gap-2">
                    <button
                      className="px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium border border-green-300 hover:bg-green-200 transition-colors"
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
                      className="px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium border border-red-300 hover:bg-red-200 transition-colors"
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
                      className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium border border-blue-300 hover:bg-blue-200 transition-colors"
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
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NotificacionesEmpresa;
