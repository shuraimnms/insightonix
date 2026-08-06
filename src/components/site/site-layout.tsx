import type { ReactNode } from "react";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { MaintenanceBanner } from "./maintenance-banner";
import { FloatingSocial } from "./floating-social";
import { Toaster } from "sonner";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <MaintenanceBanner />
      <SiteHeader />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter />
      <FloatingSocial />
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
}
