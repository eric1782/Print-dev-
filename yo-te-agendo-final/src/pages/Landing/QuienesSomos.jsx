function QuienesSomos() {
  return (
    <section id="quienes-somos" data-aos="fade-up" className="py-20 bg-white scroll-mt-24">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-indigo-600 mb-8">¿Quiénes Somos?</h2>
        <p className="text-lg text-indigo-400 leading-relaxed mb-12 max-w-3xl mx-auto">
          Yo Te Agendo es una plataforma pensada para facilitar la conexión entre clientes y negocios de peluquería, barbería, masajes y estética. 
          Nuestro objetivo es permitirte agendar tus citas de manera rápida, cómoda y sencilla desde cualquier lugar.
        </p>

                <div className= "mb-8 top-8 text-center justify-center flex">
                  <iframe width="560" height="315" src="https://www.youtube.com/embed/jzvqXJZoPVE?si=EVpeEJNICcvV7pdZ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        </div>

        {/* Tarjetas de beneficios */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-12">
          
          {/* Primera fila de 3 */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:scale-105 transition-all duration-300">
            <h4 className="text-xl font-semibold text-indigo-600 mb-3">Crea tu negocio</h4>
            <p className="text-indigo-400">Inicia tu perfil profesional y empieza a recibir citas.</p>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:scale-105 transition-all duration-300">
            <h4 className="text-xl font-semibold text-indigo-600 mb-3">Administra tu agenda</h4>
            <p className="text-indigo-400">Controla tus citas, horarios y disponibilidad en línea.</p>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:scale-105 transition-all duration-300">
            <h4 className="text-xl font-semibold text-indigo-600 mb-3">Organiza tus servicios</h4>
            <p className="text-indigo-400">Clasifica y muestra claramente los servicios que ofreces.</p>
          </div>

          {/* Segunda fila de 2, centrados */}
          <div className="md:col-span-3 flex justify-center gap-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:scale-105 transition-all duration-300 w-64">
              <h4 className="text-xl font-semibold text-indigo-600 mb-3">Personaliza tu marca</h4>
              <p className="text-indigo-400">Personaliza tu imagen, precios, horarios y tu perfil.</p>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:scale-105 transition-all duration-300 w-64">
              <h4 className="text-xl font-semibold text-indigo-600 mb-3">Crea tu E-commerce</h4>
              <p className="text-indigo-400">Vende productos y servicios de forma online fácil y segura.</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default QuienesSomos;


