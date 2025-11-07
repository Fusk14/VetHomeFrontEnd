import React from 'react'
import { Usuario } from '../../types/admin'

interface UserManagementProps {
  usuarios: Usuario[]
  onCambiarRol: (id: string, rol: 'cliente' | 'admin') => void
  onEliminarUsuario: (id: string) => void
  usuarioActual: any
}

export default function UserManagement({ 
  usuarios, 
  onCambiarRol, 
  onEliminarUsuario, 
  usuarioActual 
}: UserManagementProps) {
  
  const handleEliminarUsuario = (usuario: Usuario) => {
    if (usuarioActual?.correo === usuario.correo) {
      alert('No puedes eliminar tu propia cuenta')
      return
    }
    
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return
    onEliminarUsuario(usuario.id)
  }

  return (
    <div>
      <div className="section-header">
        <h1 className="admin-main-title">Gestión de Usuarios</h1>
        <p>Total: {usuarios.length} usuarios registrados</p>
      </div>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Rol</th>
              <th>Fecha Registro</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(usuario => (
              <tr key={usuario.id} className={usuarioActual?.correo === usuario.correo ? 'current-user' : ''}>
                <td>{usuario.nombre}</td>
                <td>{usuario.correo}</td>
                <td>{usuario.telefono || 'No especificado'}</td>
                <td>
                  <select
                    value={usuario.rol}
                    onChange={(e) => onCambiarRol(usuario.id, e.target.value as 'cliente' | 'admin')}
                    disabled={usuarioActual?.correo === usuario.correo}
                    className="role-select"
                  >
                    <option value="cliente">Cliente</option>
                    <option value="admin">Administrador</option>
                  </select>
                </td>
                <td>{new Date(usuario.fechaRegistro).toLocaleDateString()}</td>
                <td>
                  <button
                    onClick={() => handleEliminarUsuario(usuario)}
                    disabled={usuarioActual?.correo === usuario.correo}
                    className="btn-danger"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}