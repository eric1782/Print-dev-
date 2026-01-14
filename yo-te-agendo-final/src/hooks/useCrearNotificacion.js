import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export async function crearNotificacion({ tipo, mensaje, usuarioId, empresaId, reservaId }) {
  try {
    await addDoc(collection(db, "notificaciones"), {
      tipo,
      mensaje,
      usuarioId: usuarioId || null,
      empresaId: empresaId || null,
      reservaId: reservaId || null,
      fecha: Timestamp.now(),
      leida: false
    });
    return true;
  } catch (err) {
    console.error("Error creando notificación:", err);
    return false;
  }
}
