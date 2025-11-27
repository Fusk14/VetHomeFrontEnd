import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useAlert } from '../context/AlertContext'
import { getAllResenas, createResena } from '../services/resenasService'
import { getAllUsuarios } from '../services/authService'
import type { Resena } from '../types/api.types'
import type { Usuario } from '../types/api.types'

export default function Resenas() {
  const { user } = useAuth()
  const { showAlert } = useAlert()
  const [resenas, setResenas] = useState<Resena[]>([])
  const [veterinarios, setVeterinarios] = useState<Usuario[]>([])
  const [idVeterinario, setIdVeterinario] = useState('')
  const [comentario, setComentario] = useState('')
  const [calificacion, setCalificacion] = useState(5)
  const [isLoading, setIsLoading] = useState(false)

  // Cargar reseñas y veterinarios desde la API
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      
      // Cargar veterinarios
      const usuariosResult = await getAllUsuarios()
      if (usuariosResult.data) {
        // Filtrar solo usuarios con rol VETERINARIO
        const vets = usuariosResult.data.filter(u => 
          u.rol?.nombre?.toUpperCase() === 'VETERINARIO' || 
          u.rol?.nombre?.toUpperCase() === 'VETERINARIA' ||
          (typeof u.rol === 'string' && u.rol.toUpperCase() === 'VETERINARIO')
        )
        setVeterinarios(vets)
        
        // Si hay veterinarios, seleccionar el primero por defecto
        if (vets.length > 0 && !idVeterinario) {
          setIdVeterinario(vets[0].id?.toString() || '')
        }
      }
      
      // Cargar reseñas
      const resenasResult = await getAllResenas()
      if (resenasResult.error) {
        showAlert('Error al cargar reseñas: ' + resenasResult.error, 'error')
      } else if (resenasResult.data) {
        setResenas(resenasResult.data)
      }
      
      setIsLoading(false)
    }
    loadData()
  }, [showAlert])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user?.id) {
      showAlert('Debes iniciar sesión para enviar reseñas', 'error')
      return
    }

    if (!idVeterinario) {
      showAlert('Debes seleccionar un veterinario', 'error')
      return
    }

    if (!comentario.trim()) {
      showAlert('Completa el comentario', 'error')
      return
    }

    if (calificacion < 1 || calificacion > 5) {
      showAlert('La calificación debe estar entre 1 y 5', 'error')
      return
    }

    const veterinarioId = parseInt(idVeterinario)
    if (isNaN(veterinarioId)) {
      showAlert('Selecciona un veterinario válido', 'error')
      return
    }

    setIsLoading(true)
    try {
      const nuevaResena = {
        idCliente: user.id,
        idVeterinario: veterinarioId,
        calificacion: calificacion,
        comentario: comentario.trim(),
      }

      const result = await createResena(nuevaResena)
      
      if (result.error) {
        showAlert('Error al crear reseña: ' + result.error, 'error')
      } else if (result.data) {
        showAlert('Reseña enviada exitosamente', 'success')
        setResenas(prev => [...prev, result.data!])
        // Limpiar formulario (mantener veterinario seleccionado)
        setComentario('')
        setCalificacion(5)
      }
    } catch (error) {
      showAlert('Error de conexión. Verifica que el microservicio esté corriendo.', 'error')
      console.error('Error en registro de reseña:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="main-article">
      <h1 className="main-title">Reseñas</h1>
      <form id="formResena" onSubmit={handleSubmit} className="form-contacto">
        <label className="main-text">Veterinario</label>
        <select 
          className="input-contacto" 
          id="veterinario" 
          value={idVeterinario} 
          onChange={e => setIdVeterinario(e.target.value)}
          required
        >
          <option value="">Selecciona un veterinario</option>
          {veterinarios.map(vet => (
            <option key={vet.id} value={vet.id}>
              {vet.nombre} {vet.apellido || ''} {vet.correo ? `(${vet.correo})` : ''}
            </option>
          ))}
        </select>

        <label className="main-text">Calificación (1-5)</label>
        <select 
          className="input-contacto" 
          id="calificacion" 
          value={calificacion} 
          onChange={e => setCalificacion(parseInt(e.target.value))}
          required
        >
          <option value={5}>5 ⭐⭐⭐⭐⭐</option>
          <option value={4}>4 ⭐⭐⭐⭐</option>
          <option value={3}>3 ⭐⭐⭐</option>
          <option value={2}>2 ⭐⭐</option>
          <option value={1}>1 ⭐</option>
        </select>

        <label className="main-text">Comentario</label>
        <textarea 
          className="input-contacto" 
          id="comentario" 
          value={comentario} 
          onChange={e => setComentario(e.target.value)}
          required
        />

        <button className="btn-custom" type="submit" disabled={isLoading}>
          {isLoading ? 'Enviando...' : 'Enviar reseña'}
        </button>
      </form>

      <div>
        <h2 className="section-title">Reseñas de clientes</h2>
        {isLoading && resenas.length === 0 ? (
          <p className="main-text">Cargando reseñas...</p>
        ) : resenas.length === 0 ? (
          <p className="main-text">No hay reseñas registradas</p>
        ) : (
          <ul id="listaResenas">
            {resenas.map((r) => (
              <li key={r.id} className="list-group-item">
                {'⭐'.repeat(r.calificacion)} ({r.calificacion}/5)<br />
                <strong>Comentario:</strong> {r.comentario}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
