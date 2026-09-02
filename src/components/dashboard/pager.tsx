import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Offset pager for `limit`/`skip` endpoints. The API does not report totals,
 * so a full page is read as "there may be more".
 */
export function Pager({
  skip,
  limit,
  pageSize,
  onChange,
}: {
  skip: number;
  limit: number;
  /** Rows on the current page, used to decide whether a next page exists. */
  pageSize: number;
  onChange: (skip: number) => void;
}) {
  const hasPrevious = skip > 0;
  const hasNext = pageSize === limit;
  if (!hasPrevious && !hasNext) return null;

  const first = pageSize === 0 ? 0 : skip + 1;
  const last = skip + pageSize;

  return (
    <div className="flex items-center justify-between gap-3">
      <p className="font-dm-mono text-xs text-gray-500">
        Showing {first}–{last}
      </p>
      <div className="flex items-center gap-1">
        <PagerButton
          label="Previous page"
          disabled={!hasPrevious}
          onClick={() => onChange(Math.max(0, skip - limit))}
        >
          <ChevronLeft className="h-4 w-4" />
        </PagerButton>
        <PagerButton
          label="Next page"
          disabled={!hasNext}
          onClick={() => onChange(skip + limit)}
        >
          <ChevronRight className="h-4 w-4" />
        </PagerButton>
      </div>
    </div>
  );
}

function PagerButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}
