import { createFileRoute } from "@tanstack/react-router";
import { SectionScaffold } from "@/components/super-admin/section-scaffold";
import { Crown } from "lucide-react";
export const Route = createFileRoute("/_authenticated/super-admin/chief-patrons")({
  component: () => (
    <SectionScaffold
      eyebrow="Governance"
      title="Chief Patrons"
      description="Honorary patrons supporting the journal."
      icon={Crown}
    />
  ),
});
