// NUDGE: Main dashboard page showing metrics, recent offers, and live context
'use client'

import MetricCard from '@/components/MetricCard';
import OffersTable from '@/components/OffersTable';
import LiveContextPanel from '@/components/LiveContextPanel';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      {/* Metrics Row */}
      <div className="grid grid-cols-4 gap-6">
        <MetricCard label="Offers sent" value={3} period="today" />
        <MetricCard label="Redeemed" value={1} period="today" />
        <MetricCard label="Accept rate" value="33%" period="this week" />
        <MetricCard label="Revenue recovered" value="€4.50" period="this week" />
      </div>

      {/* Main Content Area */}
      <div className="flex gap-6">
        {/* Left Column - 60% */}
        <div className="w-[60%]">
          <OffersTable />
        </div>

        {/* Right Column - 40% */}
        <div className="w-[40%]">
          <LiveContextPanel />
        </div>
      </div>
    </div>
  );
}
