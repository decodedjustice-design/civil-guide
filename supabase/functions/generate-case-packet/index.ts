import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// ── Types ──────────────────────────────────────────────

interface TimelineEvent {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
}

interface EvidenceItem {
  id: string;
  title: string;
  description: string | null;
  file_type: string | null;
  file_url: string | null;
  source: string | null;
  document_date: string | null;
  created_at: string;
}

interface EvidenceIndexItem extends EvidenceItem {
  label: string;
}

interface NoteItem {
  id: string;
  title: string;
  content: string | null;
}

interface CasePacketData {
  caseId: string;
  title: string;
  location: string;
  incidentDate: string;
  createdAt: string;
  summary: string;
  timeline: TimelineEvent[];
  evidenceIndex: EvidenceIndexItem[];
  notes: NoteItem[];
  readiness: { score: number; missing: string[] };
}

// ── Business logic ─────────────────────────────────────

function buildSummary(
  caseName: string,
  county: string,
  incidentDate: string,
  timelineCount: number,
  evidenceCount: number,
  firstNote: string | null
): string {
  const noteSummary =
    firstNote && firstNote.trim().length > 0
      ? `Narrative context: ${firstNote.trim().slice(0, 500)}`
      : "Narrative context has not been added yet.";

  return [
    `This case record documents reported events connected to ${county} on or around ${incidentDate}.`,
    `The record includes ${timelineCount} timeline event(s) and ${evidenceCount} evidence item(s).`,
    noteSummary,
    "This summary is informational and does not determine legal conclusions.",
  ].join(" ");
}

function calculateReadiness(
  notes: NoteItem[],
  timeline: TimelineEvent[],
  evidence: EvidenceItem[]
): { score: number; missing: string[] } {
  const missing: string[] = [];
  let score = 0;

  if (notes.some((n) => (n.content ?? "").trim().length > 0)) {
    score += 33;
  } else {
    missing.push("Add what happened in your own words.");
  }

  if (timeline.length >= 2) {
    score += 34;
  } else {
    missing.push("Add more timeline details.");
  }

  if (evidence.length >= 1) {
    score += 33;
  } else {
    missing.push("Upload at least one piece of evidence.");
  }

  return { score, missing };
}

// ── HTML template ──────────────────────────────────────

