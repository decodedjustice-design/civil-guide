import { useMemo, useState } from "react";
import { CalendarDays, Download, ShieldCheck } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectValue, SelectTrigger } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

function addBusinessDays(date: Date, days: number) {
  const result = new Date(date);
  let remaining = days;
  while (remaining > 0) {
    result.setDate(result.getDate() + 1);
    const day = result.getDay();
    if (day !== 0 && day !== 6) remaining -= 1;
  }
  return result;
}

function addCalendarDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function formatDate(date: Date) {
  return date.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

function formatIcsDate(date: Date) {
  return date.toISOString().slice(0, 10).replace(/-/g, "");
}

export default function DeadlineCalculator() {
  const [triggerDate, setTriggerDate] = useState("");
  const [days, setDays] = useState("14");
  const [counting, setCounting] = useState<"calendar" | "business">("calendar");
  const [title, setTitle] = useState("Deadline");
  const [source, setSource] = useState("");
  const [notes, setNotes] = useState("");

  const result = useMemo(() => {
    if (!triggerDate || !Number.isFinite(Number(days)) || Number(days) < 0) return null;
    const base = new Date(triggerDate + "T12:00:00");
    if (Number.isNaN(base.getTime())) return null;
    return counting === "business" ? addBusinessDays(base, Number(days)) : addCalendarDays(base, Number(days));
  }, [triggerDate, days, counting]);

  const downloadIcs = () => {
    if (!result) return;
    const safeTitle = title.trim() || "Deadline";
    const description = [
      "Decoded Justice deadline reminder.",
      "Calculated as " + days + " " + counting + " day" + (Number(days) === 1 ? "" : "s") + " after " + triggerDate + ".",
      source.trim() ? "Source to verify: " + source.trim() : "Source to verify: not entered.",
      notes.trim() ? "Notes: " + notes.trim() : "",
      "Verify this date against the actual governing order, notice, rule, statute, or official court/agency source.",
    ].filter(Boolean).join("\\n");
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Decoded Justice//Deadline Calculator//EN",
      "BEGIN:VEVENT",
      "UID:" + crypto.randomUUID() + "@decodedjustice",
      "DTSTAMP:" + formatIcsDate(new Date()),
      "DTSTART;VALUE=DATE:" + formatIcsDate(result),
      "SUMMARY:" + safeTitle.replace(/[\\r\\n,;]/g, " "),
      "DESCRIPTION:" + description.replace(/[\\r\\n]/g, "\\\\n").replace(/,/g, "\\\\,").replace(/;/g, "\\\\;"),
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\\r\\n");
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "decoded-justice-deadline.ics";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Layout>
      <main className="container max-w-5xl py-10 sm:py-16">
        <div className="max-w-3xl">
          <p className="text-[10px] uppercase tracking-[0.22em] text-gold">Self-advocacy tool</p>
          <h1 className="mt-3 font-serif text-4xl tracking-tight sm:text-5xl">Deadline Calculator</h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Calculate a date from a triggering date and a stated number of calendar or business days. Save the result to your calendar as an .ics file.
          </p>
        </div>

        <Card className="mt-8 border-primary/20">
          <CardContent className="p-5">
            <div className="flex gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div className="text-sm leading-6 text-muted-foreground">
                <p className="font-medium text-foreground">Calculation only — verify the rule first</p>
                <p className="mt-1">
                  This tool performs date arithmetic. It does not determine which deadline applies, whether a deadline is jurisdiction-specific, whether service changes the calculation, or whether weekends and holidays are excluded. Verify the actual deadline from the controlling order, notice, statute, rule, or official source.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <Card>
            <CardHeader>
              <CardTitle>Calculate a date</CardTitle>
              <CardDescription>The count begins on the day after the triggering date.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <Label htmlFor="trigger-date">Triggering date</Label>
                <Input id="trigger-date" type="date" value={triggerDate} onChange={(e) => setTriggerDate(e.target.value)} className="mt-2" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="days">Number of days</Label>
                  <Input id="days" type="number" min="0" step="1" value={days} onChange={(e) => setDays(e.target.value)} className="mt-2" />
                </div>
                <div>
                  <Label>Counting method</Label>
                  <Select value={counting} onValueChange={(value: "calendar" | "business") => setCounting(value)}>
                    <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="calendar">Calendar days</SelectItem>
                      <SelectItem value="business">Business days (Mon–Fri)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="deadline-title">Calendar title</Label>
                <Input id="deadline-title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-2" />
              </div>
              <div>
                <Label htmlFor="deadline-source">Source to verify</Label>
                <Input id="deadline-source" value={source} onChange={(e) => setSource(e.target.value)} placeholder="e.g. court order dated …, notice, CR 6, agency rule" className="mt-2" />
              </div>
              <div>
                <Label htmlFor="deadline-notes">Notes</Label>
                <Textarea id="deadline-notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="What event or obligation does this date relate to?" className="mt-2 min-h-24" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Calculated result</CardTitle>
              <CardDescription>Use this as a planning aid until verified.</CardDescription>
            </CardHeader>
            <CardContent>
              {result ? (
                <div>
                  <CalendarDays className="h-7 w-7 text-primary" />
                  <p className="mt-5 text-sm text-muted-foreground">Calculated date</p>
                  <p className="mt-1 text-2xl font-semibold">{formatDate(result)}</p>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {days} {counting} day{Number(days) === 1 ? "" : "s"} after {new Date(triggerDate + "T12:00:00").toLocaleDateString()}.
                  </p>
                  {source.trim() && <p className="mt-3 text-xs text-muted-foreground"><strong>Verify against:</strong> {source}</p>}
                  <Button className="mt-6" onClick={downloadIcs}>
                    <Download className="mr-2 h-4 w-4" /> Download .ics
                  </Button>
                </div>
              ) : (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  Enter a triggering date and number of days to calculate a date.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </Layout>
  );
}
