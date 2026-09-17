import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, FolderOpen } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { DjPageHeader } from "@/components/ui/dj-page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Disclaimer } from "@/components/shared/Disclaimer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCases } from "@/hooks/useCases";
import { toast } from "@/hooks/use-toast";

export default function CasesList() {
  const { cases, isLoading, createCase } = useCases();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [county, setCounty] = useState("");

  const create = async () => {
    if (!name.trim()) {
      toast({ title: "Give the case a name", variant: "destructive" });
      return;
    }
    try {
      const created = await createCase.mutateAsync({ name, description, county });
      setOpen(false);
      setName("");
      setDescription("");
      setCounty("");
      navigate(`/cases/${created.id}`);
    } catch (e: any) {
      toast({ title: "Could not create the case", description: e.message, variant: "destructive" });
    }
  };

  return (
    <Layout>
      <DjPageHeader
        variant="espresso"
        eyebrow="Case workspace"
        title="Your cases"
        description="One place for your record: what happened, who was involved, what you have, and what you still need. You can pause anytime and come back."
      />
      <div className="container max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="flex justify-end">
          <Button onClick={() => setOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> New case
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : cases.length === 0 ? (
          <Card>
            <CardContent className="p-10 text-center space-y-3">
              <FolderOpen className="w-8 h-8 mx-auto text-muted-foreground" strokeWidth={1.5} />
              <p className="text-sm text-muted-foreground">
                You don't have a case workspace yet. Start one whenever you're ready — nothing is
                shared with anyone.
              </p>
              <Button onClick={() => setOpen(true)}>Start a case</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {cases.map((c) => (
              <Link key={c.id} to={`/cases/${c.id}`} className="group">
                <Card className="h-full transition-all hover:border-primary/40 hover:shadow-md cursor-pointer">
                  <CardContent className="p-5 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="font-serif text-lg text-foreground group-hover:text-primary transition-colors">
                        {c.name}
                      </h2>
                      <Badge variant="outline" className="shrink-0 capitalize">
                        {c.status?.replace(/_/g, " ")}
                      </Badge>
                    </div>
                    {c.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{c.description}</p>
                    )}
                    <p className="text-xs text-muted-foreground/80">
                      {[c.county, c.state].filter(Boolean).join(", ")}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        <Disclaimer variant="prominent" />
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start a case</DialogTitle>
            <DialogDescription>
              A short name is enough. You can add detail later.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="case-name">Case name</Label>
              <Input
                id="case-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Housing matter — 2025"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="case-county">County</Label>
              <Input
                id="case-county"
                value={county}
                onChange={(e) => setCounty(e.target.value)}
                placeholder="e.g. King"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="case-desc">What is this about?</Label>
              <Textarea
                id="case-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A sentence or two in your own words."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={create} disabled={createCase.isPending}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