function renderHtml(packet: CasePacketData): string {
  const css = `
    :root { --cream:#F7F1E8; --maroon:#6A1E2E; --gold:#C8A75D; --ink:#2a2a2a; }
    * { box-sizing: border-box; }
    body { margin:0; font-family:Inter,Arial,sans-serif; background:var(--cream); color:var(--ink); line-height:1.6; }
    .page { padding:48px; page-break-after:always; }
    .page:last-child { page-break-after:auto; }
    h1,h2 { color:var(--maroon); margin-bottom:12px; }
    h2 { border-bottom:2px solid var(--gold); padding-bottom:8px; }
    .meta { color:#5d4f4f; margin-bottom:6px; font-size:14px; }
    .card { background:#fffaf3; border:1px solid #e8dcc8; border-left:4px solid var(--gold); padding:12px 16px; margin:10px 0; border-radius:4px; }
    .label { color:var(--maroon); font-weight:600; }
    .readiness { display:flex; align-items:center; gap:12px; margin:16px 0; }
    .readiness-bar { flex:1; height:8px; background:#e8dcc8; border-radius:4px; overflow:hidden; }
    .readiness-fill { height:100%; background:var(--gold); border-radius:4px; }
    .disclaimer { margin-top:32px; padding:16px; background:#f0e8d8; border-radius:6px; font-size:13px; color:#5d4f4f; }
  `;

  const timelineRows = packet.timeline
    .map(
      (e) => `
      <div class="card">
        <div class="meta">${e.event_date}</div>
        <div class="label">${e.title}</div>
        ${e.description ? `<div>${e.description}</div>` : ""}
      </div>`
    )
    .join("");

  const evidenceRows = packet.evidenceIndex
    .map(
      (item) => `
      <div class="card">
        <div class="label">${item.label} · ${item.file_type ?? "document"}</div>
        ${item.description ? `<div>${item.description}</div>` : ""}
        ${item.source ? `<div class="meta">Source: ${item.source}</div>` : ""}
      </div>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><style>${css}</style></head>
<body>
  <section class="page">
    <h1>${packet.title}</h1>
    <p class="meta">Decoded Justice — Case Packet</p>
    <p class="meta">Location: ${packet.location}</p>
    <p class="meta">Incident date: ${packet.incidentDate}</p>
    <p class="meta">Prepared: ${new Date(packet.createdAt).toLocaleDateString()}</p>

    <div class="readiness">
      <span class="label">Readiness: ${packet.readiness.score}%</span>
      <div class="readiness-bar"><div class="readiness-fill" style="width:${packet.readiness.score}%"></div></div>
    </div>
    ${packet.readiness.missing.length > 0 ? `<ul>${packet.readiness.missing.map((m) => `<li class="meta">${m}</li>`).join("")}</ul>` : ""}
  </section>

  <section class="page">
    <h2>Case Overview</h2>
    <p>${packet.summary}</p>
  </section>

  <section class="page">
    <h2>Timeline</h2>
    ${timelineRows || "<p class='meta'>No timeline events yet.</p>"}
  </section>

  <section class="page">
    <h2>Evidence Index</h2>
    ${evidenceRows || "<p class='meta'>No evidence uploaded yet.</p>"}
  </section>

  <div class="disclaimer">
    <strong>Disclaimer:</strong> This document is an organizational tool produced by Decoded Justice for educational purposes only. 
    It does not constitute legal advice, representation, or a legal filing. No attorney-client relationship is created by using this tool.
  </div>
</body>
</html>`;
}

// ── Handler ────────────────────────────────────────────

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Verify user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { caseId, format } = await req.json();
    if (!caseId) {
      return new Response(JSON.stringify({ error: "caseId is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch case data (justice_place_cases)
    const { data: caseRecord, error: caseError } = await supabase
      .from("justice_place_cases")
      .select("*")
      .eq("id", caseId)
      .eq("user_id", user.id)
      .single();

    if (caseError || !caseRecord) {
      return new Response(JSON.stringify({ error: "Case not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch related data in parallel
    const [timelineRes, evidenceRes, notesRes] = await Promise.all([
      supabase
        .from("timeline_entries")
        .select("*")
        .eq("user_id", user.id)
        .order("event_date", { ascending: true }),
      supabase
        .from("evidence")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true }),
      supabase
        .from("notes")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true }),
    ]);

    const timeline: TimelineEvent[] = timelineRes.data ?? [];
    const evidence: EvidenceItem[] = evidenceRes.data ?? [];
    const notes: NoteItem[] = notesRes.data ?? [];

    const evidenceIndex: EvidenceIndexItem[] = evidence.map((item, i) => ({
      ...item,
      label: `EV-${String(i + 1).padStart(2, "0")}`,
    }));

    const readiness = calculateReadiness(notes, timeline, evidence);
    const incidentDate = caseRecord.incident_month_year ?? "Unknown";

    const packet: CasePacketData = {
      caseId: caseRecord.id,
      title: caseRecord.case_name,
      location: `${caseRecord.county}, ${caseRecord.state}`,
      incidentDate,
      createdAt: caseRecord.created_at,
      summary: buildSummary(
        caseRecord.case_name,
        caseRecord.county,
        incidentDate,
        timeline.length,
        evidence.length,
        notes[0]?.content ?? null
      ),
      timeline,
      evidenceIndex,
      notes,
      readiness,
    };

    // Return HTML for print-to-PDF, or JSON for in-app use
    if (format === "html") {
      const html = renderHtml(packet);
      return new Response(html, {
        headers: { ...corsHeaders, "Content-Type": "text/html; charset=utf-8" },
      });
    }

    return new Response(JSON.stringify(packet), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("generate-case-packet error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
