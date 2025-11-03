import { render, screen, fireEvent } from '@testing-library/react';
import SeleccionHorario from '../ReservarPopup/SeleccionHorario.jsx';

describe('SeleccionHorario Component', () => {
  const mockServicio = {
    tiempo: 60,
    nombre: 'Corte de pelo'
  };

  // Prueba de renderizado sin horarios disponibles
  it('should show message when no hours available', () => {
    render(
      <SeleccionHorario
        horariosDisponibles={[]}
        horaSeleccionada=""
        onSeleccionarHora={() => {}}
        servicio={mockServicio}
      />
    );
    
    expect(screen.getByText(/No hay horarios disponibles/i)).toBeInTheDocument();
  });

  // Prueba de selección de horario
  it('should handle hour selection', () => {
    const onSeleccionarHora = jest.fn();
    const horariosDisponibles = [
      { hora: '10:00', ocupado: false },
      { hora: '11:00', ocupado: true }
    ];

    render(
      <SeleccionHorario
        horariosDisponibles={horariosDisponibles}
        horaSeleccionada=""
        onSeleccionarHora={onSeleccionarHora}
        servicio={mockServicio}
      />
    );

    // Intenta seleccionar un horario disponible
    const horarioDisponible = screen.getByText('10:00');
    fireEvent.click(horarioDisponible);
    expect(onSeleccionarHora).toHaveBeenCalledWith('10:00');
  });
});