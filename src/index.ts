import { serve } from "bun";
import index from "./index.html";

// TODO(security): Add authentication if admin/drafts functionality is introduced.
// TODO(security): Consider OAuth provider for any future login flows.
// TODO(security): Enable MFA if user accounts are added.

const server = serve({
  routes: {
    // Serve the SPA shell for all unmatched routes (client-side routing).
    "/*": index,
  },

  // Security headers for every response
  // NOTE: CSP allows fonts.googleapis.com / fonts.gstatic.com for Crimson Text.
  // script-src is 'self' only — no inline scripts or unsafe-eval.
  fetch(req, server) {
    const response = server.fetch(req);
    return response;
  },

  development: process.env.NODE_ENV !== "production" && {
    hmr: true,
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
