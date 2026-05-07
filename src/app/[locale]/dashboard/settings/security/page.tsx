"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { HelpBanner } from "@/components/dashboard/settings/help-banner";
import { useActiveCompanyId } from "@/hooks/use-active-company";
import { useCompanyMutations, useCompanyQuery } from "@/hooks/use-company";

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

  const companyId = useActiveCompanyId();

  const { data: companyData } = useCompanyQuery(companyId);
  const { updateCompany } = useCompanyMutations();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SecurityValues>({
    resolver: zodResolver(securitySchema),
    defaultValues: {
      backup_email: companyData?.backup_email || "",
      access_code: companyData?.access_code || "",
    },
  });

  useEffect(() => {
    if (companyData) {
      reset({
        backup_email: companyData.backup_email || "",
        access_code: companyData.access_code || "",
      });
    }
  }, [companyData, reset]);

  const onSubmit = async (data: SecurityValues, field: "email" | "code") => {
    if (!companyId) return;
    setSavingField(field);
    try {
      await updateCompany.mutateAsync({
        companyId,
        section: "security",
        payload: {
          backup_email: data.backup_email || null,
          access_code: data.access_code || null,
        },
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
    <div className="flex min-h-[450px] flex-col gap-6 rounded-xl bg-white p-4 shadow-sm">
      <HelpBanner bgColor="bg-[#7F9FFF]" />

      {/* Set a Back-up email */}
      <div className="space-y-4">
        <h3 className="font-stolzl text-lg font-bold text-gray-900">
          Set a Back-up email
        </h3>

        <div className="flex items-center justify-between rounded-xl border border-gray-100 px-6 py-4">
          <span className="font-dm-mono text-sm font-semibold tracking-[0.15em] text-gray-500 uppercase">
            Back-up Email
          </span>
          {isEditingEmail ? (
            <div className="flex items-center gap-2">
              <div>
                <input
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm outline-none focus:border-[#006BE5]"
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
                className="flex items-center gap-2 rounded-lg bg-[#006BE5] px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-[#0058C0] disabled:opacity-50"
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
              className="flex items-center gap-2 rounded-2xl border border-gray-100 px-4 py-2.5 hover:bg-gray-50"
            >
              <span className="font-dm-mono text-sm font-medium tracking-wide text-gray-700 uppercase">
                {companyData?.backup_email
                  ? maskEmail(companyData.backup_email)
                  : "Add New Email"}
              </span>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between rounded-xl border border-gray-100 px-6 py-4">
          <span className="font-dm-mono text-sm font-semibold tracking-[0.15em] text-gray-500 uppercase">
            Access Code
          </span>
          {isEditingCode ? (
            <div className="flex items-center gap-2">
              <input
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm outline-none focus:border-[#006BE5]"
                placeholder="************"
                {...register("access_code")}
              />
              <button
                onClick={() => handleSubmit((data) => onSubmit(data, "code"))()}
                disabled={savingField === "code"}
                className="flex items-center gap-2 rounded-lg bg-[#006BE5] px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-[#0058C0] disabled:opacity-50"
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
              className="rounded-2xl border border-gray-100 px-4 py-2.5 hover:bg-gray-50"
            >
              <span className="font-dm-mono text-sm font-medium tracking-wider text-gray-700">
                {companyData?.access_code ? "••••••••••••" : "Add Access Code"}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Add a new member */}
      <div className="space-y-4">
        <h3 className="font-stolzl text-lg font-bold text-gray-900">
          Add a new member
        </h3>

        <div className="flex items-center justify-between rounded-xl border border-gray-100 px-6 py-4">
          <span className="font-dm-mono text-sm font-semibold tracking-[0.15em] text-gray-500 uppercase">
            Add Member
          </span>
          <button className="rounded-2xl bg-[#006BE5] px-6 py-2.5 text-sm font-bold tracking-wide text-white uppercase shadow-[-3px_3px_0px_0px_#000000] transition-colors hover:bg-[#0058C0]">
            Add Email
          </button>
        </div>
      </div>
    </div>
  );
}
