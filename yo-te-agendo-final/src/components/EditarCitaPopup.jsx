import React, { useState } from "react";

function EditarCitaPopup({ reserva, empresa, onClose, onSolicitarEdicion }) {
  // Obtiene la fecha original correctamente
  let fechaOriginal;
  if (reserva?.fechaReserva) {
    if (typeof reserva.fechaReserva?.toDate === "function") {
      fechaOriginal = reserva.fechaReserva.toDate();
    } else {
      fechaOriginal = new Date(reserva.fechaReserva);
    }
  } else {
    fechaOriginal = new Date();
  }
  // Si la fecha es inválida, usa la actual
  if (!fechaOriginal || isNaN(fechaOriginal.getTime())) {
    fechaOriginal = new Date();
  }
  const [nuevaFecha, setNuevaFecha] = useState(fechaOriginal);
  const [mensaje, setMensaje] = useState("");

  // Formatea la fecha para el input datetime-local
  function formatDateForInput(date) {
    if (!date || isNaN(date.getTime())) return "";
    // Ajusta a zona local para evitar desfase
    const tzOffset = date.getTimezoneOffset() * 60000;
    const localISO = new Date(date.getTime() - tzOffset).toISOString().slice(0,16);
    return localISO;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nuevaFecha || isNaN(nuevaFecha.getTime())) return;
    onSolicitarEdicion({
      id: reserva.id,
      nuevaFecha,
      mensaje,
      empresaId: empresa.id,
      servicio: reserva.servicio,
      usuarioId: reserva.usuarioId || (reserva.usuario && reserva.usuario.id) || null
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl border border-white/50">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Editar Reserva</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nueva fecha y hora</label>
            <input
              type="datetime-local"
              value={formatDateForInput(nuevaFecha)}
              onChange={e => setNuevaFecha(new Date(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-300"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje para la empresa (opcional)</label>
            <textarea
              value={mensaje}
              onChange={e => setMensaje(e.target.value)}
              placeholder="Motivo o detalles de la edición..."
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-300 resize-none"
              rows={3}
              maxLength={300}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all duration-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-600 hover:to-purple-700 transition-all duration-300"
            >
              Solicitar Edición
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditarCitaPopup;
