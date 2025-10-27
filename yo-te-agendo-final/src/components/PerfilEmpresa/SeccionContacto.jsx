import React from 'react';

/**
 * Componente para mostrar la información de contacto
 */
const SeccionContacto = ({ contacto }) => {
  if (!contacto) {
    return (
      <p className="text-gray-400 text-center py-4 text-sm">Sin información de contacto disponible.</p>
    );
  }

  return (
    <div className="space-y-3">
      {contacto.instagram && (
        <div className="flex items-center p-3 bg-gray-50 rounded-xl">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3">
            <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987c6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM12.017 2.48c5.252 0 9.507 4.255 9.507 9.507s-4.255 9.507-9.507 9.507s-9.507-4.255-9.507-9.507S6.765 2.48 12.017 2.48z"/>
            </svg>
          </div>
          <div>
            <p className="text-xs text-gray-500">Instagram</p>
            <p className="text-sm text-gray-900 font-medium">{contacto.instagram}</p>
          </div>
        </div>
      )}
      
      {contacto.facebook && (
        <div className="flex items-center p-3 bg-gray-50 rounded-xl">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3">
            <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </div>
          <div>
            <p className="text-xs text-gray-500">Facebook</p>
            <p className="text-sm text-gray-900 font-medium">{contacto.facebook}</p>
          </div>
        </div>
      )}
      
      {contacto.telefono && (
        <div className="flex items-center p-3 bg-gray-50 rounded-xl">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <div>
            <p className="text-xs text-gray-500">Teléfono</p>
            <p className="text-sm text-gray-900 font-medium">{contacto.telefono}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeccionContacto;
