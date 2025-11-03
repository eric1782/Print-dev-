import { render, screen, fireEvent } from '@testing-library/react';
import ListaServicios from '../PerfilEmpresa/ListaServicios.jsx';

describe('ListaServicios Component', () => {
  const mockServicios = [
    {
      id: 1,
      nombre: 'Corte de pelo',
      descripcion: 'Corte y estilo',
      precio: '15000',
      tiempo: 30
    }
  ];

  // Prueba de mensaje cuando no hay servicios
  it('should show empty message when no services', () => {
    render(<ListaServicios servicios={[]} onServicioClick={() => {}} />);
    expect(screen.getByText('No hay servicios disponibles')).toBeInTheDocument();
  });

  // Prueba de renderizado de servicios
  it('should render service information correctly', () => {
    render(<ListaServicios servicios={mockServicios} onServicioClick={() => {}} />);

    // Verifica que la información del servicio esté presente
    expect(screen.getByText('Corte de pelo')).toBeInTheDocument();
    expect(screen.getByText('Corte y estilo')).toBeInTheDocument();
    expect(screen.getByText('$15000')).toBeInTheDocument();
    expect(screen.getByText('30 min')).toBeInTheDocument();
  });

  // Prueba de click en un servicio
  it('should handle service click', () => {
    const onServicioClick = jest.fn();
    render(<ListaServicios servicios={mockServicios} onServicioClick={onServicioClick} />);

    // Click en el servicio
    fireEvent.click(screen.getByText('Corte de pelo'));
    expect(onServicioClick).toHaveBeenCalledWith(mockServicios[0]);
  });
});