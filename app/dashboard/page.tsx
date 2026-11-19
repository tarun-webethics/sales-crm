import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LayoutDashboard } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="text-xl font-medium tracking-tight text-black">
          Dashboard
        </h1>
        <p className="text-xs text-black mt-0.5">
          Overview of metrics, team performance, and intelligence summaries
        </p>
      </div>

      <Card className="rounded-xl border border-[#CBD5E1] bg-white shadow-xs p-12 text-center">
        <CardContent className="flex flex-col items-center justify-center max-w-md mx-auto space-y-3 p-0">
          <div className="h-12 w-12 rounded-full bg-[#EFF6FF] text-[#2563eb] border border-[#BFDBFE] flex items-center justify-center">
            <LayoutDashboard className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-bold text-[#0F172A]">Dashboard Coming Soon</h2>
          <p className="text-sm text-[#334155] font-medium">
            The main analytics and performance reporting dashboard is currently being built.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
