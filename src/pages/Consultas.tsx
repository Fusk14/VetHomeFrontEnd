import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useAlert } from '../context/AlertContext'
import { getAllConsultas, createConsulta } from '../services/consultasService'
import { getAllMascotas } from '../services/mascotasService'
import type { Consulta } from '../types/api.types'
import type { Mascota } from '../types/api.types'

export default function Consultas() {
  const { user } = useAuth()
  const { showAlert } = useAlert()
  const [consultas, setConsultas] = useState<Consulta[]>([])
  const [mascotas, setMascotas] = useState<Mascota[]>([])
  const [idMascota, setIdMascota] = useState('')
  const [fecha, setFecha] = useState('')
  const [motivo, setMotivo] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Cargar mascotas y consultas
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      
      // Cargar mascotas del usuario
      if (user?.id) {
        const mascotasResult = await getAllMascotas()
        if (mascotasResult.data) {
          // Filtrar solo las mascotas del usuario actual
          const userMascotas = mascotasResult.data.filter(m => m.idCliente === user.id)
          setMascotas(userMascotas)
        }
      }

      // Cargar consultas
      const consultasResult = await getAllConsultas()
      if (consultasResult.error) {
        showAlert('Error al cargar consultas: ' + consultasResult.error, 'error')
      } else if (consultasResult.data) {
        // Filtrar solo las consultas del usuario actual
        const userConsultas = consultasResult.data.filter(c => c.idCliente === user?.id)
        setConsultas(userConsultas)
      }
      
      setIsLoading(false)
    }
    loadData()
  }, [user, showAlert])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user?.id) {
      showAlert('Debes iniciar sesión para solicitar consultas', 'error')
      return
    }

    if (!idMascota || !fecha || !motivo) {
      showAlert('Debes completar todos los campos', 'error')
      return
    }

    const mascotaId = parseInt(idMascota)
    if (isNaN(mascotaId)) {
      showAlert('Selecciona una mascota válida', 'error')
      return
    }

    setIsLoading(true)
    try {
      const nuevaConsulta = {
        idMascota: mascotaId,
        idVeterinario: 1, // Por defecto, puedes ajustar esto según tu lógica
        idCliente: user.id,
        fecha: fecha,
        motivo: motivo.trim(),
      }

      const result = await createConsulta(nuevaConsulta)
      
      if (result.error) {
        showAlert('Error al crear consulta: ' + result.error, 'error')
      } else if (result.data) {
        showAlert('Consulta solicitada exitosamente', 'success')
        setConsultas(prev => [...prev, result.data!])
        // Limpiar formulario
        setIdMascota('')
        setFecha('')
        setMotivo('')
      }
    } catch (error) {
      showAlert('Error de conexión. Verifica que el microservicio esté corriendo.', 'error')
      console.error('Error en registro de consulta:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="main-article">
      <h1 className="main-title">Solicitar Consulta</h1>
      <form id="formConsulta" onSubmit={handleSubmit} className="form-contacto">
        <label className="main-text">Mascota</label>
        <select 
          className="input-contacto" 
          id="mascota" 
          value={idMascota} 
          onChange={e => setIdMascota(e.target.value)}
          required
        >
          <option value="">Selecciona una mascota</option>
          {mascotas.map(m => (
            <option key={m.id} value={m.id}>{m.nombre} ({m.especie})</option>
          ))}
        </select>

        <label className="main-text">Fecha</label>
        <input className="input-contacto" id="fecha" type="date" value={fecha} onChange={e => setFecha(e.target.value)} required />

        <label className="main-text">Motivo</label>
        <input className="input-contacto" id="motivo" value={motivo} onChange={e => setMotivo(e.target.value)} required />

        <button className="btn-custom" type="submit" disabled={isLoading}>
          {isLoading ? 'Enviando...' : 'Enviar'}
        </button>
      </form>

      <div>
        <h2 className="section-title">Historial de consultas</h2>
        {isLoading && consultas.length === 0 ? (
          <p className="main-text">Cargando consultas...</p>
        ) : consultas.length === 0 ? (
          <p className="main-text">No hay consultas registradas</p>
        ) : (
          <ul id="listaConsultas">
            {consultas.map((c) => (
              <li key={c.id} className="list-group-item">
                📅 {c.fecha} - Motivo: {c.motivo}
                {c.diagnostico && <div><strong>Diagnóstico:</strong> {c.diagnostico}</div>}
                {c.tratamiento && <div><strong>Tratamiento:</strong> {c.tratamiento}</div>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
