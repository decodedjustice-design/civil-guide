import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Analyzer from "./pages/Analyzer";
import LegalDecoder from "./pages/LegalDecoder";
import SelfHelpTools from "./pages/SelfHelpTools";
import RightsInsight from "./pages/RightsInsight";
import FindLegalHelp from "./pages/FindLegalHelp";
import SupportNetwork from "./pages/SupportNetwork";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/analyzer" element={<Analyzer />} />
          <Route path="/legal-decoder" element={<LegalDecoder />} />
          <Route path="/self-help" element={<SelfHelpTools />} />
          <Route path="/rights-insight" element={<RightsInsight />} />
          <Route path="/find-help" element={<FindLegalHelp />} />
          <Route path="/support-network" element={<SupportNetwork />} />
          <Route path="/about" element={<About />} />
          <Route path="/founders-story" element={<About />} />
          <Route path="/what-we-are" element={<About />} />
          <Route path="/signin" element={<SelfHelpTools />} />
          <Route path="/signup" element={<SelfHelpTools />} />
          <Route path="/privacy" element={<About />} />
          <Route path="/terms" element={<About />} />
          <Route path="/disclaimer" element={<About />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
