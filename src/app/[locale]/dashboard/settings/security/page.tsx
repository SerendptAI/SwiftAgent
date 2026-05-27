"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { HelpBanner } from "@/components/dashboard/settings/help-banner";
import { useActiveCompanyId } from "@/hooks/use-active-company";
import { useCurrentUser, useUpdateUserSecurity } from "@/hooks/use-auth";
import { useInviteMember } from "@/hooks/use-company";

const securitySchema = z.object({
  backup_email: z.string().email("Invalid email").optional().or(z.literal("")),
  access_code: z.string().optional(),
});

type SecurityValues = z.infer<typeof securitySchema>;

function maskEmail(email: string | undefined | null) {
  if (!email || !email.includes("@")) return email;
  const [local, domain] = email.split("@");
  if (local.length <= 2) return `${local[0]}***@${domain}`;
  return `${local.slice(0, 3)}***@${domain}`;
}

export default function SecurityPage() {
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingCode, setIsEditingCode] = useState(false);
  const [savingField, setSavingField] = useState<"email" | "code" | null>(null);
  const [isInviting, setIsInviting] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");

  const companyId = useActiveCompanyId();

  const { data: user } = useCurrentUser();
  const updateSecurity = useUpdateUserSecurity();
  const inviteMember = useInviteMember();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SecurityValues>({
    resolver: zodResolver(securitySchema),
    defaultValues: {
      backup_email: user?.backup_email || "",
      access_code: user?.access_code || "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        backup_email: user.backup_email || "",
        access_code: user.access_code || "",
      });
    }
  }, [user, reset]);

  const handleInvite = async () => {
    if (!companyId || !inviteEmail) return;
    try {
      await inviteMember.mutateAsync({ companyId, email: inviteEmail });
      setInviteEmail("");
      setIsInviting(false);
      alert("Invite sent successfully.");
    } catch {
      alert("Failed to send invite.");
    }
  };

  const onSubmit = async (data: SecurityValues, field: "email" | "code") => {
    setSavingField(field);
    try {
      await updateSecurity.mutateAsync({
        backup_email: data.backup_email || null,
        access_code: data.access_code || null,
      });
      if (field === "email") setIsEditingEmail(false);
      if (field === "code") setIsEditingCode(false);
      alert("Security settings updated successfully.");
    } catch (error) {
      console.error(error);
      alert("Failed to update security settings.");
    } finally {
      setSavingField(null);
    }
  };
  return (
    <div className="flex min-h-[360px] flex-col gap-5 rounded-[20px] bg-white p-3 shadow-sm sm:min-h-[450px] sm:gap-6 sm:rounded-xl sm:p-4">
      <HelpBanner bgColor="bg-[#7F9FFF]" />

      {/* Set a Back-up email */}
      <div className="space-y-4">
        <h3 className="font-stolzl text-base font-bold text-gray-900 sm:text-lg">
          Set a Back-up email
        </h3>

        <div className="flex flex-col gap-3 rounded-xl border border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span className="font-dm-mono text-xs font-semibold tracking-[0.15em] text-gray-500 uppercase sm:text-sm">
            Back-up Email
          </span>
          {isEditingEmail ? (
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
              <div className="relative min-w-0">
                <input
                  className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-[#006BE5] sm:h-auto sm:w-auto sm:py-1.5"
                  placeholder="backup@example.com"
                  {...register("backup_email")}
                />
                {errors.backup_email && (
                  <p className="absolute mt-1 text-xs text-red-500">
                    {errors.backup_email.message}
                  </p>
                )}
              </div>
              <button
                onClick={() =>
                  handleSubmit((data) => onSubmit(data, "email"))()
                }
                disabled={savingField === "email"}
                className="flex h-10 items-center justify-center gap-2 rounded-lg bg-[#006BE5] px-4 text-sm font-medium text-white transition-colors hover:bg-[#0058C0] disabled:opacity-50 sm:h-auto sm:py-1.5"
              >
                {savingField === "email" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Save"
                )}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditingEmail(true)}
              className="flex min-w-0 items-center justify-between gap-2 rounded-2xl border border-gray-100 px-4 py-2.5 hover:bg-gray-50 sm:justify-start"
            >
              <span className="font-dm-mono min-w-0 truncate text-sm font-medium tracking-wide text-gray-700 uppercase">
                {user?.backup_email
                  ? maskEmail(user.backup_email)
                  : "Add New Email"}
              </span>
              <ChevronDown className="h-4 w-4 shrink-0 text-gray-400" />
            </button>
          )}
        </div>

        <div className="flex flex-col gap-3 rounded-xl border border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span className="font-dm-mono text-xs font-semibold tracking-[0.15em] text-gray-500 uppercase sm:text-sm">
            Access Code
          </span>
          {isEditingCode ? (
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
              <input
                className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-[#006BE5] sm:h-auto sm:w-auto sm:py-1.5"
                placeholder="************"
                {...register("access_code")}
              />
              <button
                onClick={() => handleSubmit((data) => onSubmit(data, "code"))()}
                disabled={savingField === "code"}
                className="flex h-10 items-center justify-center gap-2 rounded-lg bg-[#006BE5] px-4 text-sm font-medium text-white transition-colors hover:bg-[#0058C0] disabled:opacity-50 sm:h-auto sm:py-1.5"
              >
                {savingField === "code" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Save"
                )}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditingCode(true)}
              className="rounded-2xl border border-gray-100 px-4 py-2.5 text-left hover:bg-gray-50 sm:text-center"
            >
              <span className="font-dm-mono text-sm font-medium tracking-wider text-gray-700">
                {user?.access_code ? "••••••••••••" : "Add Access Code"}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Add a new member */}
      <div className="space-y-4">
        <h3 className="font-stolzl text-base font-bold text-gray-900 sm:text-lg">
          Add a new member
        </h3>

        <div className="flex flex-col gap-3 rounded-xl border border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span className="font-dm-mono text-xs font-semibold tracking-[0.15em] text-gray-500 uppercase sm:text-sm">
            Add Member
          </span>
          {isInviting ? (
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-[#006BE5] sm:h-auto sm:w-auto sm:py-1.5"
                placeholder="member@example.com"
              />
              <button
                onClick={handleInvite}
                disabled={inviteMember.isPending || !inviteEmail}
                className="flex h-10 items-center justify-center gap-2 rounded-lg bg-[#006BE5] px-4 text-sm font-medium text-white transition-colors hover:bg-[#0058C0] disabled:opacity-50 sm:h-auto sm:py-1.5"
              >
                {inviteMember.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Send"
                )}
              </button>
              <button
                onClick={() => {
                  setIsInviting(false);
                  setInviteEmail("");
                }}
                className="h-10 rounded-lg border border-gray-200 px-3 text-sm text-gray-500 hover:bg-gray-50 sm:h-auto sm:py-1.5"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsInviting(true)}
              className="h-11 rounded-2xl bg-[#006BE5] px-6 text-sm font-bold tracking-wide text-white uppercase shadow-[-3px_3px_0px_0px_#000000] transition-colors hover:bg-[#0058C0] sm:h-auto sm:py-2.5"
            >
              Add Email
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
