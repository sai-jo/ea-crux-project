import React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '../../lib/utils';
import { Badge } from '../ui/badge';

interface Tab {
  id: string;
  label: string;
  icon?: string;
  badge?: string | number;
}

interface TabsProps {
  tabs: Tab[];
  children: React.ReactNode[];
  defaultTab?: string;
}

export function Tabs({ tabs, children, defaultTab }: TabsProps) {
  return (
    <TabsPrimitive.Root
      defaultValue={defaultTab || tabs[0]?.id}
      className="my-6"
    >
      <TabsPrimitive.List className="flex gap-1 border-b-2 border-border mb-4 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <TabsPrimitive.Trigger
            key={tab.id}
            value={tab.id}
            className={cn(
              "flex items-center gap-2 px-4 py-3",
              "bg-transparent border-none border-b-2 border-transparent -mb-0.5",
              "text-[0.9rem] font-medium text-muted-foreground whitespace-nowrap",
              "cursor-pointer transition-colors",
              "hover:text-foreground",
              "data-[state=active]:text-accent-foreground data-[state=active]:border-accent-foreground"
            )}
          >
            {tab.icon && <span className="text-base">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge && (
              <Badge
                variant="secondary"
                className={cn(
                  "px-2 py-0.5 text-xs font-semibold",
                  "data-[state=active]:bg-accent-foreground data-[state=active]:text-background"
                )}
              >
                {tab.badge}
              </Badge>
            )}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>

      {tabs.map((tab, index) => (
        <TabsPrimitive.Content
          key={tab.id}
          value={tab.id}
          className="min-h-[200px] animate-in fade-in-0 duration-200"
        >
          {children[index]}
        </TabsPrimitive.Content>
      ))}
    </TabsPrimitive.Root>
  );
}

interface TabPanelProps {
  children: React.ReactNode;
}

export function TabPanel({ children }: TabPanelProps) {
  return <div>{children}</div>;
}

export default Tabs;
