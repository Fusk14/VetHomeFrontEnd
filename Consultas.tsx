import React, { useState, useEffect } from 'react'

type Consulta = { mascota: string; fecha: string; motivo: string }

export default function Consultas() {
  const [consultas, setConsultas] = useState<Consulta[]>([])
  const [mascota, setMascota] = useState('')
  const [fecha, setFecha] = useState('')
  const [motivo, setMotivo] = useState('')

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('consultas') || '[]')
    setConsultas(saved)
  }, [])

  useEffect(() => {
    localStorage.setItem('consultas', JSON.stringify(consultas))
  }, [consultas])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!mascota || !fecha || !motivo) {
      alert('Debes completar todos los campos')
      return
    }
    setConsultas(prev => [...prev, { mascota, fecha, motivo }])
    setMascota(''); setFecha(''); setMotivo('')
  }

  return (
    <section className="main-article">
      <h1 className="main-title">Solicitar Consulta</h1>
      <form id="formConsulta" onSubmit={handleSubmit} className="form-contacto">
        <label className="main-text">Mascota</label>
        <input className="input-contacto" id="mascota" value={mascota} onChange={e => setMascota(e.target.value)} />

        <label className="main-text">Fecha</label>
        <input className="input-contacto" id="fecha" type="date" value={fecha} onChange={e => setFecha(e.target.value)} />

        <label className="main-text">Motivo</label>
        <input className="input-contacto" id="motivo" value={motivo} onChange={e => setMotivo(e.target.value)} />

        <button className="btn-custom" type="submit">Enviar</button>
      </form>

      <div>
        <h2 className="section-title">Historial de consultas</h2>
        <ul id="listaConsultas">
          {consultas.map((c, i) => (
            <li key={i} className="list-group-item">🐾 {c.mascota} - 📅 {c.fecha} - Motivo: {c.motivo}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}
