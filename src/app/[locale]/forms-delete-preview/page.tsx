"use client";

import { useState } from "react";

import { FormsDeleteManager } from "@/components/dashboard/ticketing/forms-delete-manager";
import { FormsEditManager } from "@/components/dashboard/ticketing/forms-edit-manager";
import type { Form, Submission } from "@/services/forms";

const now = "2026-02-04T14:33:00Z";

function form(id: string, link: string, title: string): Form {
  return {
    id,
    company_id: "c1",
    type: "website",
    tags: [],
    created_at: now,
    updated_at: now,
    website_link: link,
    form_title: title,
  };
}

const FORMS: Form[] = [
  form("f1", "https://serendptai.com/contact-us", "Contact Form"),
  form("f2", "https://serendptai.com/contact-us", "Newsletter Signup"),
  form("f3", "https://serendptai.com/submission", "Submission Form"),
  form("f4", "https://serendptai.com/volunteer", "Volunteer Form"),
  form("f5", "https://ngballerz.com/signup", "Signup Form"),
];

function sub(id: string, formId: string, name: string): Submission {
  return {
    id,
    form_id: formId,
    company_id: "c1",
    data: { name },
    is_read: false,
    visitor_id: "v-" + id,
    submitted_at: now,
  };
}

const SUBMISSIONS: Submission[] = [
  sub("s1", "f1", "John Doe"),
  sub("s2", "f1", "Jane Austin"),
  sub("s3", "f1", "Jane Jackson"),
  sub("s4", "f3", "Mark Twain"),
];

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
        submissions={SUBMISSIONS}
        isDeleting={false}
        onClose={() => setWhich(null)}
        onDeleteForms={async () => {}}
        onDeleteSubmissions={async () => {}}
        onDeleteWebsite={async () => {}}
        onDeletePage={async () => {}}
      />
      <FormsEditManager
        open={which === "edit"}
        forms={FORMS}
        submissions={SUBMISSIONS}
        isRenaming={false}
        onRenameForm={async () => {}}
        onRenameWebsite={async () => {}}
        onRenamePage={async () => {}}
        onClose={() => setWhich(null)}
      />
    </div>
  );
}
