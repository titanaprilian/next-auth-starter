"use client";

import { userManagementConfig } from "../config/userManagement";
import { Skeleton } from "@/components/ui/skeleton";

export function UserViewSkeleton() {
  const AvatarIcon = userManagementConfig.avatarIcon;
  const fieldCount = userManagementConfig.viewFields.length;

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center gap-2 py-2">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-branding-dark">
          <AvatarIcon className="h-7 w-7 text-white" />
        </div>
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-3 w-40" />
      </div>

      <div className="rounded-lg border">
        {Array.from({ length: fieldCount }).map((_, index) => (
          <div
            key={index}
            className={`flex items-center gap-3 px-3 py-2.5 ${
              index !== fieldCount - 1 ? "border-b" : ""
            }`}
          >
            <Skeleton className="h-8 w-8 rounded-lg" />
            <div className="flex-1">
              <Skeleton className="h-3 w-12 mb-1" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-1">
        <Skeleton className="h-2 w-32" />
        <Skeleton className="h-2 w-40" />
      </div>
    </div>
  );
}
