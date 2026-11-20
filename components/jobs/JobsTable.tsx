'use client';

import React from 'react';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Briefcase,
  Loader2,
} from 'lucide-react';
import { Job, JobStatus, SortField, SortDirection } from '@/types/job';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { JobRow } from '@/components/jobs/JobRow';
import { BulkBar } from '@/components/jobs/BulkBar';
import { cn } from '@/lib/utils';

interface JobsTableProps {
  jobs: Job[];
  totalFilteredCount: number;
  isLoading: boolean;
  selectedIds: string[];
  isFiltersOpen?: boolean;
  expandedJobId?: string | null;
  onToggleExpand?: (id: string) => void;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onClearSelection: () => void;
  onStatusChange: (id: string, status: JobStatus) => void;
  onBulkStatusChange: (status: JobStatus) => void;
  onExportSelected: () => void;
  sortField: SortField;
  sortDirection: SortDirection;
  onSortChange: (field: SortField) => void;
  onResetFilters: () => void;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
  hasMore?: boolean;
}

export function JobsTable({
  jobs,
  totalFilteredCount,
  isLoading,
  selectedIds,
  isFiltersOpen = false,
  expandedJobId: controlledExpandedJobId,
  onToggleExpand: controlledOnToggleExpand,
  onToggleSelect,
  onToggleSelectAll,
  onClearSelection,
  onStatusChange,
  onBulkStatusChange,
  onExportSelected,
  sortField,
  sortDirection,
  onSortChange,
  onResetFilters,
  onLoadMore,
  isLoadingMore = false,
  hasMore = true,
}: JobsTableProps) {
  const [internalExpandedJobId, setInternalExpandedJobId] = React.useState<string | null>(null);
  const loadMoreTriggerRef = React.useRef<HTMLDivElement | null>(null);

  const isExpandedJobPresent = internalExpandedJobId
    ? jobs.some((j) => j.id === internalExpandedJobId)
    : false;
  const activeExpandedJobId = isExpandedJobPresent ? internalExpandedJobId : null;

  const expandedJobId =
    controlledExpandedJobId !== undefined
      ? controlledExpandedJobId
      : activeExpandedJobId;

  const handleToggleExpand = (id: string) => {
    if (controlledOnToggleExpand) {
      controlledOnToggleExpand(id);
    } else {
      setInternalExpandedJobId((prev) => (prev === id ? null : id));
    }
  };

  // Auto trigger load more when user scrolls to bottom
  React.useEffect(() => {
    if (!onLoadMore || isLoadingMore || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          onLoadMore();
        }
      },
      { rootMargin: '120px' }
    );

    const el = loadMoreTriggerRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [onLoadMore, isLoadingMore, hasMore]);

  // Helper to render sort icon
  const renderSortIndicator = (field: SortField) => {
    if (sortField !== field) {
      return (
        <ArrowUpDown className="ml-1 h-3.5 w-3.5 text-[#64748B] opacity-0 group-hover:opacity-100 transition-opacity" />
      );
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="ml-1 h-3.5 w-3.5 text-[#2563eb]" />
    ) : (
      <ArrowDown className="ml-1 h-3.5 w-3.5 text-[#2563eb]" />
    );
  };

  return (
    <>
      <Card className="bg-white shadow-xs overflow-hidden">
        <Table className="w-full">
          <TableHeader className="bg-slate-50/75 sticky top-0 z-10 backdrop-blur-xs">
            <TableRow className="hover:bg-transparent border-b border-slate-200/80">
              {/* 0. Expand Toggle Column */}
              <TableHead className="w-9 pl-3.5 pr-0 py-2.5">
                <span className="sr-only">Expand details</span>
              </TableHead>

              {/* 1. JOB TITLE */}
              <TableHead
                className={cn(
                  'px-3.5 py-2.5 transition-all duration-300 font-semibold text-[11px] text-slate-500 uppercase tracking-wider',
                  isFiltersOpen
                    ? 'w-[280px] max-w-[340px] xl:max-w-[420px]'
                    : 'w-[420px] max-w-[560px] xl:max-w-[740px]'
                )}
              >
                Job Title
              </TableHead>

              {/* 2. AI RATING (Tags placed in their own column) */}
              <TableHead className="whitespace-nowrap px-3.5 py-2.5 font-semibold text-[11px] text-slate-500 uppercase tracking-wider">
                AI Rating
              </TableHead>

              {/* 3. BUDGET (Sortable) */}
              <TableHead className="whitespace-nowrap px-3.5 py-2.5 font-semibold text-[11px] uppercase tracking-wider">
                <button
                  type="button"
                  onClick={() => onSortChange('budget')}
                  className="group inline-flex items-center text-[11px] font-semibold text-slate-500 hover:text-slate-900 cursor-pointer uppercase tracking-wider"
                >
                  <span>Budget</span>
                  {renderSortIndicator('budget')}
                </button>
              </TableHead>

              {/* 4. POSTED (Sortable) */}
              <TableHead className="whitespace-nowrap px-3.5 py-2.5 font-semibold text-[11px] uppercase tracking-wider">
                <button
                  type="button"
                  onClick={() => onSortChange('posted')}
                  className="group inline-flex items-center text-[11px] font-semibold text-slate-500 hover:text-slate-900 cursor-pointer uppercase tracking-wider"
                >
                  <span>Posted</span>
                  {renderSortIndicator('posted')}
                </button>
              </TableHead>

              {/* 5. TOTAL SPENT (Sortable) */}
              <TableHead className="whitespace-nowrap px-3.5 py-2.5 font-semibold text-[11px] uppercase tracking-wider">
                <button
                  type="button"
                  onClick={() => onSortChange('totalSpent')}
                  className="group inline-flex items-center text-[11px] font-semibold text-slate-500 hover:text-slate-900 cursor-pointer uppercase tracking-wider"
                >
                  <span>Total Spent</span>
                  {renderSortIndicator('totalSpent')}
                </button>
              </TableHead>

              {/* 6. LOCATION */}
              <TableHead className="whitespace-nowrap px-3.5 py-2.5 font-semibold text-[11px] text-slate-500 uppercase tracking-wider">
                Location
              </TableHead>

              {/* 7. STATUS */}
              <TableHead className="whitespace-nowrap px-3.5 pr-4 py-2.5 font-semibold text-[11px] text-slate-500 uppercase tracking-wider">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              // Skeleton loading state (8 columns)
              Array.from({ length: 12 }).map((_, idx) => (
                <TableRow key={idx} className="border-b border-slate-100">
                  {/* 0. Expand */}
                  <TableCell className="w-9 pl-3.5 pr-0 py-2">
                    <Skeleton className="h-4 w-4 rounded" />
                  </TableCell>
                  {/* 1. Job Title */}
                  <TableCell
                    className={cn(
                      'px-3.5 py-2 transition-all duration-300',
                      isFiltersOpen
                        ? 'w-[280px] max-w-[340px] xl:max-w-[420px]'
                        : 'w-[420px] max-w-[560px] xl:max-w-[740px]'
                    )}
                  >
                    <div className="flex items-center gap-1.5">
                      <Skeleton className="h-4 w-4 rounded-full shrink-0" />
                      <Skeleton className="h-4 w-4/5" />
                    </div>
                  </TableCell>
                  {/* 2. AI Rating */}
                  <TableCell className="whitespace-nowrap px-3.5 py-2">
                    <div className="flex gap-1 items-center">
                      <Skeleton className="h-[18px] w-20 rounded-[4px]" />
                      <Skeleton className="h-[18px] w-10 rounded-[4px]" />
                    </div>
                  </TableCell>
                  {/* 3. Budget */}
                  <TableCell className="whitespace-nowrap px-3.5 py-2">
                    <Skeleton className="h-4 w-14" />
                  </TableCell>
                  {/* 4. Posted */}
                  <TableCell className="whitespace-nowrap px-3.5 py-2">
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  {/* 5. Total Spent */}
                  <TableCell className="whitespace-nowrap px-3.5 py-2">
                    <Skeleton className="h-4 w-14" />
                  </TableCell>
                  {/* 6. Location */}
                  <TableCell className="whitespace-nowrap px-3.5 py-2">
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  {/* 7. Status */}
                  <TableCell className="whitespace-nowrap px-3.5 pr-4 py-2">
                    <Skeleton className="h-6 w-24 rounded-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : jobs.length === 0 ? (
              // Empty state
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="h-64 text-center text-slate-500"
                >
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="p-3 bg-slate-100 rounded-full text-slate-400">
                      <Briefcase className="h-7 w-7 opacity-75" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-slate-900">
                        No jobs found matching your criteria
                      </p>
                      <p className="text-xs text-slate-500">
                        Try adjusting or clearing your search queries and filters.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onResetFilters}
                      className="mt-2 text-xs border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg shadow-2xs"
                    >
                      Clear Filters
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              jobs.map((job) => (
                <JobRow
                  key={job.id}
                  job={job}
                  isSelected={selectedIds.includes(job.id)}
                  isExpanded={expandedJobId === job.id}
                  onToggleExpand={() => handleToggleExpand(job.id)}
                  isFiltersOpen={isFiltersOpen}
                  onToggleSelect={onToggleSelect}
                  onStatusChange={onStatusChange}
                />
              ))
            )}
          </TableBody>
        </Table>

        {/* Centered Text-Only Load More Footer */}
        <div
          ref={loadMoreTriggerRef}
          className="flex items-center justify-center p-3.5 border-t border-slate-100 bg-white"
        >
          {hasMore ? (
            <button
              type="button"
              onClick={onLoadMore}
              disabled={isLoadingMore}
              className="group inline-flex items-center justify-center gap-1.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer disabled:opacity-50"
            >
              {isLoadingMore ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-600" />
                  <span>Loading more jobs...</span>
                </>
              ) : (
                <>
                  <span>Load more jobs</span>
                  <ArrowDown className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600 transition-transform group-hover:translate-y-0.5" />
                </>
              )}
            </button>
          ) : (
            <span className="text-xs text-slate-400 font-medium py-1">
              All jobs loaded
            </span>
          )}
        </div>
      </Card>

      {/* Floating Bulk Action Bar */}
      <BulkBar
        selectedCount={selectedIds.length}
        totalFilteredCount={totalFilteredCount}
        onClearSelection={onClearSelection}
        onBulkStatusChange={onBulkStatusChange}
        onExportSelected={onExportSelected}
      />
    </>
  );
}
