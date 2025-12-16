/**
 * Servicio para gestionar mascotas
 */
import { buildApiUrl, API_CONFIG } from '../config/api.config'
import { apiGet, apiPost, apiDelete } from './apiClient'
import type { Mascota } from '../types/api.types'

const MASCOTAS_PATH = '/api/mascotas'

/**
 * Obtiene todas las mascotas
 */
export const getAllMascotas = async (): Promise<{ data?: Mascota[]; error?: string }> => {
  const url = buildApiUrl(API_CONFIG.MASCOTAS, MASCOTAS_PATH)
  
  const response = await apiGet<Mascota[]>(url, true)
  
  if (response.error) {
    return { error: response.error }
  }

  return { data: response.data }
}

/**
 * Obtiene una mascota por ID
 */
export const getMascotaById = async (id: number): Promise<{ data?: Mascota; error?: string }> => {
  const url = buildApiUrl(API_CONFIG.MASCOTAS, `${MASCOTAS_PATH}/${id}`)
  
  const response = await apiGet<Mascota>(url, true)
  
  if (response.error) {
    return { error: response.error }
  }

  return { data: response.data }
}

/**
 * Crea una nueva mascota
 */
export const createMascota = async (mascota: Omit<Mascota, 'id'>): Promise<{ data?: Mascota; error?: string }> => {
  const url = buildApiUrl(API_CONFIG.MASCOTAS, MASCOTAS_PATH)
  
  const response = await apiPost<Mascota>(url, mascota, true)
  
  if (response.error) {
    return { error: response.error }
  }

  return { data: response.data }
}

/**
 * Elimina una mascota
 */
export const deleteMascota = async (id: number): Promise<{ success: boolean; error?: string }> => {
  const url = buildApiUrl(API_CONFIG.MASCOTAS, `${MASCOTAS_PATH}/${id}`)
  
  const response = await apiDelete<void>(url, true)
  
  if (response.error) {
    return { success: false, error: response.error }
  }

  return { success: true }
}



