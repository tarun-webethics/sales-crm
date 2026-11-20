'use client';

import React from 'react';
import {
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  X,
  Gem,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface JobsToolbarProps {
  isFiltersOpen: boolean;
  onToggleFilters: () => void;
  search: string;
  onSearchChange: (value: string) => void;
  onFetchCreamJobs: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  isCreamActive?: boolean;
}

export function JobsToolbar({
  isFiltersOpen,
  onToggleFilters,
  search,
  onSearchChange,
  onFetchCreamJobs,
  onRefresh,
  isRefreshing,
  isCreamActive = false,
}: JobsToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 w-full">
      {/* Left side: Sidebar Toggle Icon + Search Bar */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {/* 1. Sidebar open/close toggle icon on the left */}
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={onToggleFilters}
                className={cn(
                  'h-9 w-9 shrink-0 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 hover:border-slate-300 shadow-2xs transition-all cursor-pointer flex items-center justify-center',
                  isFiltersOpen &&
                    'bg-slate-100 text-slate-900 border-slate-300 hover:bg-slate-200/60 shadow-xs'
                )}
                title={isFiltersOpen ? 'Close sidebar filters' : 'Open sidebar filters'}
                aria-label={isFiltersOpen ? 'Close sidebar filters' : 'Open sidebar filters'}
                aria-expanded={isFiltersOpen}
              >
                {isFiltersOpen ? (
                  <PanelLeftClose className="h-4 w-4 text-slate-900 transition-transform duration-200" />
                ) : (
                  <PanelLeftOpen className="h-4 w-4 text-slate-600 transition-transform duration-200" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              <p>{isFiltersOpen ? 'Close sidebar filters' : 'Open sidebar filters'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* 2. Search bar next to the sidebar toggle icon */}
        <div className="relative flex-1 min-w-[180px] sm:max-w-xs md:max-w-sm lg:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search jobs by title, tech, location..."
            className="pl-9 pr-8 h-9 bg-white border border-slate-200 hover:border-slate-300 focus-visible:bg-white focus-visible:border-slate-400 focus-visible:ring-1 focus-visible:ring-slate-300 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 transition-all shadow-2xs w-full"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer p-0.5 rounded transition-colors"
              aria-label="Clear search"
              title="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Right side: Fetch Cream Jobs + Refresh buttons */}
      <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
        {/* 3. Fetch Cream Jobs button */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onFetchCreamJobs}
          className={cn(
            'h-9 px-3 gap-1.5 font-medium border border-slate-200 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 hover:border-slate-300 rounded-lg text-xs shadow-2xs transition-all cursor-pointer shrink-0',
            isCreamActive &&
              'bg-slate-100 text-slate-900 border-slate-300 font-semibold'
          )}
          title="Fetch cream jobs"
        >
          <Gem className="h-3.5 w-3.5 text-slate-500" />
          <span>Fetch Cream Jobs</span>
        </Button>

        {/* 4. Refresh button */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="h-9 px-3 gap-1.5 font-medium border border-slate-200 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 hover:border-slate-300 rounded-lg text-xs shadow-2xs disabled:opacity-60 cursor-pointer transition-all shrink-0"
          title="Refresh jobs feed"
        >
          <RefreshCw
            className={cn(
              'h-3.5 w-3.5 text-slate-500 transition-colors',
              isRefreshing && 'animate-spin text-slate-700'
            )}
          />
          <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
        </Button>
      </div>
    </div>
  );
}
