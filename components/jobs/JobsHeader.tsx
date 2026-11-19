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
  totalCount = 54499,
  showFilters = false,
  onToggleFilters,
}: JobsHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between pb-2">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[#001E00]">
          Upwork Jobs
        </h1>
        <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">
          {totalCount.toLocaleString()} jobs fetched via n8n · AI-rated and saved to Supabase
        </p>
      </div>

      <div className="flex items-center gap-2.5 self-start md:self-auto">
        {onToggleFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleFilters}
            className={cn(
              'h-9 gap-1.5 font-medium border-[#E5E7EB] text-[#3C4043] hover:text-[#001E00] hover:bg-white cursor-pointer transition-colors',
              showFilters &&
                'bg-[#F1FAF0] text-[#14A800] border-[#BEE8B8] hover:bg-[#DFF3DC] hover:text-[#0D7300]'
            )}
            title={showFilters ? 'Hide filters sidebar' : 'Show filters sidebar'}
            aria-label={showFilters ? 'Hide filters sidebar' : 'Show filters sidebar'}
          >
            <SlidersHorizontal
              className={cn(
                'h-4 w-4 transition-transform duration-200',
                showFilters ? 'rotate-180 text-[#14A800]' : 'text-[#6B7280]'
              )}
            />
            <span className="hidden sm:inline">
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </span>
          </Button>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="h-9 gap-1.5 font-medium border-[#E5E7EB] text-[#3C4043] hover:text-[#001E00] hover:bg-white disabled:opacity-75 cursor-pointer"
        >
          <RefreshCw
            className={cn(
              'h-4 w-4 text-[#6B7280]',
              isRefreshing && 'animate-spin text-[#14A800]'
            )}
          />
          <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
        </Button>
      </div>
    </div>
  );
}
