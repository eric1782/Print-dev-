import { render, screen, fireEvent } from '@testing-library/react';
import SuccessMessage from '../common/SuccessMessage.jsx';

describe('SuccessMessage Component', () => {
  // Prueba básica de renderizado del mensaje
  it('manejo del mensaje de exito', () => {
    const message = 'Operación completada con éxito';
    render(<SuccessMessage message={message} />);
    
    // Verifica que el título y el mensaje estén presentes
    expect(screen.getByText('Éxito')).toBeInTheDocument();
    expect(screen.getByText(message)).toBeInTheDocument();
  });

  // Prueba del botón de cerrar
  it('manejo del boton de cerrar y verificar que cierre', () => {
    const onClose = jest.fn();
    render(<SuccessMessage message="Test" onClose={onClose} />);
    
    // Busca y hace clic en el botón
    const closeButton = screen.getByText('Cerrar');
    fireEvent.click(closeButton);
    
    // Verifica que la función onClose fue llamada
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});