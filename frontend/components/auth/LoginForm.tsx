'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/products';
  const { login, isLoading } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    const emailLower = data.email.trim().toLowerCase();
    const isAdmin = emailLower === 'admin@gmail.com' || emailLower === 'admin@example.com';

    const loggedInUser = await login(data);
    if (loggedInUser) {
      if (isAdmin || loggedInUser.role === 'admin' || loggedInUser.email?.toLowerCase() === 'admin@gmail.com') {
        window.location.replace('/admin');
      } else {
        window.location.replace(redirectUrl || '/products');
      }
    }
  };

  const fillSuperAdminCredentials = () => {
    setValue('email', 'admin@gmail.com', { shouldValidate: true });
    setValue('password', 'admin123', { shouldValidate: true });
  };

  const fillDemoCredentials = () => {
    setValue('email', 'demo@example.com', { shouldValidate: true });
    setValue('password', 'Password123!', { shouldValidate: true });
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-900/5 p-8 sm:p-10 space-y-6">
        <div className="space-y-2 text-center">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Welcome Back</h1>
          <p className="text-sm text-slate-500">
            Sign in to access your dashboard, orders, and checkout
          </p>
        </div>

        {/* Quick Demo Credentials Helper */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={fillSuperAdminCredentials}
            className="w-full py-2 px-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-emerald-100 transition-colors shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            Fill Super Admin (admin@gmail.com)
          </button>
          <button
            type="button"
            onClick={fillDemoCredentials}
            className="w-full py-2 px-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-700 text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-stone-100 transition-colors"
          >
            Fill Demo Customer (demo@example.com)
          </button>
        </div>

        {serverError && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-medium animate-fade-in">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <Input
            id="email"
            type="email"
            label="Email Address"
            placeholder="you@example.com"
            error={errors.email?.message}
            required
            autoComplete="email"
            {...register('email')}
          />

          <Input
            id="password"
            type="password"
            label="Password"
            placeholder="••••••••"
            error={errors.password?.message}
            required
            autoComplete="current-password"
            {...register('password')}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full justify-center shadow-lg shadow-slate-900/10"
          >
            Sign In
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="font-semibold text-slate-900 hover:underline inline-flex items-center"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
