'use client';

import React, { Suspense } from 'react';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { Skeleton } from '@/components/common/Skeleton';

export default function RegisterPage() {
  return (
    <div className="py-8 sm:py-12">
      <Suspense fallback={<div className="max-w-md mx-auto p-8"><Skeleton className="h-96 w-full rounded-3xl" /></div>}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
