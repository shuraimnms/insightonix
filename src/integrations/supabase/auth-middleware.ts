import { createMiddleware } from "@tanstack/react-start";
export const requireSupabaseAuth = createMiddleware().server(async ({ next }) => {
  // Authentication handled in components, this is a shim
  return await next();
});
