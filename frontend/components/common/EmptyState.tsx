import React from 'react';
import Link from 'next/link';
import { LucideIcon, PackageOpen } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = PackageOpen,
  title,
  description,
  actionText,
  actionHref,
  onAction,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 md:p-12 rounded-2xl bg-white border border-dashed border-slate-300 max-w-lg mx-auto my-8">
      <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mb-4 shadow-inner">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {action ? (
        action
      ) : actionText ? (
        <>
          {actionHref ? (
            <Link href={actionHref}>
              <Button variant="primary">{actionText}</Button>
            </Link>
          ) : (
            <Button variant="primary" onClick={onAction}>
              {actionText}
            </Button>
          )}
        </>
      ) : null}
    </div>
  );
};
