import React, { useState, useEffect } from 'react'

type Resena = { nombre: string; comentario: string }

export default function Resenas() {
  const [resenas, setResenas] = useState<Resena[]>([])
  const [nombre, setNombre] = useState('')
  const [comentario, setComentario] = useState('')

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('resenas') || '[]')
    setResenas(saved)
  }, [])

  useEffect(() => {
    localStorage.setItem('resenas', JSON.stringify(resenas))
  }, [resenas])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nombre || !comentario) {
      alert('Completa ambos campos')
      return
    }
    setResenas(prev => [...prev, { nombre, comentario }])
    setNombre('')
    setComentario('')
  }

  return (
    <section className="main-article">
      <h1 className="main-title">Reseñas</h1>
      <form id="formResena" onSubmit={handleSubmit} className="form-contacto">
        <label className="main-text">Nombre</label>
        <input className="input-contacto" id="nombreCliente" value={nombre} onChange={e => setNombre(e.target.value)} />

        <label className="main-text">Comentario</label>
        <textarea className="input-contacto" id="comentario" value={comentario} onChange={e => setComentario(e.target.value)} />

        <button className="btn-custom" type="submit">Enviar reseña</button>
      </form>

      <div>
        <h2 className="section-title">Reseñas de clientes</h2>
        <ul id="listaResenas">
          {resenas.map((r, i) => (
            <li key={i} className="list-group-item"><strong>{r.nombre}:</strong> {r.comentario}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}
