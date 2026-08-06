import { createFileRoute } from "@tanstack/react-router";
import { SectionScaffold } from "@/components/super-admin/section-scaffold";
import { DollarSign } from "lucide-react";
export const Route = createFileRoute("/_authenticated/super-admin/fees")({
  component: () => (
    <SectionScaffold
      eyebrow="Finance"
      title="Fees & APC"
      description="Article processing charges and fee waiver policies."
      icon={DollarSign}
      linkedAdminPath="/admin/settings"
      linkedAdminLabel="Edit fees JSON in /admin/settings"
    />
  ),
});
