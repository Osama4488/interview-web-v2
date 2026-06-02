"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function QuestionsTableSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-start gap-4 py-1">
          <Skeleton className="h-6 w-24 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-full max-w-xs" />
            <Skeleton className="h-3 w-full max-w-sm" />
          </div>
          <Skeleton className="h-3 w-20 shrink-0 hidden md:block" />
          <div className="flex gap-1 shrink-0">
            <Skeleton className="h-7 w-14 rounded-md" />
            <Skeleton className="h-7 w-16 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}
