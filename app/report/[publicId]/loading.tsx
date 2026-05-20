import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingReport() {
  return (
    <main className="container space-y-8 py-12">
      <Skeleton className="h-12 w-40" />
      <Skeleton className="h-24 w-full max-w-3xl" />
      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <Skeleton className="h-44 w-full" />
          <Skeleton className="h-44 w-full" />
          <Skeleton className="h-44 w-full" />
        </div>
        <Skeleton className="h-80 w-full" />
      </div>
    </main>
  );
}
