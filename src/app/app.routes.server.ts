import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }, {
    path: 'revista/:id',
    renderMode: RenderMode.Server // <-- Esto le dice a Vercel: "No intentes crear esta página al compilar, créala cuando el usuario entre"
  },
];
