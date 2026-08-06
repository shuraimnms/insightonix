import { createFileRoute } from "@tanstack/react-router";
import { SectionScaffold } from "@/components/super-admin/section-scaffold";
import { ClipboardList } from "lucide-react";
export const Route = createFileRoute("/_authenticated/super-admin/editorial-board")({
  component: () => (
    <SectionScaffold
      eyebrow="Governance"
      title="Editorial Board"
      description="Editors guiding scholarly standards for each journal."
      icon={ClipboardList}
      linkedAdminPath="/admin/board"
    />
  ),
});
