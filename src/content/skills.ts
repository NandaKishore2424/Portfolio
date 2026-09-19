// Mirrors the resume's Skills section, grouped as layers of a backend stack
// (bottom layer first).

export type SkillLayer = {
  id: string;
  name: string;
  caption: string;
  items: string[];
};

export const skillLayers: SkillLayer[] = [
  {
    id: "languages",
    name: "Languages",
    caption: "what I write",
    items: ["Java 17", "Python", "SQL", "TypeScript", "JavaScript"],
  },
  {
    id: "backend",
    name: "Backend & Data",
    caption: "what I build on",
    items: [
      "Spring Boot",
      "Spring Security",
      "JPA / Hibernate",
      "REST APIs",
      "JWT",
      "FastAPI",
      "PostgreSQL",
      "RabbitMQ",
      "Flyway",
    ],
  },
  {
    id: "testing",
    name: "Testing",
    caption: "how I prove it",
    items: ["JUnit", "Mockito", "Testcontainers", "ArchUnit", "pytest"],
  },
  {
    id: "delivery",
    name: "DevOps & Practices",
    caption: "how it ships",
    items: [
      "Docker",
      "AWS (EC2)",
      "Git",
      "GitHub Actions",
      "CI/CD",
      "Agile / Scrum (Linear)",
      "Code review",
    ],
  },
  {
    id: "concepts",
    name: "Concepts & AI",
    caption: "how I think about it",
    items: [
      "Object-oriented design",
      "Design patterns",
      "Multi-tenancy",
      "Concurrency",
      "Transactions",
      "Indexing",
      "LangGraph",
      "RAG",
      "Vector search",
    ],
  },
];
