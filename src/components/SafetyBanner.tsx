import { aiSafetyBannerText } from "@/legal/safetyRules";

export function SafetyBanner() {
  return (
    <div className="mb-6 rounded-xl border border-amber-300/60 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      {aiSafetyBannerText}
    </div>
  );
}
