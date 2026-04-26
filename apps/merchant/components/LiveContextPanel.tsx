// NUDGE: Displays real-time context signals like weather, transaction density, and trigger state
'use client'

import React, { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getContextState } from '@/lib/api'

export default function LiveContextPanel() {
  const [currentTime, setCurrentTime] = useState<string>('')

  // Update time every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' }))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  const { data: context, isLoading, isError } = useQuery({
    queryKey: ['liveContext'],
    queryFn: getContextState,
    refetchInterval: 3000,
  })

  if (isLoading) {
    return (
      <div className="bg-white border border-[#E8E8E4] rounded-xl p-5">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-2 h-2 rounded-full bg-[#3B6D11] animate-pulse"></div>
          <h2 className="font-medium text-[16px] text-[#1A1A18]">Live context</h2>
        </div>
        <div className="space-y-6">
          <div className="h-6 bg-[#E8E8E4] animate-pulse rounded w-1/2"></div>
          <div>
            <div className="flex justify-between mb-2">
              <div className="h-4 bg-[#E8E8E4] animate-pulse rounded w-1/3"></div>
              <div className="h-4 bg-[#E8E8E4] animate-pulse rounded w-1/4"></div>
            </div>
            <div className="h-[6px] bg-[#E8E8E4] rounded-full w-full"></div>
          </div>
          <div className="h-6 bg-[#E8E8E4] animate-pulse rounded w-1/3"></div>
          <div className="h-10 bg-[#E8E8E4] animate-pulse rounded-full w-full"></div>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="bg-white border border-[#E8E8E4] rounded-xl p-5 text-[#888780] text-[14px]">
        Could not load data
      </div>
    )
  }

  // Fallback to avoid crash if data is somehow empty
  if (!context) return null

  // Weather icon mapping (simple text glyphs)
  const getWeatherIcon = (condition: string) => {
    const c = condition.toLowerCase()
    if (c.includes('rain')) return '🌧️'
    if (c.includes('cloud') || c.includes('overcast')) return '☁️'
    if (c.includes('sun') || c.includes('clear')) return '☀️'
    if (c.includes('snow')) return '❄️'
    return '🌡️'
  }

  return (
    <div className="bg-white border border-[#E8E8E4] rounded-xl p-5">
      <div className="flex items-center gap-2 mb-6">
        <div 
          className="w-2 h-2 rounded-full bg-[#3B6D11]" 
          style={{ animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}
        ></div>
        <h2 className="font-medium text-[16px] text-[#1A1A18]">Live context</h2>
      </div>

      <div className="space-y-6">
        {/* Weather Row */}
        <div className="flex items-center gap-2 text-[15px] text-[#1A1A18]">
          <span>{getWeatherIcon(context.weather.condition)}</span>
          <span>{context.weather.temp_c}°C · {context.weather.condition}</span>
        </div>

        {/* Payone Density */}
        <div>
          <div className="flex justify-between text-[14px] mb-2">
            <span className="text-[#1A1A18]">Payone transaction density</span>
            <span className="text-[#888780]">{context.payone_density_pct}% of normal</span>
          </div>
          <div className="h-[6px] bg-[#E8E8E4] rounded-full w-full overflow-hidden">
            <div 
              className="h-full bg-[#534AB7] rounded-full transition-all duration-1000 ease-in-out" 
              style={{ width: `${Math.min(100, Math.max(0, context.payone_density_pct))}%` }}
            ></div>
          </div>
        </div>

        {/* Time */}
        <div className="text-[15px] text-[#1A1A18]">
          {currentTime || '...'}
        </div>

        {/* Trigger Status */}
        <div className={`w-full py-3 rounded-full text-center text-[14px] font-medium transition-colors ${
          context.trigger_active 
            ? 'bg-[#FAEEDA] text-[#633806] animate-pulse' 
            : 'bg-[#E8E8E4] text-[#888780]'
        }`}>
          {context.trigger_active ? 'Trigger active' : 'Watching…'}
        </div>
      </div>
    </div>
  )
}
