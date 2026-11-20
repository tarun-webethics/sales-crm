'use client';

import React, { useState, useMemo, useTransition } from 'react';
import { mockJobs, generateMoreJobs } from '@/data/jobs';
import { Job, JobStatus, SortField, SortDirection, FilterState } from '@/types/job';
import {
  filterJobs,
  sortJobs,
  initialFilterState,
  exportJobsToCSV,
} from '@/lib/filters';
import { JobsHeader } from '@/components/jobs/JobsHeader';
import { JobsToolbar } from '@/components/jobs/JobsToolbar';
import { JobsFilters } from '@/components/jobs/JobsFilters';
import { JobsTable } from '@/components/jobs/JobsTable';
import { cn } from '@/lib/utils';

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [filters, setFilters] = useState<FilterState>(initialFilterState);
  const [sortField, setSortField] = useState<SortField>('savedDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [, startTransition] = useTransition();

  // Filtered and sorted jobs computation (all jobs loaded)
  const filteredJobs = useMemo(() => {
    return filterJobs(jobs, filters);
  }, [jobs, filters]);

  const sortedJobs = useMemo(() => {
    return sortJobs(filteredJobs, sortField, sortDirection);
  }, [filteredJobs, sortField, sortDirection]);

  // Handlers
  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters(initialFilterState);
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
    const allVisibleIds = sortedJobs.map((j) => j.id);
    const allCurrentSelected = allVisibleIds.every((id) =>
      selectedIds.includes(id)
    );

    if (allCurrentSelected) {
      setSelectedIds((prev) =>
        prev.filter((id) => !allVisibleIds.includes(id))
      );
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...allVisibleIds])));
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

  const handleLoadMore = () => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);
    setTimeout(() => {
      startTransition(() => {
        const nextBatch = generateMoreJobs(jobs.length, 15);
        setJobs((prev) => [...prev, ...nextBatch]);
        setIsLoadingMore(false);
      });
    }, 600);
  };

  const handleFetchCreamJobs = () => {
    setFilters((prev) => ({
      ...prev,
      cream: prev.cream === 'Cream only' ? 'All' : 'Cream only',
    }));
    handleRefresh();
  };

  return (
    <div className="space-y-6 w-full">
      {/* Page Header */}
      <JobsHeader />

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
              resultCount={filteredJobs.length}
              totalCount={jobs.length}
              onClose={() => setShowFilters(false)}
            />
          </div>
        </aside>

        {/* Jobs Table Column (smoothly expands full width when filters are hidden) */}
        <div className="flex-1 min-w-0 w-full transition-all duration-300 ease-in-out space-y-3">
          {/* Toolbar Row Above the Table */}
          <JobsToolbar
            isFiltersOpen={showFilters}
            onToggleFilters={handleToggleFilters}
            search={filters.search}
            onSearchChange={(val) => handleFilterChange({ ...filters, search: val })}
            onFetchCreamJobs={handleFetchCreamJobs}
            onRefresh={handleRefresh}
            isRefreshing={isRefreshing}
            isCreamActive={filters.cream === 'Cream only'}
          />

          {/* Table Card */}
          <JobsTable
            jobs={sortedJobs}
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
            onResetFilters={handleResetFilters}
            onLoadMore={handleLoadMore}
            isLoadingMore={isLoadingMore}
            hasMore={true}
          />
        </div>
      </div>
    </div>
  );
}
