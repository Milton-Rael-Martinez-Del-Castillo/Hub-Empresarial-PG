import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

const authState = vi.hoisted(() => ({ isAuthenticated: false, isLoading: false, user: null }));

vi.mock('./login/AuthContext', () => ({
  useAuth: () => authState
}));

function CurrentLocation() {
  const location = useLocation();
  return <span data-testid="loc">{location.pathname}</span>;
}

function renderProtected({ path = '/protegida', adminOnly = false } = {}) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <ProtectedRoute adminOnly={adminOnly}>
        <div>Contenido protegido</div>
      </ProtectedRoute>
      <CurrentLocation />
    </MemoryRouter>
  );
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    authState.isAuthenticated = false;
    authState.isLoading = false;
    authState.user = null;
  });

  it('no renderiza nada mientras carga la sesión', () => {
    authState.isLoading = true;
    renderProtected();
    expect(screen.queryByText('Contenido protegido')).not.toBeInTheDocument();
  });

  it('redirige a /login cuando no hay sesión', () => {
    renderProtected();
    expect(screen.queryByText('Contenido protegido')).not.toBeInTheDocument();
    expect(screen.getByTestId('loc')).toHaveTextContent('/login');
  });

  it('redirige a / cuando el usuario no es Administrador y la ruta exige adminOnly', () => {
    authState.isAuthenticated = true;
    authState.user = { rol: 'Emprendedor' };
    renderProtected({ adminOnly: true });
    expect(screen.queryByText('Contenido protegido')).not.toBeInTheDocument();
    expect(screen.getByTestId('loc')).toHaveTextContent('/');
  });

  it('permite el acceso solo a Administradores en rutas adminOnly', () => {
    authState.isAuthenticated = true;
    authState.user = { rol: 'Administrador' };
    renderProtected({ adminOnly: true });
    expect(screen.getByText('Contenido protegido')).toBeInTheDocument();
    expect(screen.getByTestId('loc')).toHaveTextContent('/protegida');
  });

  it('permite el acceso a cualquier usuario autenticado sin adminOnly', () => {
    authState.isAuthenticated = true;
    authState.user = { rol: 'Estudiante' };
    renderProtected();
    expect(screen.getByText('Contenido protegido')).toBeInTheDocument();
  });
});