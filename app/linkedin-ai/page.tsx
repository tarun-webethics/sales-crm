import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Share2 } from 'lucide-react';

export default function LinkedInAIPage() {
  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[#001E00]">
          LinkedIn AI
        </h1>
        <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">
          AI-driven prospecting, connection management, and personalized messaging
        </p>
      </div>

      <Card className="rounded-xl border border-[#E5E7EB] bg-white shadow-xs p-12 text-center">
        <CardContent className="flex flex-col items-center justify-center max-w-md mx-auto space-y-3 p-0">
          <div className="h-12 w-12 rounded-full bg-[#F1FAF0] text-[#14A800] flex items-center justify-center">
            <Share2 className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-semibold text-[#001E00]">LinkedIn AI Coming Soon</h2>
          <p className="text-sm text-[#6B7280]">
            Intelligent prospect discovery and LinkedIn engagement workflows are in development.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
