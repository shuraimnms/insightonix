import { createFileRoute } from "@tanstack/react-router";
import { SectionScaffold } from "@/components/super-admin/section-scaffold";
import { Megaphone } from "lucide-react";
export const Route = createFileRoute("/_authenticated/super-admin/announcements")({
  component: () => (
    <SectionScaffold
      eyebrow="Communications"
      title="Announcements"
      description="Publish site-wide news items and calls."
      icon={Megaphone}
      linkedAdminPath="/admin/announcements"
    />
  ),
});
