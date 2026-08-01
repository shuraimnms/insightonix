import { createFileRoute } from "@tanstack/react-router";
import { SectionScaffold } from "@/components/super-admin/section-scaffold";
import { UserSquare2 } from "lucide-react";
export const Route = createFileRoute("/_authenticated/super-admin/team-members")({ component: () => <SectionScaffold eyebrow="People" title="Team Members" description="Staff working across all journals." icon={UserSquare2} linkedAdminPath="/admin/team" /> });
