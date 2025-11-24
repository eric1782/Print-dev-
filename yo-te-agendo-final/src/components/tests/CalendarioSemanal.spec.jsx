import { render, screen, fireEvent } from '@testing-library/react';
import CalendarioSemanal from '../ReservarPopup/CalendarioSemanal.jsx';

describe('CalendarioSemanal Component', () => {
  const mockDiasCalendario = [
    { nombre: 'Lun', fecha: '2025-10-27', fechaObj: new Date(2025, 9, 27), disponible: true },
    { nombre: 'Mar', fecha: '2025-10-28', fechaObj: new Date(2025, 9, 28), disponible: false }
  ];

  // Prueba de navegación entre semanas
  it('manejo de navegacion semanal', () => {
    const onSemanaSiguiente = jest.fn();
    const onSemanaAnterior = jest.fn();

    render(
      <CalendarioSemanal
        diasCalendario={mockDiasCalendario}
        fechaSeleccionada=""
        onSeleccionarDia={() => {}}
        semanaActual={new Date()}
        onSemanaAnterior={onSemanaAnterior}
        onSemanaSiguiente={onSemanaSiguiente}
      />
    );

    // Click en botones de navegación
    const prevButton = screen.getByRole('button', { name: /semana anterior/i });
    const nextButton = screen.getByRole('button', { name: /semana siguiente/i });
    
    fireEvent.click(prevButton);
    fireEvent.click(nextButton);

    expect(onSemanaAnterior).toHaveBeenCalled();
    expect(onSemanaSiguiente).toHaveBeenCalled();
  });

  // Prueba de selección de día
  it('manejo de seleccion de dia', () => {
    const onSeleccionarDia = jest.fn();

    render(
      <CalendarioSemanal
        diasCalendario={mockDiasCalendario}
        fechaSeleccionada=""
        onSeleccionarDia={onSeleccionarDia}
        semanaActual={new Date()}
        onSemanaAnterior={() => {}}
        onSemanaSiguiente={() => {}}
      />
    );

    // Intenta seleccionar un día disponible
    const diaDisponible = screen.getByText('27');
    fireEvent.click(diaDisponible);

    expect(onSeleccionarDia).toHaveBeenCalledWith(mockDiasCalendario[0]);
  });
});