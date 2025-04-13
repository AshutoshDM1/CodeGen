'use client';
import CatLoading from '@/components/CatLoading';

export default function Loading() {
  return (
    <div className="min-h-screen w-full bg-black text-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <CatLoading />
      </div>
    </div>
  );
}
