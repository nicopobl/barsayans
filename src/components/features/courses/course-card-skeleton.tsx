import { cn } from "@/lib/utils";

/** Skeleton placeholder while course data loads. */
export function CourseCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-2xl border border-brand-zinc-800 bg-brand-bg-surface",
        className,
      )}
    >
      {/* Thumbnail skeleton */}
      <div className="aspect-video w-full bg-brand-bg-elevated">
        <div className="h-full w-full animate-shimmer bg-shimmer bg-[length:200%_100%]" />
      </div>

      {/* Content skeleton */}
      <div className="flex flex-col gap-3 p-5">
        <div className="h-5 w-3/4 rounded-md bg-brand-bg-elevated animate-shimmer bg-shimmer bg-[length:200%_100%]" />
        <div className="h-4 w-full rounded-md bg-brand-bg-elevated animate-shimmer bg-shimmer bg-[length:200%_100%]" />
        <div className="h-4 w-2/3 rounded-md bg-brand-bg-elevated animate-shimmer bg-shimmer bg-[length:200%_100%]" />
        <div className="mt-2 flex items-center justify-between">
          <div className="h-7 w-24 rounded-md bg-brand-bg-elevated animate-shimmer bg-shimmer bg-[length:200%_100%]" />
        </div>
      </div>
    </div>
  );
}
