import { serve } from "bun";
import index from "./index.html";
import path from "node:path";

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
  async fetch(req, server) {
    if (process.env.NODE_ENV === "production") {
      const url = new URL(req.url);
      const safePath = path.normalize(url.pathname).replace(/^(\.\.[\/\\])+/, "");
      const filePath = path.join(process.cwd(), "dist", safePath);
      console.log(`[DEBUG] url: ${url.pathname}, safePath: ${safePath}, resolved: ${filePath}`);
      
      // Ensure the resolved path resides within the dist/ folder to prevent path traversal
      const distDir = path.join(process.cwd(), "dist");
      if (filePath.startsWith(distDir + path.sep) || filePath === distDir) {
        const file = Bun.file(filePath);
        const exists = await file.exists();
        console.log(`[DEBUG] file exists: ${exists}`);
        if (exists) {
          return new Response(file);
        }
      }
    }
    const response = server.fetch(req);
    return response;
  },

  development: process.env.NODE_ENV !== "production" && {
    hmr: true,
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
