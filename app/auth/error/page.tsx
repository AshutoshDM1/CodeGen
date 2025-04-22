import React, { Suspense } from 'react';
import ErrorComponent from '@/components/Signup-components/Error';

export default function ErrorPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <Suspense
        fallback={
          <div className="flex space-x-2">
            <div className="h-4 w-4 animate-pulse rounded-full bg-blue-600"></div>
            <div className="h-4 w-4 animate-pulse rounded-full bg-blue-600 delay-150"></div>
            <div className="h-4 w-4 animate-pulse rounded-full bg-blue-600 delay-300"></div>
          </div>
        }
      >
        <ErrorComponent />
      </Suspense>
    </div>
  );
}
