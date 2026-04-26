// NUDGE: Displays recent offers with status and simulated redemption
'use client'

import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getRecentOffers, simulateScan } from '@/lib/api'
import type { OfferRow } from '@/types'

const formatTime = (isoString: string) => {
  const date = new Date(isoString)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const truncate = (text: string, length: number) => {
  return text.length > length ? text.substring(0, length) + '...' : text
}

const StatusPill = ({ status }: { status: OfferRow['status'] }) => {
  const styles = {
    redeemed: 'bg-[#3B6D11] text-white',
    dismissed: 'bg-[#E8E8E4] text-[#888780]',
    expired: 'bg-[#FEE2E2] text-[#C0392B]',
    sent: 'bg-[#FAEEDA] text-[#633806]',
  }
  
  const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1)

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-[13px] ${styles[status]}`}>
      {formattedStatus}
    </span>
  )
}

export default function OffersTable() {
  const queryClient = useQueryClient()

  const { data: offers, isLoading, isError } = useQuery({
    queryKey: ['recentOffers'],
    queryFn: getRecentOffers,
    refetchInterval: 5000,
  })

  const { mutate: scanOffer } = useMutation({
    mutationFn: simulateScan,
    onMutate: async (offerId) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['recentOffers'] })
      const previousOffers = queryClient.getQueryData<OfferRow[]>(['recentOffers'])
      
      if (previousOffers) {
        queryClient.setQueryData<OfferRow[]>(['recentOffers'], old => 
          old?.map(offer => 
            offer.offer_id === offerId 
              ? { ...offer, status: 'redeemed' } 
              : offer
          )
        )
      }
      return { previousOffers }
    },
    onError: (err, newTodo, context) => {
      if (context?.previousOffers) {
        queryClient.setQueryData(['recentOffers'], context.previousOffers)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['recentOffers'] })
      queryClient.invalidateQueries({ queryKey: ['dashboardMetrics'] }) // Trigger metrics update
    },
  })

  if (isLoading) {
    return (
      <div className="bg-white border border-[#E8E8E4] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E8E8E4] font-medium text-[16px]">Recent offers</div>
        <div className="p-6 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 bg-[#E8E8E4] animate-pulse rounded-lg w-full"></div>
          ))}
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="bg-white border border-[#E8E8E4] rounded-xl p-6 text-[#888780] text-[14px]">
        Could not load data
      </div>
    )
  }

  // Slice to last 10 offers if API returns more
  const displayOffers = offers?.slice(0, 10) || []

  return (
    <div className="bg-white border border-[#E8E8E4] rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-[#E8E8E4] font-medium text-[16px]">Recent offers</div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[14px]">
          <thead className="text-[#888780] font-normal">
            <tr>
              <th className="px-6 py-3 font-normal">Time</th>
              <th className="px-6 py-3 font-normal">Merchant</th>
              <th className="px-6 py-3 font-normal">Headline</th>
              <th className="px-6 py-3 font-normal">Discount</th>
              <th className="px-6 py-3 font-normal">Status</th>
              <th className="px-6 py-3 font-normal text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8E8E4]">
            {displayOffers.map((offer) => (
              <tr key={offer.offer_id} className="hover:bg-[#FAFAF8] transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-[#888780]">{formatTime(offer.created_at)}</td>
                <td className="px-6 py-4 whitespace-nowrap">{offer.merchant_name}</td>
                <td className="px-6 py-4 text-[#1A1A18]">{truncate(offer.headline, 40)}</td>
                <td className="px-6 py-4 whitespace-nowrap">{offer.discount_pct}% off</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusPill status={offer.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  {offer.status === 'sent' && (
                    <button 
                      onClick={() => scanOffer(offer.offer_id)}
                      className="text-[#534AB7] hover:text-[#3B3482] font-medium transition-colors"
                    >
                      Simulate scan
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {displayOffers.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-[#888780]">
                  No recent offers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
