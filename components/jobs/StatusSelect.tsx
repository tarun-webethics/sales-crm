'use client';

import React from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { JobStatus } from '@/types/job';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface StatusSelectProps {
  status: JobStatus;
  onStatusChange: (newStatus: JobStatus) => void;
  className?: string;
}

const statusConfig: Record<
  JobStatus,
  { label: string; pillClass: string; dotClass: string }
> = {
  'Not Applied': {
    label: 'Not Applied',
    pillClass: 'bg-[#F3F4F6] text-[#4B5563] border-[#E5E7EB] hover:bg-[#E5E7EB]',
    dotClass: 'bg-[#9CA3AF]',
  },
  Applied: {
    label: 'Applied',
    pillClass: 'bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE] hover:bg-[#DBEAFE]',
    dotClass: 'bg-[#2563EB]',
  },
  Interviewing: {
    label: 'Interviewing',
    pillClass: 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A] hover:bg-[#FEF3C7]',
    dotClass: 'bg-[#F59E0B]',
  },
  Hired: {
    label: 'Hired',
    pillClass: 'bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0] hover:bg-[#DCFCE7]',
    dotClass: 'bg-[#14A800]',
  },
};

const allStatuses: JobStatus[] = [
  'Not Applied',
  'Applied',
  'Interviewing',
  'Hired',
];

export function StatusSelect({
  status,
  onStatusChange,
  className,
}: StatusSelectProps) {
  const current = statusConfig[status] || statusConfig['Not Applied'];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14A800] focus-visible:ring-offset-1 cursor-pointer whitespace-nowrap',
            current.pillClass,
            className
          )}
        >
          <span className={cn('h-1.5 w-1.5 rounded-full', current.dotClass)} />
          <span>{current.label}</span>
          <ChevronDown className="h-3 w-3 opacity-60 ml-0.5" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-36 p-1">
        {allStatuses.map((item) => {
          const cfg = statusConfig[item];
          const isSelected = item === status;
          return (
            <DropdownMenuItem
              key={item}
              onClick={() => onStatusChange(item)}
              className={cn(
                'flex items-center justify-between text-xs py-1.5 px-2 cursor-pointer font-medium',
                isSelected && 'font-semibold text-[#14A800]'
              )}
            >
              <div className="flex items-center gap-2">
                <span className={cn('h-2 w-2 rounded-full', cfg.dotClass)} />
                <span>{cfg.label}</span>
              </div>
              {isSelected && <Check className="h-3.5 w-3.5 text-[#14A800]" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
