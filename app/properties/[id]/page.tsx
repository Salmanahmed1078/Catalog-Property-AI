// properties/[id]/page.tsx
import { Suspense } from 'react';
import PropertyClient from './PropertyClient';
import { Skeleton } from '@/components/ui/skeleton';

export default async function PropertyPage({ 
  params 
}: { 
  params: { id: string }
}) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-12">
        <Suspense
          fallback={
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Left column - Image skeleton */}
              <div className="space-y-4">
                <Skeleton className="h-[500px] w-full rounded-xl shadow-lg bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
                <div className="grid grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton 
                      key={i} 
                      className="aspect-square rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse 
                      transition-transform hover:scale-105 duration-300" 
                    />
                  ))}
                </div>
              </div>

              {/* Right column - Content skeletons */}
              <div className="space-y-8 backdrop-blur-sm bg-white/50 p-6 rounded-xl shadow-lg">
                <div className="space-y-4">
                  <Skeleton className="h-10 w-3/4 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" />
                  <Skeleton className="h-6 w-1/3 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" />
                </div>
                
                <div className="space-y-4">
                  <Skeleton className="h-32 w-full rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
                  <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-20 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
                    <Skeleton className="h-20 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
                  </div>
                </div>

                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton 
                      key={i} 
                      className="h-4 w-full bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" 
                    />
                  ))}
                </div>
              </div>
            </div>
          }
        >
          <PropertyClient id={params.id} />
        </Suspense>
      </div>
    </main>
  );
}