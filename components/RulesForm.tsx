// NUDGE: Form for merchants to configure trigger thresholds, constraints, and goals
'use client'

import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getMerchantRules, updateMerchantRules } from '@/lib/api'
import OfferPreview from './OfferPreview'
import type { MerchantRule } from '@/types'

const HOURS_OPTIONS = Array.from({ length: 25 }, (_, i) => {
  const hour = Math.floor(i / 2) + 8 // 8 to 20
  if (hour > 20) return null
  const mins = i % 2 === 0 ? '00' : '30'
  return `${hour.toString().padStart(2, '0')}:${mins}`
}).filter(Boolean) as string[]

export default function RulesForm() {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState<Partial<MerchantRule>>({})
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')

  const { data: initialRules, isLoading, isError } = useQuery({
    queryKey: ['merchantRules'],
    queryFn: getMerchantRules,
  })

  // Set initial form data when loaded
  useEffect(() => {
    if (initialRules && Object.keys(formData).length === 0) {
      setFormData(initialRules)
    }
  }, [initialRules, formData])

  const { mutate: saveRules } = useMutation({
    mutationFn: updateMerchantRules,
    onMutate: () => setSaveStatus('saving'),
    onSuccess: (data) => {
      setSaveStatus('saved')
      queryClient.setQueryData(['merchantRules'], data)
      setTimeout(() => setSaveStatus('idle'), 2000)
    },
    onError: () => setSaveStatus('idle')
  })

  const handleChange = (field: keyof MerchantRule, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    saveRules(formData)
  }

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-20 bg-[#E8E8E4] rounded-xl w-full"></div>
        <div className="h-40 bg-[#E8E8E4] rounded-xl w-full"></div>
        <div className="h-60 bg-[#E8E8E4] rounded-xl w-full"></div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="text-[#888780] text-[14px]">Could not load data</div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-12">
      {/* Section 1 - Your café */}
      <section>
        <h3 className="font-medium text-[16px] text-[#1A1A18] mb-4">Your café</h3>
        <div>
          <label className="block text-[14px] text-[#1A1A18] mb-2">Café name</label>
          <input 
            type="text" 
            value={formData.merchant_name || ''}
            onChange={(e) => handleChange('merchant_name', e.target.value)}
            className="w-full border border-[#E8E8E4] rounded-lg px-[14px] py-[10px] text-[14px] focus:outline-none focus:border-[#534AB7] transition-colors"
          />
        </div>
      </section>

      <div className="h-[1px] bg-[#E8E8E4] w-full"></div>

      {/* Section 2 - When should Nudge activate? */}
      <section>
        <h3 className="font-medium text-[16px] text-[#1A1A18] mb-6">When should Nudge activate?</h3>
        
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="text-[14px] text-[#1A1A18]">Send offers when transaction volume drops below</label>
              <span className="text-[#534AB7] font-medium text-[15px]">{formData.trigger_density_pct || 50}% of normal</span>
            </div>
            <input 
              type="range" 
              min="10" max="90" step="5"
              value={formData.trigger_density_pct || 50}
              onChange={(e) => handleChange('trigger_density_pct', parseInt(e.target.value))}
              className="w-full accent-[#534AB7]"
            />
          </div>

          <div>
            <label className="block text-[14px] text-[#1A1A18] mb-2">Active hours</label>
            <div className="flex items-center gap-3">
              <select 
                value={formData.active_hours_start || '08:00'}
                onChange={(e) => handleChange('active_hours_start', e.target.value)}
                className="border border-[#E8E8E4] rounded-lg px-[14px] py-[10px] text-[14px] focus:outline-none focus:border-[#534AB7] bg-white cursor-pointer"
              >
                {HOURS_OPTIONS.map(h => <option key={`start-${h}`} value={h}>{h}</option>)}
              </select>
              <span className="text-[#888780] text-[14px]">to</span>
              <select 
                value={formData.active_hours_end || '18:00'}
                onChange={(e) => handleChange('active_hours_end', e.target.value)}
                className="border border-[#E8E8E4] rounded-lg px-[14px] py-[10px] text-[14px] focus:outline-none focus:border-[#534AB7] bg-white cursor-pointer"
              >
                {HOURS_OPTIONS.map(h => <option key={`end-${h}`} value={h}>{h}</option>)}
              </select>
            </div>
          </div>
        </div>
      </section>

      <div className="h-[1px] bg-[#E8E8E4] w-full"></div>

      {/* Section 3 - What can Nudge offer? */}
      <section>
        <h3 className="font-medium text-[16px] text-[#1A1A18] mb-6">What can Nudge offer?</h3>
        
        <div className="space-y-8">
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="text-[14px] text-[#1A1A18]">Maximum discount</label>
              <span className="text-[#534AB7] font-medium text-[15px]">{formData.max_discount_pct || 20}% off</span>
            </div>
            <input 
              type="range" 
              min="5" max="30" step="5"
              value={formData.max_discount_pct || 20}
              onChange={(e) => handleChange('max_discount_pct', parseInt(e.target.value))}
              className="w-full accent-[#534AB7]"
            />
          </div>

          <div>
            <label className="block text-[14px] text-[#1A1A18] mb-4">What's your goal right now?</label>
            <div className="grid grid-cols-3 gap-4">
              <div 
                onClick={() => handleChange('goal', 'fill_quiet')}
                className={`cursor-pointer rounded-[10px] p-4 transition-colors ${
                  formData.goal === 'fill_quiet' 
                    ? 'border-2 border-[#534AB7] bg-[#F0EFFB]' 
                    : 'border border-[#E8E8E4] bg-white hover:border-[#534AB7]'
                }`}
              >
                <div className="font-medium text-[14px] text-[#1A1A18] mb-1">Fill quiet hours</div>
                <div className="text-[13px] text-[#888780]">Best for slow afternoons</div>
              </div>
              
              <div 
                onClick={() => handleChange('goal', 'move_item')}
                className={`cursor-pointer rounded-[10px] p-4 transition-colors ${
                  formData.goal === 'move_item' 
                    ? 'border-2 border-[#534AB7] bg-[#F0EFFB]' 
                    : 'border border-[#E8E8E4] bg-white hover:border-[#534AB7]'
                }`}
              >
                <div className="font-medium text-[14px] text-[#1A1A18] mb-1">Move a specific item</div>
                <div className="text-[13px] text-[#888780]">Push your daily special</div>
              </div>
              
              <div 
                onClick={() => handleChange('goal', 'footfall')}
                className={`cursor-pointer rounded-[10px] p-4 transition-colors ${
                  formData.goal === 'footfall' 
                    ? 'border-2 border-[#534AB7] bg-[#F0EFFB]' 
                    : 'border border-[#E8E8E4] bg-white hover:border-[#534AB7]'
                }`}
              >
                <div className="font-medium text-[14px] text-[#1A1A18] mb-1">Drive footfall</div>
                <div className="text-[13px] text-[#888780]">Get people through the door</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="h-[1px] bg-[#E8E8E4] w-full"></div>

      {/* Section 4 - Preview */}
      <section>
        <OfferPreview rules={formData} />
      </section>

      <button 
        type="submit" 
        disabled={saveStatus === 'saving'}
        className="w-full bg-[#534AB7] text-white rounded-[10px] h-12 text-[16px] font-medium transition-all hover:bg-[#3B3482] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {saveStatus === 'saved' ? 'Saved ✓' : saveStatus === 'saving' ? 'Saving...' : 'Save rules'}
      </button>
    </form>
  )
}
