import React from 'react';

/**
 * Componente para el formulario de datos del cliente
 */
const FormularioCliente = ({ form, onChange, validaciones, userEmail }) => {
  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-gray-900">Datos del cliente</h4>
      
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre completo
          </label>
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ingresa tu nombre"
          />
          {validaciones.nombre && (
            <p className="text-red-500 text-xs mt-1">{validaciones.nombre}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            RUT
          </label>
          <input
            type="text"
            name="rut"
            value={form.rut}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="12.345.678-9"
          />
          {validaciones.rut && (
            <p className="text-red-500 text-xs mt-1">{validaciones.rut}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Teléfono
          </label>
          <input
            type="tel"
            name="telefono"
            value={form.telefono}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="+56 9 1234 5678"
          />
          {validaciones.telefono && (
            <p className="text-red-500 text-xs mt-1">{validaciones.telefono}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Correo electrónico
          </label>
          <input
            type="email"
            name="correo"
            value={userEmail || form.correo}
            onChange={onChange}
            disabled={!!userEmail}
            className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              userEmail ? 'bg-gray-100 cursor-not-allowed' : ''
            }`}
            placeholder="tu@email.com"
          />
          {userEmail && (
            <p className="text-blue-600 text-xs mt-1">
              ✓ Usando el correo de tu cuenta: {userEmail}
            </p>
          )}
          {validaciones.correo && (
            <p className="text-red-500 text-xs mt-1">{validaciones.correo}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormularioCliente;
