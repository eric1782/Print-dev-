import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
        
      <div className="flex space-x-6 text-2xl">
  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-transform transform hover:-translate-y-1">
    <FaFacebook />
  </a>
  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition-transform transform hover:-translate-y-1">
    <FaInstagram />
  </a>
  <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition-transform transform hover:-translate-y-1">
    <FaWhatsapp />
  </a>
</div>

        {/* Derechos de autor */}
        <div className="text-center text-sm">
          © {new Date().getFullYear()} Yo Te Agendo. Todos los derechos reservados.
        </div>

        {/* Diseñado por Print-Dev */}
        <div className="text-center text-sm">
          Diseñado con ❤️ por <span className="font-semibold">Print-Dev</span>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
