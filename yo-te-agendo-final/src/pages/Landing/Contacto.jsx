function Contacto() {
    return (
    <section id="contacto" data-aos="fade-up" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center px-6">
        <h2 className="text-4xl font-bold text-indigo-600 mb-8">Contáctanos</h2>
        <form className="flex flex-col space-y-6">
            <input type="text" placeholder="Nombre" className="border p-4 rounded-lg" />
            <input type="email" placeholder="Correo Electrónico" className="border p-4 rounded-lg" />
            <input type="telefono" placeholder="+569" className="border p-4 rounded-lg" />
            <textarea placeholder="Mensaje" rows="4" className="border p-4 rounded-lg"></textarea>
            <button className="bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition">
            Enviar Mensaje
            </button>
        </form>
        </div>
    </section>
    );
}

export default Contacto;
