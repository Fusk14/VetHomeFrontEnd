import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useAlert } from '../context/AlertContext'
import { login as loginService } from '../services/authService'

export default function Login() {
  const { login } = useAuth()
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [correoValid, setCorreoValid] = useState<boolean | null>(null)
  const [passValid, setPassValid] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { showAlert } = useAlert()

  const correoRegex = /^[A-Za-z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i

  const validateCorreo = (value: string) => {
    if (!value) return setCorreoValid(false)
    if (value.length > 100) return setCorreoValid(false)
    setCorreoValid(correoRegex.test(value))
  }

  const validatePass = (value: string) => {
    const len = value.trim().length
    setPassValid(len >= 4 && len <= 10)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    validateCorreo(correo)
    validatePass(contrasena)

    if (!correoRegex.test(correo) || correo.length > 100 || contrasena.trim() === '') {
      showAlert('Por favor corrige los campos en rojo antes de continuar.', 'error')
      return
    }

    setIsLoading(true)
    try {
      const result = await loginService({ correo, contrasena })
      
      if (result.success && result.user) {
        // Adaptar el usuario del microservicio al formato esperado por AuthContext
        // Mapear ADMINISTRATIVO a admin para compatibilidad con el frontend
        const rolNombre = result.user.rol?.nombre?.toLowerCase() || 'cliente'
        const rolMapeado = rolNombre === 'administrativo' ? 'admin' : rolNombre
        
        const user = {
          nombre: result.user.nombre,
          correo: result.user.correo,
          rol: rolMapeado as 'cliente' | 'admin',
          id: result.user.id,
          apellido: result.user.apellido,
          telefono: result.user.telefono,
        }
        login(user)
        showAlert(`Inicio de sesión exitoso. Bienvenido ${result.user.nombre}`, 'success')
        navigate('/')
      } else {
        showAlert(result.error || 'Credenciales inválidas. Verifica tus datos o regístrate.', 'error')
      }
    } catch (error) {
      showAlert('Error de conexión. Verifica que los microservicios estén corriendo.', 'error')
      console.error('Error en login:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="main-article">
      <h1 className="main-title">Iniciar sesión</h1>
      <form onSubmit={handleSubmit} id="loginForm">
        <label htmlFor="correo" className="main-text">Correo</label>
        <input
          className={`input-contacto ${correoValid === false ? 'is-invalid' : correoValid === true ? 'is-valid' : ''}`}
          value={correo}
          onChange={e => { setCorreo(e.target.value); validateCorreo(e.target.value) }}
          id="correo"
          maxLength={100}
          placeholder="usuario@duoc.cl / usuario@profesor.duoc.cl / usuario@gmail.com"
          aria-describedby="correo-validation"
        />
        {correoValid === false && <div id="correo-validation" className="invalid-feedback">Correo inválido. Use @duoc.cl, @profesor.duoc.cl o @gmail.com (máx 100 caracteres).</div>}
        {correoValid === true && <div id="correo-validation" className="valid-feedback">Correo válido.</div>}

        <label htmlFor="contrasena" className="main-text">Contraseña</label>
        <input
          className={`input-contacto ${passValid === false ? 'is-invalid' : passValid === true ? 'is-valid' : ''}`}
          type="password"
          value={contrasena}
          onChange={e => { setContrasena(e.target.value); validatePass(e.target.value) }}
          id="contrasena"
          aria-describedby="password-validation"
        />
        {passValid === false && <div id="password-validation" className="invalid-feedback">La contraseña debe tener entre 4 y 10 caracteres.</div>}
        {passValid === true && <div id="password-validation" className="valid-feedback">Contraseña válida.</div>}

        <button className="btn-custom" type="submit" disabled={isLoading}>
          {isLoading ? 'Iniciando sesión...' : 'Entrar'}
        </button>
      </form>
    </section>
  )
}

