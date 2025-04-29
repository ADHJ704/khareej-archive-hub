
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

const ProjectDetailSkeleton = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow flex items-center justify-center">
        <div className="container-custom py-10">
          <div className="flex flex-col gap-4 w-full">
            {/* Breadcrumb skeleton */}
            <div className="flex gap-2">
              <Skeleton className="w-20 h-4" />
              <Skeleton className="w-4 h-4" />
              <Skeleton className="w-20 h-4" />
              <Skeleton className="w-4 h-4" />
              <Skeleton className="w-40 h-4" />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
              {/* Main content skeleton */}
              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-card rounded-lg shadow p-6">
                  <Skeleton className="w-3/4 h-8 mb-4" />
                  
                  <div className="flex gap-2 mb-6">
                    <Skeleton className="w-16 h-6" />
                    <Skeleton className="w-16 h-6" />
                    <Skeleton className="w-16 h-6" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex items-center">
                        <Skeleton className="h-5 w-5 mr-2" />
                        <div className="flex flex-col gap-1">
                          <Skeleton className="w-20 h-4" />
                          <Skeleton className="w-40 h-6" />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Skeleton className="w-full h-0.5 my-6" />
                  
                  <div className="mb-6">
                    <Skeleton className="w-40 h-6 mb-3" />
                    <div className="space-y-2">
                      <Skeleton className="w-full h-4" />
                      <Skeleton className="w-full h-4" />
                      <Skeleton className="w-3/4 h-4" />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <Skeleton className="w-40 h-6 mb-3" />
                    <div className="space-y-2">
                      <Skeleton className="w-full h-4" />
                      <Skeleton className="w-full h-4" />
                      <Skeleton className="w-full h-4" />
                      <Skeleton className="w-3/4 h-4" />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <Skeleton className="w-56 h-6 mb-3" />
                    <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
                      <div className="space-y-2">
                        <Skeleton className="w-full h-4" />
                        <Skeleton className="w-full h-4" />
                        <Skeleton className="w-full h-4" />
                        <Skeleton className="w-full h-4" />
                        <Skeleton className="w-4/5 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Sidebar skeleton */}
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-card rounded-lg shadow p-6">
                  <div className="flex justify-center mb-8">
                    <Skeleton className="w-24 h-24 rounded-full" />
                  </div>
                  
                  <div className="mb-6 text-center">
                    <Skeleton className="w-24 h-6 mx-auto mb-2" />
                    <Skeleton className="w-32 h-8 mx-auto" />
                  </div>
                  
                  <Skeleton className="w-full h-0.5 my-6" />
                  
                  <div className="space-y-4">
                    <Skeleton className="w-full h-10" />
                    <div className="mt-4 p-3 rounded-md border">
                      <Skeleton className="w-3/4 h-4 mx-auto mb-2" />
                      <div className="space-y-2">
                        <Skeleton className="w-full h-4" />
                        <Skeleton className="w-full h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectDetailSkeleton;
