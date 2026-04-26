// NUDGE: Real-time preview of AI-generated offer based on current rule settings
'use client'

import React, { useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { previewOffer } from '@/lib/api'
import type { MerchantRule, OfferPayload } from '@/types'

export default function OfferPreview({ rules }: { rules: Partial<MerchantRule> }) {
  const [offer, setOffer] = useState<OfferPayload | null>(null)
  
  const { mutate: fetchPreview, isPending } = useMutation({
    mutationFn: previewOffer,
    onSuccess: (data) => setOffer(data),
  })

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPreview(rules)
    }, 800)

    return () => clearTimeout(timer)
  }, [rules, fetchPreview])

  return (
    <div className="w-full">
      <div className="mb-4">
        <div className="text-[14px] font-medium text-[#1A1A18] mb-1">Preview of what Nudge might generate</div>
        <div className="text-[13px] text-[#888780]">Updates live as you adjust settings</div>
      </div>
      
      <div className={`border border-[#E8E8E4] rounded-[10px] p-4 transition-all duration-300 min-h-[120px] bg-white ${
        isPending ? 'relative overflow-hidden' : ''
      }`}>
        {/* Shimmer animation overlay */}
        {isPending && (
          <div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/60 to-transparent w-[200%] animate-[shimmer_1.5s_infinite] pointer-events-none" 
               style={{ transform: 'translateX(-100%)' }}>
          </div>
        )}
        
        <div className="relative z-10 flex flex-col justify-center h-full">
          {offer ? (
            <>
              <div className="font-medium text-[16px] text-[#1A1A18] mb-2">{offer.headline}</div>
              <div className="text-[14px] text-[#888780] leading-relaxed">{offer.body}</div>
            </>
          ) : (
            <div className="text-[#888780] text-[14px] text-center italic">
              Adjust settings to generate preview...
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
