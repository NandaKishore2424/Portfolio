// Projects and their case studies. Home-page copy follows the resume;
// case-study copy uses only the high-confidence claims from the project notes.

export type ProjectSlug = "skillbridge" | "integronix";

export type Stat = { value: number; label: string; prefix?: string; suffix?: string };

export type Project = {
  slug: ProjectSlug;
  name: string;
  tagline: string;
  summary: string;
  repo: string;
  accent: "amber" | "violet";
  stack: string[];
  stats: Stat[];
  bullets: string[];
};

export const projects: Project[] = [
  {
    slug: "skillbridge",
    name: "SkillBridge",
    tagline: "Multi-tenant training-management API",
    summary:
      "Colleges run placement-training batches for admins, trainers and students, with every college isolated inside one shared schema. Profile changes flow through an event pipeline to a Python analysis worker.",
    repo: "https://github.com/NandaKishore2424/SkillBridgeV2",
    accent: "amber",
    stack: [
      "Java 17",
      "Spring Boot 3.5",
      "Spring Security",
      "JPA / Hibernate",
      "PostgreSQL",
      "RabbitMQ",
      "Testcontainers",
    ],
    stats: [
      { value: 20, label: "REST controllers" },
      { value: 122, label: "endpoints" },
      { value: 26, label: "JPA entities" },
      { value: 113, label: "@PreAuthorize rules" },
    ],
    bullets: [
      "Four-role access control through 113 method-level @PreAuthorize rules, plus shared-schema tenant isolation enforced by a Hibernate filter and a 404-not-403 ownership guard.",
      "Transactional outbox to RabbitMQ: a SKIP LOCKED lease-based relay, publisher confirms, quorum queues with tiered retries, and a dead-letter store with audited replay.",
      "Verified by killing a real broker: all 601 events written before, during and after a five-minute outage were delivered, and none went to the dead-letter store.",
      "Eliminated three N+1 query patterns, with a regression test that fails if a read path's SQL statement count grows with data size.",
    ],
  },
  {
    slug: "integronix",
    name: "Integronix",
    tagline: "Agentic revenue-audit pipeline for medical coding",
    summary:
      "Turns unstructured clinical notes into ICD-10-CM and CPT billing suggestions for a person to review. The LLM is confined to one extraction step, and deterministic code makes every billing decision.",
    repo: "https://github.com/NandaKishore2424/integronix",
    accent: "violet",
    stack: ["Python", "FastAPI", "PostgreSQL", "LangGraph", "pgvector", "Docker", "AWS EC2"],
    stats: [
      { value: 10, label: "pipeline nodes" },
      { value: 1, label: "LLM call, confined" },
      { value: 1025, label: "lines of decision engine" },
      { value: 359, label: "automated tests" },
    ],
    bullets: [
      "Deterministic decision engine (41% of the pipeline's code) that scores candidate codes on confidence, documentation-earned specificity, clinical consistency and a negation penalty.",
      "Fixed an algorithmic-upcoding defect: specificity used to scale with raw code length, so a longer, rarer code could outrank a better-documented one. Regression tests cover both directions.",
      "Replaced a check-then-update race in claim adjudication with one PostgreSQL function using an optimistic lock. When two approvals race on one claim, one succeeds and the other gets 409 Conflict.",
      "Money is Decimal, quantized to the cent. If the audit-log write fails, a compensating delete removes the claim so no unaudited claim is left behind.",
    ],
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

/* ------------------------------------------------------------------ */
/* Case studies                                                        */
/* ------------------------------------------------------------------ */

export type ArchNode = {
  id: string;
  label: string;
  detail: string;
  x: number; // 0–100, diagram space
  y: number; // 0–100
  tone: "neutral" | "teal" | "amber" | "violet" | "blue" | "rose";
};

export type ArchEdge = {
  from: string;
  to: string;
  label?: string;
  dashed?: boolean;
};

export type CaseSection = {
  id: string;
  kicker: string;
  title: string;
  body: string[];
  points?: string[];
  figure?: string;
};

export type CaseStudy = {
  slug: ProjectSlug;
  headline: string;
  intro: string[];
  facts: { label: string; value: string }[];
  architecture: { nodes: ArchNode[]; edges: ArchEdge[]; caption: string };
  sections: CaseSection[];
};

export const caseStudies: Record<ProjectSlug, CaseStudy> = {
  skillbridge: {
    slug: "skillbridge",
    headline: "A multi-tenant Spring Boot API with an event pipeline built to survive a broker outage.",
    intro: [
      "SkillBridge is a training-management platform for colleges. Each college is a tenant. Its admins create training batches, attach trainers and companies, and onboard students; trainers publish a three-level syllabus and grade topic progress.",
      "When a student's skills or profile change, the API publishes an event. A Python worker consumes it and runs a prototype skill-gap analysis against 1,500 job descriptions stored as vector embeddings. Most of the engineering sits between those two points: tenancy, authorization, messaging and the data layer.",
    ],
    facts: [
      { label: "Role", value: "Design & implementation" },
      { label: "API", value: "Java 17 · Spring Boot 3.5" },
      { label: "Data", value: "PostgreSQL · pgvector · pg_trgm" },
      { label: "Messaging", value: "RabbitMQ · Python consumer" },
    ],
    architecture: {
      caption:
        "The React app talks to one Spring Boot API. A business write and its outbox row commit together, and a relay publishes the event to RabbitMQ afterwards.",
      nodes: [
        { id: "web", label: "React web app", detail: "React 19 · TypeScript · Vite", x: 8, y: 50, tone: "neutral" },
        { id: "api", label: "Spring Boot API", detail: "Spring Security · JWT · 122 endpoints", x: 32, y: 50, tone: "teal" },
        { id: "db", label: "PostgreSQL", detail: "shared schema · college_id", x: 32, y: 88, tone: "blue" },
        { id: "relay", label: "Outbox relay", detail: "FOR UPDATE SKIP LOCKED · confirms", x: 56, y: 50, tone: "teal" },
        { id: "mq", label: "RabbitMQ", detail: "quorum queues · 5 s / 30 s / 5 min", x: 78, y: 50, tone: "amber" },
        { id: "dlq", label: "Dead-letter store", detail: "audited replay", x: 78, y: 12, tone: "rose" },
        { id: "worker", label: "Python worker", detail: "idempotent consumer", x: 94, y: 88, tone: "violet" },
      ],
      edges: [
        { from: "web", to: "api", label: "HTTPS + JWT" },
        { from: "api", to: "db", label: "JPA · one transaction" },
        { from: "db", to: "relay", label: "outbox rows", dashed: true },
        { from: "relay", to: "mq", label: "confirms" },
        { from: "mq", to: "dlq", label: "exhausted retries", dashed: true },
        { from: "mq", to: "worker", label: "deliver" },
      ],
    },
    sections: [
      {
        id: "request",
        kicker: "01 · Request path",
        title: "One request, end to end",
        body: [
          "A read such as GET /api/v1/student/batches crosses a short, fixed set of layers. The tenant comes from the signed token rather than anything the caller sends, and the query cost stays the same whether the tenant is small or large.",
        ],
        figure: "request-flow",
      },
      {
        id: "tenancy",
        kicker: "02 · Multi-tenancy",
        title: "Tenant isolation in a shared schema",
        body: [
          "Every tenant's rows live in the same tables, distinguished by a college_id column. The college is read from a claim in the server-signed JWT, not from a header, subdomain or path segment, so a caller cannot choose their tenant.",
          "Isolation is layered. List queries name their college explicitly. A Hibernate filter catches JPQL and Criteria queries that forget to. Load-by-id goes through an ownership guard, because Hibernate filters don't apply to loads by primary key.",
        ],
        points: [
          "The filter is enabled by an AOP aspect ordered inside the transaction advisor (order 200 vs 100). With open-in-view disabled, each transaction opens its own session, so the filter has to be enabled on that session.",
          "The ownership guard answers 404, not 403, so a probe can't tell a record in another college from one that doesn't exist.",
        ],
        figure: "tenant-layers",
      },
      {
        id: "rbac",
        kicker: "03 · Authorization",
        title: "Four roles, enforced per method",
        body: [
          "System admins manage colleges. College admins run their own college. Trainers own syllabus and grading. Students manage their own profile and enrollments. 113 method-level @PreAuthorize rules across 20 controllers and 122 endpoints enforce those boundaries.",
        ],
        figure: "roles",
      },
      {
        id: "outbox",
        kicker: "04 · Messaging",
        title: "A transactional outbox that survives the broker going away",
        body: [
          "A business transaction writes its event to an outbox table in the same commit, so an event can't be published for a rollback or lost after a commit. A relay claims rows with FOR UPDATE SKIP LOCKED, publishes outside any transaction, and waits for publisher confirms.",
          "A broker outage doesn't count against an event's retries. The relay pauses, backing off from 1 s to 30 s. Delivery failures move through quorum-queue retry tiers of 5 s, 30 s and 5 min, then into a dead-letter store that a system admin can replay, with the replay audited.",
        ],
        points: [
          "Verified against a real broker: it was killed for five minutes while events kept being written.",
          "All 601 events written before, during and after the outage were delivered. None were marked dead.",
        ],
        figure: "outbox-sim",
      },
      {
        id: "consumer",
        kicker: "05 · Consumer",
        title: "An idempotent, shutdown-safe consumer",
        body: [
          "RabbitMQ delivers at least once, so the Python consumer deduplicates on event_id using a PostgreSQL claim table with a lease and a fencing token. It also shuts down gracefully: a delivery already in flight when SIGTERM arrives still finishes and is acknowledged.",
        ],
        points: [
          "60-second broker kill: exactly one message was redelivered, and deduplication on event_id caught it.",
          "SIGTERM with a delivery in flight: the work completed and the message was acknowledged.",
        ],
        figure: "dedup",
      },
      {
        id: "queries",
        kicker: "06 · Data layer",
        title: "Query budgets that fail the build",
        body: [
          "A test helper counts the SQL statements Hibernate prepares. The query-efficiency suite runs each read path against a small tenant and a large one, and fails if the count grows with data size. Three N+1 patterns were removed this way, using page-level bulk loads and a grouped count.",
        ],
        figure: "query-budget",
      },
      {
        id: "schema",
        kicker: "07 · Testing",
        title: "A schema you can test against",
        body: [
          "The full PostgreSQL schema was rebuilt from pg_catalog into a version-controlled baseline and checked against production with a catalog fingerprint. Integration tests run on that baseline in disposable Testcontainers instead of a shared database.",
        ],
        figure: "schema",
      },
    ],
  },

  integronix: {
    slug: "integronix",
    headline: "A LangGraph pipeline where deterministic code, not the LLM, makes the billing decision.",
    intro: [
      "A discharge summary is prose, and nobody gets paid for prose. To bill an insurer, a hospital has to translate it into ICD-10-CM diagnosis codes and CPT/HCPCS procedure codes. Undercoding leaves earned revenue behind; overcoding is fraud. The target is a coding guideline: code to the highest specificity the documentation supports, and no further.",
      "Integronix takes a clinical note (pasted text or a PDF, with an OCR fallback) and returns a suggestion: selected codes with roles and rationale, a risk label and a FHIR resource. A person reviews it and decides whether to submit a claim, which then moves through payer adjudication.",
    ],
    facts: [
      { label: "Role", value: "Backend design & implementation" },
      { label: "API", value: "Python · FastAPI" },
      { label: "Pipeline", value: "LangGraph · 10 nodes" },
      { label: "Data", value: "PostgreSQL · pgvector" },
    ],
    architecture: {
      caption:
        "Two portals share one FastAPI backend. The pipeline makes exactly one LLM call; everything after it is plain Python backed by Postgres and pgvector.",
      nodes: [
        { id: "hospital", label: "Hospital portal", detail: "code notes · submit claims", x: 8, y: 30, tone: "neutral" },
        { id: "payer", label: "Payer portal", detail: "review · adjudicate", x: 8, y: 74, tone: "neutral" },
        { id: "api", label: "FastAPI", detail: "27 authenticated endpoints", x: 32, y: 52, tone: "teal" },
        { id: "graph", label: "LangGraph pipeline", detail: "10 nodes · 1 LLM call", x: 58, y: 30, tone: "violet" },
        { id: "llm", label: "LLM (extraction only)", detail: "structured output, no code field", x: 86, y: 12, tone: "rose" },
        { id: "who", label: "WHO ICD-11 API", detail: "authoritative candidates", x: 86, y: 44, tone: "neutral" },
        { id: "pg", label: "PostgreSQL + pgvector", detail: "claims · audit · embeddings", x: 58, y: 80, tone: "blue" },
        { id: "export", label: "FHIR R4 · X12", detail: "Claim · 837P · 835", x: 86, y: 80, tone: "amber" },
      ],
      edges: [
        { from: "hospital", to: "api", label: "JWT" },
        { from: "payer", to: "api", label: "JWT" },
        { from: "api", to: "graph", label: "/code/run" },
        { from: "graph", to: "llm", label: "node 2 only", dashed: true },
        { from: "graph", to: "who", label: "node 4" },
        { from: "graph", to: "pg", label: "vectors · results" },
        { from: "api", to: "pg", label: "claims · RPC" },
        { from: "pg", to: "export", label: "export" },
      ],
    },
    sections: [
      {
        id: "pipeline",
        kicker: "01 · Orchestration",
        title: "Ten nodes, one LLM call",
        body: [
          "The pipeline is a LangGraph state machine over one typed, 34-field state. Nine plain edges and one data-driven branch connect the nodes: vector search is skipped whenever an earlier deterministic step already produced candidates.",
          "Only the extraction node calls a model, and its output schema has no field that could hold an ICD or CPT code. The model isn't just told not to make a billing decision; the schema gives it nowhere to put one.",
        ],
        figure: "pipeline",
      },
      {
        id: "decision",
        kicker: "02 · Decision engine",
        title: "Scoring that has to earn its specificity",
        body: [
          "The decision engine is 1,025 lines, 41% of the pipeline's code, and has no LLM dependency. It scores every candidate with a weighted composite and applies ICD-10-CM 'with'-convention rules.",
          "It also had a real upcoding defect. Specificity scaled with raw code length, so a longer, rarer code could outrank a shorter, well-supported one regardless of what the chart said. Specificity now scales with how much of a code's distinguishing vocabulary actually appears in the note. Regression tests pin both directions, so a rare variant still wins when the documentation supports it.",
        ],
        figure: "scoring",
      },
      {
        id: "retrieval",
        kicker: "03 · Retrieval",
        title: "Vector search as an enforced fallback",
        body: [
          "pgvector cosine similarity, with IVFFlat and HNSW indexes, runs over the billable ICD-10-CM code set and a 23-code CPT/HCPCS catalogue. For diagnoses it's the last resort. The graph's routing function only calls it after the WHO ICD-11 API and the SNOMED crosswalk have both come back empty, so the order is enforced in code, not just in documentation.",
        ],
        figure: "fallback",
      },
      {
        id: "claims",
        kicker: "04 · Money path",
        title: "Adjudication that can't double-approve",
        body: [
          "Adjudication used to fetch a claim's status in Python and then update it, so two concurrent approvals could both pass the check. It is now one PostgreSQL function guarded by an optimistic lock.",
          "Amounts are Decimal, quantized to the cent, so billed, allowed, paid and patient-responsibility figures reconcile exactly. The audit-log write is mandatory: if it fails, a compensating delete removes the claim.",
        ],
        points: ["Two concurrent approvals raced against one claim: one 200 OK and one 409 Conflict."],
        figure: "race",
      },
      {
        id: "tenancy",
        kicker: "05 · Multi-tenancy",
        title: "The organization comes from the token, never the request",
        body: [
          "All 27 authenticated /api/v1 endpoints resolve the caller's organization from their verified Supabase JWT, through a database lookup keyed on the token's subject. A request that names a different organization gets 403. The portal redirects are a convenience; the server is the security boundary.",
        ],
        figure: "tenancy",
      },
      {
        id: "standards",
        kicker: "06 · Healthcare standards",
        title: "FHIR R4 and X12, verified by execution",
        body: [
          "The system generates HL7 FHIR R4 Claim resources and ANSI X12 837P and 835 segments, each built against its own implementation-guide version (005010X222A1 and 005010X221A1). The coding-system URI follows whichever path resolved the code. Money is formatted to two decimals, and missing optional fields are left out instead of filled with placeholders.",
          "Exports sit behind authenticated, tenant-checked claim endpoints, and the hospital UI can download them.",
        ],
        figure: "coverage",
      },
      {
        id: "failclosed",
        kicker: "07 · Failure contract",
        title: "Fail closed, never plausibly wrong",
        body: [
          "One decorator wraps all ten nodes. Previously, a crashing node let the remaining nodes run on half-built state, and the endpoint could return 200 with a confident, meaningless result. Now any node failure short-circuits everything after it, and the caller gets a 500 or 502 naming the failed stage and a reference ID.",
        ],
        figure: "short-circuit",
      },
      {
        id: "tests",
        kicker: "08 · Testing & operations",
        title: "Tests that catch what mocks can't",
        body: [
          "359 tests: 323 hermetic tests against a fake data layer with zero network calls, plus 36 integration tests against live services. A schema-contract test opens a real Postgres connection and checks foreign keys, CHECK constraints, and every table and RPC name the backend references.",
          "That test exists because of a real bug. Audit rows referenced public.users while the foreign key pointed at auth.users. Every mocked test passed, and Postgres rejected the first real submission.",
        ],
        points: [
          "Heavy imports, graph compilation and index warm-up happen in the FastAPI startup lifespan, not on the first request.",
          "Liveness and readiness are separate checks, so a database blip removes the service from traffic instead of causing a restart loop.",
          "Multi-stage Docker image: CPU-only PyTorch, a non-root user, and the embedding model baked in. On every push, CI boots the real image and checks liveness, readiness and 401s.",
        ],
        figure: "tests",
      },
    ],
  },
};
