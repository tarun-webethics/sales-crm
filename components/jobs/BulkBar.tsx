'use client';

import React from 'react';
import { CheckCircle2, Download, X, Clock, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { JobStatus } from '@/types/job';

interface BulkBarProps {
  selectedCount: number;
  totalFilteredCount: number;
  onClearSelection: () => void;
  onBulkStatusChange: (status: JobStatus) => void;
  onExportSelected: () => void;
}

export function BulkBar({
  selectedCount,
  totalFilteredCount,
  onClearSelection,
  onBulkStatusChange,
  onExportSelected,
}: BulkBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 bg-[#001E00] text-white px-4 py-2.5 rounded-xl shadow-2xl border border-white/10 animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div className="flex items-center gap-2 pr-2 border-r border-white/20">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#14A800] text-[11px] font-bold text-white">
          {selectedCount}
        </span>
        <span className="text-xs font-medium text-white/90">
          selected of {totalFilteredCount}
        </span>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onBulkStatusChange('Applied')}
          className="h-7 text-xs bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white"
        >
          <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-[#14A800]" />
          Mark Applied
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => onBulkStatusChange('Interviewing')}
          className="h-7 text-xs bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white"
        >
          <Clock className="h-3.5 w-3.5 mr-1 text-[#F59E0B]" />
          Interviewing
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => onBulkStatusChange('Hired')}
          className="h-7 text-xs bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white"
        >
          <Award className="h-3.5 w-3.5 mr-1 text-[#14A800]" />
          Hired
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={onExportSelected}
          className="h-7 text-xs bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white"
        >
          <Download className="h-3.5 w-3.5 mr-1" />
          Export
        </Button>
      </div>

      <button
        type="button"
        onClick={onClearSelection}
        className="ml-1 text-white/60 hover:text-white transition-colors p-1 rounded-md hover:bg-white/10 cursor-pointer"
        aria-label="Clear selection"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
