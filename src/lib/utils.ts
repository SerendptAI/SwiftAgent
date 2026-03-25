import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

const PROFILE_COUNT = 12;

export function getProfileImage(userId?: string): string {
  if (!userId) return `/images/profiles/profile1.svg`;
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = (hash * 31 + userId.charCodeAt(i)) | 0;
  }
  const index = (Math.abs(hash) % PROFILE_COUNT) + 1;
  return `/images/profiles/profile${index}.svg`;
}
