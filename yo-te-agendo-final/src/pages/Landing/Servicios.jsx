// Importamos íconos (ejemplo usando Scissors, luego se pueden agregar más)
import { Scissors, GanttChartSquare, Sparkles, Hand, Droplet, Smile, Armchair, Palette, Dumbbell, Footprints, Brush } from 'lucide-react';

// Componente Servicios
function Servicios() {
  return (
      // Sección de servicios ofrecidos
    <section id="servicios" className="py-20 bg-white text-center scroll-mt-24">
      <h2 className="text-4xl font-bold text-indigo-600 mb-8">
        Nuestros Servicios
      </h2>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-6">

        {/* Peluquería */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:scale-105 transition-all duration-300 flex flex-col items-center">
          <Scissors className="w-16 h-16 text-purple-500 mb-4" />
          <h3 className="text-2xl font-semibold text-indigo-600 mb-3">Peluquería</h3>
          <p className="text-indigo-400">Cortes modernos y personalizados para todos los estilos.</p>
        </div>

        {/* Barbería */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:scale-105 transition-all duration-300 flex flex-col items-center">
          <GanttChartSquare className="w-16 h-16 text-purple-500 mb-4" />
          <h3 className="text-2xl font-semibold text-indigo-600 mb-3">Barbería</h3>
          <p className="text-indigo-400">Cortes de cabello y cuidado de barba para hombres.</p>
        </div>

        {/* Masajes */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:scale-105 transition-all duration-300 flex flex-col items-center">
        <Sparkles className="w-16 h-16 text-purple-500 mb-4" />
          <h3 className="text-2xl font-semibold text-indigo-600 mb-3">Masajes</h3>
          <p className="text-indigo-400">Relajación total con masajes profesionales de calidad.</p>
        </div>

        {/* Estética */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:scale-105 transition-all duration-300 flex flex-col items-center">
          <Sparkles className="w-16 h-16 text-purple-500 mb-4" />
          <h3 className="text-2xl font-semibold text-indigo-600 mb-3">Estética</h3>
          <p className="text-indigo-400">Tratamientos de belleza facial y corporal para verte increíble.</p>
        </div>

        {/* Manicure y Pedicure */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:scale-105 transition-all duration-300 flex flex-col items-center">
          <Hand className="w-16 h-16 text-purple-500 mb-4" />
          <h3 className="text-2xl font-semibold text-indigo-600 mb-3">Manicure y Pedicure</h3>
          <p className="text-indigo-400">Cuidado completo de uñas para manos y pies.</p>
        </div>

        {/* Depilación */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:scale-105 transition-all duration-300 flex flex-col items-center">
          <Droplet className="w-16 h-16 text-purple-500 mb-4" />
          <h3 className="text-2xl font-semibold text-indigo-600 mb-3">Depilación</h3>
          <p className="text-indigo-400">Servicios de depilación para mujer y hombre.</p>
        </div>

        {/* Tratamientos Faciales */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:scale-105 transition-all duration-300 flex flex-col items-center">
          <Smile className="w-16 h-16 text-purple-500 mb-4" />
          <h3 className="text-2xl font-semibold text-indigo-600 mb-3">Tratamientos Faciales</h3>
          <p className="text-indigo-400">Rejuvenece tu piel con nuestras terapias de limpieza profunda.</p>
        </div>

        {/* Masajes Deportivos */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:scale-105 transition-all duration-300 flex flex-col items-center">
          <Armchair className="w-16 h-16 text-purple-500 mb-4" />
          <h3 className="text-2xl font-semibold text-indigo-600 mb-3">Masajes Deportivos</h3>
          <p className="text-indigo-400">Ideal para la recuperación muscular post ejercicio.</p>
        </div>

        {/* Maquillaje Profesional */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:scale-105 transition-all duration-300 flex flex-col items-center">
          <Palette className="w-16 h-16 text-purple-500 mb-4" />
          <h3 className="text-2xl font-semibold text-indigo-600 mb-3">Maquillaje Profesional</h3>
          <p className="text-indigo-400">Maquillaje para eventos, sesiones y celebraciones especiales.</p>
        </div>

        {/* Tratamientos Corporales */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:scale-105 transition-all duration-300 flex flex-col items-center">
          <Dumbbell className="w-16 h-16 text-purple-500 mb-4" />
          <h3 className="text-2xl font-semibold text-indigo-600 mb-3">Tratamientos Corporales</h3>
          <p className="text-indigo-400">Reducción, tonificación y moldeamiento del cuerpo.</p>
        </div>

        {/* Spa de Pies */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:scale-105 transition-all duration-300 flex flex-col items-center">
          <Footprints className="w-16 h-16 text-purple-500 mb-4" />
          <h3 className="text-2xl font-semibold text-indigo-600 mb-3">Spa de Pies</h3>
          <p className="text-indigo-400">Relaja y revitaliza tus pies con nuestro tratamiento especial.</p>
        </div>

        {/* Coloración de Cabello */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:scale-105 transition-all duration-300 flex flex-col items-center">
          <Brush className="w-16 h-16 text-purple-500 mb-4" />
          <h3 className="text-2xl font-semibold text-indigo-600 mb-3">Coloración de Cabello</h3>
          <p className="text-indigo-400">Renueva tu look con nuestros servicios de tintura profesional.</p>
        </div>

      </div>
    </section>
  );
}
// Exportamos el componente
export default Servicios;

