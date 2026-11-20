'use client';

import React from 'react';

interface JobsHeaderProps {
  onExportCSV?: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  totalCount?: number;
  showFilters?: boolean;
  onToggleFilters?: () => void;
}

export function JobsHeader({}: JobsHeaderProps) {
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
    </div>
  );
}
