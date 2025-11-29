import { render, screen, fireEvent } from '@testing-library/react';
import { signOut } from 'firebase/auth'; // Importamos la función real para chequear el mock
import NavbarAdmin from '../../components/PaginaAdmin/NavbarAdmin.jsx'; // Ajusta la ruta

// --- MOCK DE FIREBASE ---
jest.mock('../../firebase/firebaseConfig', () => ({
  auth: {},
}));

// Mockeamos signOut para espiarlo
jest.mock('firebase/auth', () => ({
  signOut: jest.fn(() => Promise.resolve()),
}));

describe('NavbarAdmin Component - Logout', () => {
  it('debe llamar a signOut de Firebase al hacer clic en el botón Salir', () => {
    // Renderizamos el componente (no nos importa el activeTab aquí)
    render(
      <NavbarAdmin 
        activeTab="dashboard" 
        setActiveTab={() => {}} 
      />
    );

    // 1. Buscamos el botón de salir
    const botonSalir = screen.getByRole('button', { name: /Salir/i });
    
    // 2. Simulamos el clic
    fireEvent.click(botonSalir);

    // 3. Verificamos que la función signOut (mockeada) haya sido llamada
    expect(signOut).toHaveBeenCalledTimes(1);
  });
});