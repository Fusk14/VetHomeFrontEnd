/**
 * Servicio para gestionar inventario (medicamentos y productos)
 */
import { buildApiUrl, API_CONFIG } from '../config/api.config'
import { apiGet, apiPost } from './apiClient'
import type { Medicamento, Producto } from '../types/api.types'

const MEDICAMENTOS_PATH = '/api/medicamentos'

/**
 * Obtiene todos los medicamentos
 */
export const getAllMedicamentos = async (): Promise<{ data?: Medicamento[]; error?: string }> => {
  const url = buildApiUrl(API_CONFIG.INVENTARIO, MEDICAMENTOS_PATH)
  
  const response = await apiGet<Medicamento[]>(url, true)
  
  if (response.error) {
    return { error: response.error }
  }

  return { data: response.data }
}

/**
 * Crea un nuevo medicamento
 */
export const createMedicamento = async (medicamento: Omit<Medicamento, 'id'>): Promise<{ data?: Medicamento; error?: string }> => {
  const url = buildApiUrl(API_CONFIG.INVENTARIO, MEDICAMENTOS_PATH)
  
  const response = await apiPost<Medicamento>(url, medicamento, true)
  
  if (response.error) {
    return { error: response.error }
  }

  return { data: response.data }
}

/**
 * Obtiene todos los productos (para el catálogo)
 * Nota: Si tienes un endpoint específico para productos, ajústalo aquí
 */
export const getAllProductos = async (): Promise<{ data?: Producto[]; error?: string }> => {
  // Por ahora usamos medicamentos, pero puedes crear un endpoint específico
  const medicamentosResponse = await getAllMedicamentos()
  
  if (medicamentosResponse.error) {
    return { error: medicamentosResponse.error }
  }

  // Convertir medicamentos a productos si es necesario
  const productos: Producto[] = medicamentosResponse.data?.map(m => ({
    id: m.id,
    nombre: m.nombre,
    stock: m.stock,
  })) || []

  return { data: productos }
}


