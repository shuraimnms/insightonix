import { createFileRoute } from "@tanstack/react-router";
import { SectionScaffold } from "@/components/super-admin/section-scaffold";
import { Building2 } from "lucide-react";
export const Route = createFileRoute("/_authenticated/super-admin/advisory-board")({ component: () => <SectionScaffold eyebrow="Governance" title="Advisory Board" description="Senior advisors steering long-term strategy." icon={Building2} linkedAdminPath="/admin/board" /> });
