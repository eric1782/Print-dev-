function Hero() {
    return (
    <section data-aos="fade-up" className="min-h-screen flex flex-col items-center justify-center text-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6" id="hero">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6">
        Administra tu agenda, crea tu E-commerce.   
        </h1>
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6">
        Todo desde un mismo lugar    
        
        </h1>
        <p className="text-lg md:text-xl text-white mb-8 max-w-2xl">
        Encuentra peluquerías, barberías, masajes y servicios de estética cerca de ti. Agenda tu cita en segundos con Yo Te Agendo.
        </p>
        <p className="text-lg md:text-xl text-white mb-8 max-w-2xl">
        ¡Inscribete fácil y rápido!
        </p>
        <a
        href="#contacto"
        className="bg-white text-indigo-600 font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-indigo-100 transition"
        >
        Agenda tu Cita
        </a>
    </section>
    );
}

export default Hero;

