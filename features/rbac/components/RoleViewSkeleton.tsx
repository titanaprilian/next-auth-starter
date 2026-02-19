"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function RoleViewSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center gap-2 py-2">
        <Skeleton className="h-14 w-14 rounded-full" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>

      <div className="rounded-lg border">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-3 py-2.5 border-b last:border-b-0"
          >
            <Skeleton className="h-8 w-8 rounded-lg" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <Skeleton className="h-3 w-24" />
        <div className="rounded-lg border">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-3 px-3 py-2.5 border-b last:border-b-0"
            >
              <Skeleton className="h-4 w-20" />
              <div className="flex gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-4" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-1">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  );
}
