import { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";

export default function useNotificacionesUsuario(usuarioId) {
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!usuarioId) return;
    setLoading(true);
    const q = query(
      collection(db, "notificaciones"),
      where("usuarioId", "==", usuarioId),
      orderBy("fecha", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setNotificaciones(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, [usuarioId]);

  return { notificaciones, loading };
}
