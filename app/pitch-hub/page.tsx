import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export default function PitchHubPage() {
  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[#001E00]">
          Pitch Hub
        </h1>
        <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">
          Proposal generation, pitch decks, case studies, and winning bids
        </p>
      </div>

      <Card className="rounded-xl border border-[#E5E7EB] bg-white shadow-xs p-12 text-center">
        <CardContent className="flex flex-col items-center justify-center max-w-md mx-auto space-y-3 p-0">
          <div className="h-12 w-12 rounded-full bg-[#F1FAF0] text-[#14A800] flex items-center justify-center">
            <FileText className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-semibold text-[#001E00]">Pitch Hub Coming Soon</h2>
          <p className="text-sm text-[#6B7280]">
            AI proposal generation, custom pitch deck templates, and response libraries will appear here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
