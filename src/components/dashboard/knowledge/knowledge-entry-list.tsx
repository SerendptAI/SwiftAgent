"use client";

import { Check, Pencil, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface KnowledgeEntry {
  id: string;
  text: string;
}

const INITIAL_ENTRIES: KnowledgeEntry[] = [
  {
    id: "1",
    text: "Swift agents facilitate secure, automated interactions between users and businesses across multiple channels.",
  },
  {
    id: "2",
    text: "They serve as intermediaries between customer requests and internal business systems.",
  },
  {
    id: "3",
    text: "Swift agents ensure compliance with data privacy and security regulations.",
  },
  {
    id: "4",
    text: "Their role is crucial for scaling customer support without increasing headcount.",
  },
  {
    id: "5",
    text: "They provide secure messaging, ticketing, and knowledge retrieval in one place.",
  },
  {
    id: "6",
    text: "Swift agents help reduce the time customers wait for a response.",
  },
  {
    id: "7",
    text: "They are part of the broader SwiftAgent platform for AI-powered engagement.",
  },
];

export function KnowledgeEntryList({
  searchQuery = "",
}: {
  searchQuery?: string;
}) {
  const [entries, setEntries] = useState<KnowledgeEntry[]>(INITIAL_ENTRIES);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const editTextareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editingId) editTextareaRef.current?.focus();
  }, [editingId]);

  const query = searchQuery.trim().toLowerCase();
  const visibleEntries = query
    ? entries.filter((entry) => entry.text.toLowerCase().includes(query))
    : entries;

  const startEdit = (entry: KnowledgeEntry) => {
    setEditingId(entry.id);
    setDraft(entry.text);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft("");
  };

  const saveEdit = (id: string) => {
    const trimmed = draft.trim();
    if (trimmed) {
      setEntries((prev) =>
        prev.map((entry) =>
          entry.id === id ? { ...entry, text: trimmed } : entry,
        ),
      );
    }
    cancelEdit();
  };

  const deleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
    if (editingId === id) cancelEdit();
  };

  return (
    <div className="flex h-full min-w-0 flex-col lg:min-h-0">
      <div className="scrollbar-none min-h-0 flex-1 overflow-y-auto rounded-3xl bg-white p-4 shadow-sm">
        <div className="mb-3 rounded-2xl bg-[#03A84E] p-4">
          <h2 className="font-greed text-2xl font-bold tracking-[-2%] text-white sm:text-3xl lg:text-4xl">
            Knowledge Base
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {visibleEntries.length === 0 && (
            <p className="px-2 py-6 text-center text-sm text-black/40">
              {query
                ? "No matching entries."
                : "No knowledge base entries yet."}
            </p>
          )}

          {visibleEntries.map((entry) => (
            <div
              key={entry.id}
              className="group flex items-center gap-3 rounded-[10px] border-2 border-black bg-white px-4 py-3 shadow-[-3px_3px_0px_0px_#000000]"
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
                  <p className="min-w-0 flex-1 truncate py-1 text-sm text-black md:text-base">
                    {entry.text}
                  </p>
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
                      onClick={() => deleteEntry(entry.id)}
                      className="flex h-6.5 w-6.5 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#F25430] text-white transition-colors hover:bg-[#d94526]"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
