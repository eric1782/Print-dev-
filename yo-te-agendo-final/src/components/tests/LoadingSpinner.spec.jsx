import { render, screen } from '@testing-library/react';
import LoadingSpinner from '../common/LoadingSpinner.jsx';

describe('LoadingSpinner Component', () => {
  // Prueba del texto por defecto
  it('manejo de mensaje de cargando cuando este carjando', () => {
    render(<LoadingSpinner />);
    expect(screen.getByText('Cargando...')).toBeInTheDocument();
  });

  // Prueba de texto personalizado
  it('manejo de mensaje con texto personalizado', () => {
    const customText = 'Procesando...';
    render(<LoadingSpinner text={customText} />);
    expect(screen.getByText(customText)).toBeInTheDocument();
  });

  // Prueba de diferentes tamaños
  it('manejo de cambio de tamaño de la fuente', () => {
    const { container } = render(<LoadingSpinner size="lg" />);
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toHaveClass('h-12', 'w-12');
  });
});