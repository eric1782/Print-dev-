// Importamos íconos (ejemplo usando Scissors, luego se pueden agregar más)
import { Scissors, GanttChartSquare, Sparkles, Hand, Droplet, Smile, Armchair, Palette, Dumbbell, Footprints, Brush } from 'lucide-react';

// Componente Servicios
function Servicios() {
  return (
      // Sección de servicios ofrecidos
    <section id="servicios" className="py-20 bg-gray-100 text-center">
      <h2 className="text-4xl md:text-5xl font-bold mb-12 text-indigo-600">
        Nuestros Servicios
      </h2>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-6">

        {/* Peluquería */}
        <div className="bg-white rounded-lg shadow-lg p-8 hover:scale-105 transition flex flex-col items-center">
          <Scissors className="w-16 h-16 text-indigo-500 mb-4" />
          <h3 className="text-2xl font-semibold mb-2">Peluquería</h3>
          <p>Cortes modernos y personalizados para todos los estilos.</p>
        </div>

        {/* Barbería */}
        <div className="bg-white rounded-lg shadow-lg p-8 hover:scale-105 transition flex flex-col items-center">
          <GanttChartSquare className="w-16 h-16 text-indigo-500 mb-4" />
          <h3 className="text-2xl font-semibold mb-2">Barbería</h3>
          <p>Cortes de cabello y cuidado de barba para hombres.</p>
        </div>

        {/* Masajes */}
        <div className="bg-white rounded-lg shadow-lg p-8 hover:scale-105 transition flex flex-col items-center">
        <Sparkles className="w-16 h-16 text-indigo-500 mb-4" />
          <h3 className="text-2xl font-semibold mb-2">Masajes</h3>
          <p>Relajación total con masajes profesionales de calidad.</p>
        </div>

        {/* Estética */}
        <div className="bg-white rounded-lg shadow-lg p-8 hover:scale-105 transition flex flex-col items-center">
          <Sparkles className="w-16 h-16 text-indigo-500 mb-4" />
          <h3 className="text-2xl font-semibold mb-2">Estética</h3>
          <p>Tratamientos de belleza facial y corporal para verte increíble.</p>
        </div>

        {/* Manicure y Pedicure */}
        <div className="bg-white rounded-lg shadow-lg p-8 hover:scale-105 transition flex flex-col items-center">
          <Hand className="w-16 h-16 text-indigo-500 mb-4" />
          <h3 className="text-2xl font-semibold mb-2">Manicure y Pedicure</h3>
          <p>Cuidado completo de uñas para manos y pies.</p>
        </div>

        {/* Depilación */}
        <div className="bg-white rounded-lg shadow-lg p-8 hover:scale-105 transition flex flex-col items-center">
          <Droplet className="w-16 h-16 text-indigo-500 mb-4" />
          <h3 className="text-2xl font-semibold mb-2">Depilación</h3>
          <p>Servicios de depilación para mujer y hombre.</p>
        </div>

        {/* Tratamientos Faciales */}
        <div className="bg-white rounded-lg shadow-lg p-8 hover:scale-105 transition flex flex-col items-center">
          <Smile className="w-16 h-16 text-indigo-500 mb-4" />
          <h3 className="text-2xl font-semibold mb-2">Tratamientos Faciales</h3>
          <p>Rejuvenece tu piel con nuestras terapias de limpieza profunda.</p>
        </div>

        {/* Masajes Deportivos */}
        <div className="bg-white rounded-lg shadow-lg p-8 hover:scale-105 transition flex flex-col items-center">
          <Armchair className="w-16 h-16 text-indigo-500 mb-4" />
          <h3 className="text-2xl font-semibold mb-2">Masajes Deportivos</h3>
          <p>Ideal para la recuperación muscular post ejercicio.</p>
        </div>

        {/* Maquillaje Profesional */}
        <div className="bg-white rounded-lg shadow-lg p-8 hover:scale-105 transition flex flex-col items-center">
          <Palette className="w-16 h-16 text-indigo-500 mb-4" />
          <h3 className="text-2xl font-semibold mb-2">Maquillaje Profesional</h3>
          <p>Maquillaje para eventos, sesiones y celebraciones especiales.</p>
        </div>

        {/* Tratamientos Corporales */}
        <div className="bg-white rounded-lg shadow-lg p-8 hover:scale-105 transition flex flex-col items-center">
          <Dumbbell className="w-16 h-16 text-indigo-500 mb-4" />
          <h3 className="text-2xl font-semibold mb-2">Tratamientos Corporales</h3>
          <p>Reducción, tonificación y moldeamiento del cuerpo.</p>
        </div>

        {/* Spa de Pies */}
        <div className="bg-white rounded-lg shadow-lg p-8 hover:scale-105 transition flex flex-col items-center">
          <Footprints className="w-16 h-16 text-indigo-500 mb-4" />
          <h3 className="text-2xl font-semibold mb-2">Spa de Pies</h3>
          <p>Relaja y revitaliza tus pies con nuestro tratamiento especial.</p>
        </div>

        {/* Coloración de Cabello */}
        <div className="bg-white rounded-lg shadow-lg p-8 hover:scale-105 transition flex flex-col items-center">
          <Brush className="w-16 h-16 text-indigo-500 mb-4" />
          <h3 className="text-2xl font-semibold mb-2">Coloración de Cabello</h3>
          <p>Renueva tu look con nuestros servicios de tintura profesional.</p>
        </div>

      </div>
    </section>
  );
}
// Exportamos el componente
export default Servicios;

