"use client";

import { Check, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useActiveCompanyId } from "@/hooks/use-active-company";
import { useKnowledgeEntries } from "@/hooks/use-knowledge";
import type { KnowledgeEntrySummary } from "@/services/knowledge";

import { AddEntryModal } from "./add-entry-modal";
import { DeleteEntryModal } from "./delete-entry-modal";

export function KnowledgeEntryList({
  searchQuery = "",
}: {
  searchQuery?: string;
}) {
  const companyId = useActiveCompanyId();
  const {
    data,
    isLoading,
    isError,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useKnowledgeEntries(companyId);
  // The API has no update or delete endpoint yet, so edits and removals only
  // change what this view shows until the page is reloaded.
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [removedIds, setRemovedIds] = useState<Set<string>>(new Set());
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [pendingDelete, setPendingDelete] =
    useState<KnowledgeEntrySummary | null>(null);
  const editTextareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editingId) editTextareaRef.current?.focus();
  }, [editingId]);

  // The endpoint lists every company the user owns, so keep this one's entries.
  // An entry can appear on a later page too once one is added locally, so drop
  // repeats.
  const seenIds = new Set<string>();
  const entries = (data?.pages.flatMap((page) => page.items) ?? [])
    .filter((entry) => !entry.company_id || entry.company_id === companyId)
    .filter((entry) => {
      if (seenIds.has(entry.id) || removedIds.has(entry.id)) return false;
      seenIds.add(entry.id);
      return true;
    })
    .map((entry) => ({ ...entry, title: edits[entry.id] ?? entry.title }));

  const query = searchQuery.trim().toLowerCase();
  const visibleEntries = query
    ? entries.filter((entry) => entry.title.toLowerCase().includes(query))
    : entries;

  const startEdit = (entry: KnowledgeEntrySummary) => {
    setEditingId(entry.id);
    setDraft(entry.title);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft("");
  };

  const saveEdit = (id: string) => {
    const trimmed = draft.trim();
    if (trimmed) setEdits((prev) => ({ ...prev, [id]: trimmed }));
    cancelEdit();
  };

  const deleteEntry = (id: string) => {
    setRemovedIds((prev) => new Set(prev).add(id));
    if (editingId === id) cancelEdit();
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;
    deleteEntry(pendingDelete.id);
    setPendingDelete(null);
  };

  return (
    <div className="flex h-full min-w-0 flex-col lg:min-h-0">
      <div className="scrollbar-none min-h-0 flex-1 overflow-y-auto rounded-3xl bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between gap-3 rounded-2xl bg-[#03A84E] p-4">
          <h2 className="font-greed text-2xl font-bold tracking-[-2%] text-white sm:text-3xl lg:text-4xl">
            Knowledge Base
          </h2>
          <button
            type="button"
            aria-label="Add entry"
            onClick={() => setIsAdding(true)}
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white text-[#03A84E] transition-opacity hover:opacity-80"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {isLoading && (
            <div className="flex justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-black/40" />
            </div>
          )}

          {isError && (
            <div className="flex flex-col items-center gap-2 px-2 py-6 text-center">
              <p className="text-sm text-black/40">
                Couldn&apos;t load your knowledge base entries.
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="cursor-pointer text-sm font-medium text-[#006BE5] hover:underline"
              >
                Try again
              </button>
            </div>
          )}

          {!isLoading && !isError && visibleEntries.length === 0 && (
            <p className="px-2 py-6 text-center text-sm text-black/40">
              {query
                ? "No matching entries."
                : "No knowledge base entries yet."}
            </p>
          )}

          {visibleEntries.map((entry) => (
            <div
              key={entry.id}
              className="group flex cursor-pointer items-center gap-3 rounded-[10px] border-2 border-black bg-white px-4 py-3 shadow-[-3px_3px_0px_0px_#000000] transition-all duration-200 hover:shadow-[0px_0px_0px_0px_#000000]"
            >
              {editingId === entry.id ? (
                <>
                  <textarea
                    ref={editTextareaRef}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    rows={2}
                    className="min-w-0 flex-1 resize-none rounded-lg bg-[#EDEDED] px-3 py-2 text-sm text-black outline-none"
                  />
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      aria-label="Save entry"
                      onClick={() => saveEdit(entry.id)}
                      className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-green-500 text-white transition-colors hover:bg-green-600"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      aria-label="Cancel edit"
                      onClick={cancelEdit}
                      className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-gray-300 text-gray-700 transition-colors hover:bg-gray-400"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="min-w-0 flex-1 py-1">
                    <p className="truncate text-sm font-medium text-black md:text-base">
                      {entry.title}
                    </p>
                    {entry.category && (
                      <p className="truncate text-xs text-black/60 md:text-sm">
                        {entry.category}
                      </p>
                    )}
                  </div>
                  <div className="hidden shrink-0 items-center gap-1 transition-all group-hover:flex">
                    <button
                      type="button"
                      aria-label="Edit entry"
                      onClick={() => startEdit(entry)}
                      className="flex h-6.5 w-6.5 shrink-0 cursor-pointer items-center justify-center rounded-full bg-green-500 text-white transition-colors hover:bg-green-600"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      aria-label="Delete entry"
                      onClick={() => setPendingDelete(entry)}
                      className="flex h-6.5 w-6.5 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#F25430] text-white transition-colors hover:bg-[#d94526]"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}

          {hasNextPage && (
            <button
              type="button"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="mx-auto mt-1 flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#EDEDED] px-6 text-sm font-medium text-black transition-colors hover:bg-[#e2e2e2] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isFetchingNextPage && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              {isFetchingNextPage ? "Loading..." : "Load more"}
            </button>
          )}
        </div>
      </div>

      {isAdding && <AddEntryModal onClose={() => setIsAdding(false)} />}

      {pendingDelete && (
        <DeleteEntryModal
          entryText={pendingDelete.title}
          onConfirm={confirmDelete}
          onClose={() => setPendingDelete(null)}
        />
      )}
    </div>
  );
}
