"use client";

import { useState } from "react";

import { FormsDeleteManager } from "@/components/dashboard/ticketing/forms-delete-manager";
import { FormsEditManager } from "@/components/dashboard/ticketing/forms-edit-manager";
import type { Form, FormOverview } from "@/services/forms";

const now = "2026-02-04T14:33:00Z";

function form(id: string, link: string): Form {
  return {
    id,
    company_id: "c1",
    type: "website",
    tags: [],
    created_at: now,
    updated_at: now,
    website_link: link,
  };
}

const FORMS: Form[] = [
  form("f1", "https://serendptai.com"),
  form("f2", "https://ngballerz.com"),
];

const OVERVIEWS: Record<string, FormOverview> = {
  f1: {
    form_id: "f1",
    website_link: "https://serendptai.com",
    total_entries: 4,
    pages: [
      {
        page_path: "/contact-us",
        total_entries: 3,
        forms: [
          {
            form_identifier: "form-1",
            form_name: "Contact Form",
            entries_count: 3,
            last_submission: now,
          },
          {
            form_identifier: "form-2",
            form_name: "Newsletter Signup",
            entries_count: 0,
            last_submission: null,
          },
        ],
      },
      {
        page_path: "/volunteer",
        total_entries: 1,
        forms: [
          {
            form_identifier: "form-1",
            form_name: "Volunteer Form",
            entries_count: 1,
            last_submission: now,
          },
        ],
      },
    ],
  },
  f2: {
    form_id: "f2",
    website_link: "https://ngballerz.com",
    total_entries: 1,
    pages: [
      {
        page_path: "/signup",
        total_entries: 1,
        forms: [
          {
            form_identifier: "form-1",
            form_name: "Signup Form",
            entries_count: 1,
            last_submission: now,
          },
        ],
      },
    ],
  },
};

export default function FormsDeletePreviewPage() {
  const [which, setWhich] = useState<"delete" | "edit" | null>("delete");
  return (
    <div className="min-h-screen bg-[#F6F6F6] p-10">
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setWhich("delete")}
          className="rounded-lg bg-[#F25430] px-4 py-2 text-white"
        >
          Open delete manager
        </button>
        <button
          type="button"
          onClick={() => setWhich("edit")}
          className="rounded-lg bg-[#006BE5] px-4 py-2 text-white"
        >
          Open edit manager
        </button>
      </div>
      <FormsDeleteManager
        open={which === "delete"}
        forms={FORMS}
        overviews={OVERVIEWS}
        isDeleting={false}
        onClose={() => setWhich(null)}
        onDeleteWebsite={async () => {}}
        onDeletePage={async () => {}}
        onDeleteFormGroup={async () => {}}
        onDeleteSubmissions={async () => {}}
      />
      <FormsEditManager
        open={which === "edit"}
        forms={FORMS}
        overviews={OVERVIEWS}
        isRenaming={false}
        onRenameForm={async () => {}}
        onRenameWebsite={async () => {}}
        onClose={() => setWhich(null)}
      />
    </div>
  );
}
