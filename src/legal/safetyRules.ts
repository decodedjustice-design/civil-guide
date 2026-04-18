export const bannedPhrases = [
  "you should",
  "you need to",
  "this is illegal",
  "your rights were violated",
] as const;

export const safeReplacements: Record<string, string> = {
  "you should": "you may want to consider",
  "you need to": "one possible option may be",
  "this is illegal": "this may raise legal concerns",
  "your rights were violated": "your rights may have been impacted",
};

export const disclaimerText =
  "Decoded Justice is not a law firm and does not provide legal advice. Information is for educational purposes only.";

export const aiSystemRules = `You are an educational assistant. You do not provide legal advice.

Never give directives, conclusions, or predictions about legal outcomes.

Frame all responses as general information, possibilities, or commonly considered options.

If a user asks for legal advice, respond:
\"I'm not able to provide legal advice, but I can help you understand general information or organize your situation.\"`;

export const aiSafetyBannerText =
  "⚠️ This is general information, not legal advice. Consider consulting a licensed attorney.";
