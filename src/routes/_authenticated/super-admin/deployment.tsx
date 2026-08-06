import { createFileRoute } from "@tanstack/react-router";
import { SectionScaffold } from "@/components/super-admin/section-scaffold";
import { Rocket } from "lucide-react";
export const Route = createFileRoute("/_authenticated/super-admin/deployment")({
  component: () => (
    <SectionScaffold
      eyebrow="Operations"
      title="Deployment"
      description="Build status, release notes, and maintenance mode toggles."
      icon={Rocket}
      linkedAdminPath="/admin/maintenance"
      linkedAdminLabel="Toggle maintenance mode in /admin/maintenance"
    />
  ),
});
