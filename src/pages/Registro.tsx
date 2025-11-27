import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAlert } from '../context/AlertContext'
import { register as registerService } from '../services/authService'

export default function Registro() {
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [rut, setRut] = useState('')
  const [correo, setCorreo] = useState('')
  const [telefono, setTelefono] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [repetirContrasena, setRepetirContrasena] = useState('')
  const [correoValid, setCorreoValid] = useState<boolean | null>(null)
  const [passValid, setPassValid] = useState<boolean | null>(null)
  const [repetirValid, setRepetirValid] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(false)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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

    if (!nombre.trim()) {
      showAlert('El nombre es requerido', 'error')
      return
    }

    if (!apellido.trim()) {
      showAlert('El apellido es requerido', 'error')
      return
    }

    if (!rut.trim()) {
      showAlert('El RUT es requerido', 'error')
      return
    }

    setIsLoading(true)
    try {
      const result = await registerService({
        rut: rut.trim(),
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        correo: correo.trim(),
        telefono: telefono.trim() || '+56900000000',
        contrasena: contrasena,
        rolNombre: 'CLIENTE', // Rol por defecto para nuevos usuarios
      })

      if (result.success) {
        showAlert('Registro exitoso', 'success')
        navigate('/login')
      } else {
        showAlert(result.error || 'Error al registrar usuario', 'error')
      }
    } catch (error) {
      showAlert('Error de conexión. Verifica que los microservicios estén corriendo.', 'error')
      console.error('Error en registro:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="main-article">
      <h1 className="main-title">Registro</h1>
      <form id="registroForm" onSubmit={handleSubmit}>
        <label htmlFor="rut" className="main-text">RUT</label>
        <input className="input-contacto" value={rut} onChange={e => setRut(e.target.value)} id="rut" placeholder="12345678-9" required />
        
        <label htmlFor="nombre" className="main-text">Nombre</label>
        <input className="input-contacto" value={nombre} onChange={e => setNombre(e.target.value)} id="nombre" required />
        
        <label htmlFor="apellido" className="main-text">Apellido</label>
        <input className="input-contacto" value={apellido} onChange={e => setApellido(e.target.value)} id="apellido" required />
        
        <label htmlFor="correo" className="main-text">Correo</label>
  <input
    className={`input-contacto ${correoValid === false ? 'is-invalid' : correoValid === true ? 'is-valid' : ''}`}
    value={correo}
    onChange={e => { setCorreo(e.target.value); validateCorreo(e.target.value) }}
    id="correo"
    maxLength={100}
    placeholder="usuario@duoc.cl"
    aria-describedby="correo-validation"
  />
  {correoValid === false && <div id="correo-validation" className="invalid-feedback">Correo inválido. Use @duoc.cl, @profesor.duoc.cl o @gmail.com (máx 100 caracteres).</div>}
  {correoValid === true && <div id="correo-validation" className="valid-feedback">Correo válido.</div>}
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
          aria-describedby="password-validation"
        />
        {passValid === false && <div id="password-validation" className="invalid-feedback">La contraseña debe tener entre 4 y 10 caracteres.</div>}
        {passValid === true && <div id="password-validation" className="valid-feedback">Contraseña válida.</div>}
        <label htmlFor="repetirContrasena" className="main-text">Repetir contraseña</label>
        <input
          className={`input-contacto ${repetirValid === false ? 'is-invalid' : repetirValid === true ? 'is-valid' : ''}`}
          type="password"
          value={repetirContrasena}
          onChange={e => { setRepetirContrasena(e.target.value); validateRepetir(e.target.value) }}
          id="repetirContrasena"
          aria-describedby="repetir-validation"
        />
        {repetirValid === false && <div id="repetir-validation" className="invalid-feedback">Las contraseñas no coinciden.</div>}
        {repetirValid === true && <div id="repetir-validation" className="valid-feedback">Las contraseñas coinciden.</div>}
        <button className="btn-custom" type="submit" disabled={isLoading}>
          {isLoading ? 'Registrando...' : 'Registrar'}
        </button>
      </form>
    </section>
  )
}
