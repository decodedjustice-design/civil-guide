import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function SafetyEntry() {
  return (
    <section className="py-12 lg:py-16">
      <div className="container max-w-2xl text-center">
        <h1 className="text-2xl md:text-3xl font-medium text-foreground mb-3">
          A space for clarity when systems feel confusing
        </h1>
        <p className="text-muted-foreground mb-6">
          Learn, organize, and prepare at your own pace.
        </p>
        <Button variant="outline" size="sm" asChild>
          <Link to="/tools">Explore what's available</Link>
        </Button>
      </div>
    </section>
  );
}
