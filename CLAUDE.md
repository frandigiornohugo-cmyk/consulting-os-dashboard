# Obsidian Dashboard — Guide for Claude Code

## What this app does

Obsidian Dashboard es el sistema operativo digital de Obsidian Systems. Centraliza la gestión de contenido, métricas, clientes, ventas, operaciones y curso en una sola app — reemplazando Airtable, Skool y cualquier otra suscripción.

---

## Who uses it

| Role | Access |
|------|--------|
| **Admin (Fran)** | Todo. Control total del sistema, todos los módulos, datos de todos los clientes. |
| **Equipo de Fran** | Limitado por área. Ven los módulos de su función dentro del negocio de Fran o de los clientes de Fran. |
| **Cliente** | Ve su propio negocio (métricas, pipeline, contenido) + módulos del programa/curso. |
| **Equipo del cliente** | Limitado por área dentro del negocio de su cliente. |

No hay vista pública. Todos los usuarios están autenticados.

---

## Tech stack

| Layer | Tech |
|-------|------|
| Frontend | React 18 + Vite 5 |
| Styling | Tailwind CSS 3 + CSS variables para branding |
| Routing | React Router 6 |
| Icons | Lucide React |
| Backend | Express 4 (Node.js, ESM) |
| Auth | Clerk (`@clerk/clerk-react`) |
| Database | Supabase (`@supabase/supabase-js`) |
| AI | Claude API (Anthropic SDK) — para Fran Virtual |
| External APIs | Instagram Graph API, Stripe, YouTube Analytics, Telegram |

---

## Brand

- **Nombre:** Obsidian Systems
- **Color primario:** Negro/slate oscuro — `--accent: 15 23 42` (slate-900)
- **Foreground:** Blanco — `--accent-foreground: 255 255 255`
- **Font:** System stack (ui-sans-serif, system-ui). Si se agrega custom: Inter o Geist.
- **Tono visual:** Limpio, oscuro, profesional. Sin emojis en la UI. Minimalista.
- **Logo:** "O" o marca Obsidian (placeholder "B" en Sidebar debe cambiar)

---

## Modules (priority order)

Estos son los 7 módulos que componen el dashboard. Se construyen en este orden:

1. **Content Calendar** — Calendario de contenido con estados (idea → draft → scheduled → published). Vista semanal/mensual. Drag & drop para mover contenido entre días.

2. **Content Metrics** — Dashboard de métricas de Instagram (reach, saves, shares, likes, comments, watch time). Comparación semanal. Semáforo (verde/amarillo/rojo). Indicador de momentum. Powered by Instagram Graph API + Content Analyzer agent.

3. **Skool + Course** — Hosting de programa/curso para clientes. Módulos, lecciones (video + texto), progreso por cliente. Reemplaza Skool. Accesible por rol Cliente.

4. **Operations** — Checklists de implementación, procesos documentados (SOPs), estados por cliente. Vista tipo kanban o lista con progreso %.

5. **Revenue** — Métricas de facturación. Stripe integration. MRR, churn, LTV, revenue por cliente. Gráficos de tendencia.

6. **CRM** — Pipeline de ventas (leads → qualified → call → closed/lost). Directorio de miembros/clientes con detalle. Engagement tracking.

7. **Fran Virtual** — Chat de consultor integrado (estilo digitalcoffee.ai). Motor Claude API con `agents/consultant.md` como system prompt. Lee `context/knowledge/` y `context/output/` como base de conocimiento. Aprende de cada conversación (guarda historial, preferencias, contexto).

8. **Estudio de Miniaturas** — Wizard para miniaturas de YouTube ultra realistas (marca personal, B2B, infoproductos, e-commerce): referencia → análisis visual editable → fotos → texto/colores → generación y ajustes por versión. Motor OpenAI (`OPENAI_API_KEY`; análisis con `OPENAI_VISION_MODEL`, generación con `OPENAI_IMAGE_MODEL` en calidad alta e `input_fidelity: high`). Base de conocimiento (packaging del SOP + metodología) en `estudio-miniaturas/conocimiento/`, compartida con el proyecto aparte de Claude Code `estudio-miniaturas/`. Página `src/pages/Thumbnails.jsx`, API `server/routes/thumbnails.js`, prompts en `server/lib/thumbnail-prompt.js`.

---

## File structure

```
.
├── CLAUDE.md                # ← you are here
├── package.json             # One manifest runs frontend + server
├── .env                     # Keys (never commit)
├── .env.example             # Template
├── vite.config.js           # Vite + proxy /api → Express
├── tailwind.config.js       # Tailwind + accent color token
├── index.html               # HTML shell
├── src/                     # React frontend
│   ├── main.jsx             # React entry (ClerkProvider)
│   ├── App.jsx              # Routes (protected by Clerk)
│   ├── index.css            # Tailwind directives + brand tokens
│   ├── lib/
│   │   └── supabase.js      # Supabase client
│   ├── components/          # Layout, Sidebar, Header, reusable UI
│   └── pages/               # One file per module/page
└── server/                  # Express API
    ├── index.js             # App + middleware + route mounts
    └── routes/              # One file per API domain
```

---

## Conventions

- **Components:** PascalCase, `.jsx` extension. One component per file.
- **Pages:** PascalCase, in `src/pages/`. Each page is a route target.
- **Routes (API):** kebab-case files in `server/routes/`. Mounted at `/api/<resource>`.
- **State:** Local state with `useState`/`useEffect`. No Redux. Fetch data from API routes.
- **Styling:** Tailwind utility classes. No inline styles. Use `accent` color token for brand elements.
- **Imports:** Named exports for components. Default export for pages.
- **No TypeScript.** Plain JSX.
- **No comments** unless the WHY is non-obvious.

---

## Rules

1. **Español argentino** en toda comunicación con el usuario. Directo, sin fluff.
2. **Incremental.** Cambios chicos. Después de cada cambio, indicar cómo verificar.
3. **Mobile-first responsive.** Sidebar collapsa en mobile. Cards se stackean.
4. **Role-based access.** Cada módulo debe respetar los 4 roles. Clerk maneja auth, Supabase RLS maneja permisos por row.
5. **API-first.** Los datos siempre pasan por `/api/` routes. El frontend nunca habla directo a Supabase.
6. **No inventar datos.** Si no hay data real, mostrar empty state con CTA para conectar la fuente.
7. **No emojis en la UI.** El dashboard es profesional y limpio.
8. **Preservar TODO markers** hasta que el feature esté completamente implementado.

---

## Commands

| Command | What it does |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm run dev` | Run Vite (frontend :5173) and Express (API :3001) together |
| `npm run build` | Build frontend to `dist/` |
| `npm start` | Run Express in production (serves `dist/`) |

---

## Working style

- Keep changes small — the user may not read diffs.
- After any meaningful change, suggest `npm run dev` and explain exactly what to click or curl to verify.
- When building a new module, follow this pattern:
  1. Create page component in `src/pages/`
  2. Add nav item to `Sidebar.jsx` (pick icon from lucide.dev/icons)
  3. Add route to `App.jsx`
  4. Create API route in `server/routes/`
  5. Mount route in `server/index.js`
  6. Wire frontend to fetch from API
  7. Test with `npm run dev`
