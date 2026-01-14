import { useEffect, useState } from "react";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export default function useNotificacionesEmpresa(empresaId) {
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!empresaId) return;
    setLoading(true);
    setError(null);
    const fetchNotificaciones = async () => {
      try {
        const notiRef = collection(db, "notificaciones");
        const q = query(
          notiRef,
          where("empresaId", "==", empresaId),
          orderBy("fecha", "desc")
        );
        const snap = await getDocs(q);
        const notis = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log("[NotificacionesEmpresa] empresaId:", empresaId);
        console.log("[NotificacionesEmpresa] notificaciones:", notis);
        setNotificaciones(notis);
      } catch (err) {
        console.error("[NotificacionesEmpresa] error:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotificaciones();
  }, [empresaId]);

  return { notificaciones, loading, error };
}
