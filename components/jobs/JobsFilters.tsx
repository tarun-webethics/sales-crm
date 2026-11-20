'use client';

import React, { useState } from 'react';
import {
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  Gem,
  Code2,
  MapPin,
  CheckCircle2,
  Calendar,
  PanelLeftClose,
  Bookmark,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FilterState,
  MagicFilterType,
  DateFilterType,
} from '@/types/job';
import { cn } from '@/lib/utils';

interface JobsFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onReset: () => void;
  onSaveFilters?: () => void;
  resultCount: number;
  totalCount: number;
  onClose?: () => void;
}

const magicOptions: MagicFilterType[] = [
  'All',
  'Manual Review',
  'Rejected',
  'Approved',
];

const technologyOptions = [
  'All Technologies',
  'Shopify Plus',
  'PHP',
  'Front End Developer',
  'Python',
  'API Developer',
  'Shopify',
  'React',
  'Node.js',
];

const locationOptions = [
  'All Locations',
  'Netherlands',
  'India',
  'Australia',
  'Philippines',
  'GBR',
  'United States',
];

const statusOptions = [
  'All Statuses',
  'Not Applied',
  'Applied',
  'Interviewing',
  'Hired',
];

const dateOptions: DateFilterType[] = [
  'All Time',
  'Today',
  'Last 24 hours',
  'Last 7 days',
  'Last 30 days',
];

