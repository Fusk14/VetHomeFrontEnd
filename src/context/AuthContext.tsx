import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

type User = {
  nombre: string
  correo: string
  rol: string
}

type AuthContextType = {
  user: User | null
  login: (user: User) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {}
})

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const stored = localStorage.getItem('auth_user')
    if (stored) setUser(JSON.parse(stored))
  }, [])

  const login = (u: User) => {
    setUser(u)
    localStorage.setItem('auth_user', JSON.stringify(u))
    localStorage.setItem('isLoggedIn', 'true')
    localStorage.setItem('nombre', u.nombre)
    localStorage.setItem('correo', u.correo)
    localStorage.setItem('rol', u.rol)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('auth_user')
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('nombre')
    localStorage.removeItem('correo')
    localStorage.removeItem('rol')
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// ✅ Hook auxiliar para usar y mockear fácilmente
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
