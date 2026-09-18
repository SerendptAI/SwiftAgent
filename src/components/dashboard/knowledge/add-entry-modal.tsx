"use client";

import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useActiveCompanyId } from "@/hooks/use-active-company";
import { useIngestKnowledge } from "@/hooks/use-knowledge";
import { useScrollLock } from "@/hooks/use-scroll-lock";
import { getApiErrorMessage } from "@/lib/api-error";

interface AddEntryModalProps {
  onClose: () => void;
}

export function AddEntryModal({ onClose }: AddEntryModalProps) {
  const companyId = useActiveCompanyId();
  const ingestKnowledge = useIngestKnowledge();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  const isSaving = ingestKnowledge.isPending;
  const canSave = !!companyId && title.trim() !== "" && content.trim() !== "";

  useScrollLock(true);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSaving) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSaving, onClose]);

  const handleSave = async () => {
    if (!canSave || !companyId || isSaving) return;
    setError(null);
    try {
      await ingestKnowledge.mutateAsync({
        company_id: companyId,
        category: "general",
        title: title.trim(),
        content: content.trim(),
        // The backend indexes and plan-checks entries by metadata.company_id.
        metadata: { company_id: companyId, category: "general" },
      });
      onClose();
    } catch (err) {
      setError(
        getApiErrorMessage(err, "Couldn't save the entry. Please try again."),
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-10000 flex items-center justify-center px-6"
      role="presentation"
    >
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 cursor-pointer bg-black/40"
        onClick={isSaving ? undefined : onClose}
        disabled={isSaving}
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-entry-title"
        className="relative flex w-full max-w-[520px] flex-col rounded-[21px] bg-white p-3 shadow-[0px_24px_48px_0px_rgba(0,0,0,0.2)]"
      >
        <div className="flex h-[51px] shrink-0 items-center justify-between rounded-[17px] bg-[#F3F3F3] px-[21px]">
          <h2
            id="add-entry-title"
            className="font-greed text-[30px] leading-none font-medium text-black"
          >
            Add entry
          </h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            disabled={isSaving}
            className="flex h-5 w-5 cursor-pointer items-center justify-center text-black transition-opacity hover:opacity-60 disabled:opacity-40"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col gap-4 px-3 pt-6 pb-4">
          <label className="flex flex-col gap-2">
            <span className="font-stolzl text-sm text-black">Title</span>
            <input
              ref={titleRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Refund policy"
              maxLength={120}
              className="font-stolzl rounded-lg bg-[#EDEDED] px-4 py-3 text-sm text-black outline-none placeholder:text-black/40"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="font-stolzl text-sm text-black">Content</span>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What should your agent know?"
              rows={5}
              className="font-stolzl resize-none rounded-lg bg-[#EDEDED] px-4 py-3 text-sm text-black outline-none placeholder:text-black/40"
            />
          </label>

          {error && (
            <p role="alert" className="text-sm text-[#F25430]">
              {error}
            </p>
          )}

          <div className="mt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="flex h-[38px] w-24 cursor-pointer items-center justify-center rounded-[8px] border border-[#EDEDED] text-[14px] text-[#7E7E7E] transition-colors hover:bg-gray-50 disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!canSave || isSaving}
              className="flex h-[38px] w-full max-w-[180px] cursor-pointer items-center justify-center rounded-[8px] bg-[#2196F3] text-[14px] font-medium text-white shadow-[-4px_4px_0px_0px_#000000] transition-colors hover:bg-[#1E88E5] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "Saving..." : "Save entry"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
