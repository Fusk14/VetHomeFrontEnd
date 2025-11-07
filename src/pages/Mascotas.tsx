import React, { useState, useEffect } from 'react'

type Mascota = {
  nombre: string
  tipo: string
  raza?: string
  color?: string
  edad: string
  peso?: string
  genero?: string
  observaciones?: string
}


export default function Mascotas() {
  const [mascotas, setMascotas] = useState<Mascota[]>([])
  const [nombre, setNombre] = useState('')
  const [tipo, setTipo] = useState('perro')
  const [raza, setRaza] = useState('')
  const [color, setColor] = useState('')
  const [edad, setEdad] = useState('')
  const [peso, setPeso] = useState('')
  const [genero, setGenero] = useState('')
  const [observaciones, setObservaciones] = useState('')

  //Carga todas las mascotas 
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('mascotas') || '[]')
    setMascotas(saved)
  }, [])

  //guarda mascotas
  useEffect(() => {
    localStorage.setItem('mascotas', JSON.stringify(mascotas))
  }, [mascotas])

  //valida campos
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nombre || !tipo || edad === '') {
      alert('Debes completar Nombre, Tipo y Edad')
      return
    }
    const m: Mascota = { nombre, tipo, raza, color, edad, peso, genero, observaciones }
    setMascotas(prev => [...prev, m])
    setNombre(''); setTipo('perro'); setRaza(''); setColor(''); setEdad(''); setPeso(''); setGenero(''); setObservaciones('')
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

        <label className="main-text">Color</label>
        <input className="input-contacto" id="color" value={color} onChange={e => setColor(e.target.value)} />

        <label className="main-text">Edad</label>
        <input className="input-contacto" id="edad" value={edad} onChange={e => setEdad(e.target.value)} />

        <label className="main-text">Peso (kg)</label>
        <input className="input-contacto" id="peso" value={peso} onChange={e => setPeso(e.target.value)} />

        <label className="main-text">Género</label>
        <input className="input-contacto" id="genero" value={genero} onChange={e => setGenero(e.target.value)} />

        <label className="main-text">Observaciones</label>
        <textarea className="input-contacto" id="observaciones" value={observaciones} onChange={e => setObservaciones(e.target.value)} />

        <button type="submit" className="btn-custom">Agregar mascota</button>
      </form>

      <div>
        <h2 className="section-title">Listado</h2>
        <ul id="listaMascotas">
          {mascotas.map((m, i) => (
            <li key={i} className="list-group-item">
              <strong>{m.nombre}</strong> ({m.tipo}{m.raza ? ', ' + m.raza : ''})<br />
              Edad: {m.edad} años{m.peso ? ' | Peso: ' + m.peso + ' kg' : ''}{m.color ? ' | Color: ' + m.color : ''}{m.genero ? ' | ' + m.genero : ''}
              {m.observaciones ? <div><em>Obs: {m.observaciones}</em></div> : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
