import React from 'react';
import { ModelScore } from '@/types/job';
import { cn } from '@/lib/utils';

interface RatingBadgesProps {
  verdict: 'Manual Review' | 'Rejected' | 'Approved';
  verdictScore: number;
  modelScores?: ModelScore[];
  className?: string;
}

export function RatingBadges({
  verdict,
  verdictScore,
  modelScores = [],
  className,
}: RatingBadgesProps) {
  let verdictColor = 'bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]';

  if (verdict === 'Rejected') {
    verdictColor = 'bg-[#FEE2E2] text-[#DC2626] border-[#FECACA]';
  } else if (verdict === 'Approved') {
    verdictColor = 'bg-[#DFF3DC] text-[#14A800] border-[#BEE8B8]';
  }

  return (
    <div className={cn('flex flex-wrap items-center gap-1.5', className)}>
      {/* Verdict Pill */}
      <span
        className={cn(
          'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium border',
          verdictColor
        )}
      >
        <span>{verdict}</span>
        <span className="font-semibold opacity-90">{verdictScore}%</span>
      </span>

      {/* Model Badges */}
      {modelScores.map((m, idx) => {
        let modelBadgeClass = 'bg-[#EEF2FF] text-[#4F46E5] border-[#C7D2FE]';

        if (m.model === 'C') {
          modelBadgeClass = 'bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]';
        } else if (m.model === 'Rejected') {
          modelBadgeClass = 'bg-[#FEF2F2] text-[#DC2626] border-[#FEE2E2]';
        }

        return (
          <span
            key={idx}
            className={cn(
              'inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-normal border',
              modelBadgeClass
            )}
          >
            <span className="font-medium">{m.model}</span>
            <span>{m.score}%</span>
          </span>
        );
      })}
    </div>
  );
}
