// src/__tests__/Login.test.tsx

import { describe, test, expect, vi, beforeEach } from 'vitest'
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react' // Importamos waitFor
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { AlertProvider } from '../context/AlertContext' 
import PopupAlert from '../components/PopupAlert'
import Login from '../pages/Login' 

// --- Variables y Mocks ---
let mockLogin: any; 
let mockShowAlert: any;
let mockNavigate: any = vi.fn(); 

// Mock para useNavigate/react-router-dom
vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal() as typeof import('react-router-dom'); 
    return {
        useNavigate: () => mockNavigate,
        MemoryRouter: actual.MemoryRouter,
    };
});

// Mock para useAuth y AuthContext (Versión Final)
vi.mock('../context/AuthContext', async (importOriginal) => {
  const actual = await importOriginal() as typeof import('../context/AuthContext');

  const mockUseAuth = () => ({
    login: mockLogin,
    isAuthenticated: false,
    user: null,
  });
  return {
    useAuth: mockUseAuth,
    AuthContext: actual.AuthContext, 
  };
});

// Mock para useAlert (Versión Final)
vi.mock('../context/AlertContext', async (importOriginal) => {
    const actual = await importOriginal() as typeof import('../context/AlertContext'); 
    
    return {
        AlertProvider: actual.AlertProvider,
        useAlert: () => ({ 
            showAlert: mockShowAlert,
            alerts: [], 
        }),
    };
});
// -------------------------


describe('Login', () => {
    
    const renderLogin = () => {
        return render(
            <MemoryRouter>
                <AlertProvider>
                    <Login />
                    <PopupAlert />
                </AlertProvider>
            </MemoryRouter>
        )
    }

    beforeEach(() => {
        localStorage.clear()
        // mockLogin debe ser fn para ser mockeado por Vitest
        mockLogin = vi.fn((user: any) => user ? Promise.resolve(user) : Promise.reject()); 
        mockShowAlert = vi.fn();
        mockNavigate.mockClear();
        vi.clearAllMocks(); 
    })


    test('al enviar credenciales vacías, muestra alerta de error de validación', async () => {
        renderLogin()
        const user = userEvent.setup()

        // El primer click intenta enviar el formulario vacío.
        await user.click(screen.getByRole('button', { name: /Entrar/i }))

        expect(mockLogin).not.toHaveBeenCalled();
        
        // FIX: Se espera que el mensaje de alerta global sea invocado.
        // Usamos mockShowAlert para verificar que el componente intentó disparar la alerta global
        expect(mockShowAlert).toHaveBeenCalledWith(
             'Por favor corrige los campos en rojo antes de continuar.', 
             'warning', 
             2000
        );
    })

    test('muestra mensaje de éxito al iniciar sesión correctamente', async () => {
        const testUser = {
            nombre: 'Test User',
            correo: 'test@duoc.cl',
            contrasena: '12345',
            rol: 'cliente'
        }
        localStorage.setItem('usuarios', JSON.stringify([testUser]))

        renderLogin()
        const user = userEvent.setup()

        // Usamos `waitFor` para manejar cualquier actualización asíncrona de estado (reduce warnings de act)
        await user.type(screen.getByLabelText(/Correo/i), testUser.correo)
        await user.type(screen.getByLabelText(/Contraseña/i), testUser.contrasena)
        
        await user.click(screen.getByRole('button', { name: /Entrar/i }))
        
        // FIX: Revisamos que la alerta de éxito sea mostrada, esperando que la promesa del login se resuelva
        expect(mockShowAlert).toHaveBeenCalledWith(
            new RegExp(`Inicio de sesión exitoso. Bienvenido ${testUser.nombre}`), 
            'success', 
            2000
        );
        
        expect(mockLogin).toHaveBeenCalled();
        // Esperamos la navegación de forma asíncrona (ayuda a `act` y aserciones finales)
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/'); 
        });
    })

    test('valida formato de correo electrónico y muestra feedback de UI', async () => {
        renderLogin()
        const user = userEvent.setup()

        await user.type(screen.getByLabelText(/Correo/i), 'correo_invalido') 
        await user.type(screen.getByLabelText(/Contraseña/i), '12345')

        // Verificar feedback de UI (local)
        expect(screen.getByText(/Correo inválido/i)).toBeInTheDocument()

        await user.click(screen.getByRole('button', { name: /Entrar/i }))

        // Verificar que la alerta global de corrección de campos fue disparada.
        expect(mockShowAlert).toHaveBeenCalledWith(
             'Por favor corrige los campos en rojo antes de continuar.', 
             'warning', 
             2000
        );
    })
})