import { createFileRoute } from "@tanstack/react-router";
import { SectionScaffold } from "@/components/super-admin/section-scaffold";
import { TrendingUp } from "lucide-react";
export const Route = createFileRoute("/_authenticated/super-admin/impact-factors")({ component: () => <SectionScaffold eyebrow="Metrics" title="Impact Factors" description="Annual impact factor, h-index, and citation counts." icon={TrendingUp} linkedAdminPath="/admin/impact-factor" /> });
