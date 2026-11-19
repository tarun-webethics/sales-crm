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
    <div className="w-full bg-white rounded-2xl border border-[#E5E7EB] p-4.5 space-y-5 shadow-xs">
      {/* 1. TOP HEADER ROW */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-[#374151]" />
          <h3 className="text-base font-bold text-[#111827] tracking-tight">
            Filters
          </h3>
          {activeFiltersCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-[#111827] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
              {activeFiltersCount}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            disabled={activeFiltersCount === 0}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#4B5563] hover:text-[#111827] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-md text-[#6B7280] hover:text-[#111827] hover:bg-gray-100 transition-colors cursor-pointer"
              title="Close filters"
            >
              <PanelLeftClose className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* 2. SAVED FILTERS PILLS */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider block">
          Saved Filters
        </span>

        <div className="flex flex-wrap items-center gap-2">
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
              'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer',
              filters.magicFilter === 'Approved'
                ? 'bg-[#F1FAF0] text-[#14A800] border-[#BEE8B8] font-semibold shadow-xs'
                : 'bg-white text-[#374151] border-[#E5E7EB] hover:border-[#14A800] hover:text-[#14A800]'
            )}
          >
            <Sparkles
              className={cn(
                'h-3.5 w-3.5',
                filters.magicFilter === 'Approved'
                  ? 'text-[#14A800]'
                  : 'text-[#6B7280]'
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
              'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer',
              filters.cream === 'Cream only'
                ? 'bg-[#F1FAF0] text-[#14A800] border-[#BEE8B8] font-semibold shadow-xs'
                : 'bg-white text-[#374151] border-[#E5E7EB] hover:border-[#14A800] hover:text-[#14A800]'
            )}
          >
            <Gem
              className={cn(
                'h-3.5 w-3.5',
                filters.cream === 'Cream only'
                  ? 'text-[#14A800]'
                  : 'text-[#6B7280]'
              )}
            />
            <span>Cream Jobs</span>
            {filters.cream === 'Cream only' && (
              <span className="h-1.5 w-1.5 rounded-full bg-[#14A800]" />
            )}
          </button>
        </div>
      </div>

      {/* 3. SEARCH INPUT */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#9CA3AF]" />
        <Input
          value={filters.search}
          onChange={(e) => updateField('search', e.target.value)}
          placeholder="Search title, tech, location..."
          className="pl-9 pr-8 h-10 bg-white border-[#E5E7EB] hover:border-gray-300 focus-visible:border-[#14A800] focus-visible:ring-1 focus-visible:ring-[#14A800] rounded-xl text-xs placeholder:text-[#9CA3AF] transition-colors"
        />
        {filters.search && (
          <button
            type="button"
            onClick={() => updateField('search', '')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#111827] cursor-pointer p-0.5"
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* 4. MAIN FILTER DROPDOWNS CONTAINER */}
      <div className="p-4 rounded-2xl border border-[#F0F2F5] bg-[#FAFAFA]/60 space-y-3.5">
        {/* 1. Webethics magic filter */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <label className="text-xs font-semibold text-[#374151]">
              Webethics magic filter
            </label>
            {filters.magicFilter !== 'All' && (
              <span className="h-1.5 w-1.5 rounded-full bg-[#14A800]" />
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
                'h-10 text-xs rounded-xl transition-all cursor-pointer',
                filters.magicFilter !== 'All'
                  ? 'bg-[#F1FAF0]/60 border-[#BEE8B8] text-[#14A800] font-medium'
                  : 'bg-white border-[#E5E7EB] hover:border-gray-300 text-[#111827]'
              )}
            >
              <div className="flex items-center gap-2 truncate">
                <Sparkles
                  className={cn(
                    'h-3.5 w-3.5 shrink-0',
                    filters.magicFilter !== 'All'
                      ? 'text-[#14A800]'
                      : 'text-[#6B7280]'
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
                  className="text-xs cursor-pointer"
                >
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 2. Technology */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <label className="text-xs font-semibold text-[#374151]">
              Technology
            </label>
            {filters.technology !== 'All Technologies' && (
              <span className="h-1.5 w-1.5 rounded-full bg-[#14A800]" />
            )}
          </div>
          <Select
            value={filters.technology}
            onValueChange={(val) => updateField('technology', val)}
          >
            <SelectTrigger
              className={cn(
                'h-10 text-xs rounded-xl transition-all cursor-pointer',
                filters.technology !== 'All Technologies'
                  ? 'bg-[#F1FAF0]/60 border-[#BEE8B8] text-[#14A800] font-medium'
                  : 'bg-white border-[#E5E7EB] hover:border-gray-300 text-[#111827]'
              )}
            >
              <div className="flex items-center gap-2 truncate">
                <Code2
                  className={cn(
                    'h-3.5 w-3.5 shrink-0',
                    filters.technology !== 'All Technologies'
                      ? 'text-[#14A800]'
                      : 'text-[#6B7280]'
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
                  className="text-xs cursor-pointer"
                >
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 3. Client location */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <label className="text-xs font-semibold text-[#374151]">
              Client location
            </label>
            {filters.location !== 'All Locations' && (
              <span className="h-1.5 w-1.5 rounded-full bg-[#14A800]" />
            )}
          </div>
          <Select
            value={filters.location}
            onValueChange={(val) => updateField('location', val)}
          >
            <SelectTrigger
              className={cn(
                'h-10 text-xs rounded-xl transition-all cursor-pointer',
                filters.location !== 'All Locations'
                  ? 'bg-[#F1FAF0]/60 border-[#BEE8B8] text-[#14A800] font-medium'
                  : 'bg-white border-[#E5E7EB] hover:border-gray-300 text-[#111827]'
              )}
            >
              <div className="flex items-center gap-2 truncate">
                <MapPin
                  className={cn(
                    'h-3.5 w-3.5 shrink-0',
                    filters.location !== 'All Locations'
                      ? 'text-[#14A800]'
                      : 'text-[#6B7280]'
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
                  className="text-xs cursor-pointer"
                >
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 4. Status */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <label className="text-xs font-semibold text-[#374151]">
              Status
            </label>
            {filters.status !== 'All Statuses' && (
              <span className="h-1.5 w-1.5 rounded-full bg-[#14A800]" />
            )}
          </div>
          <Select
            value={filters.status}
            onValueChange={(val) => updateField('status', val)}
          >
            <SelectTrigger
              className={cn(
                'h-10 text-xs rounded-xl transition-all cursor-pointer',
                filters.status !== 'All Statuses'
                  ? 'bg-[#F1FAF0]/60 border-[#BEE8B8] text-[#14A800] font-medium'
                  : 'bg-white border-[#E5E7EB] hover:border-gray-300 text-[#111827]'
              )}
            >
              <div className="flex items-center gap-2 truncate">
                <CheckCircle2
                  className={cn(
                    'h-3.5 w-3.5 shrink-0',
                    filters.status !== 'All Statuses'
                      ? 'text-[#14A800]'
                      : 'text-[#6B7280]'
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
                  className="text-xs cursor-pointer"
                >
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 5. Date posted */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <label className="text-xs font-semibold text-[#374151]">
              Date posted
            </label>
            {filters.date !== 'All Time' && (
              <span className="h-1.5 w-1.5 rounded-full bg-[#14A800]" />
            )}
          </div>
          <Select
            value={filters.date}
            onValueChange={(val) => updateField('date', val as DateFilterType)}
          >
            <SelectTrigger
              className={cn(
                'h-10 text-xs rounded-xl transition-all cursor-pointer',
                filters.date !== 'All Time'
                  ? 'bg-[#F1FAF0]/60 border-[#BEE8B8] text-[#14A800] font-medium'
                  : 'bg-white border-[#E5E7EB] hover:border-gray-300 text-[#111827]'
              )}
            >
              <div className="flex items-center gap-2 truncate">
                <Calendar
                  className={cn(
                    'h-3.5 w-3.5 shrink-0',
                    filters.date !== 'All Time'
                      ? 'text-[#14A800]'
                      : 'text-[#6B7280]'
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
                  className="text-xs cursor-pointer"
                >
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 5. CREAM JOBS STAR RATING SECTION */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">
            Cream Jobs
          </span>
          {(filters.cream !== 'All' || selectedStar !== null) && (
            <button
              type="button"
              onClick={() => {
                setSelectedStar(null);
                updateField('cream', 'All');
              }}
              className="text-xs font-semibold text-[#14A800] hover:text-[#108A00] transition-colors cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
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
                  'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer',
                  isSelected
                    ? 'bg-[#FEFCE8] text-[#854D0E] border-[#FDE047] shadow-xs font-semibold'
                    : 'bg-white text-[#374151] border-[#E5E7EB] hover:border-gray-300'
                )}
              >
                <Star
                  className={cn(
                    'h-3.5 w-3.5',
                    isSelected
                      ? 'text-[#EAB308] fill-[#EAB308]'
                      : 'text-[#9CA3AF]'
                  )}
                />
                <span>{star} star</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. BOTTOM ACTION & RESULTS COUNTER */}
      <div className="pt-2 space-y-3">
        <Button
          type="button"
          onClick={onFetchJobs}
          className="w-full h-10 rounded-xl bg-[#14A800] hover:bg-[#108A00] text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Sparkles className="h-4 w-4" />
          <span>Fetch Jobs</span>
        </Button>

        <div className="flex items-center justify-between text-xs text-[#6B7280] pt-0.5">
          <span>
            Showing{' '}
            <strong className="text-[#111827] font-bold">{resultCount}</strong>{' '}
            of {totalCount} jobs
          </span>

          {activeFiltersCount > 0 && (
            <button
              type="button"
              onClick={handleReset}
              className="text-[#14A800] hover:text-[#108A00] font-semibold hover:underline cursor-pointer"
            >
              Clear all
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
