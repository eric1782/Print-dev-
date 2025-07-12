import { useEffect, useState, useCallback } from "react";
import { collection, query, where, getDocs, deleteDoc, doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function HomeEmpresaAgenda() {
  const [reservas, setReservas] = useState([]);
  const [empresaId, setEmpresaId] = useState("");
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
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setEmpresaId(user.uid);
      } else {
        setError("No hay usuario autenticado.");
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const formatDate = (date) => {
    return date.toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  const formatTime = (timeStr) => {
    return timeStr;
  };

  const fetchReservas = useCallback(async () => {
    if (!empresaId) return;

    setLoading(true);
    setError(null);
    try {
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);

      const reservasRef = collection(db, "reservas");
      const q = query(
        reservasRef,
        where("empresaId", "==", empresaId),
        where("fecha", ">=", startOfWeek),
        where("fecha", "<=", endOfWeek)
      );
      const querySnapshot = await getDocs(q);
      let fetchedReservas = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      const userIds = [...new Set(fetchedReservas.map(r => r.clienteId))];
      const serviceIds = [...new Set(fetchedReservas.map(r => r.servicioId))];

      let usersData = {};
      if (userIds.length > 0) {
        const usersRef = collection(db, "users"); 
        const userPromises = userIds.map(uid => getDoc(doc(usersRef, uid)));
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
        cliente: usersData[reserva.clienteId] || { nombre: "Desconocido" },
        servicio: servicesData[reserva.servicioId] || { nombre: "Servicio Desconocido" },
        fecha: reserva.fecha instanceof Date ? reserva.fecha : reserva.fecha.toDate(),
      }));

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

  return <div>Agenda de la Empresa</div>;
}

export default HomeEmpresaAgenda;
