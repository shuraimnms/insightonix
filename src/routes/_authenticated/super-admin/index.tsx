import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/super-admin/")({
  beforeLoad: () => { throw redirect({ to: "/super-admin/dashboard" }); },
});
