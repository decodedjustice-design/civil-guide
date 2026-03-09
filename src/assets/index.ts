// Category illustrations
import categoryPolice from "@/assets/category-police-encounters.jpg";
import categoryTraffic from "@/assets/category-traffic-stops.jpg";
import categoryCourts from "@/assets/hero-courthouse-cinematic.jpg";
import categoryHousing from "@/assets/category-housing-rights.jpg";
import categoryDisability from "@/assets/category-disability-rights.jpg";
import categoryProtest from "@/assets/hero-police-interaction.png";
import categoryEducation from "@/assets/category-education-rights.jpg";
import categoryGovernment from "@/assets/hero-organized-files.jpg";
import categoryIncarceration from "@/assets/hero-documents-night.jpg";
import categoryHealthcare from "@/assets/hero-workspace-calm.jpg";
import categorySupportNetwork from "@/assets/category-support-network.jpg";

// Tool graphics
import toolEvidenceVault from "@/assets/tool-evidence-vault.jpg";
import toolAnalyzer from "@/assets/tool-analyzer.jpg";
import toolTimeline from "@/assets/tool-timeline.jpg";
import toolNotes from "@/assets/tool-notes.jpg";
import toolTranscription from "@/assets/tool-transcription.jpg";
import toolLegalDecoder from "@/assets/tool-legal-decoder.jpg";
import toolRightsInsight from "@/assets/tool-rights-insight.jpg";
import toolIntakePacket from "@/assets/tool-intake-packet.jpg";
import toolLegalResearch from "@/assets/tool-legal-research.jpg";

// Banners
import bannerScalesJustice from "@/assets/banner-scales-justice.jpg";
import bannerCivicBuilding from "@/assets/banner-civic-building.jpg";
import bannerCaseBuilder from "@/assets/banner-case-builder.jpg";
import bannerCourtsFiling from "@/assets/banner-courts-filing.jpg";
import bannerEvidenceVault from "@/assets/banner-evidence-vault.jpg";
import bannerLibrary from "@/assets/banner-library.jpg";

// Dashboard graphics
import dashboardCompass from "@/assets/dashboard-compass.jpg";
import dashboardOverview from "@/assets/dashboard-overview.jpg";
import dashboardOrientation from "@/assets/dashboard-orientation.jpg";

// Empty states
import emptyStateFolder from "@/assets/empty-state-folder.jpg";
import emptyStateNotebook from "@/assets/empty-state-notebook.jpg";
import emptyStateNoDocuments from "@/assets/empty-state-no-documents.jpg";
import emptyStateNoEntries from "@/assets/empty-state-no-entries.jpg";
import emptyStateNoCases from "@/assets/empty-state-no-cases.jpg";
import emptyStateNoTimeline from "@/assets/empty-state-no-timeline.jpg";

/** Map category IDs to their illustration */
export const categoryImages: Record<string, string> = {
  police: categoryPolice,
  traffic: categoryTraffic,
  courts: categoryCourts,
  housing: categoryHousing,
  disability: categoryDisability,
  protest: categoryProtest,
  education: categoryEducation,
  government: categoryGovernment,
  incarceration: categoryIncarceration,
  healthcare: categoryHealthcare,
  support: categorySupportNetwork,
};

export {
  // Tools
  toolEvidenceVault,
  toolAnalyzer,
  toolTimeline,
  toolNotes,
  toolTranscription,
  toolLegalDecoder,
  toolRightsInsight,
  toolIntakePacket,
  toolLegalResearch,
  // Banners
  bannerScalesJustice,
  bannerCivicBuilding,
  bannerCaseBuilder,
  bannerCourtsFiling,
  bannerEvidenceVault,
  bannerLibrary,
  // Dashboard
  dashboardCompass,
  dashboardOverview,
  dashboardOrientation,
  // Empty states
  emptyStateFolder,
  emptyStateNotebook,
  emptyStateNoDocuments,
  emptyStateNoEntries,
  emptyStateNoCases,
  emptyStateNoTimeline,
};
