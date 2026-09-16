"use client";

import { Check, Pencil, Plus, Trash2, X } from "lucide-react";
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

let nextEntryId = INITIAL_ENTRIES.length + 1;

export function KnowledgeEntryList({
  searchQuery = "",
}: {
  searchQuery?: string;
}) {
  const [entries, setEntries] = useState<KnowledgeEntry[]>(INITIAL_ENTRIES);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [newEntryText, setNewEntryText] = useState("");
  const editTextareaRef = useRef<HTMLTextAreaElement>(null);
  const addTextareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editingId) editTextareaRef.current?.focus();
  }, [editingId]);

  useEffect(() => {
    if (isAdding) addTextareaRef.current?.focus();
  }, [isAdding]);

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

  const cancelAdd = () => {
    setIsAdding(false);
    setNewEntryText("");
  };

  const addEntry = () => {
    const trimmed = newEntryText.trim();
    if (!trimmed) {
      cancelAdd();
      return;
    }
    setEntries((prev) => [
      ...prev,
      { id: String(nextEntryId++), text: trimmed },
    ]);
    cancelAdd();
  };

  return (
    <div className="flex h-full min-w-0 flex-col gap-4">
      <div className="shrink-0 rounded-3xl bg-[#03A84E] px-6 py-6 shadow-[-3px_3px_0px_0px_#000000]">
        <h2 className="font-greed text-2xl font-bold text-white sm:text-3xl">
          Knowledge Base
        </h2>
      </div>

      <div className="scrollbar-none flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pr-1">
        {visibleEntries.length === 0 && (
          <p className="px-2 py-6 text-center text-sm text-black/40">
            {query ? "No matching entries." : "No knowledge base entries yet."}
          </p>
        )}

        {visibleEntries.map((entry) => (
          <div
            key={entry.id}
            className="flex items-center gap-3 rounded-2xl border-2 border-black bg-white px-4 py-3 shadow-[-3px_3px_0px_0px_#000000]"
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
                <p className="min-w-0 flex-1 truncate text-sm text-black">
                  {entry.text}
                </p>
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    aria-label="Edit entry"
                    onClick={() => startEdit(entry)}
                    className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-green-500 text-white transition-colors hover:bg-green-600"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    aria-label="Delete entry"
                    onClick={() => deleteEntry(entry.id)}
                    className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#F25430] text-white transition-colors hover:bg-[#d94526]"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}

        {isAdding ? (
          <div className="flex items-center gap-3 rounded-2xl border-2 border-dashed border-black/30 bg-white px-4 py-3">
            <textarea
              ref={addTextareaRef}
              value={newEntryText}
              onChange={(e) => setNewEntryText(e.target.value)}
              rows={2}
              placeholder="Type a new knowledge base entry…"
              className="min-w-0 flex-1 resize-none rounded-lg bg-[#EDEDED] px-3 py-2 text-sm text-black outline-none placeholder:text-black/40"
            />
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                aria-label="Save new entry"
                onClick={addEntry}
                className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-green-500 text-white transition-colors hover:bg-green-600"
              >
                <Check className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Cancel new entry"
                onClick={cancelAdd}
                className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-gray-300 text-gray-700 transition-colors hover:bg-gray-400"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="flex w-full shrink-0 cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-black/20 px-4 py-3 text-sm font-semibold tracking-wide text-black/50 transition-colors hover:border-black/40 hover:text-black/70"
          >
            <Plus className="h-4 w-4" />
            Add entry
          </button>
        )}
      </div>
    </div>
  );
}
