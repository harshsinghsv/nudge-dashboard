// NUDGE: Displays a single dashboard metric with label, value, and period
import React from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  period: string;
}

export default function MetricCard({ label, value, period }: MetricCardProps) {
  return (
    <div className="bg-white border border-[#E8E8E4] rounded-xl py-5 px-6">
      <div className="text-[12px] text-[#888780] mb-1">{label}</div>
      <div className="text-[28px] font-medium text-[#1A1A18] mb-1">{value}</div>
      <div className="text-[12px] text-[#888780]">{period}</div>
    </div>
  );
}
