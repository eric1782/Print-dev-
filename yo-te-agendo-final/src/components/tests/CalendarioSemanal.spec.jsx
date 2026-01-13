import { render, screen, fireEvent } from '@testing-library/react';
import CalendarioSemanal from '../ReservarPopup/CalendarioSemanal.jsx'; // Asegúrate que esta ruta sea correcta

describe('CalendarioSemanal Component', () => {
  // Creamos fechas fijas para evitar problemas de zona horaria en los tests
  const fechaPrueba = new Date(2025, 9, 27); // 27 de Octubre 2025
  const fechaSiguiente = new Date(2025, 9, 28); // 28 de Octubre 2025

  const mockDiasCalendario = [
    { nombre: 'Lun', fecha: '2025-10-27', fechaObj: fechaPrueba, disponible: true },
    { nombre: 'Mar', fecha: '2025-10-28', fechaObj: fechaSiguiente, disponible: false }
  ];

  // Prueba 1: Navegación (Flechas)
  it('manejo de navegacion semanal usando los botones de flecha', () => {
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
        onIrHoy={() => {}} // Agregamos esta prop requerida vacía
      />
    );

    // Como tu componente TIENE aria-label, la prueba los encontrará así:
    const prevButton = screen.getByRole('button', { name: /semana anterior/i });
    const nextButton = screen.getByRole('button', { name: /semana siguiente/i });
    
    fireEvent.click(prevButton);
    fireEvent.click(nextButton);

    expect(onSemanaAnterior).toHaveBeenCalledTimes(1);
    expect(onSemanaSiguiente).toHaveBeenCalledTimes(1);
  });

  // Prueba 2: Selección de día (Números)
  it('manejo de seleccion de dia al hacer click en el numero', () => {
    const onSeleccionarDia = jest.fn();

    render(
      <CalendarioSemanal
        diasCalendario={mockDiasCalendario}
        fechaSeleccionada=""
        onSeleccionarDia={onSeleccionarDia}
        semanaActual={new Date()}
        onSemanaAnterior={() => {}}
        onSemanaSiguiente={() => {}}
        onIrHoy={() => {}}
      />
    );

    // Buscamos el botón que contiene el texto "27".
    // Usamos una Expresión Regular /27/ para encontrarlo aunque tenga espacios alrededor.
    const diaDisponible = screen.getByRole('button', { name: /27/i });
    
    fireEvent.click(diaDisponible);

    // Verificamos que se llamó a la función con el objeto del primer día (el del 27)
    expect(onSeleccionarDia).toHaveBeenCalledWith(mockDiasCalendario[0]);
  });
});