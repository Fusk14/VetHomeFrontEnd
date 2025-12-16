import React, { useContext, useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom' 
import { AuthContext } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate() // Inicializa el hook de navegación
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Función de navegacion
  const handleNavigation = (path: string) => {
    navigate(path)
    setIsMenuOpen(false) //Cierra el menú
  }

  const handleLogout = () => {
    logout() // Ejecuta logout
    setIsMenuOpen(false) // Cierra menú
  }

  //Efecto para cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'hidden' 
    } else {
      document.body.style.overflow = 'unset' 
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen])

  return (
    <nav className="nav-bar" ref={menuRef}>
      <div className="nav-header">
        <h1 className="nav-logo">VetHome</h1>
        <button 
          className={`nav-menu-toggle ${isMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      <div className={`nav-menu ${isMenuOpen ? 'nav-menu-open' : ''}`}>
        <div className="nav-menu-content">
          <button onClick={() => handleNavigation('/')} className="nav-btn">Inicio</button>
          <button onClick={() => handleNavigation('/nosotros')} className="nav-btn">Nosotros</button>
          <button onClick={() => handleNavigation('/blogs')} className="nav-btn">Blogs</button>
          <button onClick={() => handleNavigation('/contacto')} className="nav-btn">Contacto</button>
          
          {user && user.rol === 'admin' && (
            <button onClick={() => handleNavigation('/admin')} className="nav-btn">Admin</button>
          )}
          
          <button onClick={() => handleNavigation('/inventario')} className="nav-btn">Productos</button>
          <button onClick={() => handleNavigation('/mascotas')} className="nav-btn">Mascotas</button>
          <button onClick={() => handleNavigation('/consultas')} className="nav-btn">Consultas</button>
          <button onClick={() => handleNavigation('/resenas')} className="nav-btn">Reseñas</button>
          
          <div className="nav-divider"></div>
          
          {!user ? (
            <>
              <button onClick={() => handleNavigation('/login')} className="nav-btn nav-btn-primary">Login</button>
              <button onClick={() => handleNavigation('/registro')} className="nav-btn nav-btn-secondary">Registro</button>
            </>
          ) : (
            <button onClick={handleLogout} className="nav-btn nav-btn-logout">Cerrar sesión</button>
          )}
        </div>
      </div>
      
      {isMenuOpen && <div className="nav-overlay" onClick={() => setIsMenuOpen(false)}></div>}
    </nav>
  )
}