-- Backfill legacy Justice Place records into the canonical case model.
-- Idempotent: existing case_id values are preserved; only unmapped records are attached.
-- The legacy Justice Place model had one case per user, so legacy-owned records
-- without a case_id are mapped to that user's canonical legacy case.

DO $$
BEGIN
  -- Ensure every legacy Justice Place case has a canonical case row.
  INSERT INTO public.cases (
    user_id,
    name,
    description,
    case_type,
    county,
    state,
    status,
    legacy_justice_place_case_id,
    created_at,
    updated_at
  )
  SELECT
    jpc.user_id,
    COALESCE(NULLIF(BTRIM(jpc.case_name), ''), 'Untitled case'),
    NULL,
    jpc.issue_type,
    jpc.county,
    COALESCE(jpc.state, 'WA'),
    CASE
      WHEN jpc.case_status = 'on_hold' THEN 'on_hold'
      ELSE 'active'
    END,
    jpc.id,
    jpc.created_at,
    jpc.updated_at
  FROM public.justice_place_cases jpc
  WHERE NOT EXISTS (
    SELECT 1
    FROM public.cases c
    WHERE c.legacy_justice_place_case_id = jpc.id
  );
END $$;

-- Preserve the legacy case status where it maps cleanly to the canonical status model.
UPDATE public.cases c
SET
  status = CASE
    WHEN jpc.case_status = 'on_hold' THEN 'on_hold'
    WHEN jpc.case_status IN (
      'getting_oriented',
      'gathering_information',
      'preparing_outreach',
      'awaiting_responses',
      'reviewing_options',
      'taking_next_steps'
    ) THEN 'active'
    ELSE c.status
  END,
  updated_at = GREATEST(c.updated_at, jpc.updated_at)
FROM public.justice_place_cases jpc
WHERE c.legacy_justice_place_case_id = jpc.id;

-- The old Justice Place case was the implicit parent for the user's existing
-- timeline, evidence, and notes. Attach only currently-unassigned records.
-- Existing canonical case assignments are never overwritten.
WITH legacy_cases AS (
  SELECT
    c.user_id,
    c.id AS case_id,
    c.created_at,
    ROW_NUMBER() OVER (
      PARTITION BY c.user_id
      ORDER BY c.created_at ASC, c.id ASC
    ) AS rn
  FROM public.cases c
  WHERE c.legacy_justice_place_case_id IS NOT NULL
)
UPDATE public.timeline_entries t
SET case_id = lc.case_id
FROM legacy_cases lc
WHERE lc.rn = 1
  AND t.user_id = lc.user_id
  AND t.case_id IS NULL;

WITH legacy_cases AS (
  SELECT
    c.user_id,
    c.id AS case_id,
    ROW_NUMBER() OVER (
      PARTITION BY c.user_id
      ORDER BY c.created_at ASC, c.id ASC
    ) AS rn
  FROM public.cases c
  WHERE c.legacy_justice_place_case_id IS NOT NULL
)
UPDATE public.evidence e
SET case_id = lc.case_id
FROM legacy_cases lc
WHERE lc.rn = 1
  AND e.user_id = lc.user_id
  AND e.case_id IS NULL;

WITH legacy_cases AS (
  SELECT
    c.user_id,
    c.id AS case_id,
    ROW_NUMBER() OVER (
      PARTITION BY c.user_id
      ORDER BY c.created_at ASC, c.id ASC
    ) AS rn
  FROM public.cases c
  WHERE c.legacy_justice_place_case_id IS NOT NULL
)
UPDATE public.notes n
SET case_id = lc.case_id
FROM legacy_cases lc
WHERE lc.rn = 1
  AND n.user_id = lc.user_id
  AND n.case_id IS NULL;

-- Number all newly attached evidence deterministically without changing any
-- existing exhibit numbers.
WITH numbered AS (
  SELECT
    e.id,
    ROW_NUMBER() OVER (
      PARTITION BY e.case_id
      ORDER BY e.created_at ASC, e.id ASC
    ) AS rn
  FROM public.evidence e
  WHERE e.case_id IS NOT NULL
    AND e.exhibit_number IS NULL
)
UPDATE public.evidence e
SET exhibit_number = numbered.rn
FROM numbered
WHERE e.id = numbered.id;
