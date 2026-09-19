import { Card, CardContent } from "@/components/ui/card";
import { CalendarClock, CheckCircle2, MessageSquare, FileSearch } from "lucide-react";

interface Props {
  communications?: any[];
  requests?: any[];
}

export function CaseWorkspaceSummary({ communications = [], requests = [] }: Props) {
  const followUps = communications.filter((c) => c.follow_up_needed);
  const undatedFollowUps = followUps.filter((c) => !c.follow_up_date);
  const pendingRequests = requests.filter((r) => !["complete", "denied"].includes(r.status));
  const overdueRequests = requests.filter((r) => r.status === "overdue");

  const cards = [
    {
      label: "Contacts logged",
      value: communications.length,
      detail: followUps.length ? `${followUps.length} need follow-up` : "No follow-ups flagged",
      icon: MessageSquare,
    },
    {
      label: "Requests tracked",
      value: requests.length,
      detail: pendingRequests.length ? `${pendingRequests.length} still open` : "No open requests",
      icon: FileSearch,
    },
    {
      label: "Follow-ups without dates",
      value: undatedFollowUps.length,
      detail: undatedFollowUps.length ? "Add a date so the item is not easy to lose" : "Nothing missing",
      icon: CalendarClock,
    },
    {
      label: "Past-due requests",
      value: overdueRequests.length,
      detail: overdueRequests.length ? "Review the record and next step" : "None marked past due",
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3">
      {cards.map((card) => (
        <Card key={card.label}>
          <CardContent className="p-4 flex items-start gap-3">
            <card.icon className="h-4 w-4 mt-0.5 text-primary shrink-0" strokeWidth={1.5} />
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">{card.label}</p>
              <p className="text-2xl font-serif text-foreground mt-1">{card.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{card.detail}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
