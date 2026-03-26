import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PacketGeneratorPanel } from "@/components/decoded-justice/PacketGeneratorPanel";

export default function DecodedJusticePacket() {
  return (
    <DashboardLayout pageTitle="Packet Generator">
      <div className="max-w-4xl mx-auto p-6 space-y-4">
        <PacketGeneratorPanel />
        <section className="rounded-xl border bg-card p-5">
          <h3 className="font-semibold">Preview</h3>
          <p className="text-sm text-muted-foreground mt-2">
            After generation, this area renders the packet preview before export.
          </p>
        </section>
      </div>
    </DashboardLayout>
  );
}
