import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DashboardOverview } from "@/components/decoded-justice/DashboardOverview";

const readiness = {
  score: 75,
  missing: ["Select at least one issue area."],
};

export default function DecodedJusticeDashboard() {
  return (
    <DashboardLayout pageTitle="Decoded Justice Dashboard">
      <div className="max-w-4xl mx-auto p-6">
        <DashboardOverview
          caseTitle="Housing Access Complaint"
          nextStep="Review key issue areas"
          progressItems={[
            { label: "Write what happened", done: true },
            { label: "Build timeline", done: true },
            { label: "Upload evidence", done: true },
            { label: "Review key issues", done: false },
            { label: "Generate case packet", done: false },
          ]}
          readiness={readiness}
        />
      </div>
    </DashboardLayout>
  );
}
