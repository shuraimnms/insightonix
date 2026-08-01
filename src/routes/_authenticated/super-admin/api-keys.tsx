import { createFileRoute } from "@tanstack/react-router";
import { SectionScaffold } from "@/components/super-admin/section-scaffold";
import { KeyRound } from "lucide-react";
export const Route = createFileRoute("/_authenticated/super-admin/api-keys")({ component: () => <SectionScaffold eyebrow="Integrations" title="API Keys" description="Third-party provider keys (Crossref, indexing partners, mail)." icon={KeyRound} /> });
