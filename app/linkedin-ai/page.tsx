import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Share2 } from 'lucide-react';

export default function LinkedInAIPage() {
  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="text-xl font-medium tracking-tight text-black">
          LinkedIn AI
        </h1>
        <p className="text-xs text-black mt-0.5">
          AI-driven prospecting, connection management, and personalized messaging
        </p>
      </div>

      <Card className="rounded-xl border border-[#CBD5E1] bg-white shadow-xs p-12 text-center">
        <CardContent className="flex flex-col items-center justify-center max-w-md mx-auto space-y-3 p-0">
          <div className="h-12 w-12 rounded-full bg-[#EFF6FF] text-[#2563eb] border border-[#BFDBFE] flex items-center justify-center">
            <Share2 className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-bold text-[#0F172A]">LinkedIn AI Coming Soon</h2>
          <p className="text-sm text-[#334155] font-medium">
            Intelligent prospect discovery and LinkedIn engagement workflows are in development.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
