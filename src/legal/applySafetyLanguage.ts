import { safeReplacements } from "@/legal/safetyRules";

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const preserveCase = (original: string, replacement: string) => {
  if (original === original.toUpperCase()) return replacement.toUpperCase();
  if (original[0] === original[0]?.toUpperCase()) {
    return replacement.charAt(0).toUpperCase() + replacement.slice(1);
  }
  return replacement;
};

export const applySafetyLanguage = (value: string): string => {
  let next = value;

  Object.entries(safeReplacements).forEach(([unsafePhrase, safePhrase]) => {
    const pattern = new RegExp(`\\b${escapeRegExp(unsafePhrase)}\\b`, "gi");
    next = next.replace(pattern, (match) => preserveCase(match, safePhrase));
  });

  return next;
};

export const sanitizeSafetyLanguage = <T>(input: T): T => {
  if (typeof input === "string") return applySafetyLanguage(input) as T;
  if (Array.isArray(input)) return input.map((item) => sanitizeSafetyLanguage(item)) as T;
  if (input && typeof input === "object") {
    const entries = Object.entries(input as Record<string, unknown>).map(([key, value]) => [key, sanitizeSafetyLanguage(value)]);
    return Object.fromEntries(entries) as T;
  }

  return input;
};
