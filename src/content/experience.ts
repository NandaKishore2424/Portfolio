// Botcode / HealthPilot.ai. This is private company code, so copy stays at
// resume level: no internal names, file paths or unpublished numbers.

export type Highlight = {
  id: string;
  kicker: string;
  title: string;
  body: string;
  visual: "tenants" | "race" | "checks" | "diff";
  metric?: { value: string; label: string };
  checks?: string[];
  diff?: { value: number; label: string }[];
};

export const experience = {
  company: "Botcode",
  product: "HealthPilot.ai",
  role: "Software Developer Intern",
  employment: "Full-time · 12 months · Onsite",
  period: "Aug 2025 – Aug 2026",
  location: "Chennai",
  context:
    "A multi-tenant clinic platform that serves multiple hospitals from one PostgreSQL schema.",
  stack: [
    "PostgreSQL",
    "Row-level security",
    "Stored procedures",
    "REST APIs",
    "TypeScript",
    "Supabase",
  ],
  highlights: [
    {
      id: "platform",
      kicker: "Core modules",
      title: "Built core modules of a multi-tenant clinic platform",
      body: "Role-based access control, scheduling, clinical charting and billing for hospitals that share one PostgreSQL schema. I'm the largest contributor to its prescription-pad module.",
      visual: "tenants",
      metric: { value: "56%", label: "of the prescription-pad module's current code" },
    },
    {
      id: "race",
      kicker: "Concurrency",
      title: "Closed a duplicate-record race in clinical chart saves",
      body: "Moved the invariant into PostgreSQL: a partial unique index plus an ON CONFLICT upsert inside one stored procedure. An idempotent backfill let the constraint go onto tenants that already held duplicates.",
      visual: "race",
    },
    {
      id: "hardening",
      kicker: "Authorization",
      title: "Hardened an AI clinical-recommendations feature before release",
      body: "Closed the authorization gaps before launch and replaced a read-modify-write settings update with an atomic stored procedure.",
      visual: "checks",
      checks: [
        "Row-level-security policy now verifies patient ownership",
        "Reads scoped to the authoring clinician",
        "Organization and role checks enforced on writes",
        "Settings update made atomic in one stored procedure",
      ],
      metric: { value: "40", label: "new tests, including a concurrency regression" },
    },
    {
      id: "retire",
      kicker: "Simplification",
      title: "Retired a legacy workflow engine",
      body: "Dropped the engine's tables and functions in one transactional migration, and documented 150 defects and the safe-deletion rules in an architecture decision record.",
      visual: "diff",
      diff: [
        { value: 116, label: "files" },
        { value: 45, label: "API routes" },
        { value: 9, label: "tables" },
        { value: 9, label: "functions" },
      ],
    },
  ] satisfies Highlight[],
};
