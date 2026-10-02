# Education Library subject photography

## Scope
- Generate 11 distinct, realistic cinematic photographs, one for each requested Knowledge Center subject.
- Keep every card's existing copy, icon, link, dimensions, overlay, typography, and responsive behavior.
- Update only the Education Library's image imports and subject mapping.

## Files
- Add 11 optimized image assets under `src/assets/education-library/`.
- Update `src/assets/index.ts` with a dedicated typed image map for these 11 subjects.
- Update `src/pages/EducationLibrary.tsx` to use stable subject IDs and the dedicated image map.

## Verification
- Confirm all 11 source files exist, are unique, and resolve through valid imports.
- Check the Education Library at desktop and phone widths for recognizable imagery, intact overlays, and no broken cards.
- Check the generated preview diagnostics and TypeScript errors, separating any pre-existing unrelated errors from this change.

## Technical details
- Photos will contain no added text, branding, legible documents, or embedded interface elements.
- Image generation will use consistent editorial lighting and crop-safe 16:8 compositions while keeping each subject visually distinct.
