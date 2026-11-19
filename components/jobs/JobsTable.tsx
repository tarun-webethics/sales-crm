'use client';

import React from 'react';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Briefcase,
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
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import { JobRow } from '@/components/jobs/JobRow';
import { BulkBar } from '@/components/jobs/BulkBar';
import { cn } from '@/lib/utils';

interface JobsTableProps {
  jobs: Job[];
  totalFilteredCount: number;
  isLoading: boolean;
  selectedIds: string[];
  isFiltersOpen?: boolean;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onClearSelection: () => void;
  onStatusChange: (id: string, status: JobStatus) => void;
  onBulkStatusChange: (status: JobStatus) => void;
  onExportSelected: () => void;
  sortField: SortField;
  sortDirection: SortDirection;
  onSortChange: (field: SortField) => void;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onResetFilters: () => void;
}

export function JobsTable({
  jobs,
  totalFilteredCount,
  isLoading,
  selectedIds,
  isFiltersOpen = false,
  onToggleSelect,
  onToggleSelectAll,
  onClearSelection,
  onStatusChange,
  onBulkStatusChange,
  onExportSelected,
  sortField,
  sortDirection,
  onSortChange,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onResetFilters,
}: JobsTableProps) {
  const isAllSelected =
    jobs.length > 0 && jobs.every((job) => selectedIds.includes(job.id));
  const isPartiallySelected =
    selectedIds.length > 0 &&
    jobs.some((job) => selectedIds.includes(job.id)) &&
    !isAllSelected;

  const totalPages = Math.max(1, Math.ceil(totalFilteredCount / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalFilteredCount);

  // Helper to render sort icon
  const renderSortIndicator = (field: SortField) => {
    if (sortField !== field) {
      return (
        <ArrowUpDown className="ml-1 h-3.5 w-3.5 text-[#9CA3AF] opacity-0 group-hover:opacity-100 transition-opacity" />
      );
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="ml-1 h-3.5 w-3.5 text-[#14A800]" />
    ) : (
      <ArrowDown className="ml-1 h-3.5 w-3.5 text-[#14A800]" />
    );
  };

  return (
    <>
      <Card className="rounded-xl border border-[#E5E7EB] bg-white shadow-xs overflow-hidden">
        <Table className="w-full">
          <TableHeader className="bg-[#F9FAFB] sticky top-0 z-10">
            <TableRow className="hover:bg-[#F9FAFB] border-b border-[#E5E7EB]">
              {/* 0. Expand Toggle Column */}
              <TableHead className="w-8 pl-3.5 pr-0 py-3.5">
                <span className="sr-only">Expand details</span>
              </TableHead>

              {/* 1. Checkbox Select All */}
              <TableHead className="w-9 px-1 py-3.5">
                <Checkbox
                  checked={isAllSelected ? true : isPartiallySelected ? 'indeterminate' : false}
                  onCheckedChange={onToggleSelectAll}
                  aria-label="Select all jobs on current page"
                />
              </TableHead>

              {/* 2. JOB TITLE */}
              <TableHead
                className={cn(
                  'px-3.5 py-3.5 transition-all duration-300 font-medium text-xs text-[#6B7280]',
                  isFiltersOpen
                    ? 'w-[280px] max-w-[340px] xl:max-w-[420px]'
                    : 'w-[420px] max-w-[560px] xl:max-w-[740px]'
                )}
              >
                Job Title
              </TableHead>

              {/* 3. AI RATING (Tags placed in their own column) */}
              <TableHead className="whitespace-nowrap px-3.5 py-3.5 font-medium text-xs text-[#6B7280]">
                AI Rating
              </TableHead>

              {/* 4. BUDGET (Sortable) */}
              <TableHead className="whitespace-nowrap px-3.5 py-3.5">
                <button
                  type="button"
                  onClick={() => onSortChange('budget')}
                  className="group inline-flex items-center text-xs font-medium text-[#6B7280] hover:text-[#111827] cursor-pointer"
                >
                  <span>Budget</span>
                  {renderSortIndicator('budget')}
                </button>
              </TableHead>

              {/* 5. POSTED (Sortable) */}
              <TableHead className="whitespace-nowrap px-3.5 py-3.5">
                <button
                  type="button"
                  onClick={() => onSortChange('posted')}
                  className="group inline-flex items-center text-xs font-medium text-[#6B7280] hover:text-[#111827] cursor-pointer"
                >
                  <span>Posted</span>
                  {renderSortIndicator('posted')}
                </button>
              </TableHead>

              {/* 6. TOTAL SPENT (Sortable) */}
              <TableHead className="whitespace-nowrap px-3.5 py-3.5">
                <button
                  type="button"
                  onClick={() => onSortChange('totalSpent')}
                  className="group inline-flex items-center text-xs font-medium text-[#6B7280] hover:text-[#111827] cursor-pointer"
                >
                  <span>Total Spent</span>
                  {renderSortIndicator('totalSpent')}
                </button>
              </TableHead>

              {/* 7. LOCATION */}
              <TableHead className="whitespace-nowrap px-3.5 py-3.5 font-medium text-xs text-[#6B7280]">
                Location
              </TableHead>

              {/* 8. STATUS */}
              <TableHead className="whitespace-nowrap px-3.5 pr-4 py-3.5 font-medium text-xs text-[#6B7280]">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              // Skeleton loading state (9 columns)
              Array.from({ length: 8 }).map((_, idx) => (
                <TableRow key={idx} className="border-b border-[#E5E7EB]">
                  {/* 0. Expand */}
                  <TableCell className="w-8 pl-3.5 pr-0 py-3.5">
                    <Skeleton className="h-4 w-4 rounded" />
                  </TableCell>
                  {/* 1. Checkbox */}
                  <TableCell className="w-9 px-1 py-3.5">
                    <Skeleton className="h-4 w-4 rounded" />
                  </TableCell>
                  {/* 2. Job Title */}
                  <TableCell
                    className={cn(
                      'px-3.5 py-3.5 transition-all duration-300',
                      isFiltersOpen
                        ? 'w-[280px] max-w-[340px] xl:max-w-[420px]'
                        : 'w-[420px] max-w-[560px] xl:max-w-[740px]'
                    )}
                  >
                    <Skeleton className="h-4 w-4/5" />
                  </TableCell>
                  {/* 3. AI Rating */}
                  <TableCell className="whitespace-nowrap px-3.5 py-3.5">
                    <div className="flex gap-1.5">
                      <Skeleton className="h-5 w-20 rounded-md" />
                      <Skeleton className="h-5 w-12 rounded" />
                    </div>
                  </TableCell>
                  {/* 4. Budget */}
                  <TableCell className="whitespace-nowrap px-3.5 py-3.5">
                    <Skeleton className="h-4 w-14" />
                  </TableCell>
                  {/* 5. Posted */}
                  <TableCell className="whitespace-nowrap px-3.5 py-3.5">
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  {/* 6. Total Spent */}
                  <TableCell className="whitespace-nowrap px-3.5 py-3.5">
                    <Skeleton className="h-4 w-14" />
                  </TableCell>
                  {/* 7. Location */}
                  <TableCell className="whitespace-nowrap px-3.5 py-3.5">
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  {/* 8. Status */}
                  <TableCell className="whitespace-nowrap px-3.5 pr-4 py-3.5">
                    <Skeleton className="h-6 w-24 rounded-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : jobs.length === 0 ? (
              // Empty state
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="h-64 text-center text-[#6B7280]"
                >
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="p-3 bg-[#F3F4F6] rounded-full text-[#9CA3AF]">
                      <Briefcase className="h-8 w-8 opacity-60" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-base font-semibold text-[#001E00]">
                        No jobs found matching your criteria
                      </p>
                      <p className="text-xs text-[#6B7280]">
                        Try adjusting or clearing your search queries and filters.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onResetFilters}
                      className="mt-2 text-xs border-[#E5E7EB]"
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
                  isFiltersOpen={isFiltersOpen}
                  onToggleSelect={onToggleSelect}
                  onStatusChange={onStatusChange}
                />
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination and Rows Per Page Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-[#E5E7EB] bg-white">
          <div className="flex items-center gap-3 text-xs text-[#6B7280]">
            <span>
              Showing{' '}
              <strong className="text-[#001E00] font-semibold">
                {totalFilteredCount === 0 ? 0 : startIndex + 1}
              </strong>
              –
              <strong className="text-[#001E00] font-semibold">
                {endIndex}
              </strong>{' '}
              of{' '}
              <strong className="text-[#001E00] font-semibold">
                {totalFilteredCount.toLocaleString()}
              </strong>{' '}
              jobs
            </span>

            <div className="hidden sm:flex items-center gap-1.5 ml-4">
              <span className="text-[11px] text-[#9CA3AF] uppercase font-medium">
                Rows:
              </span>
              <Select
                value={String(pageSize)}
                onValueChange={(val) => {
                  onPageSizeChange(Number(val));
                  onPageChange(1);
                }}
              >
                <SelectTrigger className="h-7 w-16 text-xs bg-[#F9FAFB] border-[#E5E7EB]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="end">
                  <SelectItem value="10" className="text-xs">
                    10
                  </SelectItem>
                  <SelectItem value="20" className="text-xs">
                    20
                  </SelectItem>
                  <SelectItem value="50" className="text-xs">
                    50
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {totalPages > 1 && (
            <Pagination className="mx-0 w-auto">
              <PaginationContent className="gap-1">
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage <= 1}
                    className={cn(
                      currentPage <= 1 &&
                        'pointer-events-none opacity-40 cursor-not-allowed'
                    )}
                  />
                </PaginationItem>

                {/* Page numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((page) => {
                    return (
                      page === 1 ||
                      page === totalPages ||
                      Math.abs(page - currentPage) <= 1
                    );
                  })
                  .map((page, idx, arr) => {
                    const prev = arr[idx - 1];
                    const showEllipsisBefore = prev && page - prev > 1;

                    return (
                      <React.Fragment key={page}>
                        {showEllipsisBefore && (
                          <PaginationItem>
                            <PaginationEllipsis />
                          </PaginationItem>
                        )}
                        <PaginationItem>
                          <PaginationLink
                            isActive={page === currentPage}
                            onClick={() => onPageChange(page)}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      </React.Fragment>
                    );
                  })}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      onPageChange(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage >= totalPages}
                    className={cn(
                      currentPage >= totalPages &&
                        'pointer-events-none opacity-40 cursor-not-allowed'
                    )}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
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
