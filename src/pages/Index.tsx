import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { TrustLayer } from "@/components/home/TrustLayer";
import { PurposeGrid } from "@/components/home/PurposeGrid";
import { GuidedEntry } from "@/components/home/GuidedEntry";
import { HumanLayer } from "@/components/home/HumanLayer";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <TrustLayer />
      <PurposeGrid />
      <HumanLayer />
      <GuidedEntry />
    </Layout>
  );
};

export default Index;
