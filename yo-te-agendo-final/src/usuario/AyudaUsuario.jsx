function AyudaUsuario() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold text-indigo-700 mb-4">Ayuda y Contacto</h1>
      <p className="mb-4">¿Tienes dudas? Completa el formulario y te responderemos pronto.</p>
      <form className="bg-white p-6 rounded shadow-md max-w-md">
        <input type="text" placeholder="Nombre" className="w-full mb-4 p-3 border rounded" />
        <input type="email" placeholder="Correo" className="w-full mb-4 p-3 border rounded" />
        <textarea placeholder="Mensaje" rows="4" className="w-full mb-4 p-3 border rounded"></textarea>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Enviar</button>
      </form>
    </div>
  );
}

export default AyudaUsuario;
