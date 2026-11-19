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
    pillClass: 'bg-slate-100/80 text-slate-700 border-slate-200/80 hover:bg-slate-200/70 font-medium',
    dotClass: 'bg-slate-400',
  },
  Applied: {
    label: 'Applied',
    pillClass: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100/70 font-medium',
    dotClass: 'bg-blue-600',
  },
  Interviewing: {
    label: 'Interviewing',
    pillClass: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100/70 font-medium',
    dotClass: 'bg-amber-500',
  },
  Hired: {
    label: 'Hired',
    pillClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/70 font-medium',
    dotClass: 'bg-emerald-600',
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
            'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border transition-all shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1 cursor-pointer whitespace-nowrap leading-tight',
            current.pillClass,
            className
          )}
        >
          <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', current.dotClass)} />
          <span>{current.label}</span>
          <ChevronDown className="h-3 w-3 opacity-60 ml-0.5 shrink-0" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-34 p-1">
        {allStatuses.map((item) => {
          const cfg = statusConfig[item];
          const isSelected = item === status;
          return (
            <DropdownMenuItem
              key={item}
              onClick={() => onStatusChange(item)}
              className={cn(
                'flex items-center justify-between text-[11px] py-1.5 px-2 cursor-pointer font-medium text-[#0F172A]',
                isSelected && 'font-bold text-[#2563eb]'
              )}
            >
              <div className="flex items-center gap-1.5">
                <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', cfg.dotClass)} />
                <span>{cfg.label}</span>
              </div>
              {isSelected && <Check className="h-3 w-3 text-[#2563eb]" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
