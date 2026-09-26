import React from 'react';
import { cn } from '@/lib/utils';

export const Skeleton: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={cn('animate-pulse rounded-xl bg-slate-200/80', className)}
      {...props}
    />
  );
};

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm p-4 space-y-4">
      <Skeleton className="w-full aspect-square rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-4 w-full" />
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-9 w-1/3 rounded-xl" />
      </div>
    </div>
  );
};

export const CartItemSkeleton: React.FC = () => {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-slate-100">
      <Skeleton className="w-20 h-20 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-1/6" />
      </div>
      <Skeleton className="h-8 w-24 rounded-lg" />
      <Skeleton className="h-6 w-16" />
      <Skeleton className="h-8 w-8 rounded-lg" />
    </div>
  );
};
