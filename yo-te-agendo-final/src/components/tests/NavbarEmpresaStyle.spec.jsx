import { render, screen } from '@testing-library/react';
import NavbarEmpresa from '../PerfilEmpresa/NavbarEmpresa.jsx';

// --- MOCK DE FIREBASE ---
jest.mock('../../firebase/firebaseConfig', () => ({
  auth: {},
}));

jest.mock('firebase/auth', () => ({
  signOut: jest.fn(),
}));

describe('NavbarEmpresa Component - Estilos Activos', () => {
  it('debe resaltar visualmente la pestaña que está activa', () => {
    // Definimos que la pestaña activa simulada es 'agenda'
    const activeTab = 'agenda';
    
    render(
      <NavbarEmpresa 
        activeTab={activeTab} 
        setActiveTab={() => {}} 
      />
    );

    // 1. Buscamos el botón que debería estar activo (Agenda)
    const botonAgenda = screen.getByRole('button', { name: /Agenda/i });
    
    // 2. Verificamos que tenga las clases de estilo "activo" 
    // (Buscamos la clase de fondo índigo o texto índigo oscuro que definimos)
    expect(botonAgenda).toHaveClass('bg-indigo-50');
    expect(botonAgenda).toHaveClass('text-indigo-700');

    // 3. Verificamos que otro botón (ej: Mis Datos) NO tenga esas clases
    const botonPerfil = screen.getByRole('button', { name: /Mis Datos/i });
    expect(botonPerfil).not.toHaveClass('bg-indigo-50');
  });
});