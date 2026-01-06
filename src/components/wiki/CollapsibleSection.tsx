import React, { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { Badge } from '../ui/badge';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

interface CollapsibleSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  badge?: string;
}

export function CollapsibleSection({
  title,
  defaultOpen = false,
  children,
  badge,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="border border-border rounded-lg my-3 overflow-hidden">
      <CollapsibleTrigger className={cn(
        "flex items-center gap-3 w-full px-4 py-3 text-left font-medium bg-muted/50 hover:bg-muted transition-colors",
        isOpen && "border-b border-border"
      )}>
        <ChevronDown className={cn(
          "h-4 w-4 text-muted-foreground transition-transform duration-200",
          isOpen && "rotate-180"
        )} />
        <span className="flex-1">{title}</span>
        {badge && <Badge variant="secondary">{badge}</Badge>}
      </CollapsibleTrigger>
      <CollapsibleContent className="p-4">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}

export default CollapsibleSection;
