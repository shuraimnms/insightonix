import { createFileRoute } from "@tanstack/react-router";
import { SectionScaffold } from "@/components/super-admin/section-scaffold";
import { Settings } from "lucide-react";
export const Route = createFileRoute("/_authenticated/super-admin/settings")({ component: () => <SectionScaffold eyebrow="System" title="Settings" description="Global platform settings and per-site overrides." icon={Settings} linkedAdminPath="/admin/settings" /> });
