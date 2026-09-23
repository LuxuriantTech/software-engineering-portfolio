import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  build: {
    outDir: "dist/client",
  },
  optimizeDeps: {
    include: ["react", "react-dom/client"],
  },
  server: {
    host: "127.0.0.1",
    allowedHosts: ["terminal.local"],
    warmup: {
      clientFiles: ["./src/main.jsx"],
    },
  },
  plugins: [react(), {
    name: 'project-demo-indexes',
    configureServer(server) {
      const projectPaths = new Set([
        '/projects/',
        '/projects/api-contract-guard/',
        '/projects/toolcall-replay/',
        '/projects/entity-resolution-workbench/',
        '/projects/evidencedesk/',
        '/projects/postgres-migration-rehearsal/',
        '/projects/skill-studio/',
      ]);
      server.middlewares.use((request, _response, next) => {
        const path = request.url?.split('?')[0];
        if (projectPaths.has(path)) {
          request.url = request.url.replace(path, `${path}index.html`);
        }
        next();
      });
    },
  }],
});
