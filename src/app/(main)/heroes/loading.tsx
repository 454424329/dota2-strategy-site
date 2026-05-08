import { Container } from "@/components/layout/Container";
import { Skeleton } from "@/components/ui/skeleton";

export default function HeroesLoading() {
  return (
    <Container className="py-8">
      <div className="space-y-1 mb-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Search + filter skeleton */}
      <div className="space-y-4 mb-8">
        <Skeleton className="h-10 w-full max-w-md" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-16 rounded-md" />
          ))}
        </div>
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-dota-border bg-dota-surface overflow-hidden">
            <Skeleton className="aspect-[4/3] w-full" />
            <div className="p-3 space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-5 w-12 rounded-md" />
              </div>
              <div className="flex gap-1">
                <Skeleton className="h-4 w-10 rounded-md" />
                <Skeleton className="h-4 w-10 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}
