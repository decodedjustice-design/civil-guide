import { Layout } from "@/components/layout/Layout";
import { SafetyEntry } from "@/components/home/SafetyEntry";
import { OrientationBlock } from "@/components/home/OrientationBlock";
import { SupportGrid } from "@/components/home/SupportGrid";
import { GentleNavigation } from "@/components/home/GentleNavigation";

const Index = () => {
  return (
    <Layout>
      <SafetyEntry />
      <OrientationBlock />
      <SupportGrid />
      <GentleNavigation />
    </Layout>
  );
};

export default Index;
