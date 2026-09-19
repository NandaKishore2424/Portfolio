// Single source of truth for personal details. Everything here mirrors the
// current resume (public/Nanda_Kishore_Resume.pdf).

export const profile = {
  name: "Nanda Kishore R",
  firstName: "Nanda Kishore",
  initials: "NK",
  role: "Software Engineer — Backend",
  specialty: "Java / Spring Boot",
  location: "Chennai, India",
  email: "r.nandakishore24@gmail.com",
  phone: "+91 93442 48604",
  phoneHref: "tel:+919344248604",
  siteUrl: "https://nandakishorer.vercel.app",
  resume: "/Nanda_Kishore_Resume.pdf",
  photo: "/images/profile.jpg",
  github: "https://github.com/NandaKishore2424",
  githubHandle: "NandaKishore2424",
  linkedin: "https://www.linkedin.com/in/nanda-kishore-7290551b8/",
  tagline:
    "I design APIs and data layers for multi-tenant systems, and make sure they stay correct when two requests arrive at the same time.",
  summary:
    "Software engineer with one year of full-time onsite experience on a multi-tenant healthcare platform, working across REST APIs and the PostgreSQL data layer: concurrency control, row-level authorization and transactional integrity. I build backend services in Java 17 / Spring Boot and Python / FastAPI.",
  whoami: {
    name: "Nanda Kishore R",
    role: "Software Engineer, Backend",
    stack: ["Java 17", "Spring Boot", "PostgreSQL", "Python / FastAPI"],
    focus: ["concurrency", "multi-tenancy", "transactions"],
    location: "Chennai, IN",
    open_to_work: true,
  },
  stats: [
    { value: 650, prefix: "~", label: "commits in 12 months" },
    { value: 138, label: "automated test cases" },
    { value: 7, label: "architecture decision records" },
    { value: 12, label: "months full-time, onsite" },
  ],
} as const;

/**
 * The page is a request travelling through a backend. Each section is one
 * hop; `node` names the 3D topology node the camera flies to.
 */
export const journey = [
  { id: "top", node: "client", method: "GET", path: "/whoami", label: "Hello" },
  { id: "about", node: "gateway", method: "GET", path: "/about", label: "About" },
  { id: "experience", node: "service", method: "GET", path: "/experience", label: "Experience" },
  { id: "projects", node: "broker", method: "GET", path: "/projects", label: "Projects" },
  { id: "stack", node: "postgres", method: "GET", path: "/stack", label: "Stack" },
  { id: "education", node: "worker", method: "GET", path: "/education", label: "Education" },
  { id: "contact", node: "client", method: "POST", path: "/contact", label: "Contact" },
] as const;

export type JourneyStop = (typeof journey)[number];
export type NodeId = JourneyStop["node"] | "auth" | "outbox" | "vector";
