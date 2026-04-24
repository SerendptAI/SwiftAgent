import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

const CHAT_IMAGES = [
  "/images/chats/newimg.svg",
  "/images/chats/newimg1.svg",
  "/images/chats/newimg2.svg",
  "/images/chats/newimg3.svg",
  "/images/chats/newimg4.svg",
];

export function getProfileImage(userId?: string): string {
  if (!userId) return CHAT_IMAGES[0];
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = (hash * 31 + userId.charCodeAt(i)) | 0;
  }
  const index = Math.abs(hash) % CHAT_IMAGES.length;
  return CHAT_IMAGES[index];
}
