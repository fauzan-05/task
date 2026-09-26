'use client';

import React, { Suspense } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { Skeleton } from '@/components/common/Skeleton';

export default function LoginPage() {
  return (
    <div className="py-8 sm:py-12">
      <Suspense fallback={<div className="max-w-md mx-auto p-8"><Skeleton className="h-96 w-full rounded-3xl" /></div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
