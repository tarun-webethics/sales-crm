import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export default function PitchHubPage() {
  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="text-xl font-medium tracking-tight text-black">
          Pitch Hub
        </h1>
        <p className="text-xs text-black mt-0.5">
          Proposal generation, pitch decks, case studies, and winning bids
        </p>
      </div>

      <Card className="rounded-xl border border-[#CBD5E1] bg-white shadow-xs p-12 text-center">
        <CardContent className="flex flex-col items-center justify-center max-w-md mx-auto space-y-3 p-0">
          <div className="h-12 w-12 rounded-full bg-[#EFF6FF] text-[#2563eb] border border-[#BFDBFE] flex items-center justify-center">
            <FileText className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-bold text-[#0F172A]">Pitch Hub Coming Soon</h2>
          <p className="text-sm text-[#334155] font-medium">
            AI proposal generation, custom pitch deck templates, and response libraries will appear here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
