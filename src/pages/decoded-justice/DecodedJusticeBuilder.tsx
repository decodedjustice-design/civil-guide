import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CaseBuilderFlow } from "@/components/decoded-justice/CaseBuilderFlow";

export default function DecodedJusticeBuilder() {
  return (
    <DashboardLayout pageTitle="Case Builder">
      <div className="max-w-4xl mx-auto p-6">
        <CaseBuilderFlow />
      </div>
    </DashboardLayout>
  );
}
