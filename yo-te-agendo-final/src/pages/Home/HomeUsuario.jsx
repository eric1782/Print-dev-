import React from 'react';
// placeholder de iconos
 
const PlaceholderIcon = ({ className }) => (
  <div className={`w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center ${className}`}>
    {/* Placeholder visual */}
    <span className="text-gray-600 text-xs">Icon</span>
  </div>
);

function HomeUsuario() {
  // Dummy data for demonstration with placeholders
  const empresasHorizontal = Array.from({ length: 8 }).map((_, i) => ({
    id: i,
    nombre: `nombre_empresa ${i + 1}`,
  }));

  const empresasVertical = Array.from({ length: 10 }).map((_, i) => ({
    id: i,
    nombre: `nombre_empresa ${i + 1}`,
    categoria: `Categoría ${i % 3 + 1}`, // Example categories
  }));

  const citasAgendadas = Array.from({ length: 10 }).map((_, i) => ({ // Increased to 10 for better slider demo
    id: i,
    nombreEmpresa: `nombre_empresa ${i + 1}`,
    servicio: `servicio_empresa ${i + 1}`,
    fecha: `fecha_servicio ${i + 1}`,
  }));

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-6">

        {/* Sección de Empresas Horizontal*/}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-indigo-600 mb-6 text-center">Nuestras empresas recomendadas!</h2>
          {/* ajustes de card y tamaño de iconos*/}
          <div className="flex overflow-x-auto space-x-6 pb-4 scrollbar-hide">
            {empresasHorizontal.map(empresa => (
              <div key={empresa.id} className="flex-none w-64 bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center hover:scale-105 transition">
                {/* cambio de tamaño de iconos*/}
                <PlaceholderIcon className="w-24 h-24 mb-3" />
                <h3 className="text-lg font-semibold">{empresa.nombre}</h3>
              </div>
            ))}
          </div>
        </section>

        {/* Sección de Empresas Vertical */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-indigo-600 mb-6 text-center">Buscar empresas</h2>
          {/* Contenedor*/}
          <div className="flex flex-col overflow-y-auto space-y-6 h-96 pb-4 scrollbar-hide items-start-center min-w-full">
            {empresasVertical.map(empresa => (
              // tarjetitas
              <div key={empresa.id} className="bg-white rounded-lg shadow-lg p-6 flex items-center space-x-4 hover:scale-105 transition max-w-6xl">
                <PlaceholderIcon className="flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold">{empresa.nombre}</h3>
                  <p className="text-gray-600 text-sm">{empresa.categoria}</p>  
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Sección de Citas Agendadas*/}
        <section>
          <h2 className="text-3xl font-bold text-indigo-600 mb-6 text-center">Tu historial de citas!</h2>
          <div className="flex flex-col overflow-y-auto space-y-6 h-96 pb-4 scrollbar-hide items-start-center">
            {citasAgendadas.map(cita => (
              // Changed max-w-md to max-w-lg to make items wider
              <div key={cita.id} className="bg-white rounded-lg shadow-lg p-6 flex flex-col md:flex-row justify-between items-center hover:scale-105 transition max-w-6x1">
                <div className="mb-4 md:mb-0 md:mr-4">
                  <h3 className="text-xl font-semibold">{cita.nombreEmpresa}</h3>
                  <p className="text-gray-700">{cita.servicio}</p>
                </div>
                <div className="text-gray-500 text-sm">
                  {cita.fecha}
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

export default HomeUsuario;
