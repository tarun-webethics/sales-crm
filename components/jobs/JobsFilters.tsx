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
  Star,
  Search,
  X,
  PanelLeftClose,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  CreamFilterType,
} from '@/types/job';
import { cn } from '@/lib/utils';

interface JobsFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onReset: () => void;
  onFetchJobs: () => void;
  onFetchCreamJobs: () => void;
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
  onFetchJobs,
  onFetchCreamJobs,
  resultCount,
  totalCount,
  onClose,
}: JobsFiltersProps) {
  const [selectedStar, setSelectedStar] = useState<number | null>(null);

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
    setSelectedStar(null);
    onReset();
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
    selectedStar !== null,
  ].filter(Boolean).length;

  return (
    <div className="w-full bg-white pl-0 p-4 space-y-4 shadow-xs">
      {/* 1. TOP HEADER ROW */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-slate-700" />
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

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Close filters"
            >
              <PanelLeftClose className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* 2. SEARCH INPUT */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
        <Input
          value={filters.search}
          onChange={(e) => updateField('search', e.target.value)}
          placeholder="Search title, tech, location..."
          className="pl-9 pr-8 h-9 bg-slate-50/70 border border-slate-200 hover:border-slate-300 focus-visible:bg-white focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/20 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 transition-all shadow-2xs"
        />
        {filters.search && (
          <button
            type="button"
            onClick={() => updateField('search', '')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer p-0.5"
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* 3. QUICK FILTERS */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
          Quick Filters
        </span>

        <div className="grid grid-cols-2 gap-2">
          {/* AI Match Pill */}
          <button
            type="button"
            onClick={() =>
              updateField(
                'magicFilter',
                filters.magicFilter === 'Approved' ? 'All' : 'Approved'
              )
            }
            className={cn(
              'inline-flex items-center justify-center gap-1.5 h-8 px-2.5 rounded-lg text-xs font-medium border transition-all cursor-pointer shadow-2xs',
              filters.magicFilter === 'Approved'
                ? 'bg-blue-50 text-blue-600 border-blue-200 font-semibold shadow-xs'
                : 'bg-slate-50/60 text-slate-600 border-slate-200/80 hover:bg-white hover:text-slate-900 hover:border-slate-300'
            )}
          >
            <Sparkles
              className={cn(
                'h-3.5 w-3.5 shrink-0',
                filters.magicFilter === 'Approved'
                  ? 'text-blue-600'
                  : 'text-slate-400'
              )}
            />
            <span>AI Match</span>
          </button>

          {/* Cream Jobs Pill */}
          <button
            type="button"
            onClick={() => {
              const isCreamActive = filters.cream === 'Cream only';
              updateField('cream', isCreamActive ? 'All' : 'Cream only');
              if (isCreamActive) setSelectedStar(null);
            }}
            className={cn(
              'inline-flex items-center justify-center gap-1.5 h-8 px-2.5 rounded-lg text-xs font-medium border transition-all cursor-pointer shadow-2xs',
              filters.cream === 'Cream only'
                ? 'bg-amber-50 text-amber-700 border-amber-200 font-semibold shadow-xs'
                : 'bg-slate-50/60 text-slate-600 border-slate-200/80 hover:bg-white hover:text-slate-900 hover:border-slate-300'
            )}
          >
            <Gem
              className={cn(
                'h-3.5 w-3.5 shrink-0',
                filters.cream === 'Cream only'
                  ? 'text-amber-600'
                  : 'text-slate-400'
              )}
            />
            <span>Cream Jobs</span>
          </button>
        </div>
      </div>

      {/* 4. MAIN FILTER DROPDOWNS (Clean un-boxed stack) */}
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

      {/* 5. CREAM JOBS STAR RATING SECTION */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            Cream Rating
          </span>
          {(filters.cream !== 'All' || selectedStar !== null) && (
            <button
              type="button"
              onClick={() => {
                setSelectedStar(null);
                updateField('cream', 'All');
              }}
              className="text-[11px] font-medium text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        <div className="grid grid-cols-5 gap-1">
          {[1, 2, 3, 4, 5].map((star) => {
            const isSelected =
              selectedStar === star ||
              (star === 5 &&
                filters.cream === 'Cream only' &&
                selectedStar === null);

            return (
              <button
                key={star}
                type="button"
                onClick={() => {
                  if (isSelected) {
                    setSelectedStar(null);
                    updateField('cream', 'All');
                  } else {
                    setSelectedStar(star);
                    updateField('cream', 'Cream only');
                  }
                }}
                className={cn(
                  'h-8 rounded-lg flex items-center justify-center gap-1 text-xs font-medium border transition-all cursor-pointer shadow-2xs',
                  isSelected
                    ? 'bg-amber-50 text-amber-800 border-amber-200 font-semibold shadow-xs'
                    : 'bg-slate-50/50 text-slate-600 border-slate-200 hover:bg-white hover:border-slate-300 hover:text-slate-900'
                )}
              >
                <Star
                  className={cn(
                    'h-3 w-3 shrink-0',
                    isSelected
                      ? 'text-amber-500 fill-amber-500'
                      : 'text-slate-400'
                  )}
                />
                <span>{star}★</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. BOTTOM ACTION & RESULTS COUNTER */}
      <div className="pt-2 border-t border-slate-100 space-y-2.5">
        <Button
          type="button"
          onClick={onFetchJobs}
          className="w-full h-9 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium shadow-xs flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Fetch Jobs</span>
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
