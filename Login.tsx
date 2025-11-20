import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useAlert } from '../context/AlertContext'

export default function Login() {
  const { login } = useAuth()
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [correoValid, setCorreoValid] = useState<boolean | null>(null)
  const [passValid, setPassValid] = useState<boolean | null>(null)
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    validateCorreo(correo)
    validatePass(contrasena)

    if (!correoRegex.test(correo) || correo.length > 100 || contrasena.trim() === '') {
      showAlert('Por favor corrige los campos en rojo antes de continuar.', 'error')
      return
    }

    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]')
    const usuario = usuarios.find((u: any) => u.correo === correo && u.contrasena === contrasena)
    if (!usuario) {
      showAlert('Credenciales inválidas. Verifica tus datos o regístrate.', 'error')
      return
    }

    const user = { nombre: usuario.nombre, correo: usuario.correo, rol: usuario.rol || 'cliente' }
    login(user)
    showAlert('Inicio de sesión exitoso. Bienvenido ' + usuario.nombre, 'success')
    navigate('/')
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

        <button className="btn-custom" type="submit">Entrar</button>
      </form>
    </section>
  )
}
