import { useEffect, useState, useCallback } from "react";
import { collection, query, where, getDocs, deleteDoc, doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function HomeEmpresaAgenda({ empresaId: empresaIdProp, personal, servicios }) {
  const [reservas, setReservas] = useState([]);
  const [empresaId, setEmpresaId] = useState(empresaIdProp || "");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [startOfWeek, setStartOfWeek] = useState(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    today.setDate(diff);
    today.setHours(0, 0, 0, 0);
    return today;
  });

  const [selectedReserva, setSelectedReserva] = useState(null);

  useEffect(() => {
    if (empresaIdProp) {
      setEmpresaId(empresaIdProp);
      setError(null);
      setLoading(false);
      console.log('[HomeEmpresaAgenda] empresaIdProp recibido:', empresaIdProp);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setEmpresaId(user.uid);
        console.log('[HomeEmpresaAgenda] user.uid autenticado:', user.uid);
      } else {
        setError("No hay usuario autenticado.");
        setLoading(false);
        console.log('[HomeEmpresaAgenda] No hay usuario autenticado');
      }
    });
    return () => unsubscribe();
  }, [empresaIdProp]);

  const formatDate = (date) => {
    return date.toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  const formatTime = (timeStr) => {
    return timeStr;
  };

  const fetchReservas = useCallback(async () => {
    if (!empresaId) {
      console.log('[HomeEmpresaAgenda] empresaId vacío, no se consulta reservas');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Traer todas las reservas de la empresa
      console.log('[HomeEmpresaAgenda] Consultando reservas con empresaId:', empresaId);
      const reservasRef = collection(db, "reservas");
      const q = query(
        reservasRef,
        where("empresaId", "==", empresaId)
      );
      const querySnapshot = await getDocs(q);
      let fetchedReservas = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      console.log('[HomeEmpresaAgenda] Reservas obtenidas:', fetchedReservas);

      // Filtrar por rango de fechas en el frontend
      const start = new Date(startOfWeek);
      const end = new Date(startOfWeek);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      fetchedReservas = fetchedReservas.filter(r => {
        let rDate;
        if (r.fecha instanceof Date) {
          rDate = r.fecha;
        } else if (r.fecha && r.fecha.toDate) {
          rDate = r.fecha.toDate();
        } else if (typeof r.fecha === "string") {
          rDate = new Date(r.fecha);
        } else {
          return false;
        }
        return rDate >= start && rDate <= end;
      });
      console.log('[HomeEmpresaAgenda] Reservas tras filtro de fechas:', fetchedReservas);

      const userIds = [...new Set(fetchedReservas.map(r => r.clienteId))];
      const serviceIds = [...new Set(fetchedReservas.map(r => r.servicioId))];

      let usersData = {};
      if (userIds.length > 0) {
        const usersRef = collection(db, "usuarios");
        const userPromises = userIds
          .filter(uid => !!uid)
          .map(uid => getDoc(doc(usersRef, uid)));
        const userSnaps = await Promise.all(userPromises);
        userSnaps.forEach(snap => {
          if (snap.exists()) {
            usersData[snap.id] = snap.data();
          }
        });
      }

      let servicesData = {};
      if (serviceIds.length > 0) {
        const empresaDocRef = doc(db, "empresas", empresaId);
        const empresaDocSnap = await getDoc(empresaDocRef);
        if (empresaDocSnap.exists() && empresaDocSnap.data().servicios) {
          empresaDocSnap.data().servicios.forEach(service => {
            servicesData[service.id] = service;
          });
        }
      }

      const populatedReservas = fetchedReservas.map(reserva => ({
        ...reserva,
        cliente: reserva.clienteNombre ? { nombre: reserva.clienteNombre, telefono: reserva.telefono || "" } : (usersData[reserva.clienteId] || { nombre: "Desconocido" }),
        servicio: reserva.servicio ? { nombre: reserva.servicio } : (servicesData[reserva.servicioId] || { nombre: "Servicio Desconocido" }),
        personalNombre: reserva.personal || reserva.personalNombre || "-",
        fecha: reserva.fecha instanceof Date ? reserva.fecha : (reserva.fecha && reserva.fecha.toDate ? reserva.fecha.toDate() : new Date(reserva.fecha)),
      }));

      console.log('[HomeEmpresaAgenda] Reservas final para mostrar:', populatedReservas);
      setReservas(populatedReservas);

    } catch (err) {
      console.error("Error al cargar reservas:", err);
      setError("Error al cargar las reservas. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }, [empresaId, startOfWeek]);

  useEffect(() => {
    fetchReservas();
  }, [fetchReservas]);

  return (
    <div className="max-w-5xl mx-auto p-2 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Agenda semanal</h2>
        <div className="flex gap-2 items-center">
          <button className="px-3 py-1 rounded bg-indigo-100 text-indigo-700 text-xs font-semibold" onClick={() => setStartOfWeek(prev => { const d = new Date(prev); d.setDate(d.getDate() - 7); return d; })}>Semana anterior</button>
          <span className="text-sm font-medium text-gray-700">{formatDate(startOfWeek)} - {formatDate(new Date(startOfWeek.getTime() + 6 * 24 * 60 * 60 * 1000))}</span>
          <button className="px-3 py-1 rounded bg-indigo-100 text-indigo-700 text-xs font-semibold" onClick={() => setStartOfWeek(prev => { const d = new Date(prev); d.setDate(d.getDate() + 7); return d; })}>Semana siguiente</button>
        </div>
      </div>
      {loading ? (
        <div className="text-center text-gray-500 py-8">Cargando reservas...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-8">{error}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[...Array(7)].map((_, i) => {
            const dayDate = new Date(startOfWeek.getTime() + i * 24 * 60 * 60 * 1000);
            const dayReservas = reservas.filter(r => {
              const rDate = r.fecha instanceof Date ? r.fecha : r.fecha.toDate();
              return rDate.getDate() === dayDate.getDate() && rDate.getMonth() === dayDate.getMonth() && rDate.getFullYear() === dayDate.getFullYear();
            });
            return (
              <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col gap-3">
                <div className="font-semibold text-base text-indigo-700 mb-2 text-center">{formatDate(dayDate)}</div>
                {dayReservas.length === 0 ? (
                  <div className="text-xs text-gray-400 text-center">Sin citas</div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {dayReservas.map((reserva, idx) => {
                      const isPendiente = (reserva.estado || "").toLowerCase() === "pendiente";
                      return (
                        <div
                          key={reserva.id || idx}
                          className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 flex flex-col gap-1 shadow"
                        >
                          <div className="flex flex-row justify-between items-center">
                            <div className="font-semibold text-sm text-gray-900">{reserva.servicio.nombre}</div>
                            <span
                              className={`px-2 py-0.5 rounded text-xs font-semibold ${isPendiente ? 'bg-yellow-100 text-yellow-700 shadow-yellow-400 shadow-sm' : 'bg-green-100 text-green-700'}`}
                            >
                              {reserva.estado || "Confirmada"}
                            </span>
                          </div>
                          <div className="text-xs text-gray-700"><span className="font-semibold">Hora:</span> {formatTime(reserva.horaInicio || reserva.hora)}</div>
                          <div className="text-xs text-gray-700"><span className="font-semibold">Cliente:</span> {reserva.cliente.nombre} <span className="text-gray-500">{reserva.cliente.telefono ? `(${reserva.cliente.telefono})` : ""}</span></div>
                          <div className="text-xs text-gray-700"><span className="font-semibold">Personal:</span> {reserva.personalNombre || "-"}</div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default HomeEmpresaAgenda;
