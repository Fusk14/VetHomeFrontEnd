import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Admin from './pages/Admin'
import Nosotros from './pages/Nosotros'
import Blogs from './pages/Blogs'
import Blog1 from './pages/Blog1'
import Blog2 from './pages/Blog2'
import Contacto from './pages/Contacto'
import Inventario from './pages/Inventario'
import Mascotas from './pages/Mascotas'
import Consultas from './pages/Consultas'
import Resenas from './pages/Resenas'
import Login from './pages/Login'
import Registro from './pages/Registro'
import Navbar from './components/Navbar'
import { AuthProvider } from './context/AuthContext'
import { AlertProvider } from './context/AlertContext'
import PopupAlert from './components/PopupAlert'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <AlertProvider>
      <AuthProvider>
        <div>
        <header>
          <Navbar />
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blogs/1" element={<Blog1 />} />
            <Route path="/blogs/2" element={<Blog2 />} />
            <Route path="/contacto" element={<Contacto />} />

            <Route path="/inventario" element={<Inventario />} />
            <Route path="/mascotas" element={<Mascotas />} />
            <Route path="/consultas" element={<Consultas />} />
            <Route path="/resenas" element={<Resenas />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/admin" element={<ProtectedRoute> <Admin /> </ProtectedRoute>} />
          </Routes>
        </main>

        <footer>
          <p>&copy; 2025 Veterinaria. Todos los derechos reservados.</p>
        </footer>
      </div>
      <PopupAlert />
      </AuthProvider>
    </AlertProvider>
  )
}
