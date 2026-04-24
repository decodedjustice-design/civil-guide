import { applySafetyLanguage } from "@/legal/applySafetyLanguage";

const toolkitReplacements: Record<string, string> = {
  "you should": "you may consider",
  "your case is": "this information suggests",
};

export const applyToolkitLanguageGuard = (input: string): string => {
  let value = applySafetyLanguage(input);

  Object.entries(toolkitReplacements).forEach(([unsafePhrase, safePhrase]) => {
    const pattern = new RegExp(unsafePhrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    value = value.replace(pattern, safePhrase);
  });

  return value;
};
