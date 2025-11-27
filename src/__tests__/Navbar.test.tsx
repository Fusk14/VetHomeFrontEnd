import { describe, test, expect, vi, beforeEach } from 'vitest'
import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { AuthContext } from '../context/AuthContext'
import '@testing-library/jest-dom'

const mockNavigate = vi.fn()

// Mock react-router-dom
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal() as typeof import('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    MemoryRouter: actual.MemoryRouter,
  }
})

describe('Navbar', () => {
  const mockLogout = vi.fn()
  
  const renderNavbar = (user: { nombre: string; correo: string; rol: string } | null = null) => {
    const authValue = {
      user,
      login: vi.fn(),
      logout: mockLogout,
    }
    
    return render(
      <MemoryRouter>
        <AuthContext.Provider value={authValue}>
          <Navbar />
        </AuthContext.Provider>
      </MemoryRouter>
    )
  }

  beforeEach(() => {
    mockNavigate.mockClear()
    mockLogout.mockClear()
    vi.clearAllMocks()
  })

  test('muestra el logo VetHome', () => {
    renderNavbar()
    expect(screen.getByText('VetHome')).toBeInTheDocument()
  })

  test('muestra botones de Login y Registro cuando el usuario no está autenticado', () => {
    renderNavbar(null)
    expect(screen.getByText('Login')).toBeInTheDocument()
    expect(screen.getByText('Registro')).toBeInTheDocument()
    expect(screen.queryByText('Cerrar sesión')).not.toBeInTheDocument()
  })

  test('muestra botón de Cerrar sesión cuando el usuario está autenticado', () => {
    const user = { nombre: 'Test User', correo: 'test@duoc.cl', rol: 'cliente' }
    renderNavbar(user)
    expect(screen.getByText('Cerrar sesión')).toBeInTheDocument()
    expect(screen.queryByText('Login')).not.toBeInTheDocument()
    expect(screen.queryByText('Registro')).not.toBeInTheDocument()
  })

  test('muestra botón de Admin cuando el usuario es administrador', () => {
    const adminUser = { nombre: 'Admin', correo: 'admin@duoc.cl', rol: 'admin' }
    renderNavbar(adminUser)
    expect(screen.getByText('Admin')).toBeInTheDocument()
  })

  test('no muestra botón de Admin cuando el usuario no es administrador', () => {
    const user = { nombre: 'Test User', correo: 'test@duoc.cl', rol: 'cliente' }
    renderNavbar(user)
    expect(screen.queryByText('Admin')).not.toBeInTheDocument()
  })

  test('navega a la ruta correcta al hacer clic en un botón de navegación', async () => {
    renderNavbar()
    const user = userEvent.setup()
    
    await user.click(screen.getByText('Inicio'))
    expect(mockNavigate).toHaveBeenCalledWith('/')
    
    await user.click(screen.getByText('Blogs'))
    expect(mockNavigate).toHaveBeenCalledWith('/blogs')
  })

  test('llama a logout cuando se hace clic en Cerrar sesión', async () => {
    const user = { nombre: 'Test User', correo: 'test@duoc.cl', rol: 'cliente' }
    renderNavbar(user)
    const userEventInstance = userEvent.setup()
    
    await userEventInstance.click(screen.getByText('Cerrar sesión'))
    expect(mockLogout).toHaveBeenCalledTimes(1)
  })

  test('abre y cierra el menú hamburguesa en móviles', async () => {
    renderNavbar()
    const user = userEvent.setup()
    const menuToggle = screen.getByLabelText('Toggle menu')
    
    // El menú debe estar cerrado inicialmente
    expect(menuToggle).toHaveAttribute('aria-expanded', 'false')
    
    // Abrir el menú
    await user.click(menuToggle)
    expect(menuToggle).toHaveAttribute('aria-expanded', 'true')
    
    // Cerrar el menú
    await user.click(menuToggle)
    expect(menuToggle).toHaveAttribute('aria-expanded', 'false')
  })

  test('muestra todos los botones de navegación principales', () => {
    renderNavbar()
    expect(screen.getByText('Inicio')).toBeInTheDocument()
    expect(screen.getByText('Nosotros')).toBeInTheDocument()
    expect(screen.getByText('Blogs')).toBeInTheDocument()
    expect(screen.getByText('Contacto')).toBeInTheDocument()
    expect(screen.getByText('Productos')).toBeInTheDocument()
    expect(screen.getByText('Mascotas')).toBeInTheDocument()
    expect(screen.getByText('Consultas')).toBeInTheDocument()
    expect(screen.getByText('Reseñas')).toBeInTheDocument()
  })
})


