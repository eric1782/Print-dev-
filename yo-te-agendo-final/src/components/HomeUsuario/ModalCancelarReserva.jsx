import React, { useState } from 'react';
import { formatearFecha } from '../../utils/dateUtils';
import { LoadingSpinner } from '../common';

/**
 * Modal para cancelar una reserva
 */
const ModalCancelarReserva = ({ 
  isOpen, 
  onClose, 
  reserva, 
  onConfirmar, 
  loading 
}) => {
  const [mensaje, setMensaje] = useState('');

  if (!isOpen || !reserva) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mensaje.trim()) {
      onConfirmar(mensaje);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl border border-white/50">
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">❌</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Cancelar Reserva</h3>
          <div className="bg-red-50 p-4 rounded-xl border border-red-200 mb-4">
            <p className="text-sm text-red-600 font-medium">
              Empresa: <span className="font-bold">{reserva.empresaData?.nombreEmpresa}</span>
            </p>
            <p className="text-sm text-red-600 font-medium">
              Fecha: <span className="font-bold">{formatearFecha(reserva.fechaReserva)}</span>
            </p>
            <p className="text-sm text-red-600 font-medium">
              Servicio: <span className="font-bold">{reserva.servicio}</span>
            </p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <textarea
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              placeholder="Motivo de la cancelación..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-red-200 focus:border-red-400 transition-all duration-300 resize-none mb-2"
              rows={4}
              maxLength={500}
              required
            />
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all duration-300"
                disabled={loading}
              >
                Volver
              </button>
              <button
                type="submit"
                disabled={!mensaje.trim() || loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <LoadingSpinner size="sm" text="" />
                ) : (
                  "Cancelar Reserva"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalCancelarReserva;
