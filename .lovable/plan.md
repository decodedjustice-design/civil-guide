# Backend Identity Investigation — Findings (Read-Only)

No code, database, or configuration changes were made or are proposed. This plan records the investigation results only.

## Confirmed facts

1. **Published app runtime backend**: The live bundle at `https://decodedjustice.lovable.app/assets/index-DQ_in6E1.js` contains exactly one Supabase URL: `https://keeirvtfrvyqtmkonsru.supabase.co`, with the matching anon/publishable key for that ref.
2. **Repository `.env`**: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PROJECT_ID`, and `VITE_SUPABASE_PUBLISHABLE_KEY` all point to ref `keeirvtfrvyqtmkonsru`.
3. **Lovable Cloud project info**: Live instance ref `keeirvtfrvyqtmkonsru` (Tiny, not paused, eu-west-1), managed by Lovable. Session tools bound to the same live instance.

## Conclusion

The published app, the editor preview, the repo `.env`, and the Lovable-managed database all use the **same single backend**: ref `keeirvtfrvyqtmkonsru`. No second environment exists.

## Inference vs. fact

- Vite inlines `VITE_*` values at build time, so a published build *could* differ from the repo `.env` — but bundle inspection proves it does not: the deployed artifact matches `.env` exactly.
- Edge functions deploy to the same project ref and use its built-in server-side bindings.
- Caveat: only the current bundle hash was inspected; a future publish with different env vars would change it.

## Action

None. No changes required — configuration is consistent across all surfaces.
