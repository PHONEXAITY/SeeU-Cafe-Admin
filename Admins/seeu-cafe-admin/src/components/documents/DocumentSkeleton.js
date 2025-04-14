import { Skeleton } from '@/components/ui/skeleton';

export default function DocumentSkeleton() {
  return (
    <div className="container mx-auto p-6 font-['Phetsarath_OT']">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Skeleton className="h-10 flex-grow" />
        <Skeleton className="h-10 w-48" />
      </div>
      <div className="space-y-6">
        {Array(5).fill(0).map((_, i) => (
          <div key={i} className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded" />
              <div>
                <Skeleton className="h-5 w-48 mb-2" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-9 w-9 rounded-full" />
              <Skeleton className="h-9 w-9 rounded-full" />
              <Skeleton className="h-9 w-9 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}