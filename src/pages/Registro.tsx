import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAlert } from '../context/AlertContext'

export default function Registro() {
  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [telefono, setTelefono] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [repetirContrasena, setRepetirContrasena] = useState('')
  const [correoValid, setCorreoValid] = useState<boolean | null>(null)
  const [passValid, setPassValid] = useState<boolean | null>(null)
  const [repetirValid, setRepetirValid] = useState<boolean | null>(null)
  const navigate = useNavigate()
  const { showAlert } = useAlert()
  // regex shared with Login
  const correoRegex = /^[A-Za-z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i

  const validateCorreo = (value: string) => {
    if (!value) return setCorreoValid(false)
    if (value.length > 100) return setCorreoValid(false)
    setCorreoValid(correoRegex.test(value))
  }
  const validatePass = (value: string) => {
    setPassValid(value.trim().length >= 4 && value.trim().length <= 10)
  }
  const validateRepetir = (value: string, base = contrasena) => {
    setRepetirValid(value === base && value.length > 0)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]')
    // run validators and set visual states
    validateCorreo(correo)
    validatePass(contrasena)
    validateRepetir(repetirContrasena)

    if (!correo || correo.length > 100 || !correoRegex.test(correo)) {
      showAlert('Ingresa un correo válido con dominio @duoc.cl, @profesor.duoc.cl o @gmail.com (max 100 caracteres)', 'error')
      return
    }
    if (contrasena.length < 4 || contrasena.length > 10) {
      showAlert('La contraseña debe tener entre 4 y 10 caracteres', 'error')
      return
    }

    // confirmar contraseña
    if (contrasena !== repetirContrasena) {
      showAlert('La contraseña y su confirmación no coinciden', 'error')
      return
    }

    if (usuarios.find((u: any) => u.correo === correo)) {
      showAlert('Correo ya registrado', 'error')
      return
    }
    usuarios.push({ nombre, correo, contrasena, telefono: telefono || '', rol: 'cliente' })
    localStorage.setItem('usuarios', JSON.stringify(usuarios))
    showAlert('Registro exitoso', 'success')
    navigate('/login')
  }

  return (
    <section className="main-article">
      <h1 className="main-title">Registro</h1>
      <form id="registroForm" onSubmit={handleSubmit}>
        <label htmlFor="nombre" className="main-text">Nombre</label>
        <input className="input-contacto" value={nombre} onChange={e => setNombre(e.target.value)} id="nombre" />
  <label htmlFor="correo" className="main-text">Correo</label>
  <input
    className={`input-contacto ${correoValid === false ? 'is-invalid' : correoValid === true ? 'is-valid' : ''}`}
    value={correo}
    onChange={e => { setCorreo(e.target.value); validateCorreo(e.target.value) }}
    id="correo"
    maxLength={100}
    placeholder="usuario@duoc.cl"
  />
  {correoValid === false && <div className="invalid-feedback">Correo inválido. Use @duoc.cl, @profesor.duoc.cl o @gmail.com (máx 100 caracteres).</div>}
  {correoValid === true && <div className="valid-feedback">Correo válido.</div>}
  <label htmlFor="telefono" className="main-text">Teléfono (opcional)</label>
  <input className="input-contacto" value={telefono} onChange={e => setTelefono(e.target.value)} id="telefono" placeholder="+56 9 1234 5678" />
  <div className="form-text">Opcional. Se usará para contacto.</div>
        <label htmlFor="contrasena" className="main-text">Contraseña</label>
        <input
          className={`input-contacto ${passValid === false ? 'is-invalid' : passValid === true ? 'is-valid' : ''}`}
          type="password"
          value={contrasena}
          onChange={e => { setContrasena(e.target.value); validatePass(e.target.value); validateRepetir(repetirContrasena, e.target.value) }}
          id="contrasena"
        />
        {passValid === false && <div className="invalid-feedback">La contraseña debe tener entre 4 y 10 caracteres.</div>}
        {passValid === true && <div className="valid-feedback">Contraseña válida.</div>}
        <label htmlFor="repetirContrasena" className="main-text">Repetir contraseña</label>
        <input
          className={`input-contacto ${repetirValid === false ? 'is-invalid' : repetirValid === true ? 'is-valid' : ''}`}
          type="password"
          value={repetirContrasena}
          onChange={e => { setRepetirContrasena(e.target.value); validateRepetir(e.target.value) }}
          id="repetirContrasena"
        />
        {repetirValid === false && <div className="invalid-feedback">Las contraseñas no coinciden.</div>}
        {repetirValid === true && <div className="valid-feedback">Las contraseñas coinciden.</div>}
        <button className="btn-custom" type="submit">Registrar</button>
      </form>
    </section>
  )
}
