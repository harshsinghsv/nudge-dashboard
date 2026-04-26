export interface OfferRow {
  offer_id: string
  merchant_name: string
  headline: string
  body: string
  discount_pct: number
  created_at: string
  expires_at: string
  status: 'sent' | 'redeemed' | 'dismissed' | 'expired'
  cashback_amount?: number
}

export interface DashboardMetrics {
  offers_sent: number
  redeemed: number
  accept_rate: number
  revenue_recovered: number
}

export interface MerchantRule {
  merchant_id: string
  merchant_name: string
  max_discount_pct: number
  trigger_density_pct: number
  active_hours_start: string
  active_hours_end: string
  goal: 'fill_quiet' | 'move_item' | 'footfall'
}

export interface ContextState {
  weather: {
    temp_c: number
    condition: string
  }
  payone_density_pct: number
  merchant_id: string
  merchant_name: string
  distance_m: number
  timestamp: string
  trigger_active: boolean
}

export interface OfferPayload {
  offer_id: string
  merchant_name: string
  distance_m: number
  headline: string
  body: string
  discount_pct: number
  expires_minutes: number
  tone: 'warm' | 'energetic' | 'calm'
}
