/**
 * Servicio para autenticación (login y registro)
 */
import { buildApiUrl, API_CONFIG } from '../config/api.config'
import { apiPost, apiGet } from './apiClient'
import type { LoginRequest, RegisterRequest, Usuario } from '../types/api.types'

const AUTH_PATH = '/api/auth'
const USUARIOS_PATH = '/api/usuarios'

/**
 * Inicia sesión con correo y contraseña
 */
export const login = async (credentials: LoginRequest): Promise<{ success: boolean; user?: Usuario; error?: string }> => {
  const url = buildApiUrl(API_CONFIG.USUARIOS, `${AUTH_PATH}/login`)
  
  const response = await apiPost<{ message?: string }>(url, credentials)
  
  if (response.error) {
    return { success: false, error: response.error }
  }

  // Si el login es exitoso, obtener el usuario por correo
  if (response.status === 200) {
    const usuarioResponse = await getUsuarioByCorreo(credentials.correo)
    if (usuarioResponse.data) {
      return { success: true, user: usuarioResponse.data }
    }
  }

  return { success: false, error: 'Credenciales inválidas' }
}

/**
 * Registra un nuevo usuario
 */
export const register = async (userData: RegisterRequest): Promise<{ success: boolean; user?: Usuario; error?: string }> => {
  // Intentar primero con /api/auth/register
  let url = buildApiUrl(API_CONFIG.USUARIOS, `${AUTH_PATH}/register`)
  console.log('Intentando registro en:', url)
  
  let response = await apiPost<Usuario>(url, userData)
  
  // Si falla con 404, intentar con /api/usuarios como fallback
  if (response.status === 404) {
    console.log('Endpoint /api/auth/register no encontrado, intentando con /api/usuarios')
    url = buildApiUrl(API_CONFIG.USUARIOS, USUARIOS_PATH)
    console.log('Intentando registro en (fallback):', url)
    response = await apiPost<Usuario>(url, userData)
  }
  
  if (response.error) {
    console.error('Error en registro:', response.error, 'Status:', response.status)
    return { success: false, error: response.error }
  }

  if (response.data) {
    return { success: true, user: response.data }
  }

  return { success: false, error: 'Error al registrar usuario' }
}

/**
 * Obtiene un usuario por correo
 */
export const getUsuarioByCorreo = async (correo: string): Promise<{ data?: Usuario; error?: string }> => {
  const url = buildApiUrl(API_CONFIG.USUARIOS, `${USUARIOS_PATH}/correo/${encodeURIComponent(correo)}`)
  
  const response = await apiGet<Usuario>(url)
  
  if (response.error) {
    return { error: response.error }
  }

  return { data: response.data }
}

/**
 * Obtiene un usuario por RUT
 */
export const getUsuarioByRut = async (rut: string): Promise<{ data?: Usuario; error?: string }> => {
  const url = buildApiUrl(API_CONFIG.USUARIOS, `${USUARIOS_PATH}/rut/${encodeURIComponent(rut)}`)
  
  const response = await apiGet<Usuario>(url)
  
  if (response.error) {
    return { error: response.error }
  }

  return { data: response.data }
}

/**
 * Obtiene todos los usuarios
 */
export const getAllUsuarios = async (): Promise<{ data?: Usuario[]; error?: string }> => {
  const url = buildApiUrl(API_CONFIG.USUARIOS, USUARIOS_PATH)
  
  const response = await apiGet<Usuario[]>(url, true)
  
  if (response.error) {
    return { error: response.error }
  }

  return { data: response.data }
}

/**
 * Crea un nuevo usuario (para admin)
 */
export const createUsuario = async (usuario: Omit<Usuario, 'id'>): Promise<{ data?: Usuario; error?: string }> => {
  const url = buildApiUrl(API_CONFIG.USUARIOS, USUARIOS_PATH)
  
  const response = await apiPost<Usuario>(url, usuario, true)
  
  if (response.error) {
    return { error: response.error }
  }

  return { data: response.data }
}


