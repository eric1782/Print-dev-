function QuienesSomos() {
  return (
    <section id="quienes-somos" data-aos="fade-up" className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-indigo-600 mb-8">¿Quiénes Somos?</h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-12">
          Yo Te Agendo es una plataforma pensada para facilitar la conexión entre clientes y negocios de peluquería, barbería, masajes y estética. 
          Nuestro objetivo es permitirte agendar tus citas de manera rápida, cómoda y sencilla desde cualquier lugar.
        </p>


        {/* Tarjetas de beneficios */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-12">
          
          {/* Primera fila de 3 */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:scale-105 transition">
            <h4 className="text-xl font-semibold mb-2">Crea tu negocio</h4>
            <p className="text-gray-600">Inicia tu perfil profesional y empieza a recibir citas.</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 hover:scale-105 transition">
            <h4 className="text-xl font-semibold mb-2">Administra tu agenda</h4>
            <p className="text-gray-600">Controla tus citas, horarios y disponibilidad en línea.</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 hover:scale-105 transition">
            <h4 className="text-xl font-semibold mb-2">Organiza tus servicios</h4>
            <p className="text-gray-600">Clasifica y muestra claramente los servicios que ofreces.</p>
          </div>

          {/* Segunda fila de 2, centrados */}
          <div className="md:col-span-3 flex justify-center gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6 hover:scale-105 transition w-64">
              <h4 className="text-xl font-semibold mb-2">Personaliza tu marca</h4>
              <p className="text-gray-600">Personaliza tu imagen, precios, horarios y tu perfil.</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 hover:scale-105 transition w-64">
              <h4 className="text-xl font-semibold mb-2">Crea tu E-commerce</h4>
              <p className="text-gray-600">Vende productos y servicios de forma online fácil y segura.</p>
            </div>
          </div>

        </div>
<<<<<<< HEAD
=======

        {/* Barra deslizable de logos */}
        <div className="overflow-hidden whitespace-nowrap">
          <div className="inline-block animate-slide">
            <img src="https://via.placeholder.com/150x80?text=Cliente+1" alt="Cliente 1" className="inline-block mx-4" />
            <img src="https://via.placeholder.com/150x80?text=Cliente+2" alt="Cliente 2" className="inline-block mx-4" />
            <img src="https://via.placeholder.com/150x80?text=Cliente+3" alt="Cliente 3" className="inline-block mx-4" />
            <img src="https://via.placeholder.com/150x80?text=Cliente+4" alt="Cliente 4" className="inline-block mx-4" />
            <img src="https://via.placeholder.com/150x80?text=Cliente+5" alt="Cliente 5" className="inline-block mx-4" />
          </div>
        </div>

>>>>>>> d8b8c7cb6550cbfdf48db52ccb3ff40c4194ce44
      </div>
    </section>
  );
}

export default QuienesSomos;


