import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function SafetyEntry() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container max-w-3xl">
        {/* QuietStatement */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground leading-tight mb-6">
            A quiet place to find clarity
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            When systems feel overwhelming, it helps to have a space to organize your thoughts, 
            understand what you're facing, and prepare at your own pace.
          </p>
        </div>

        {/* SoftAction */}
        <div className="flex justify-center">
          <Button variant="outline" size="lg" asChild className="text-base">
            <Link to="/tools">
              See what's here
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
