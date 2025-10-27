function Contacto() {
    return (
    <section id="contacto" data-aos="fade-up" className="py-20 bg-gradient-to-r from-indigo-200 via-purple-100 to-pink-100 scroll-mt-24">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl font-bold text-indigo-600 mb-4">Contáctanos</h2>
          <p className="text-indigo-600 text-lg mb-8">
            ¿Tienes alguna pregunta? Estamos aquí para ayudarte. Envíanos un mensaje y te responderemos pronto.
          </p>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input 
                  type="text" 
                  placeholder="Nombre completo" 
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" 
                />
                <input 
                  type="email" 
                  placeholder="Correo electrónico" 
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" 
                />
              </div>
              
              <input 
                type="tel" 
                placeholder="+56 9 1234 5678" 
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" 
              />
              
              <textarea 
                placeholder="Cuéntanos en qué podemos ayudarte..." 
                rows="6" 
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none"
              ></textarea>
              
              <button 
                type="submit" 
                className="w-full bg-white text-indigo-600 font-bold py-4 px-8 rounded-xl shadow-lg hover:bg-indigo-50 transition-all duration-300 transform hover:scale-105 border-2 border-indigo-600"
              >
                Enviar Mensaje
              </button>
            </form>
          </div>
        </div>
    </section>
    );
}

export default Contacto;
