// Deployment URLs. `npm run dev` uses localhost; `npm run build` (Render) uses
// the live URLs. Any VITE_* env var set at build time overrides both.
const isDev = import.meta.env.DEV;

export const SERVER_URL = isDev
  ? 'http://localhost:5000'
  : 'https://bazaro-server-ecom-2026.onrender.com';

// In dev the Vite proxy forwards /api to the local server.
export const API_URL = import.meta.env.VITE_API_URL || (isDev ? '/api/v1' : `${SERVER_URL}/api/v1`);

export const ADMIN_URL =
  import.meta.env.VITE_ADMIN_URL ||
  (isDev ? 'http://localhost:5174' : 'https://bazaro-admin-ecom-2026.onrender.com');
