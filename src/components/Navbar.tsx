import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useContext(AuthContext)

  return (
    <nav className="nav-bar">
      <Link to="/" className="nav-btn">Inicio</Link>
      <Link to="/nosotros" className="nav-btn">Nosotros</Link>
      <Link to="/blogs" className="nav-btn">Blogs</Link>
      <Link to="/contacto" className="nav-btn">Contacto</Link>

      {user && user.rol === 'admin' && <Link to="/admin" className="nav-btn">Admin</Link>}
      <Link to="/inventario" className="nav-btn">Productos</Link>
      <Link to="/mascotas" className="nav-btn">Mascotas</Link>
      <Link to="/consultas" className="nav-btn">Consultas</Link>
      <Link to="/resenas" className="nav-btn">Reseñas</Link>
      {!user ? (
        <>
          <Link to="/login" className="nav-btn">Login</Link>
          <Link to="/registro" className="nav-btn">Registro</Link>
        </>
      ) : (
        <button onClick={() => logout()} className="nav-btn">Cerrar sesión</button>
      )}
    </nav>
  )
}
