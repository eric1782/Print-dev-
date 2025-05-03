// Importamos React y un ícono de flecha hacia arriba
import { ArrowUp } from 'lucide-react';
import { useState, useEffect } from 'react';

// Componente para volver arriba
function ScrollToTop() {
  // Estado para mostrar o no la flecha
  const [showButton, setShowButton] = useState(false);

  // Detectar cuando el usuario hace scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Limpieza del evento al salir del componente
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Función para subir a la parte superior
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Botón visible solo cuando scroll > 300px */}
      {showButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition"
        >
          <ArrowUp size={24} />
        </button>
      )}
    </>
  );
}

// Exportamos el componente
export default ScrollToTop;


