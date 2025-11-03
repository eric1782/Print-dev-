import { render, screen } from '@testing-library/react';
import LoadingSpinner from '../common/LoadingSpinner.jsx';

describe('LoadingSpinner Component', () => {
  // Prueba del texto por defecto
  it('should render with default text', () => {
    render(<LoadingSpinner />);
    expect(screen.getByText('Cargando...')).toBeInTheDocument();
  });

  // Prueba de texto personalizado
  it('should render with custom text', () => {
    const customText = 'Procesando...';
    render(<LoadingSpinner text={customText} />);
    expect(screen.getByText(customText)).toBeInTheDocument();
  });

  // Prueba de diferentes tamaños
  it('should apply correct size classes', () => {
    const { container } = render(<LoadingSpinner size="lg" />);
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toHaveClass('h-12', 'w-12');
  });
});