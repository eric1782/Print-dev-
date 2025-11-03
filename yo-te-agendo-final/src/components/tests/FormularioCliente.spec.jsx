import { render, screen, fireEvent } from '@testing-library/react';
import FormularioCliente from '../ReservarPopup/FormularioCliente.jsx';

describe('FormularioCliente Component', () => {
  const mockForm = {
    nombre: '',
    rut: '',
    telefono: '',
    correo: ''
  };

  const mockValidaciones = {
    nombre: '',
    rut: '',
    telefono: '',
    correo: ''
  };

  const mockOnChange = jest.fn();

  it('should render all form fields correctly', () => {
    render(
      <FormularioCliente
        form={mockForm}
        onChange={mockOnChange}
        validaciones={mockValidaciones}
      />
    );

    // Verificar que todos los campos estén presentes
    expect(screen.getByRole('heading', { name: /datos del cliente/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ingresa tu nombre')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('12.345.678-9')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('+56 9 1234 5678')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('tu@email.com')).toBeInTheDocument();

    // Verificar los placeholders
    expect(screen.getByPlaceholderText('Ingresa tu nombre')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('12.345.678-9')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('+56 9 1234 5678')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('tu@email.com')).toBeInTheDocument();
  });

  it('should display validation errors when present', () => {
    const validacionesConError = {
      nombre: 'El nombre es requerido',
      rut: 'RUT inválido',
      telefono: 'Teléfono inválido',
      correo: 'Correo inválido'
    };

    render(
      <FormularioCliente
        form={mockForm}
        onChange={mockOnChange}
        validaciones={validacionesConError}
      />
    );

    // Verificar que se muestren los mensajes de error
    expect(screen.getByText('El nombre es requerido')).toBeInTheDocument();
    expect(screen.getByText('RUT inválido')).toBeInTheDocument();
    expect(screen.getByText('Teléfono inválido')).toBeInTheDocument();
    expect(screen.getByText('Correo inválido')).toBeInTheDocument();
  });

  it('should disable email field when userEmail is provided', () => {
    const userEmail = 'usuario@example.com';
    
    render(
      <FormularioCliente
        form={mockForm}
        onChange={mockOnChange}
        validaciones={mockValidaciones}
        userEmail={userEmail}
      />
    );

    const emailInput = screen.getByPlaceholderText('tu@email.com');
    expect(emailInput).toBeDisabled();
    expect(emailInput).toHaveValue(userEmail);
    expect(screen.getByText(`✓ Usando el correo de tu cuenta: ${userEmail}`)).toBeInTheDocument();
  });
});