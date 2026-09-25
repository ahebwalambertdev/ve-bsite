'use client';

import React, { useState } from 'react';
import { Download, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CsvExportButtonProps<T> {
  data: T[];
  filename: string;
  columns?: { key: keyof T; header: string }[];
  className?: string;
  label?: string;
}

export function CsvExportButton<T extends Record<string, unknown>>({
  data,
  filename,
  columns,
  className,
  label = 'Export CSV',
}: CsvExportButtonProps<T>) {
  const [downloaded, setDownloaded] = useState(false);

  const handleExport = () => {
    if (!data || data.length === 0) return;

    // 1. Determine headers and keys
    const cols =
      columns ||
      Object.keys(data[0] || {}).map((k) => ({
        key: k as keyof T,
        header: k,
      }));

    // 2. Build CSV header row
    const headerRow = cols.map((c) => `"${String(c.header).replace(/"/g, '""')}"`).join(',');

    // 3. Build CSV data rows
    const rows = data.map((item) =>
      cols
        .map((c) => {
          const val = item[c.key];
          if (val === null || val === undefined) return '""';
          if (Array.isArray(val)) {
            return `"${val.join('; ').replace(/"/g, '""')}"`;
          }
          if (typeof val === 'object') {
            return `"${JSON.stringify(val).replace(/"/g, '""')}"`;
          }
          return `"${String(val).replace(/"/g, '""')}"`;
        })
        .join(',')
    );

    const csvContent = [headerRow, ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${filename}-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={!data || data.length === 0}
      className={className}
    >
      {downloaded ? (
        <>
          <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
          <span>Exported</span>
        </>
      ) : (
        <>
          <Download className="w-3.5 h-3.5 mr-1.5" />
          <span>{label}</span>
        </>
      )}
    </Button>
  );
}
