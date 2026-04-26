import axios from 'axios'
import type { DashboardMetrics, OfferPayload, ContextState, MerchantRule, OfferRow } from '@/types'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: BASE_URL,
})

export const getDashboardMetrics = async (): Promise<DashboardMetrics> => {
  const { data } = await api.get('/api/dashboard')
  return data
}

export const getRecentOffers = async (): Promise<OfferRow[]> => {
  const { data } = await api.get('/api/offers/recent')
  return data
}

export const getContextState = async (): Promise<ContextState> => {
  const { data } = await api.get('/api/context')
  return data
}

export const getMerchantRules = async (): Promise<MerchantRule> => {
  const { data } = await api.get('/api/rules')
  return data
}

export const updateMerchantRules = async (rules: Partial<MerchantRule>): Promise<MerchantRule> => {
  const { data } = await api.post('/api/rules', rules)
  return data
}

export const previewOffer = async (rules: Partial<MerchantRule>): Promise<OfferPayload> => {
  const { data } = await api.post('/api/preview-offer', rules)
  return data
}

export const simulateScan = async (offer_id: string): Promise<{ success: boolean }> => {
  const { data } = await api.post('/api/simulate-scan', { offer_id })
  return data
}
