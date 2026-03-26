import type { CasePacketData } from "@/features/decoded-justice/types";

const css = `
  :root {
    --cream: #F7F1E8;
    --maroon: #6A1E2E;
    --gold: #C8A75D;
    --ink: #2a2a2a;
  }
  body {
    margin: 0;
    font-family: Inter, Arial, sans-serif;
    background: var(--cream);
    color: var(--ink);
    line-height: 1.5;
  }
  .page { padding: 48px; page-break-after: always; }
  .page:last-child { page-break-after: auto; }
  h1, h2 { color: var(--maroon); margin-bottom: 12px; }
  h2 { border-bottom: 2px solid var(--gold); padding-bottom: 8px; }
  .meta { color: #5d4f4f; margin-bottom: 6px; }
  .card { background: #fffaf3; border: 1px solid #e8dcc8; border-left: 4px solid var(--gold); padding: 12px; margin: 10px 0; }
  .label { color: var(--maroon); font-weight: 600; }
`;

export function renderCasePacketHtml(packet: CasePacketData): string {
  const timelineRows = packet.timeline
    .map(
      (event) => `
      <div class="card">
        <div class="meta">${new Date(event.date).toLocaleString()}</div>
        <div class="label">${event.title}</div>
        <div>${event.description}</div>
      </div>
    `,
    )
    .join("");

  const evidenceRows = packet.evidenceIndex
    .map(
      (item) => `
      <div class="card">
        <div class="label">${item.label} · ${item.type}</div>
        <div>${item.description}</div>
        <div class="meta">${item.file_url}</div>
      </div>
    `,
    )
    .join("");

  const issueRows = packet.issues
    .map((issue) => `<li><strong>${issue.type}:</strong> ${issue.description}</li>`)
    .join("");

  return `
    <html>
      <head><style>${css}</style></head>
      <body>
        <section class="page">
          <h1>${packet.title}</h1>
          <p class="meta">Decoded Justice Case Packet</p>
          <p class="meta">Location: ${packet.location}</p>
          <p class="meta">Incident date: ${new Date(packet.incidentDate).toLocaleDateString()}</p>
          <p class="meta">Prepared: ${new Date(packet.createdAt).toLocaleDateString()}</p>
        </section>

        <section class="page">
          <h2>Case overview</h2>
          <p>${packet.summary}</p>
          <h2>Issue context</h2>
          <ul>${issueRows || "<li>No issues selected yet.</li>"}</ul>
        </section>

        <section class="page">
          <h2>Timeline</h2>
          ${timelineRows || "<p>No timeline events yet.</p>"}
        </section>

        <section class="page">
          <h2>Evidence index</h2>
          ${evidenceRows || "<p>No evidence uploaded yet.</p>"}
        </section>
      </body>
    </html>
  `;
}
