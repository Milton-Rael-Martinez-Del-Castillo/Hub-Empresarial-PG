import { describe, it, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import ProtectedAdmin from './ProtectedAdmin';

function CurrentLocation() {
  const location = useLocation();
  return <span data-testid="loc">{location.pathname}</span>;
}

describe('ProtectedAdmin', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('redirige a /admin/login cuando no hay sesión de administrador', () => {
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <ProtectedAdmin>
          <div>Panel de administración</div>
        </ProtectedAdmin>
        <CurrentLocation />
      </MemoryRouter>
    );

    expect(screen.queryByText('Panel de administración')).not.toBeInTheDocument();
    expect(screen.getByTestId('loc')).toHaveTextContent('/admin/login');
  });

  it('permite el acceso y muestra el panel cuando hay token guardado', () => {
    localStorage.setItem('hub_token', 'token-valido');

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <ProtectedAdmin>
          <div>Panel de administración</div>
        </ProtectedAdmin>
        <CurrentLocation />
      </MemoryRouter>
    );

    expect(screen.getByText('Panel de administración')).toBeInTheDocument();
    expect(screen.getByTestId('loc')).toHaveTextContent('/admin');
  });
});