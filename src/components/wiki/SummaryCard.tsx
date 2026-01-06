import React from 'react';
import { Card } from '../ui/card';
import { cn } from '../../lib/utils';

type CardVariant = 'default' | 'highlight' | 'warning' | 'success';

interface SummaryCardProps {
  title: string;
  value: string;
  subtitle?: string;
  confidence?: 'high' | 'medium' | 'low';
  link?: string;
  variant?: CardVariant;
  icon?: string;
}

const variantClasses: Record<CardVariant, string> = {
  default: 'border-border bg-gradient-to-br from-muted to-background',
  highlight: 'border-blue-500 bg-blue-500/10',
  warning: 'border-amber-500 bg-amber-500/10',
  success: 'border-green-500 bg-green-500/10',
};

const variantAccentClasses: Record<CardVariant, string> = {
  default: 'bg-accent-foreground',
  highlight: 'bg-blue-500',
  warning: 'bg-amber-500',
  success: 'bg-green-500',
};

const confidenceLabels = {
  high: { text: 'High confidence', className: 'text-green-500' },
  medium: { text: 'Medium confidence', className: 'text-amber-500' },
  low: { text: 'Low confidence', className: 'text-red-500' },
};

export function SummaryCard({
  title,
  value,
  subtitle,
  confidence,
  link,
  variant = 'default',
  icon,
}: SummaryCardProps) {
  const cardContent = (
    <Card
      className={cn(
        'relative p-5 py-5 gap-1 overflow-hidden transition-all duration-200',
        'shadow-sm hover:-translate-y-0.5 hover:shadow-lg',
        variantClasses[variant]
      )}
    >
      {/* Top accent bar */}
      <div className={cn(
        'absolute top-0 left-0 right-0 h-1 opacity-60 transition-opacity',
        'group-hover:opacity-100',
        variantAccentClasses[variant]
      )} />

      <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wide">
        {icon && <span>{icon}</span>}
        <span>{title}</span>
      </div>
      <div className="text-2xl font-bold text-foreground">
        {value}
      </div>
      {subtitle && (
        <div className="text-sm text-muted-foreground">{subtitle}</div>
      )}
      {confidence && (
        <div className={cn('text-xs font-medium mt-1', confidenceLabels[confidence].className)}>
          {confidenceLabels[confidence].text}
        </div>
      )}
    </Card>
  );

  if (link) {
    return (
      <a href={link} className="no-underline block group">
        {cardContent}
      </a>
    );
  }

  return cardContent;
}

interface CardGridProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
}

export function CardGrid({ children, columns = 3 }: CardGridProps) {
  const columnClasses = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={cn('grid gap-4 my-4', columnClasses[columns])}>
      {children}
    </div>
  );
}

export default SummaryCard;
