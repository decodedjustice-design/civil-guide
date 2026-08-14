import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import Dashboard from "./pages/Dashboard";
import Notes from "./pages/Notes";
import EvidenceVault from "./pages/EvidenceVault";
import Timeline from "./pages/Timeline";
import FullGuide from "./pages/FullGuide";
import Library from "./pages/Library";
import Transcription from "./pages/Transcription";
import Tools from "./pages/Tools";
import PublicRequestRights from "./pages/PublicRequestRights";
import CourtsFilingInfo from "./pages/CourtsFilingInfo";
import SavedAttorneys from "./pages/SavedAttorneys";
import StarterLegalTemplates from "./pages/StarterLegalTemplates";
import IntakePacket from "./pages/IntakePacket";
import AttorneyContacts from "./pages/AttorneyContacts";
import JusticePlace from "./pages/JusticePlace";
import Clarion from "./pages/Clarion";
import EducationLibrary from "./pages/EducationLibrary";
import CaseBuilder from "./pages/CaseBuilder";
import FoundersStory from "./pages/FoundersStory";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import DisclaimerPage from "./pages/Disclaimer";
import DecodedJusticeDashboard from "./pages/decoded-justice/DecodedJusticeDashboard";
import DecodedJusticeBuilder from "./pages/decoded-justice/DecodedJusticeBuilder";
import DecodedJusticePacket from "./pages/decoded-justice/DecodedJusticePacket";
import LegalHelp from "./pages/LegalHelp";
import DecodedJusticeEmbed from "./pages/decoded-justice/DecodedJusticeEmbed";
import ProSeToolkit from "./pages/pro-se/ProSeToolkit";
import ProSeDashboard from "./pages/pro-se/ProSeDashboard";
import HousingNavigator from "./pages/HousingNavigator";
import OAuthConsent from "./pages/OAuthConsent";


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
              <Route path="/justice-place" element={<ProtectedRoute><JusticePlace /></ProtectedRoute>} />
              <Route path="/clarion" element={<ProtectedRoute><Clarion /></ProtectedRoute>} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/legal-decoder" element={<LegalDecoder />} />
              <Route path="/self-help" element={<SelfHelpTools />} />
              <Route path="/rights-insight" element={<RightsInsight />} />
              <Route path="/find-help" element={<FindLegalHelp />} />
              <Route path="/legal-help" element={<LegalHelp />} />
              <Route path="/support-network" element={<SupportNetwork />} />
              <Route path="/about" element={<About />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/signin" element={<Auth />} />
              <Route path="/signup" element={<Auth />} />
              <Route path="/notes" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
              <Route path="/evidence-vault" element={<ProtectedRoute><EvidenceVault /></ProtectedRoute>} />
              <Route path="/timeline" element={<ProtectedRoute><Timeline /></ProtectedRoute>} />
              <Route path="/guide/:guideId" element={<FullGuide />} />
              <Route path="/library" element={<Library />} />
              <Route path="/education-library" element={<EducationLibrary />} />
              <Route path="/transcription" element={<ProtectedRoute><Transcription /></ProtectedRoute>} />
              <Route path="/public-request-rights" element={<PublicRequestRights />} />
              <Route path="/courts-filing-info" element={<CourtsFilingInfo />} />
              <Route path="/saved-attorneys" element={<ProtectedRoute><SavedAttorneys /></ProtectedRoute>} />
              <Route path="/legal-templates" element={<StarterLegalTemplates />} />
              <Route path="/intake-packet" element={<ProtectedRoute><IntakePacket /></ProtectedRoute>} />
              <Route path="/attorney-contacts" element={<ProtectedRoute><AttorneyContacts /></ProtectedRoute>} />
              <Route path="/founders-story" element={<FoundersStory />} />
              <Route path="/case-builder" element={<ProtectedRoute><CaseBuilder /></ProtectedRoute>} />
              <Route path="/decoded-justice/dashboard" element={<ProtectedRoute><DecodedJusticeDashboard /></ProtectedRoute>} />
              <Route path="/decoded-justice/builder" element={<ProtectedRoute><DecodedJusticeBuilder /></ProtectedRoute>} />
              <Route path="/decoded-justice/packet" element={<ProtectedRoute><DecodedJusticePacket /></ProtectedRoute>} />
              <Route path="/cases" element={<ProtectedRoute><DecodedJusticeEmbed /></ProtectedRoute>} />
              <Route path="/cases/kanban" element={<ProtectedRoute><DecodedJusticeEmbed /></ProtectedRoute>} />
              <Route path="/cases/calendar" element={<ProtectedRoute><DecodedJusticeEmbed /></ProtectedRoute>} />
              <Route path="/cases/search" element={<ProtectedRoute><DecodedJusticeEmbed /></ProtectedRoute>} />
              <Route path="/wa-statutes" element={<DecodedJusticeEmbed />} />
              <Route path="/wa-rights" element={<DecodedJusticeEmbed />} />
              <Route path="/wa-rights/:section" element={<DecodedJusticeEmbed />} />
              <Route path="/wa-sol" element={<DecodedJusticeEmbed />} />
              <Route path="/wa-templates" element={<DecodedJusticeEmbed />} />
              <Route path="/cases/:id" element={<ProtectedRoute><DecodedJusticeEmbed /></ProtectedRoute>} />
              <Route path="/cases/:id/evidence" element={<ProtectedRoute><DecodedJusticeEmbed /></ProtectedRoute>} />
              <Route path="/cases/:id/timeline" element={<ProtectedRoute><DecodedJusticeEmbed /></ProtectedRoute>} />
              <Route path="/cases/:id/people" element={<ProtectedRoute><DecodedJusticeEmbed /></ProtectedRoute>} />
              <Route path="/cases/:id/claims" element={<ProtectedRoute><DecodedJusticeEmbed /></ProtectedRoute>} />
              <Route path="/cases/:id/documents" element={<ProtectedRoute><DecodedJusticeEmbed /></ProtectedRoute>} />
              <Route path="/cases/:id/communications" element={<ProtectedRoute><DecodedJusticeEmbed /></ProtectedRoute>} />
              <Route path="/cases/:id/deadlines" element={<ProtectedRoute><DecodedJusticeEmbed /></ProtectedRoute>} />
              <Route path="/cases/:id/financials" element={<ProtectedRoute><DecodedJusticeEmbed /></ProtectedRoute>} />
              <Route path="/cases/:id/notes" element={<ProtectedRoute><DecodedJusticeEmbed /></ProtectedRoute>} />
              <Route path="/cases/:id/activity" element={<ProtectedRoute><DecodedJusticeEmbed /></ProtectedRoute>} />
              <Route path="/cases/:id/sharing" element={<ProtectedRoute><DecodedJusticeEmbed /></ProtectedRoute>} />
              <Route path="/cases/:id/ai" element={<ProtectedRoute><DecodedJusticeEmbed /></ProtectedRoute>} />
              <Route path="/what-we-are" element={<About />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/disclaimer" element={<DisclaimerPage />} />
              <Route path="/pro-se-toolkit" element={<ProSeToolkit />} />
              <Route path="/pro-se-toolkit/dashboard" element={<ProtectedRoute><ProSeDashboard /></ProtectedRoute>} />
              <Route path="/housing-navigator" element={<HousingNavigator />} />
              <Route path="/.lovable/oauth/consent" element={<OAuthConsent />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
