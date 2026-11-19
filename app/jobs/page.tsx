'use client';

import React, { useState, useMemo, useTransition } from 'react';
import { mockJobs } from '@/data/jobs';
import { Job, JobStatus, SortField, SortDirection, FilterState } from '@/types/job';
import {
  filterJobs,
  sortJobs,
  initialFilterState,
  exportJobsToCSV,
} from '@/lib/filters';
import { JobsHeader } from '@/components/jobs/JobsHeader';
import { JobsFilters } from '@/components/jobs/JobsFilters';
import { JobsTable } from '@/components/jobs/JobsTable';
import { cn } from '@/lib/utils';

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [filters, setFilters] = useState<FilterState>(initialFilterState);
  const [sortField, setSortField] = useState<SortField>('savedDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [, startTransition] = useTransition();

  // Filtered and sorted jobs computation
  const filteredJobs = useMemo(() => {
    return filterJobs(jobs, filters);
  }, [jobs, filters]);

  const sortedJobs = useMemo(() => {
    return sortJobs(filteredJobs, sortField, sortDirection);
  }, [filteredJobs, sortField, sortDirection]);

  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedJobs.slice(start, start + pageSize);
  }, [sortedJobs, currentPage, pageSize]);

  // Handlers
  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters(initialFilterState);
    setCurrentPage(1);
  };

  const handleToggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  const handleSortChange = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    const currentPageIds = paginatedJobs.map((j) => j.id);
    const allCurrentSelected = currentPageIds.every((id) =>
      selectedIds.includes(id)
    );

    if (allCurrentSelected) {
      setSelectedIds((prev) =>
        prev.filter((id) => !currentPageIds.includes(id))
      );
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...currentPageIds])));
    }
  };

  const handleClearSelection = () => {
    setSelectedIds([]);
  };

  const handleStatusChange = (id: string, newStatus: JobStatus) => {
    setJobs((prev) =>
      prev.map((job) => (job.id === id ? { ...job, status: newStatus } : job))
    );
  };

  const handleBulkStatusChange = (newStatus: JobStatus) => {
    setJobs((prev) =>
      prev.map((job) =>
        selectedIds.includes(job.id) ? { ...job, status: newStatus } : job
      )
    );
  };

  const handleExportCSV = () => {
    exportJobsToCSV(filteredJobs, `upwork-jobs-${Date.now()}.csv`);
  };

  const handleExportSelected = () => {
    const selectedJobs = jobs.filter((j) => selectedIds.includes(j.id));
    exportJobsToCSV(
      selectedJobs,
      `upwork-jobs-selected-${Date.now()}.csv`
    );
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      startTransition(() => {
        setIsRefreshing(false);
      });
    }, 800);
  };

  const handleFetchCreamJobs = () => {
    setFilters((prev) => ({ ...prev, cream: 'Cream only' }));
    setCurrentPage(1);
    handleRefresh();
  };

  const handleFetchJobs = () => {
    handleRefresh();
  };

  return (
    <div className="space-y-6 w-full">
      {/* Page Header */}
      <JobsHeader
        onExportCSV={handleExportCSV}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        totalCount={54499}
        showFilters={showFilters}
        onToggleFilters={handleToggleFilters}
      />

      {/* Main Content with Left Filters Sidebar */}
      <div className="flex flex-col lg:flex-row items-start w-full">
        {/* Left Filters Sidebar with Smooth Width & Opacity Animation */}
        <aside
          aria-label="Jobs Filter Panel"
          className={cn(
            'overflow-hidden transition-all duration-300 ease-in-out shrink-0 self-start lg:sticky lg:top-20',
            showFilters
              ? 'w-full max-h-[1600px] opacity-100 mb-6 lg:mb-0 lg:w-72 xl:w-80 lg:mr-6 pointer-events-auto'
              : 'w-0 max-h-0 opacity-0 mb-0 lg:w-0 lg:mr-0 pointer-events-none'
          )}
        >
          <div
            className={cn(
              'w-full lg:w-72 xl:w-80 transition-all duration-300 ease-in-out',
              showFilters ? 'translate-x-0 opacity-100' : '-translate-x-6 opacity-0'
            )}
          >
            <JobsFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
              onFetchJobs={handleFetchJobs}
              onFetchCreamJobs={handleFetchCreamJobs}
              resultCount={filteredJobs.length}
              totalCount={jobs.length}
              onClose={() => setShowFilters(false)}
            />
          </div>
        </aside>

        {/* Jobs Table Card (smoothly expands full width when filters are hidden) */}
        <div className="flex-1 min-w-0 w-full transition-all duration-300 ease-in-out">
          <JobsTable
            jobs={paginatedJobs}
            totalFilteredCount={filteredJobs.length}
            isLoading={isRefreshing}
            selectedIds={selectedIds}
            isFiltersOpen={showFilters}
            onToggleSelect={handleToggleSelect}
            onToggleSelectAll={handleToggleSelectAll}
            onClearSelection={handleClearSelection}
            onStatusChange={handleStatusChange}
            onBulkStatusChange={handleBulkStatusChange}
            onExportSelected={handleExportSelected}
            sortField={sortField}
            sortDirection={sortDirection}
            onSortChange={handleSortChange}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            onResetFilters={handleResetFilters}
          />
        </div>
      </div>
    </div>
  );
}
