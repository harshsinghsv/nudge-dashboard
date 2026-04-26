// NUDGE: Settings page for merchant rules configuration
import React from 'react'
import RulesForm from '@/components/RulesForm'

export default function RulesPage() {
  return (
    <div className="max-w-[700px] mx-auto bg-white rounded-xl border border-[#E8E8E4] p-8 mt-4">
      <div className="mb-8">
        <h1 className="text-[24px] font-semibold text-[#1A1A18] mb-2">Your Nudge settings</h1>
        <p className="text-[14px] text-[#888780]">
          Nudge runs automatically. These rules tell it when to activate and what to offer.
        </p>
      </div>
      
      <RulesForm />
    </div>
  )
}
