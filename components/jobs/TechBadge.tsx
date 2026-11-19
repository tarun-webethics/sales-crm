import React from 'react';
import { cn } from '@/lib/utils';

interface TechBadgeProps {
  technology: string;
  className?: string;
}

export function TechBadge({ technology, className }: TechBadgeProps) {
  const techLower = technology.toLowerCase().trim();

  let colorClasses = 'bg-[#F3F4F6] text-[#4B5563] border-[#E5E7EB]';

  if (techLower.includes('shopify plus')) {
    colorClasses = 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]';
  } else if (techLower === 'shopify') {
    colorClasses = 'bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]';
  } else if (techLower.includes('php')) {
    colorClasses = 'bg-[#FAF5FF] text-[#7E22CE] border-[#F3E8FF]';
  } else if (techLower.includes('front end') || techLower.includes('frontend')) {
    colorClasses = 'bg-[#FFF7ED] text-[#EA580C] border-[#FFEDD5]';
  } else if (techLower.includes('python')) {
    colorClasses = 'bg-[#FEFCE8] text-[#854D0E] border-[#FEF08A]';
  } else if (techLower.includes('api developer') || techLower.includes('api')) {
    colorClasses = 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]';
  } else if (techLower.includes('react')) {
    colorClasses = 'bg-[#ECFEFF] text-[#0E7490] border-[#CFFAFE]';
  } else if (techLower.includes('node')) {
    colorClasses = 'bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]';
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border transition-colors whitespace-nowrap',
        colorClasses,
        className
      )}
    >
      {technology}
    </span>
  );
}
