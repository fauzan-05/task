import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

    const variants = {
      primary:
        'bg-slate-900 text-white hover:bg-slate-800 focus-visible:ring-slate-900 shadow-sm hover:shadow active:bg-slate-950',
      secondary:
        'bg-brand-500 text-white hover:bg-brand-600 focus-visible:ring-brand-500 shadow-sm hover:shadow active:bg-brand-700',
      outline:
        'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400 focus-visible:ring-slate-400',
      ghost:
        'text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus-visible:ring-slate-400',
      danger:
        'bg-rose-600 text-white hover:bg-rose-700 focus-visible:ring-rose-600 shadow-sm active:bg-rose-800',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs font-medium gap-1.5',
      md: 'px-4 py-2.5 text-sm font-medium gap-2',
      lg: 'px-6 py-3.5 text-base font-semibold gap-2.5',
    };

    return (
      <button
        ref={ref}
        type={type}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin text-current" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
