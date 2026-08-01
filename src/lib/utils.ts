// ---------- Tiện ích dùng chung ----------

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const rand = (min: number, max: number) => min + Math.random() * (max - min);

export const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

export const fmtTime = (s: number) => {
  const v = Math.max(0, Math.ceil(s));
  return String(Math.floor(v / 60)).padStart(2, "0") + ":" + String(v % 60).padStart(2, "0");
};
