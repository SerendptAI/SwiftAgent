import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

export interface DataTableColumn<T> {
  key: string;
  header: string;
  className?: string;
  render: (row: T) => React.ReactNode;
}

/**
 * Bordered table for dashboard lists. Anything interactive belongs inside a
 * cell as a real button or link, so rows stay plain and keyboard-reachable.
 */
export function DataTable<T>({
  columns,
  rows,
  rowKey,
  isLoading = false,
  emptyMessage,
  className,
}: {
  columns: DataTableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  isLoading?: boolean;
  emptyMessage: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-x-auto rounded-xl border border-gray-100",
        className,
      )}
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
        </div>
      ) : rows.length === 0 ? (
        <p className="px-6 py-6 text-center text-sm text-gray-400">
          {emptyMessage}
        </p>
      ) : (
        <table className="w-full min-w-160 text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-[11px] tracking-wider text-gray-500">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn("px-4 py-3 font-normal", column.className)}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((row) => (
              <tr key={rowKey(row)}>
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cn(
                      "px-4 py-3 align-top text-gray-800",
                      column.className,
                    )}
                  >
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
