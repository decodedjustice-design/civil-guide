import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { CaseWorkspaceLayout } from "@/components/case-workspace/CaseWorkspaceLayout";
import { RecordManager } from "@/components/case-workspace/RecordManager";
import { CLASSIFICATIONS, TIMELINE_CATEGORIES, IMPORTANCE_LEVELS } from "@/lib/case/classification";
import { useCaseSnapshot } from "@/hooks/useCaseSnapshot";
import { Card, CardContent } from "@/components/ui/card";

type ChronologyItem = {
  id: string;
  date: string;
  type: string;
  title: string;
  description?: string;
  source?: string;
  sourceId: string;
  status?: string;
};

export default function CaseTimeline() {
  const { id } = useParams();
  const { snapshot } = useCaseSnapshot(id);

  const chronology = useMemo<ChronologyItem[]>(() => {
    const items: ChronologyItem[] = [];

    snapshot.timeline.forEach((event: any) => items.push({
      id: `event-${event.id}`,
      date: event.event_date ?? event.occurred_at ?? event.created_at,
      type: "Event",
      title: event.title,
      description: event.description,
      source: event.source_type,
      sourceId: event.id,
      status: event.review_status ?? event.classification,
    }));

    snapshot.communications.forEach((communication: any) => items.push({
      id: `communication-${communication.id}`,
      date: communication.occurred_at ?? communication.created_at,
      type: "Communication",
      title: communication.subject || communication.method || "Communication",
      description: communication.summary,
      source: communication.source_type,
      sourceId: communication.id,
      status: communication.review_status,
    }));

    snapshot.requests.forEach((request: any) => items.push({
      id: `request-${request.id}`,
      date: request.requested_at ?? request.created_at,
      type: "Records request",
      title: request.title,
      description: request.record_holder ? `Records holder: ${request.record_holder}` : request.notes,
      source: request.request_number ? `Request ${request.request_number}` : "Records request",
      sourceId: request.id,
      status: request.status,
    }));

    snapshot.evidence.forEach((document: any) => items.push({
      id: `document-${document.id}`,
      date: document.document_date ?? document.received_at ?? document.created_at,
      type: "Document",
      title: document.title ?? document.display_filename ?? "Document",
      description: document.description,
      source: document.source,
      sourceId: document.id,
      status: document.review_status ?? document.status,
    }));

    return items.filter(item => !!item.date).sort((a, b) => {
      const da = new Date(a.date).getTime();
      const db = new Date(b.date).getTime();
      return da - db;
    });
  }, [snapshot]);

  return (
    <CaseWorkspaceLayout
      title="Master chronology"
      description="One chronological view of events, communications, records requests, and documents. Source type and review status remain visible so the chronology does not turn different kinds of records into one kind of fact."
    >
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
            <span>{chronology.length} chronology entries</span>
            <span>·</span>
            <span>{snapshot.timeline.length} events</span>
            <span>·</span>
            <span>{snapshot.communications.length} communications</span>
            <span>·</span>
            <span>{snapshot.requests.length} records requests</span>
            <span>·</span>
            <span>{snapshot.evidence.length} documents</span>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3 mb-8">
        {chronology.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <div className="flex flex-col gap-1">
                <div className="flex flex-wrap items-center gap-2">
                  <time className="text-sm font-medium">
                    {new Date(item.date).toLocaleDateString()}
                  </time>
                  <span className="text-xs rounded-full border px-2 py-0.5">{item.type}</span>
                  {item.status && <span className="text-xs text-muted-foreground">{item.status}</span>}
                </div>
                <div className="font-medium">{item.title}</div>
                {item.description && <div className="text-sm text-muted-foreground">{item.description}</div>}
                {item.source && <div className="text-xs text-muted-foreground">Source: {item.source}</div>}
              </div>
            </CardContent>
          </Card>
        ))}
        {!chronology.length && (
          <Card><CardContent className="p-6 text-sm text-muted-foreground">No dated records are available for the unified chronology yet.</CardContent></Card>
        )}
      </div>

      <RecordManager
        table="events" caseId={id} addLabel="Add event"
        emptyMessage="No events yet. Start with the dates you're most sure about."
        titleField="title" subtitleFields={["occurred_at", "description"]}
        badgeFields={["classification", "category", "importance"]}
        orderBy={{ column: "occurred_at", ascending: true }}
        fields={[
          { key: "title", label: "What happened", type: "text", required: true },
          { key: "occurred_at", label: "Date / time", type: "datetime-local", required: true },
          { key: "description", label: "Details", type: "textarea" },
          { key: "classification", label: "How should this be treated?", type: "select", options: CLASSIFICATIONS.map((c) => ({ value: c.value, label: c.label })), defaultValue: "unknown" },
          { key: "category", label: "Category", type: "select", options: TIMELINE_CATEGORIES },
          { key: "importance", label: "Importance", type: "select", options: IMPORTANCE_LEVELS },
          { key: "reviewed", label: "Reviewed", type: "checkbox", placeholder: "I've checked this against a record" },
          { key: "disputed", label: "Disputed", type: "checkbox", placeholder: "Accounts conflict on this" },
          { key: "source_locator_id", label: "Source locator ID", type: "text", help: "Use the locator when a specific document passage supports this event." },
          { key: "source_type", label: "Source type", type: "text", placeholder: "Report, email, order, recording, firsthand account" },
          { key: "reason", label: "Why this matters", type: "textarea" },
        ]}
      />
    </CaseWorkspaceLayout>
  );
}
