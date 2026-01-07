import React from 'react';
import { Card } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { cn } from '../../lib/utils';

interface ComparisonRow {
  name: string;
  link?: string;
  values?: Record<string, string | { value: string; badge?: 'high' | 'medium' | 'low' }>;
  attributes?: Record<string, string | { value: string; badge?: 'high' | 'medium' | 'low' }>;
}

interface ComparisonTableProps {
  title: string;
  columns?: string[];
  rows?: ComparisonRow[];
  items?: ComparisonRow[];
  highlightColumn?: string;
}

const badgeStyles = {
  high: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  medium: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  low: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
};

export function ComparisonTable({ title, columns, rows, items, highlightColumn }: ComparisonTableProps) {
  // Use rows or items (backwards compatibility)
  const tableRows = rows || items || [];

  // Use provided columns or derive from first row
  const tableColumns = columns || (() => {
    const firstRow = tableRows[0];
    if (!firstRow) return [];
    return Object.keys(firstRow.values || firstRow.attributes || {});
  })();

  if (tableRows.length === 0) {
    return (
      <Card className="my-6 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 bg-muted border-b border-border font-semibold">
          <span>📊</span>
          <span>{title}</span>
        </div>
        <div className="p-4">
          <p className="text-muted-foreground">No data available</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="my-6 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 bg-muted border-b border-border font-semibold">
        <span>📊</span>
        <span>{title}</span>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              {tableColumns.map(col => (
                <TableHead
                  key={col}
                  className={cn(col === highlightColumn && 'bg-sky-500/10')}
                >
                  {col}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableRows.map((row, i) => {
              // Support both values and attributes
              const rowData = row.values || row.attributes || {};

              return (
                <TableRow key={i}>
                  <TableCell>
                    {row.link ? (
                      <a href={row.link} className="text-accent-foreground hover:underline">
                        {row.name}
                      </a>
                    ) : (
                      <strong>{row.name}</strong>
                    )}
                  </TableCell>
                  {tableColumns.map(col => {
                    const cellValue = rowData[col];
                    if (!cellValue) return <TableCell key={col}>—</TableCell>;

                    if (typeof cellValue === 'string') {
                      return <TableCell key={col}>{cellValue}</TableCell>;
                    }

                    return (
                      <TableCell key={col}>
                        {cellValue.value}
                        {cellValue.badge && (
                          <span className={cn(
                            'inline-block ml-2 px-2 py-0.5 text-xs font-medium rounded',
                            badgeStyles[cellValue.badge]
                          )}>
                            {cellValue.badge}
                          </span>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}

export default ComparisonTable;
