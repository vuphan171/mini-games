// ---------- Tiện ích dùng chung ----------

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const rand = (min: number, max: number) => min + Math.random() * (max - min);

export const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

/** Định dạng số điện thoại Việt Nam dạng "0901 234 567". Trả nguyên input nếu không nhận dạng được. */
export const formatVietnamesePhone = (phone: string): string => {
  const digits = phone.replace(/\D/g, "");
  const normalized = digits.startsWith("84") ? `0${digits.slice(2)}` : digits;

  if (normalized.length !== 10) return phone;

  return `${normalized.slice(0, 4)} ${normalized.slice(4, 7)} ${normalized.slice(7)}`;
};
