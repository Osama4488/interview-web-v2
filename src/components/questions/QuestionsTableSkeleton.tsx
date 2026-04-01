"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function QuestionsTableSkeleton() {
  return (
    <div className="overflow-hidden border rounded">
      <div className="bg-slate-50 border-b p-3">
        <div className="grid grid-cols-4 gap-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-4 w-28" />
        </div>
      </div>

      <div className="p-3 space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="grid grid-cols-4 gap-3 items-center">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-32" />
          </div>
        ))}
      </div>
    </div>
  );
}