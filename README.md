# nandakishorer.vercel.app

Portfolio of **Nanda Kishore R**, Software Engineer (Backend): Java 17 / Spring Boot, Python / FastAPI, PostgreSQL.

The page is built as a request travelling through a backend. A fixed 3D service topology
(client → REST API → auth → services → PostgreSQL → outbox → RabbitMQ → worker) sits behind the
content, and the camera flies from node to node as you scroll: `/about`, `/experience`,
`/projects`, `/stack`, `/education`, then back to the client for `POST /contact`.

- **Case studies** for SkillBridge and Integronix at `/projects/<slug>`, with animated
  architecture diagrams and interactive figures (a broker-outage replay, the 10-node pipeline, a
  query-budget chart).
- **A real endpoint**: `curl -s https://nandakishorer.vercel.app/api/whoami`

## Stack

- Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS 4
- React Three Fiber, drei and postprocessing for the 3D topology
- Motion for scroll-linked and entrance animations; Lenis for smooth scrolling
- Components adapted from 21st.dev, Aceternity UI and Magic UI (credits below)

## Editing content

All copy lives in `src/content/`:

| File | What it holds |
|---|---|
| `profile.ts` | name, links, tagline, summary, headline stats, the `/api/whoami` payload, `open_to_work` |
| `experience.ts` | Botcode / HealthPilot.ai highlights |
| `projects.ts` | project cards and the full case-study content |
| `skills.ts` | the stack layers |
| `education.ts` | degree, achievements, certifications |

Every number on the site comes from the resume in `public/Nanda_Kishore_Resume.pdf`, or from the
project's own verified notes.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint
npm run build
```

## Credits

- Radial Orbital Timeline, by Jatin Yadav (21st.dev, MIT)
- Inversion Circle Scroll Animation, by ajith66310 (21st.dev, MIT)
- Timeline, Glowing Effect and Container Scroll, from Aceternity UI
- Terminal, Number Ticker, Border Beam, Marquee, Hyper Text and Scroll Progress, from Magic UI
- Icons: Lucide, Simple Icons

Each adapted component notes its source and the changes at the top of its file in `src/components/ui/`.
