'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Nav() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center justify-between h-[56px] px-8 border-b border-[#E8E8E4] bg-white">
      <div className="text-[#534AB7] font-bold text-[20px]">
        Nudge
      </div>
      <div className="flex gap-6">
        <Link 
          href="/dashboard" 
          className={`text-[14px] font-medium transition-colors ${
            pathname.startsWith('/dashboard') ? 'text-[#1A1A18]' : 'text-[#888780] hover:text-[#1A1A18]'
          }`}
        >
          Dashboard
        </Link>
        <Link 
          href="/rules" 
          className={`text-[14px] font-medium transition-colors ${
            pathname.startsWith('/rules') ? 'text-[#1A1A18]' : 'text-[#888780] hover:text-[#1A1A18]'
          }`}
        >
          Rules
        </Link>
      </div>
    </nav>
  )
}
