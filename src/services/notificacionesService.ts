/**
 * Servicio para gestionar notificaciones
 */
import { buildApiUrl, API_CONFIG } from '../config/api.config'
import { apiGet, apiPost, apiDelete } from './apiClient'
import type { Notificacion } from '../types/api.types'

const NOTIFICACIONES_PATH = '/api/notificaciones'

/**
 * Obtiene todas las notificaciones
 */
export const getAllNotificaciones = async (): Promise<{ data?: Notificacion[]; error?: string }> => {
  const url = buildApiUrl(API_CONFIG.NOTIFICACIONES, NOTIFICACIONES_PATH)
  
  const response = await apiGet<Notificacion[]>(url, true)
  
  if (response.error) {
    return { error: response.error }
  }

  return { data: response.data }
}

/**
 * Obtiene una notificación por ID
 */
export const getNotificacionById = async (id: number): Promise<{ data?: Notificacion; error?: string }> => {
  const url = buildApiUrl(API_CONFIG.NOTIFICACIONES, `${NOTIFICACIONES_PATH}/${id}`)
  
  const response = await apiGet<Notificacion>(url, true)
  
  if (response.error) {
    return { error: response.error }
  }

  return { data: response.data }
}

/**
 * Obtiene notificaciones por ID de usuario
 */
export const getNotificacionesByUsuario = async (idUsuario: number): Promise<{ data?: Notificacion[]; error?: string }> => {
  const url = buildApiUrl(API_CONFIG.NOTIFICACIONES, `${NOTIFICACIONES_PATH}/usuario/${idUsuario}`)
  
  const response = await apiGet<Notificacion[]>(url, true)
  
  if (response.error) {
    return { error: response.error }
  }

  return { data: response.data }
}

/**
 * Crea una nueva notificación
 */
export const createNotificacion = async (notificacion: Omit<Notificacion, 'id'>): Promise<{ data?: Notificacion; error?: string }> => {
  const url = buildApiUrl(API_CONFIG.NOTIFICACIONES, NOTIFICACIONES_PATH)
  
  const response = await apiPost<Notificacion>(url, notificacion, true)
  
  if (response.error) {
    return { error: response.error }
  }

  return { data: response.data }
}

/**
 * Elimina una notificación
 */
export const deleteNotificacion = async (id: number): Promise<{ success: boolean; error?: string }> => {
  const url = buildApiUrl(API_CONFIG.NOTIFICACIONES, `${NOTIFICACIONES_PATH}/${id}`)
  
  const response = await apiDelete<void>(url, true)
  
  if (response.error) {
    return { success: false, error: response.error }
  }

  return { success: true }
}


