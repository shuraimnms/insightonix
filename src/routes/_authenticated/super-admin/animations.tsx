import { createFileRoute } from "@tanstack/react-router";
import { SectionScaffold } from "@/components/super-admin/section-scaffold";
import { Sparkles } from "lucide-react";
export const Route = createFileRoute("/_authenticated/super-admin/animations")({ component: () => <SectionScaffold eyebrow="Presentation" title="Animation Settings" description="Toggle homepage motion, hero animations, and micro-interactions." icon={Sparkles} /> });
