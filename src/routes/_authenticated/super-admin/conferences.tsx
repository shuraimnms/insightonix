import { createFileRoute } from "@tanstack/react-router";
import { SectionScaffold } from "@/components/super-admin/section-scaffold";
import { Mic2 } from "lucide-react";
export const Route = createFileRoute("/_authenticated/super-admin/conferences")({
  component: () => (
    <SectionScaffold
      eyebrow="Events"
      title="Conferences"
      description="Upcoming and past conferences, proceedings, and calls."
      icon={Mic2}
      linkedAdminPath="/admin/conferences"
    />
  ),
});
