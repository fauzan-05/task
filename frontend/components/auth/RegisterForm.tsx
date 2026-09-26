'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserPlus, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';

const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name cannot exceed 50 characters'),
    email: z
      .string()
      .trim()
      .min(1, 'Email is required')
      .email('Please enter a valid email address'),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters long'),
    confirmPassword: z
      .string()
      .min(6, 'Confirm password must be at least 6 characters long'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterForm: React.FC = () => {
  const router = useRouter();
  const { register: registerUser, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    const success = await registerUser(data);
    if (success) {
      router.push('/products');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-900/5 p-8 sm:p-10 space-y-6">
        <div className="space-y-2 text-center">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto shadow-md">
            <UserPlus className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create an Account</h1>
          <p className="text-sm text-slate-500">
            Sign up to start shopping eco-friendly kitchenware and essentials
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <Input
            id="name"
            type="text"
            label="Full Name"
            placeholder="John Doe"
            error={errors.name?.message}
            required
            autoComplete="name"
            {...register('name')}
          />

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
            placeholder="Min. 6 characters"
            error={errors.password?.message}
            required
            autoComplete="new-password"
            {...register('password')}
          />

          <Input
            id="confirmPassword"
            type="password"
            label="Confirm Password"
            placeholder="Repeat password"
            error={errors.confirmPassword?.message}
            required
            autoComplete="new-password"
            {...register('confirmPassword')}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full justify-center shadow-lg shadow-slate-900/10"
          >
            Create Account
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-semibold text-slate-900 hover:underline inline-flex items-center"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
