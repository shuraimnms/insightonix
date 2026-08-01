import { createFileRoute } from "@tanstack/react-router";
import { SectionScaffold } from "@/components/super-admin/section-scaffold";
import { Award } from "lucide-react";
export const Route = createFileRoute("/_authenticated/super-admin/certificates")({ component: () => <SectionScaffold eyebrow="Recognition" title="Certificates" description="Issue and verify publication, conference, and reviewer certificates." icon={Award} linkedAdminPath="/admin/certificates" /> });
