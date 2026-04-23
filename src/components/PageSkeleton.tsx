import { Skeleton } from "@/components/ui/skeleton";

const PageSkeleton = () => (
  <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
    <div className="flex items-center gap-4">
      <Skeleton className="w-14 h-14 rounded-2xl" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-3 w-72" />
      </div>
    </div>
    <Skeleton className="h-2 w-full rounded-full" />
    <div className="grid sm:grid-cols-3 gap-4">
      <Skeleton className="h-24 rounded-2xl" />
      <Skeleton className="h-24 rounded-2xl" />
      <Skeleton className="h-24 rounded-2xl" />
    </div>
    <Skeleton className="h-64 rounded-2xl" />
  </div>
);

export default PageSkeleton;
