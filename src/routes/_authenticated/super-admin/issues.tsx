import { createFileRoute } from "@tanstack/react-router";
import { SectionScaffold } from "@/components/super-admin/section-scaffold";
import { Layers } from "lucide-react";
export const Route = createFileRoute("/_authenticated/super-admin/issues")({ component: () => <SectionScaffold eyebrow="Content" title="Issues & Archives" description="Volumes and issues across every journal." icon={Layers} linkedAdminPath="/admin/issues" /> });
