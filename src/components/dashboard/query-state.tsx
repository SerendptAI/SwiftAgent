import type { UseQueryResult } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import { getApiErrorMessage } from "@/lib/api-error";

/**
 * Renders a query's loading and error states so a screen only has to describe
 * its data state. The error surface shows the API's own `detail` when it has
 * one, since a plan refusal or a permission error explains itself there.
 */
export function QueryState<T>({
  query,
  fallback,
  children,
}: {
  query: UseQueryResult<T>;
  /** Shown when the API gives no reason for the failure. */
  fallback: string;
  children: (data: T) => React.ReactNode;
}) {
  if (query.isPending) {
    return (
      <div className="flex flex-1 items-center justify-center py-8">
        <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
      </div>
    );
  }

  if (query.isError || query.data === undefined) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 py-8">
        <p className="max-w-md text-center text-sm text-gray-500">
          {getApiErrorMessage(query.error, fallback)}
        </p>
        <button
          type="button"
          onClick={() => query.refetch()}
          className="rounded-lg border border-gray-200 px-4 py-2 text-xs tracking-wider text-gray-700 transition-colors hover:bg-gray-50"
        >
          Retry
        </button>
      </div>
    );
  }

  return <>{children(query.data)}</>;
}
