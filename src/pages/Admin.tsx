import React from 'react'

export default function Admin() {
  return (
    <section className="main-article admin-article">
      <div className="admin-container">
        <aside className="admin-sidebar">
          <h2 className="admin-menu-title">Menú Admin</h2>
          <ul className="admin-menu-list">
            <li className="admin-menu-item"><a href="#productos" className="admin-menu-link">Gestionar Productos</a></li>
            <li className="admin-menu-item"><a href="#usuarios" className="admin-menu-link">Gestionar Usuarios</a></li>
          </ul>
        </aside>
        <section className="admin-main-panel">
          <h1 className="admin-main-title">Bienvenido al Panel de Administración</h1>
          <p>Desde aquí puedes gestionar productos y usuarios de la veterinaria.</p>
        </section>
      </div>
    </section>
  )
}
