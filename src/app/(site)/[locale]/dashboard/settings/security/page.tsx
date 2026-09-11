"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Check,
  ChevronDown,
  Loader2,
  RotateCcw,
  Trash2,
  X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { HelpBanner } from "@/components/dashboard/settings/help-banner";
import { useToast } from "@/components/ui/toast";
import { useActiveCompanyId } from "@/hooks/use-active-company";
import { useCurrentUser, useUpdateUserSecurity } from "@/hooks/use-auth";
import {
  useCompanyMembers,
  useInviteMember,
  useRemoveMember,
  useResendInvite,
} from "@/hooks/use-company";
import { cn } from "@/lib/utils";
import type { CompanyMember, CompanyMemberStatus } from "@/services/company";

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
  const toast = useToast();

  const { data: user } = useCurrentUser();
  const updateSecurity = useUpdateUserSecurity();
  const inviteMember = useInviteMember();
  const { data: members, isLoading: isLoadingMembers } =
    useCompanyMembers(companyId);

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
      toast.success("Invite sent successfully.");
    } catch {
      toast.error("Failed to send invite.");
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
      toast.success("Security settings updated successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update security settings.");
    } finally {
      setSavingField(null);
    }
  };
  return (
    <div className="flex min-h-[360px] flex-col gap-5 rounded-[20px] bg-white p-3 shadow-sm sm:min-h-[450px] sm:gap-6 sm:rounded-xl sm:p-4">
      <HelpBanner bgColor="bg-[#7F9FFF]" />

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
              className="h-11 rounded-2xl bg-[#006BE5] px-6 text-sm font-bold tracking-wide text-white uppercase shadow-[-4px_4px_0px_0px_#000000] transition-colors hover:bg-[#0058C0] sm:h-auto sm:py-2.5"
            >
              Add Email
            </button>
          )}
        </div>

        <div className="rounded-xl border border-gray-100">
          {isLoadingMembers ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
            </div>
          ) : !members || members.length === 0 ? (
            <p className="font-stolzl px-6 py-6 text-center text-sm text-gray-400">
              No members yet.
            </p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {members.map((member) => (
                <MemberRow key={member.email} member={member} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

const STATUS_STYLES: Record<CompanyMemberStatus, string> = {
  Active: "bg-green-50 text-green-700",
  Pending: "bg-amber-50 text-amber-700",
  Expired: "bg-gray-100 text-gray-500",
};

function MemberRow({ member }: { member: CompanyMember }) {
  const companyId = useActiveCompanyId();
  const toast = useToast();
  const resendInvite = useResendInvite();
  const removeMember = useRemoveMember();
  const [confirmingRemove, setConfirmingRemove] = useState(false);

  const displayName = member.name || member.email.split("@")[0];
  const statusClass =
    STATUS_STYLES[member.status] ?? "bg-gray-100 text-gray-500";
  const canResend = member.status === "Pending" || member.status === "Expired";

  const handleResend = () => {
    if (!companyId || resendInvite.isPending) return;
    resendInvite.mutate(
      { companyId, email: member.email },
      {
        onSuccess: () => toast.success("Invite resent successfully."),
        onError: () => toast.error("Failed to resend invite."),
      },
    );
  };

  const handleRemove = () => {
    if (!companyId || removeMember.isPending) return;
    removeMember.mutate(
      { companyId, email: member.email },
      {
        onSuccess: () => {
          toast.success("Member removed.");
          setConfirmingRemove(false);
        },
        onError: () => toast.error("Failed to remove member."),
      },
    );
  };

  return (
    <li className="flex items-center gap-4 px-6 py-3">
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-100">
        {member.picture ? (
          <Image
            src={member.picture}
            alt={displayName}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-gray-500">
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-stolzl truncate text-sm font-semibold text-gray-900">
          {displayName}
        </p>
        <p className="font-stolzl truncate text-xs text-gray-400">
          {member.email}
        </p>
      </div>
      <span className="font-dm-mono hidden shrink-0 text-xs tracking-wider text-gray-500 uppercase sm:inline">
        {member.role}
      </span>
      <span
        className={cn(
          "font-dm-mono shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase",
          statusClass,
        )}
      >
        {member.status}
      </span>

      {canResend && (
        <button
          type="button"
          onClick={handleResend}
          disabled={resendInvite.isPending}
          aria-label="Resend invite"
          title="Resend invite"
          className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {resendInvite.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RotateCcw className="h-4 w-4" />
          )}
        </button>
      )}

      {confirmingRemove ? (
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={handleRemove}
            disabled={removeMember.isPending}
            aria-label="Confirm remove"
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-red-50 text-red-600 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {removeMember.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Check className="h-4 w-4" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setConfirmingRemove(false)}
            aria-label="Cancel"
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setConfirmingRemove(true)}
          aria-label="Remove member"
          title="Remove member"
          className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </li>
  );
}
