import { describe, it, expect, beforeEach } from 'vitest';
import { saveAdminSession, clearAdminSession, getAdminUser, isAdminLoggedIn } from './hubApi';

describe('Gestión de sesión de administrador (hubApi)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('isAdminLoggedIn es false sin token', () => {
    expect(isAdminLoggedIn()).toBe(false);
  });

  it('guarda el token y los datos del usuario con saveAdminSession', () => {
    saveAdminSession({ email: 'admin@univalle.edu', rol: 'Administrador' }, 'token-abc');

    expect(isAdminLoggedIn()).toBe(true);
    expect(localStorage.getItem('hub_token')).toBe('token-abc');
    expect(getAdminUser()).toEqual({ email: 'admin@univalle.edu', rol: 'Administrador' });
  });

  it('limpia la sesión con clearAdminSession', () => {
    saveAdminSession({ email: 'admin@univalle.edu' }, 'token-abc');
    clearAdminSession();

    expect(isAdminLoggedIn()).toBe(false);
    expect(getAdminUser()).toBeNull();
  });

  it('getAdminUser devuelve null si el JSON es inválido', () => {
    localStorage.setItem('hub_user', '{no es json');
    expect(getAdminUser()).toBeNull();
  });
});