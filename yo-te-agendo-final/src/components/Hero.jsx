function Hero() {
    return (
    <section data-aos="fade-up" className="min-h-screen flex flex-col items-center justify-center text-center bg-gradient-to-r from-indigo-200 via-purple-100 to-pink-100 p-6" id="hero">
        <h1 className="text-5xl md:text-6xl font-bold text-indigo-600 mb-8">
        Administra tu agenda, crea tu E-commerce.   
        </h1>
        <h1 className="text-5xl md:text-6xl font-bold text-indigo-600 mb-8">
        Todo desde un mismo lugar    
        </h1>
        <p className="text-lg md:text-xl text-indigo-600 mb-8 max-w-2xl">
        Encuentra peluquerías, barberías, masajes y servicios de estética cerca de ti. Agenda tu cita en segundos con Yo Te Agendo.
        </p>
        <p className="text-lg md:text-xl text-indigo-600 mb-8 max-w-2xl">
        ¡Inscribete fácil y rápido!
        </p>
        <a
        href="#contacto"
        className="bg-white text-indigo-600 font-bold py-4 px-8 rounded-xl shadow-xl hover:bg-indigo-50 transition-all duration-300 transform hover:scale-105 border-2 border-indigo-600"
        >
        Agenda tu Cita
        </a>
    </section>
    );
}

export default Hero;

