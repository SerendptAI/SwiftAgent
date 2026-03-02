import { useMutation } from "@tanstack/react-query";

import type {
  CreateCompanyPayload,
  UpdateBoundariesPayload,
  UpdateCompanyTypePayload,
  UpdateIdentityPayload,
  UpdateVoicePayload,
} from "@/services/company";
import {
  createCompany,
  updateBoundaries,
  updateCompanyType,
  updateIdentity,
  updateVoice,
  uploadLogo,
} from "@/services/company";

export function useCreateCompany() {
  return useMutation({
    mutationFn: (payload: CreateCompanyPayload) => createCompany(payload),
  });
}

export function useUpdateIdentity() {
  return useMutation({
    mutationFn: ({
      companyId,
      payload,
    }: {
      companyId: string;
      payload: UpdateIdentityPayload;
    }) => updateIdentity(companyId, payload),
  });
}

export function useUpdateCompanyType() {
  return useMutation({
    mutationFn: ({
      companyId,
      payload,
    }: {
      companyId: string;
      payload: UpdateCompanyTypePayload;
    }) => updateCompanyType(companyId, payload),
  });
}

export function useUpdateBoundaries() {
  return useMutation({
    mutationFn: ({
      companyId,
      payload,
    }: {
      companyId: string;
      payload: UpdateBoundariesPayload;
    }) => updateBoundaries(companyId, payload),
  });
}

export function useUpdateVoice() {
  return useMutation({
    mutationFn: ({
      companyId,
      payload,
    }: {
      companyId: string;
      payload: UpdateVoicePayload;
    }) => updateVoice(companyId, payload),
  });
}

export function useUploadLogo() {
  return useMutation({
    mutationFn: ({ companyId, file }: { companyId: string; file: File }) =>
      uploadLogo(companyId, file),
  });
}
