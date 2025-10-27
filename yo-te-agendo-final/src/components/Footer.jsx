import { FaFacebook, FaInstagram, FaWhatsapp, FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-white/90 backdrop-blur-sm border-t border-white/20 py-6">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Logo y descripción */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Yo Te Agendo
            </h3>
          </div>
          <p className="text-indigo-600 mb-4 max-w-2xl mx-auto">
            Administra tu agenda, crea tu E-commerce. Todo desde un mismo lugar. 
            Conectamos clientes con los mejores servicios de belleza y bienestar.
          </p>
        </div>

        {/* Contenido principal del footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          
          {/* Enlaces rápidos */}
          <div>
            <h4 className="text-lg font-semibold text-indigo-600 mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li><a href="#quienes-somos" className="text-indigo-600 hover:text-indigo-800 transition">¿Quiénes Somos?</a></li>
              <li><a href="#servicios" className="text-indigo-600 hover:text-indigo-800 transition">Servicios</a></li>
              <li><a href="#contacto" className="text-indigo-600 hover:text-indigo-800 transition">Contacto</a></li>
              <li><a href="/login" className="text-indigo-600 hover:text-indigo-800 transition">Iniciar Sesión</a></li>
            </ul>
          </div>

          {/* Servicios */}
          <div>
            <h4 className="text-lg font-semibold text-indigo-600 mb-4">Servicios</h4>
            <ul className="space-y-2">
              <li><span className="text-indigo-600">Peluquería</span></li>
              <li><span className="text-indigo-600">Barbería</span></li>
              <li><span className="text-indigo-600">Masajes</span></li>
              <li><span className="text-indigo-600">Estética</span></li>
              <li><span className="text-indigo-600">Manicure & Pedicure</span></li>
            </ul>
          </div>

          {/* Información de contacto */}
          <div>
            <h4 className="text-lg font-semibold text-indigo-600 mb-4">Contacto</h4>
            <ul className="space-y-2">
              <li className="flex items-center text-indigo-600">
                <FaEnvelope className="w-4 h-4 mr-2" />
                <span>contacto@yoteagendo.com</span>
              </li>
              <li className="flex items-center text-indigo-600">
                <FaPhone className="w-4 h-4 mr-2" />
                <span>+56 9 1234 5678</span>
              </li>
              <li className="flex items-center text-indigo-600">
                <FaMapMarkerAlt className="w-4 h-4 mr-2" />
                <span>Santiago, Chile</span>
              </li>
              <li className="flex items-center text-indigo-600">
                <FaClock className="w-4 h-4 mr-2" />
                <span>Lun - Vie: 9:00 - 18:00</span>
              </li>
            </ul>
          </div>

          {/* Redes sociales */}
          <div>
            <h4 className="text-lg font-semibold text-indigo-600 mb-4">Síguenos</h4>
            <div className="flex space-x-4 text-2xl">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 transition-transform transform hover:-translate-y-1">
                <FaFacebook />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 transition-transform transform hover:-translate-y-1">
                <FaInstagram />
              </a>
              <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 transition-transform transform hover:-translate-y-1">
                <FaWhatsapp />
              </a>
            </div>
            <p className="text-sm text-indigo-500 mt-4">
              Mantente al día con nuestras últimas noticias y ofertas especiales.
            </p>
          </div>

        </div>

        {/* Línea divisoria */}
        <div className="border-t border-indigo-200 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            
            {/* Derechos de autor */}
            <div className="text-center text-sm text-indigo-500">
              © {new Date().getFullYear()} Yo Te Agendo. Todos los derechos reservados.
            </div>

            {/* Enlaces legales */}
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-indigo-500 hover:text-indigo-700 transition">Política de Privacidad</a>
              <a href="#" className="text-indigo-500 hover:text-indigo-700 transition">Términos de Servicio</a>
              <a href="#" className="text-indigo-500 hover:text-indigo-700 transition">Cookies</a>
            </div>

            {/* Diseñado por Print-Dev */}
            <div className="text-center text-sm text-indigo-500">
              Diseñado con ❤️ por <span className="font-semibold text-indigo-600">Print-Dev</span>
            </div>

          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
