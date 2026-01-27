import { BookOpen, Shield, Lock, Clock, Heart } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface TrustItemProps {
  icon: LucideIcon;
  label: string;
}

function TrustItem({ icon: Icon, label }: TrustItemProps) {
  return (
    <div className="flex items-center gap-3 px-5 py-3">
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <span className="text-sm font-medium text-foreground">{label}</span>
    </div>
  );
}

export function TrustLayer() {
  return (
    <section className="py-16 bg-gradient-warm">
      <div className="container">
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
          <TrustItem icon={BookOpen} label="Educational space" />
          <TrustItem icon={Shield} label="Built for understanding" />
          <TrustItem icon={Lock} label="Private by design" />
          <TrustItem icon={Clock} label="Your pace, your control" />
          <TrustItem icon={Heart} label="No pressure, no judgment" />
        </div>
      </div>
    </section>
  );
}
