import { createFileRoute } from "@tanstack/react-router";
import { SectionScaffold } from "@/components/super-admin/section-scaffold";
import { Eye } from "lucide-react";
export const Route = createFileRoute("/_authenticated/super-admin/reviewer-board")({
  component: () => (
    <SectionScaffold
      eyebrow="Governance"
      title="Reviewer Board"
      description="Vetted peer reviewers available for assignment."
      icon={Eye}
      linkedAdminPath="/admin/board"
    />
  ),
});
