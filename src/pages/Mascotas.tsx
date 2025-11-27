import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useAlert } from '../context/AlertContext'
import { getAllMascotas, createMascota } from '../services/mascotasService'
import type { Mascota } from '../types/api.types'

export default function Mascotas() {
  const { user } = useAuth()
  const { showAlert } = useAlert()
  const [mascotas, setMascotas] = useState<Mascota[]>([])
  const [nombre, setNombre] = useState('')
  const [tipo, setTipo] = useState('perro')
  const [raza, setRaza] = useState('')
  const [edad, setEdad] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Carga todas las mascotas desde la API
  useEffect(() => {
    const loadMascotas = async () => {
      setIsLoading(true)
      const result = await getAllMascotas()
      if (result.error) {
        showAlert('Error al cargar mascotas: ' + result.error, 'error')
      } else if (result.data) {
        // Filtrar solo las mascotas del usuario actual
        if (user?.id) {
          const userMascotas = result.data.filter(m => m.idCliente === user.id)
          setMascotas(userMascotas)
        } else {
          setMascotas(result.data)
        }
      }
      setIsLoading(false)
    }
    loadMascotas()
  }, [showAlert, user])

  // Valida campos y guarda en la API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user?.id) {
      showAlert('Debes iniciar sesión para agregar mascotas', 'error')
      return
    }

    if (!nombre || !tipo || !edad) {
      showAlert('Debes completar Nombre, Tipo y Edad', 'error')
      return
    }

    const edadNum = parseInt(edad)
    if (isNaN(edadNum) || edadNum < 0) {
      showAlert('La edad debe ser un número válido', 'error')
      return
    }

    setIsLoading(true)
    try {
      const nuevaMascota = {
        idCliente: user.id,
        nombre: nombre.trim(),
        especie: tipo,
        raza: raza.trim() || 'Sin raza',
        edad: edadNum,
      }

      const result = await createMascota(nuevaMascota)
      
      if (result.error) {
        showAlert('Error al crear mascota: ' + result.error, 'error')
      } else if (result.data) {
        showAlert('Mascota agregada exitosamente', 'success')
        setMascotas(prev => [...prev, result.data!])
        // Limpiar formulario
        setNombre('')
        setTipo('perro')
        setRaza('')
        setEdad('')
      }
    } catch (error) {
      showAlert('Error de conexión. Verifica que el microservicio esté corriendo.', 'error')
      console.error('Error en registro de mascota:', error)
    } finally {
      setIsLoading(false)
    }
  }
//pagina
  return (
    <section className="main-article">
      <h1 className="main-title">Mascotas</h1>
      <form id="formMascota" onSubmit={handleSubmit} className="form-contacto">
        <label className="main-text">Nombre</label>
        <input className="input-contacto" id="nombreMascota" value={nombre} onChange={e => setNombre(e.target.value)} />

        <label className="main-text">Tipo</label>
        <select className="input-contacto" value={tipo} onChange={e => setTipo(e.target.value)} id="tipo">
          <option value="perro">Perro</option>
          <option value="gato">Gato</option>
          <option value="otro">Otro</option>
        </select>

        <label className="main-text">Raza</label>
        <input className="input-contacto" id="raza" value={raza} onChange={e => setRaza(e.target.value)} />

        <label className="main-text">Edad (años)</label>
        <input className="input-contacto" id="edad" type="number" min="0" value={edad} onChange={e => setEdad(e.target.value)} />

        <button type="submit" className="btn-custom" disabled={isLoading}>
          {isLoading ? 'Guardando...' : 'Agregar mascota'}
        </button>
      </form>

      <div>
        <h2 className="section-title">Listado</h2>
        {isLoading && mascotas.length === 0 ? (
          <p className="main-text">Cargando mascotas...</p>
        ) : mascotas.length === 0 ? (
          <p className="main-text">No hay mascotas registradas</p>
        ) : (
          <ul id="listaMascotas">
            {mascotas.map((m) => (
              <li key={m.id} className="list-group-item">
                <strong>{m.nombre}</strong> ({m.especie}{m.raza ? ', ' + m.raza : ''})<br />
                Edad: {m.edad} años
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
