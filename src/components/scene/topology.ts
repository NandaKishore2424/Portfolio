import type { NodeId } from "@/content/profile";

export type Vec3 = [number, number, number];

export type NodeKind =
  | "client"
  | "gateway"
  | "auth"
  | "service"
  | "database"
  | "outbox"
  | "broker"
  | "worker"
  | "vector";

export type TopologyNode = {
  id: NodeId;
  kind: NodeKind;
  label: string;
  sub: string;
  color: string;
  position: Vec3;
  /** Section to scroll to when the node is clicked. */
  section?: string;
  /** Hide the label in the hero, where the node sits behind the headline. */
  quietInHero?: boolean;
};

export const palette = {
  neutral: "#dfe7f1",
  teal: "#5eead4",
  green: "#4ade80",
  blue: "#60a5fa",
  amber: "#fbbf24",
  violet: "#a78bfa",
  rose: "#fb7185",
} as const;

export const nodes: TopologyNode[] = [
  { id: "client", kind: "client", label: "Client", sub: "every request starts here", color: palette.neutral, position: [-8.4, 0.5, 1.6], section: "contact", quietInHero: true },
  { id: "gateway", kind: "gateway", label: "REST API", sub: "Spring Boot · FastAPI", color: palette.teal, position: [-5.0, 0.9, 0.3], section: "about", quietInHero: true },
  { id: "auth", kind: "auth", label: "Auth", sub: "JWT · RBAC · row-level security", color: palette.green, position: [-2.5, 2.8, -1.1] },
  { id: "service", kind: "service", label: "Services", sub: "transactions · domain logic", color: palette.teal, position: [-0.5, 0.7, 0.2], section: "experience" },
  { id: "postgres", kind: "database", label: "PostgreSQL", sub: "indexes · constraints · procedures", color: palette.blue, position: [0.5, -2.5, 1.3], section: "stack" },
  { id: "outbox", kind: "outbox", label: "Outbox relay", sub: "SKIP LOCKED · publisher confirms", color: palette.amber, position: [2.8, 0.1, -1.7] },
  { id: "broker", kind: "broker", label: "RabbitMQ", sub: "quorum queues · retries · DLQ", color: palette.amber, position: [5.5, 1.4, -0.5], section: "projects" },
  { id: "worker", kind: "worker", label: "Worker", sub: "Python · LangGraph", color: palette.violet, position: [8.7, 0.4, 0.8], section: "education" },
  { id: "vector", kind: "vector", label: "pgvector", sub: "semantic retrieval", color: palette.violet, position: [7.6, -2.4, -0.9] },
];

export const nodeById = Object.fromEntries(nodes.map((n) => [n.id, n])) as Record<NodeId, TopologyNode>;

export type TopologyEdge = {
  from: NodeId;
  to: NodeId;
  color: string;
  /** Arc height of the curve's midpoint. */
  lift: number;
  packets: number;
  speed: number;
  /** Journey stops at which this edge is emphasised. */
  hot: string[];
};

export const edges: TopologyEdge[] = [
  { from: "client", to: "gateway", color: palette.teal, lift: 0.9, packets: 3, speed: 0.34, hot: ["top", "about"] },
  { from: "gateway", to: "client", color: palette.neutral, lift: -0.9, packets: 2, speed: 0.3, hot: ["contact", "top"] },
  { from: "gateway", to: "auth", color: palette.green, lift: 0.6, packets: 2, speed: 0.4, hot: ["about"] },
  { from: "auth", to: "service", color: palette.teal, lift: 0.5, packets: 2, speed: 0.42, hot: ["about", "experience"] },
  { from: "service", to: "postgres", color: palette.blue, lift: 0.4, packets: 3, speed: 0.38, hot: ["experience", "stack"] },
  { from: "postgres", to: "outbox", color: palette.amber, lift: 0.6, packets: 2, speed: 0.3, hot: ["projects", "stack"] },
  { from: "outbox", to: "broker", color: palette.amber, lift: 0.9, packets: 3, speed: 0.36, hot: ["projects"] },
  { from: "broker", to: "worker", color: palette.violet, lift: 0.8, packets: 3, speed: 0.36, hot: ["projects", "education"] },
  { from: "worker", to: "vector", color: palette.violet, lift: -0.3, packets: 2, speed: 0.32, hot: ["education"] },
];

/**
 * Camera framing per journey stop: where the camera sits and what it looks at.
 * `shift` moves the image sideways (a fraction of the viewport width) without changing perspective.
 */
export type Waypoint = { position: Vec3; target: Vec3; shift?: number };

const offset = (a: Vec3, b: Vec3): Vec3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];

const frame = (node: NodeId, cam: Vec3, shift: Vec3): Waypoint => {
  const p = nodeById[node].position;
  return { position: offset(p, cam), target: offset(p, shift) };
};

export const waypoints: Record<string, Waypoint> = {
  top: { position: [1.2, 4.0, 20.5], target: [0.4, 0.6, 0], shift: 0.17 },
  about: frame("gateway", [3.4, 2.6, 11.5], [-3.2, -0.3, 0]),
  experience: frame("service", [-1.6, 3.6, 12], [-3.4, -1.0, 0]),
  projects: frame("broker", [-3.0, 2.0, 12], [-3.4, -0.3, 0]),
  stack: frame("postgres", [4.2, 0.4, 11], [-3.0, 0.6, 0]),
  education: frame("worker", [-4.4, 2.4, 11.5], [-3.0, -0.8, 0]),
  contact: { position: [-3.2, 3.2, 15], target: [-1.6, -0.2, 0] },
};
