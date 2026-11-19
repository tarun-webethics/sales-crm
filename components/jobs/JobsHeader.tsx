'use client';

import React from 'react';
import { Download, RefreshCw, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface JobsHeaderProps {
  onExportCSV: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  totalCount?: number;
  showFilters?: boolean;
  onToggleFilters?: () => void;
}

export function JobsHeader({
  onExportCSV,
  onRefresh,
  isRefreshing,
  showFilters = false,
  onToggleFilters,
}: JobsHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-1">
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Upwork Jobs
          </h1>
        </div>
        <p className="text-xs text-slate-500">
          Real-time intelligence feed · AI-analyzed and scored
        </p>
      </div>

      <div className="flex items-center gap-2 self-start sm:self-auto">
        {onToggleFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleFilters}
            className={cn(
              'h-9 px-3 gap-1.5 font-medium border border-slate-200 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 hover:border-slate-300 rounded-lg text-xs shadow-2xs transition-all cursor-pointer',
              showFilters &&
                'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100/60 hover:text-blue-700 hover:border-blue-300 font-semibold shadow-xs'
            )}
            title={showFilters ? 'Hide filters sidebar' : 'Show filters sidebar'}
            aria-label={showFilters ? 'Hide filters sidebar' : 'Show filters sidebar'}
          >
            <SlidersHorizontal
              className={cn(
                'h-3.5 w-3.5 transition-transform duration-200',
                showFilters ? 'rotate-180 text-blue-600' : 'text-slate-500'
              )}
            />
            <span>{showFilters ? 'Hide Filters' : 'Filters'}</span>
          </Button>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="h-9 px-3 gap-1.5 font-medium border border-slate-200 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 hover:border-slate-300 rounded-lg text-xs shadow-2xs disabled:opacity-60 cursor-pointer transition-all"
        >
          <RefreshCw
            className={cn(
              'h-3.5 w-3.5 text-slate-500',
              isRefreshing && 'animate-spin text-blue-600'
            )}
          />
          <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
        </Button>
      </div>
    </div>
  );
}
