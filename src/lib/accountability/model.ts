export const EVIDENCE_STATUSES = ["verified by identified evidence", "supported but not conclusively established", "alleged", "disputed", "inferred", "contradicted", "unknown", "unable to verify"] as const;
export const LIFECYCLE = ["Draft", "Evidence Review", "Ready", "Submitted", "Confirmed", "Acknowledged", "Assigned", "Under Review", "Additional Information Requested", "Response Received", "Outcome Received", "Escalation Considered", "Closed"] as const;
export type WorkKind = "agency" | "source" | "allegation" | "policy_review" | "complaint" | "document" | "task" | "research";
export interface WorkRecord { id: string; case_id: string; user_id: string; kind: WorkKind; title: string; status: string; data: Record<string, string | string[]>; created_at: string; updated_at: string; }
export interface AuditRecord { id: string; record_id: string; kind: string; action: string; created_at: string; before_record: WorkRecord | null; after_record: WorkRecord | null; }
export const text = (r: WorkRecord, key: string) => String(r.data[key] ?? "");
export const ids = (r: WorkRecord, key: string): string[] => Array.isArray(r.data[key]) ? r.data[key] as string[] : [];
export function safeSourceUrl(value: string) {
  try { const url = new URL(value); return url.protocol === "https:" && !url.username && !url.password ? url.href : null; } catch { return null; }
}
export function validateWorkRecord(r: Pick<WorkRecord, "title" | "kind" | "status" | "data">, evidenceIds: string[]) {
  if (!r.title.trim() || r.title.length > 300) throw new Error("A title of 1–300 characters is required.");
  for (const key of ["supporting", "contrary"]) {
    const refs = r.data[key];
    if (Array.isArray(refs) && refs.some(id => !evidenceIds.includes(id))) throw new Error("Evidence must belong to this case.");
  }
  if (r.kind === "allegation" && r.status === EVIDENCE_STATUSES[0] && (!Array.isArray(r.data.supporting) || !r.data.supporting.length || !String(r.data.verification_note ?? "").trim())) throw new Error("Identify supporting evidence and explain what it verifies before using the verified label.");
  for (const key of ["url", "authority_url", "procedure_url"]) {
    const value = r.data[key];
    if (typeof value === "string" && value.trim() && !safeSourceUrl(value)) throw new Error("Source links must be complete HTTPS addresses.");
  }
}
export function patternSummary(records: WorkRecord[], start: string, end: string, scope: string) {
  const selected = records.filter(r => r.kind === "allegation" && text(r,"date") && (!start || text(r,"date") >= start) && (!end || text(r,"date") <= end) && (!scope || text(r,"agency_id") === scope));
  const groups: Record<string, number> = {};
  selected.forEach(r => { const group = text(r,"record_scope") || "user-held records"; groups[group] = (groups[group] ?? 0) + 1; });
  return { count: selected.length, groups, undated: records.filter(r => r.kind === "allegation" && !text(r,"date") && (!scope || text(r,"agency_id") === scope)).length, statuses: EVIDENCE_STATUSES.map(status => ({status, count: selected.filter(r=>r.status===status).length})) };
}
export function complaintReadiness(complaint: WorkRecord, records: WorkRecord[]) {
  const agency = records.find(r => r.kind === "agency" && r.id === text(complaint,"recipient_id"));
  const findings = records.filter(r => r.kind === "allegation" && ids(complaint,"allegations").includes(r.id));
  const missing: string[] = [];
  if (!agency || agency.status !== "reviewed" || !text(agency,"authority") || !safeSourceUrl(text(agency,"procedure_url")) || !text(agency,"verified_on")) missing.push("Recipient authority, official procedure and verification date need review.");
  if (!findings.length) missing.push("Select at least one allegation.");
  if (findings.some(r => !ids(r,"supporting").length)) missing.push("Some allegations have no identified supporting exhibit.");
  if (!text(complaint,"requested_action")) missing.push("Requested action is not recorded.");
  return { agency, findings, missing, ready: missing.length === 0 };
}
export function escapeHtml(value: unknown): string { return String(value ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch] ?? ch)); }
export function downloadFile(name: string, content: string, type = "text/plain") {
  const url = URL.createObjectURL(new Blob([content], { type })); const a = document.createElement("a"); a.href=url; a.download=name; a.click(); setTimeout(()=>URL.revokeObjectURL(url),1000);
}
export function reportHtml(title: string, body: string) { return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${escapeHtml(title)}</title></head><body><h1>${escapeHtml(title)}</h1><p>Decoded Justice · Washington-first educational record. Not legal advice or a legal finding. Complaints do not automatically pause court deadlines. Review confidentiality before sharing.</p>${body}</body></html>`; }
