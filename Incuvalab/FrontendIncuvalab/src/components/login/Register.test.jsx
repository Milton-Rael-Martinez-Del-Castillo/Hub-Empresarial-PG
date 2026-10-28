import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RegisterForm from './Register';

const navigateSpy = vi.hoisted(() => vi.fn());

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useNavigate: () => navigateSpy };
});

function renderRegister() {
  return render(
    <MemoryRouter initialEntries={['/registro']}>
      <RegisterForm />
    </MemoryRouter>
  );
}

const PASSWORD_FUERTE = 'Clave123!';

describe('RegisterForm', () => {
  beforeEach(() => {
    navigateSpy.mockClear();
    localStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('muestra solo los roles registrables (Emprendedor, Institución, Estudiante)', () => {
    renderRegister();
    const options = screen.getAllByRole('option').map((o) => o.textContent);
    expect(options).toContain('Emprendedor');
    expect(options).toContain('Institución');
    expect(options).toContain('Estudiante');
    expect(options).not.toContain('Administrador');
    expect(options).not.toContain('Mentor');
  });

  it('muestra los requisitos faltantes cuando la contraseña es débil', () => {
    renderRegister();
    fireEvent.change(screen.getByPlaceholderText('Crea una contraseña'), {
      target: { value: 'abc' }
    });
    expect(screen.getByText(/La contraseña debe contener/)).toBeInTheDocument();
  });

  it('indica "Contraseña segura" cuando cumple todos los requisitos', () => {
    renderRegister();
    fireEvent.change(screen.getByPlaceholderText('Crea una contraseña'), {
      target: { value: PASSWORD_FUERTE }
    });
    expect(screen.getByText('Contraseña segura')).toBeInTheDocument();
  });

  it('muestra el error de correo inválido sin llamar a la API', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    renderRegister();
    fireEvent.change(screen.getByPlaceholderText('Crea una contraseña'), {
      target: { value: PASSWORD_FUERTE }
    });
    fireEvent.change(screen.getByPlaceholderText('Confirma tu contraseña'), {
      target: { value: PASSWORD_FUERTE }
    });
    fireEvent.change(screen.getByPlaceholderText('tu@correo.com'), {
      target: { value: 'a@b' }
    });
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'Emprendedor' }
    });
    fireEvent.click(screen.getByRole('button', { name: 'Registrarse' }));

    await screen.findByText('Por favor ingresa un correo electrónico válido.');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('muestra error si las contraseñas no coinciden', async () => {
    renderRegister();
    fireEvent.change(screen.getByPlaceholderText('Crea una contraseña'), {
      target: { value: PASSWORD_FUERTE }
    });
    fireEvent.change(screen.getByPlaceholderText('Confirma tu contraseña'), {
      target: { value: 'OtraClave123!' }
    });
    fireEvent.change(screen.getByPlaceholderText('tu@correo.com'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'Emprendedor' }
    });
    fireEvent.click(screen.getByRole('button', { name: 'Registrarse' }));

    await screen.findByText('Las contraseñas no coinciden.');
  });

  it('envía el registro a la API y muestra confirmación en caso de éxito', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ message: 'Usuario registrado correctamente' })
    });
    vi.stubGlobal('fetch', fetchMock);

    renderRegister();
    fireEvent.change(screen.getByPlaceholderText('Crea una contraseña'), {
      target: { value: PASSWORD_FUERTE }
    });
    fireEvent.change(screen.getByPlaceholderText('Confirma tu contraseña'), {
      target: { value: PASSWORD_FUERTE }
    });
    fireEvent.change(screen.getByPlaceholderText('tu@correo.com'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'Emprendedor' }
    });
    fireEvent.click(screen.getByRole('button', { name: 'Registrarse' }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));

    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe('http://localhost:8000/api/usuario');
    expect(JSON.parse(options.body)).toEqual({
      email: 'test@example.com',
      password: PASSWORD_FUERTE,
      rol: 'Emprendedor'
    });

    expect(await screen.findByText('Usuario registrado correctamente')).toBeInTheDocument();
  });

  it('muestra el error del servidor cuando la API responde con error', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ message: 'El rol seleccionado no es válido' })
    });
    vi.stubGlobal('fetch', fetchMock);

    renderRegister();
    fireEvent.change(screen.getByPlaceholderText('Crea una contraseña'), {
      target: { value: PASSWORD_FUERTE }
    });
    fireEvent.change(screen.getByPlaceholderText('Confirma tu contraseña'), {
      target: { value: PASSWORD_FUERTE }
    });
    fireEvent.change(screen.getByPlaceholderText('tu@correo.com'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'Emprendedor' }
    });
    fireEvent.click(screen.getByRole('button', { name: 'Registrarse' }));

    expect(await screen.findByText('El rol seleccionado no es válido')).toBeInTheDocument();
  });
});