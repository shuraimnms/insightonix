import { createFileRoute } from "@tanstack/react-router";
import { SectionScaffold } from "@/components/super-admin/section-scaffold";
import { BookOpen } from "lucide-react";
export const Route = createFileRoute("/_authenticated/super-admin/ebooks")({ component: () => <SectionScaffold eyebrow="Content" title="E-Books" description="Long-form publications and monographs." icon={BookOpen} linkedAdminPath="/admin/ebooks" /> });