export function JobsFilters({
  filters,
  onFilterChange,
  onReset,
  onSaveFilters,
  resultCount,
  totalCount,
  onClose,
}: JobsFiltersProps) {
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const updateField = <K extends keyof FilterState>(
    field: K,
    value: FilterState[K]
  ) => {
    onFilterChange({
      ...filters,
      [field]: value,
    });
  };

  const handleReset = () => {
    onReset();
  };

  const handleSaveFilters = () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('saved_job_filters', JSON.stringify(filters));
      }
    } catch {
      // Ignore storage errors in restricted contexts
    }
    setIsSaved(true);
    if (onSaveFilters) {
      onSaveFilters();
    }
    setTimeout(() => {
      setIsSaved(false);
    }, 2000);
  };

  // Count active filters dynamically
  const activeFiltersCount = [
    filters.search.trim() !== '',
    filters.magicFilter !== 'All',
    filters.technology !== 'All Technologies',
    filters.location !== 'All Locations',
    filters.status !== 'All Statuses',
    filters.date !== 'All Time',
    filters.cream !== 'All',
  ].filter(Boolean).length;

  return (
    <div className="w-full bg-white pr-4 space-y-4 border-r border-slate-100/80 shadow-xs">
      {/* 1. TOP HEADER ROW */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-slate-900 tracking-tight">
            Filters
          </h3>
          {activeFiltersCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200/80 text-[10px] font-bold">
              {activeFiltersCount}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            disabled={activeFiltersCount === 0}
            className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset</span>
          </button>
        </div>
      </div>
      
      {/* 3. MAIN FILTER DROPDOWNS (Clean un-boxed stack) */}
      <div className="space-y-3 pt-0.5">
        {/* 1. Webethics magic filter */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-medium text-slate-600">
              Webethics Magic Filter
            </label>
            {filters.magicFilter !== 'All' && (
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
            )}
          </div>
          <Select
            value={filters.magicFilter}
            onValueChange={(val) =>
              updateField('magicFilter', val as MagicFilterType)
            }
          >
            <SelectTrigger
              className={cn(
                'h-9 text-xs rounded-lg transition-all cursor-pointer border shadow-2xs',
                filters.magicFilter !== 'All'
                  ? 'bg-blue-50/50 border-blue-200 text-blue-600 font-medium'
                  : 'bg-slate-50/50 border-slate-200 hover:bg-white hover:border-slate-300 text-slate-800'
              )}
            >
              <div className="flex items-center gap-2 truncate">
                <Sparkles
                  className={cn(
                    'h-3.5 w-3.5 shrink-0',
                    filters.magicFilter !== 'All'
                      ? 'text-blue-600'
                      : 'text-slate-400'
                  )}
                />
                <SelectValue placeholder="All" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {magicOptions.map((opt) => (
                <SelectItem
                  key={opt}
                  value={opt}
                  className="text-xs text-slate-800 cursor-pointer"
                >
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 2. Technology */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-medium text-slate-600">
              Technology
            </label>
            {filters.technology !== 'All Technologies' && (
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
            )}
          </div>
          <Select
            value={filters.technology}
            onValueChange={(val) => updateField('technology', val)}
          >
            <SelectTrigger
              className={cn(
                'h-9 text-xs rounded-lg transition-all cursor-pointer border shadow-2xs',
                filters.technology !== 'All Technologies'
                  ? 'bg-blue-50/50 border-blue-200 text-blue-600 font-medium'
                  : 'bg-slate-50/50 border-slate-200 hover:bg-white hover:border-slate-300 text-slate-800'
              )}
            >
              <div className="flex items-center gap-2 truncate">
                <Code2
                  className={cn(
                    'h-3.5 w-3.5 shrink-0',
                    filters.technology !== 'All Technologies'
                      ? 'text-blue-600'
                      : 'text-slate-400'
                  )}
                />
                <SelectValue placeholder="All technologies" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {technologyOptions.map((opt) => (
                <SelectItem
                  key={opt}
                  value={opt}
                  className="text-xs text-slate-800 cursor-pointer"
                >
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 3. Client location */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-medium text-slate-600">
              Client Location
            </label>
            {filters.location !== 'All Locations' && (
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
            )}
          </div>
          <Select
            value={filters.location}
            onValueChange={(val) => updateField('location', val)}
          >
            <SelectTrigger
              className={cn(
                'h-9 text-xs rounded-lg transition-all cursor-pointer border shadow-2xs',
                filters.location !== 'All Locations'
                  ? 'bg-blue-50/50 border-blue-200 text-blue-600 font-medium'
                  : 'bg-slate-50/50 border-slate-200 hover:bg-white hover:border-slate-300 text-slate-800'
              )}
            >
              <div className="flex items-center gap-2 truncate">
                <MapPin
                  className={cn(
                    'h-3.5 w-3.5 shrink-0',
                    filters.location !== 'All Locations'
                      ? 'text-blue-600'
                      : 'text-slate-400'
                  )}
                />
                <SelectValue placeholder="All locations" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {locationOptions.map((opt) => (
                <SelectItem
                  key={opt}
                  value={opt}
                  className="text-xs text-slate-800 cursor-pointer"
                >
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 4. Status */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-medium text-slate-600">
              Status
            </label>
            {filters.status !== 'All Statuses' && (
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
            )}
          </div>
          <Select
            value={filters.status}
            onValueChange={(val) => updateField('status', val)}
          >
            <SelectTrigger
              className={cn(
                'h-9 text-xs rounded-lg transition-all cursor-pointer border shadow-2xs',
                filters.status !== 'All Statuses'
                  ? 'bg-blue-50/50 border-blue-200 text-blue-600 font-medium'
                  : 'bg-slate-50/50 border-slate-200 hover:bg-white hover:border-slate-300 text-slate-800'
              )}
            >
              <div className="flex items-center gap-2 truncate">
                <CheckCircle2
                  className={cn(
                    'h-3.5 w-3.5 shrink-0',
                    filters.status !== 'All Statuses'
                      ? 'text-blue-600'
                      : 'text-slate-400'
                  )}
                />
                <SelectValue placeholder="All statuses" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((opt) => (
                <SelectItem
                  key={opt}
                  value={opt}
                  className="text-xs text-slate-800 cursor-pointer"
                >
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 5. Date posted */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-medium text-slate-600">
              Date Posted
            </label>
            {filters.date !== 'All Time' && (
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
            )}
          </div>
          <Select
            value={filters.date}
            onValueChange={(val) => updateField('date', val as DateFilterType)}
          >
            <SelectTrigger
              className={cn(
                'h-9 text-xs rounded-lg transition-all cursor-pointer border shadow-2xs',
                filters.date !== 'All Time'
                  ? 'bg-blue-50/50 border-blue-200 text-blue-600 font-medium'
                  : 'bg-slate-50/50 border-slate-200 hover:bg-white hover:border-slate-300 text-slate-800'
              )}
            >
              <div className="flex items-center gap-2 truncate">
                <Calendar
                  className={cn(
                    'h-3.5 w-3.5 shrink-0',
                    filters.date !== 'All Time'
                      ? 'text-blue-600'
                      : 'text-slate-400'
                  )}
                />
                <SelectValue placeholder="All time" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {dateOptions.map((opt) => (
                <SelectItem
                  key={opt}
                  value={opt}
                  className="text-xs text-slate-800 cursor-pointer"
                >
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 4. BOTTOM ACTION & RESULTS COUNTER */}
      <div className="pt-2 border-t border-slate-100 space-y-2.5">
        {/* Save Filters Button: Lightweight secondary button style */}
        <Button
          type="button"
          variant="outline"
          onClick={handleSaveFilters}
          className="w-full h-9 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50/80 hover:bg-slate-100 text-slate-700 hover:text-slate-900 text-xs font-medium shadow-2xs flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-[0.99]"
        >
          {isSaved ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-600" />
              <span className="text-emerald-700 font-semibold">Filters Saved</span>
            </>
          ) : (
            <>
              <Bookmark className="h-3.5 w-3.5 text-slate-500" />
              <span>Save Filters</span>
            </>
          )}
        </Button>

        <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>
            Showing <strong className="text-slate-900 font-semibold">{resultCount}</strong> of{' '}
            {totalCount.toLocaleString()}
          </span>

          {activeFiltersCount > 0 && (
            <button
              type="button"
              onClick={handleReset}
              className="text-blue-600 hover:text-blue-700 text-xs font-medium hover:underline cursor-pointer"
            >
              Clear all
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
