import React, { useEffect, useState } from "react";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { format, parseISO, addDays, getDay, setMinutes, setHours, addMinutes, isBefore, isEqual } from "date-fns";
import { es } from "date-fns/locale";

function ReservarPopup({ servicio, empresa, onClose }) {
  const [form, setForm] = useState({ nombre: "", rut: "", telefono: "", correo: "" });
  const [fechaSeleccionada, setFechaSeleccionada] = useState(format(new Date(), "yyyy-MM-dd"));
  const [horasDisponibles, setHorasDisponibles] = useState([]);
  const [horaSeleccionada, setHoraSeleccionada] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const generarHoras = async () => {
      if (!empresa || !servicio) return;
      const diaSemana = getDay(parseISO(fechaSeleccionada));
      const nombreDia = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][diaSemana];
      const horarioDia = empresa.horarios.find(h => h.dia === nombreDia);

      if (!horarioDia || !horarioDia.rangos.length) {
        setHorasDisponibles([]);
        return;
      }

      const duracion = parseInt(servicio.tiempo, 10);
      const descanso = 15;

      const reservasSnap = await getDocs(query(
        collection(db, "reservas"),
        where("empresaId", "==", empresa.id),
        where("fecha", "==", fechaSeleccionada)
      ));
      const reservas = reservasSnap.docs.map(d => d.data());

      const horasReservadas = new Set();
      reservas.forEach(r => {
        const [h, m] = r.hora.split(":").map(Number);
        let inicio = setMinutes(setHours(parseISO(fechaSeleccionada), h), m);
        for (let i = 0; i < parseInt(r.duracionServicio, 10); i += 15) {
          horasReservadas.add(format(addMinutes(inicio, i), "HH:mm"));
        }
      });

      const horas = [];
      let current = setMinutes(setHours(parseISO(fechaSeleccionada), ...horarioDia.rangos[0].horaInicio.split(":").map(Number)), 0);
      const fin = setMinutes(setHours(parseISO(fechaSeleccionada), ...horarioDia.rangos[0].horaFin.split(":").map(Number)), 0);

      while (isBefore(addMinutes(current, duracion), addMinutes(fin, 1))) {
        let libre = true;
        for (let i = 0; i < duracion; i += 15) {
          if (horasReservadas.has(format(addMinutes(current, i), "HH:mm"))) {
            libre = false;
            break;
          }
        }
        if (libre) {
          horas.push(format(current, "HH:mm"));
        }
        current = addMinutes(current, duracion + descanso);
      }

      setHorasDisponibles(horas);
    };

    generarHoras();
  }, [fechaSeleccionada, empresa, servicio]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleReservar = async () => {
    if (!form.nombre || !form.rut || !form.telefono || !form.correo || !horaSeleccionada) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    await addDoc(collection(db, "reservas"), {
      ...form,
      servicio: servicio.nombre,
      duracionServicio: servicio.tiempo,
      empresaId: empresa.id,
      fecha: fechaSeleccionada,
      hora: horaSeleccionada,
      timestamp: new Date(),
    });

    setMensaje(`¡Reserva confirmada para el servicio ${servicio.nombre} el día ${fechaSeleccionada} a las ${horaSeleccionada}. Si tienes dudas, contáctanos al +56 9 1234 5678!`);
    setHoraSeleccionada("");
    setForm({ nombre: "", rut: "", telefono: "", correo: "" });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6 space-y-4 relative">
        <h2 className="text-2xl font-bold text-indigo-700 mb-2">Reservar: {servicio.nombre}</h2>

        <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" className="w-full p-2 border rounded" />
        <input name="rut" value={form.rut} onChange={handleChange} placeholder="RUT" className="w-full p-2 border rounded" />
        <input name="telefono" value={form.telefono} onChange={handleChange} placeholder="Teléfono" className="w-full p-2 border rounded" />
        <input name="correo" value={form.correo} onChange={handleChange} placeholder="Correo" className="w-full p-2 border rounded" />

        <label className="block text-sm font-medium text-gray-700">Selecciona una fecha:</label>
        <input
          type="date"
          value={fechaSeleccionada}
          onChange={e => setFechaSeleccionada(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <label className="block text-sm font-medium text-gray-700 mt-4">Selecciona una hora:</label>
        <div className="grid grid-cols-3 gap-2">
          {horasDisponibles.length > 0 ? (
            horasDisponibles.map(h => (
              <button
                key={h}
                onClick={() => setHoraSeleccionada(h)}
                className={`p-2 rounded border text-sm ${horaSeleccionada === h ? 'bg-indigo-600 text-white' : 'bg-gray-100 hover:bg-indigo-100'}`}
              >
                {h}
              </button>
            ))
          ) : (
            <p className="text-red-500 col-span-3">No hay horarios disponibles.</p>
          )}
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {mensaje && <p className="text-green-600 text-sm">{mensaje}</p>}

        <div className="flex justify-between mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancelar</button>
          <button onClick={handleReservar} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Confirmar</button>
        </div>
      </div>
    </div>
  );
}

export default ReservarPopup;
