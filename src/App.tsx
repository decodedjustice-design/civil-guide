import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Analyzer from "./pages/Analyzer";
import LegalDecoder from "./pages/LegalDecoder";
import SelfHelpTools from "./pages/SelfHelpTools";
import RightsInsight from "./pages/RightsInsight";
import FindLegalHelp from "./pages/FindLegalHelp";
import SupportNetwork from "./pages/SupportNetwork";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import AuthCallback from "./pages/AuthCallback";
import Dashboard from "./pages/Dashboard";
import FullGuide from "./pages/FullGuide";
import GovernmentBenefitsGuide from "./pages/GovernmentBenefitsGuide";
import Transcription from "./pages/Transcription";
import Tools from "./pages/Tools";
import PublicRequestRights from "./pages/PublicRequestRights";
import CourtsFilingInfo from "./pages/CourtsFilingInfo";
import SavedAttorneys from "./pages/SavedAttorneys";
import StarterLegalTemplates from "./pages/StarterLegalTemplates";
import Templates from "./pages/Templates";
import AttorneyContacts from "./pages/AttorneyContacts";
import EducationLibrary from "./pages/EducationLibrary";
import KnowledgeTopicHub from "./pages/KnowledgeTopicHub";
import CaseBuilder from "./pages/CaseBuilder";
import FoundersStory from "./pages/FoundersStory";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import DisclaimerPage from "./pages/Disclaimer";
import LegalHelp from "./pages/LegalHelp";
import DecodedJusticeEmbed from "./pages/decoded-justice/DecodedJusticeEmbed";
import ProSeToolkit from "./pages/pro-se/ProSeToolkit";
import ProSeDashboard from "./pages/pro-se/ProSeDashboard";
import HousingNavigator from "./pages/HousingNavigator";
import GuidedWorkflows from "./pages/GuidedWorkflows";
import PathToJustice from "./pages/PathToJustice";
import DeadlineCalculator from "./pages/DeadlineCalculator";
import OAuthConsent from "./pages/OAuthConsent";
import LawModules from "./pages/LawModules";
import CasesList from "./pages/cases/CasesList";
import CaseOverview from "./pages/cases/CaseOverview";
import CaseEvidence from "./pages/cases/CaseEvidence";
import CaseEvidenceReview from "./pages/cases/CaseEvidenceReview";
import CaseDocumentIntelligence from "./pages/cases/CaseDocumentIntelligence";
import CaseTimeline from "./pages/cases/CaseTimeline";
import CasePeople from "./pages/cases/CasePeople";
import CaseIssues from "./pages/cases/CaseIssues";
import CaseClaims from "./pages/cases/CaseClaims";
import CaseCommunications from "./pages/cases/CaseCommunications";
import CaseRequests from "./pages/cases/CaseRequests";
import CaseRecordGaps from "./pages/cases/CaseRecordGaps";
import CaseChecklists from "./pages/cases/CaseChecklists";
import CaseSearch from "./pages/cases/CaseSearch";
import CaseContentCheck from "./pages/cases/CaseContentCheck";
import CasePackets from "./pages/cases/CasePackets";
import CaseExportCenter from "./pages/cases/CaseExportCenter";
import CaseRelationships from "./pages/cases/CaseRelationships";
import AttorneySearch from "./pages/AttorneySearch";
import JusticeResearchEngine from "./pages/JusticeResearchEngine";
import Notes from "./pages/Notes";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/analyzer" element={<ProtectedRoute><Analyzer /></ProtectedRoute>} />
              <Route path="/justice-place" element={<ProtectedRoute><Navigate to="/cases" replace /></ProtectedRoute>} />
              <Route path="/clarion" element={<ProtectedRoute><Navigate to="/case-builder" replace /></ProtectedRoute>} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/legal-decoder" element={<LegalDecoder />} />
              <Route path="/self-help" element={<SelfHelpTools />} />
              <Route path="/rights-insight" element={<RightsInsight />} />
              <Route path="/find-help" element={<FindLegalHelp />} />
              <Route path="/attorney-search" element={<ProtectedRoute><AttorneySearch /></ProtectedRoute>} />
              <Route path="/justice-research" element={<JusticeResearchEngine />} />
              <Route path="/legal-help" element={<LegalHelp />} />
              <Route path="/support-network" element={<SupportNetwork />} />
              <Route path="/about" element={<About />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/signin" element={<Auth />} />
              <Route path="/signup" element={<Auth />} />
              <Route path="/notes" element={<ProtectedRoute><Navigate to="/cases" replace /></ProtectedRoute>} />
              <Route path="/evidence-vault" element={<ProtectedRoute><Navigate to="/cases" replace /></ProtectedRoute>} />
              <Route path="/timeline" element={<ProtectedRoute><Navigate to="/cases" replace /></ProtectedRoute>} />
              <Route path="/guide/government-full-guide" element={<GovernmentBenefitsGuide />} />
              <Route path="/guide/:guideId" element={<FullGuide />} />
              <Route path="/library" element={<Navigate to="/education-library" replace />} />
              <Route path="/education-library" element={<EducationLibrary />} />
              <Route path="/education-library/topic/:slug" element={<KnowledgeTopicHub />} />
              <Route path="/transcription" element={<ProtectedRoute><Transcription /></ProtectedRoute>} />
              <Route path="/public-request-rights" element={<PublicRequestRights />} />
              <Route path="/courts-filing-info" element={<CourtsFilingInfo />} />
              <Route path="/saved-attorneys" element={<ProtectedRoute><SavedAttorneys /></ProtectedRoute>} />
              <Route path="/templates" element={<Templates />} />
              <Route path="/legal-templates" element={<StarterLegalTemplates />} />
              <Route path="/intake-packet" element={<ProtectedRoute><Navigate to="/cases" replace /></ProtectedRoute>} />
              <Route path="/attorney-contacts" element={<ProtectedRoute><AttorneyContacts /></ProtectedRoute>} />
              <Route path="/founders-story" element={<FoundersStory />} />
              <Route path="/case-builder" element={<ProtectedRoute><CaseBuilder /></ProtectedRoute>} />
              <Route path="/law-modules" element={<LawModules />} />
              <Route path="/decoded-justice/dashboard" element={<ProtectedRoute><Navigate to="/dashboard" replace /></ProtectedRoute>} />
              <Route path="/decoded-justice/builder" element={<ProtectedRoute><Navigate to="/case-builder" replace /></ProtectedRoute>} />
              <Route path="/decoded-justice/packet" element={<ProtectedRoute><Navigate to="/cases" replace /></ProtectedRoute>} />
              <Route path="/cases" element={<ProtectedRoute><CasesList /></ProtectedRoute>} />
              <Route path="/wa-statutes" element={<DecodedJusticeEmbed />} />
              <Route path="/wa-rights" element={<DecodedJusticeEmbed />} />
              <Route path="/wa-rights/:section" element={<DecodedJusticeEmbed />} />
              <Route path="/wa-sol" element={<DecodedJusticeEmbed />} />
              <Route path="/wa-templates" element={<DecodedJusticeEmbed />} />
              <Route path="/cases/:id" element={<ProtectedRoute><CaseOverview /></ProtectedRoute>} />
              <Route path="/cases/:id/evidence" element={<ProtectedRoute><CaseEvidence /></ProtectedRoute>} />
              <Route path="/cases/:id/evidence-review" element={<ProtectedRoute><CaseEvidenceReview /></ProtectedRoute>} />
              <Route path="/cases/:id/document-intelligence" element={<ProtectedRoute><CaseDocumentIntelligence /></ProtectedRoute>} />
              <Route path="/cases/:id/documents" element={<ProtectedRoute><CaseEvidence /></ProtectedRoute>} />
              <Route path="/cases/:id/timeline" element={<ProtectedRoute><CaseTimeline /></ProtectedRoute>} />
              <Route path="/cases/:id/people" element={<ProtectedRoute><CasePeople /></ProtectedRoute>} />
              <Route path="/cases/:id/issues" element={<ProtectedRoute><CaseIssues /></ProtectedRoute>} />
              <Route path="/cases/:id/claims" element={<ProtectedRoute><CaseClaims /></ProtectedRoute>} />
              <Route path="/cases/:id/communications" element={<ProtectedRoute><CaseCommunications /></ProtectedRoute>} />
              <Route path="/cases/:id/requests" element={<ProtectedRoute><CaseRequests /></ProtectedRoute>} />
              <Route path="/cases/:id/record-gaps" element={<ProtectedRoute><CaseRecordGaps /></ProtectedRoute>} />
              <Route path="/cases/:id/checklists" element={<ProtectedRoute><CaseChecklists /></ProtectedRoute>} />
              <Route path="/cases/:id/deadlines" element={<ProtectedRoute><CaseRequests /></ProtectedRoute>} />
              <Route path="/cases/:id/search" element={<ProtectedRoute><CaseSearch /></ProtectedRoute>} />
              <Route path="/cases/:id/content-check" element={<ProtectedRoute><CaseContentCheck /></ProtectedRoute>} />
              <Route path="/cases/:id/packets" element={<ProtectedRoute><CasePackets /></ProtectedRoute>} />
              <Route path="/cases/:id/exports" element={<ProtectedRoute><CaseExportCenter /></ProtectedRoute>} />
              <Route path="/cases/:id/relationships" element={<ProtectedRoute><CaseRelationships /></ProtectedRoute>} />
              <Route path="/cases/:id/attorneys" element={<ProtectedRoute><AttorneySearch /></ProtectedRoute>} />
              <Route path="/cases/:id/notes" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
              <Route path="/what-we-are" element={<About />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/disclaimer" element={<DisclaimerPage />} />
              <Route path="/pro-se-toolkit" element={<ProSeToolkit />} />
              <Route path="/pro-se-toolkit/dashboard" element={<ProtectedRoute><ProSeDashboard /></ProtectedRoute>} />
              <Route path="/housing-navigator" element={<HousingNavigator />} />
              <Route path="/guided-workflows" element={<GuidedWorkflows />} />
              <Route path="/path-to-justice" element={<PathToJustice />} />
              <Route path="/deadline-calculator" element={<DeadlineCalculator />} />
              <Route path="/.lovable/oauth/consent" element={<OAuthConsent />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
