import { render, screen, fireEvent } from '@testing-library/react';
import NavbarAdmin from '../../components/PaginaAdmin/NavbarAdmin.jsx'; // Ajusta la ruta

// --- MOCK DE FIREBASE (Necesario porque el componente importa auth) ---
jest.mock('../../firebase/firebaseConfig', () => ({
  auth: {},
}));

jest.mock('firebase/auth', () => ({
  signOut: jest.fn(),
}));

describe('NavbarAdmin Component - Navegación', () => {
  it('debe renderizar las pestañas de admin y detectar el cambio de pestaña', () => {
    const setActiveTab = jest.fn();
    
    render(
      <NavbarAdmin 
        activeTab="dashboard" 
        setActiveTab={setActiveTab} 
      />
    );

    // 1. Verificamos que los textos exclusivos de Admin estén presentes
    // Usamos expresiones regulares (/.../i) para ignorar mayúsculas/minúsculas
    expect(screen.getByText(/Resumen/i)).toBeInTheDocument();
    expect(screen.getByText(/Empresas/i)).toBeInTheDocument();
    expect(screen.getByText(/Usuarios/i)).toBeInTheDocument();
    expect(screen.getByText(/Administradores/i)).toBeInTheDocument();

    // 2. Simulamos clic en la pestaña "Usuarios"
    const botonUsuarios = screen.getByRole('button', { name: /Usuarios/i });
    fireEvent.click(botonUsuarios);

    // 3. Verificamos que la función de control se haya llamado con el ID correcto
    expect(setActiveTab).toHaveBeenCalledWith('usuarios');
  });
});