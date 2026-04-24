import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ProSeToolkitFlow } from "@/components/pro-se/ProSeToolkitFlow";
import { EducationalUseBanner } from "@/components/pro-se/EducationalUseBanner";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export default function ProSeToolkit() {
  const { user } = useAuth();

  if (!user) {
    sessionStorage.setItem("auth_redirect", "/pro-se-toolkit");
    return (
      <Layout>
        <div className="container max-w-2xl py-16 space-y-6">
          <EducationalUseBanner />
          <h1 className="font-serif text-3xl text-foreground">Pro Se Case Toolkit</h1>
          <p className="text-muted-foreground">
            Please sign in to access this guided toolkit.
          </p>
          <Button asChild>
            <Link to="/auth?redirect=/pro-se-toolkit">Sign In to Continue</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container max-w-3xl py-12 space-y-6">
        <EducationalUseBanner />
        <div>
          <h1 className="font-serif text-3xl text-foreground mb-2">Pro Se Case Toolkit</h1>
          <p className="text-muted-foreground">
            Structured workflow for people who could not secure attorney representation.
          </p>
        </div>
        <ProSeToolkitFlow />
      </div>
    </Layout>
  );
}
