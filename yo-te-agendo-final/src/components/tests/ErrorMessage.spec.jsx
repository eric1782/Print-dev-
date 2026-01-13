import { render, screen } from '@testing-library/react';
import ErrorMessage from '../common/ErrorMessage.jsx';

describe('ErrorMessage Component', () => {
  it('manejo de muestra de mensaje de error', () => {
    const message = 'Test error message';
    render(<ErrorMessage message={message} />);
    
    expect(screen.getByText(message)).toBeInTheDocument();
  });

  it('manejo del parrafo vacio, si esta vacio se tiene que mostrar como tal', () => {
    render(<ErrorMessage message="" />);
    const messageElement = screen.getByText('Error');
    expect(messageElement).toBeInTheDocument();
  });
});