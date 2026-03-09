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
import toolIntakePacket from "@/assets/tool-intake-packet.jpg";
import toolLegalResearch from "@/assets/tool-legal-research.jpg";

// Banners
import bannerCourtsFiling from "@/assets/banner-courts-filing.jpg";
import bannerEvidenceVault from "@/assets/banner-evidence-vault.jpg";
import bannerLibrary from "@/assets/banner-library.jpg";

// Dashboard graphics
import dashboardOrientation from "@/assets/dashboard-orientation.jpg";

// Empty states
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
  toolIntakePacket,
  toolLegalResearch,
  // Banners
  bannerCourtsFiling,
  bannerEvidenceVault,
  bannerLibrary,
  // Dashboard
  dashboardOrientation,
  // Empty states
  emptyStateNoCases,
  emptyStateNoTimeline,
};

// Re-export placeholders for assets referenced elsewhere that may not exist yet
export const emptyStateNoDocuments = emptyStateNoCases;
export const emptyStateNoEntries = emptyStateNoTimeline;
