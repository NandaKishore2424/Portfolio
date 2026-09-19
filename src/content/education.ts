export const education = {
  school: "Saveetha Engineering College",
  degree: "BE, Electronics and Communication Engineering",
  period: "2022 – 2026",
  cgpa: "8.98 / 10",
  coursework: [
    "Data Structures & Algorithms",
    "OOP (Java)",
    "DBMS",
    "Operating Systems",
    "System Design",
  ],
};

export type Achievement = {
  title: string;
  detail: string;
  kind: "publication" | "award" | "leadership";
  href?: string;
};

export const achievements: Achievement[] = [
  {
    title: "IEEE conference paper",
    detail: "Lightweight deep learning for white blood cell counting, published on IEEE Xplore.",
    kind: "publication",
    href: "https://ieeexplore.ieee.org/document/11497191",
  },
  {
    title: "Winner, Hardware Track",
    detail: "AMD Pervasive AI Developer Challenge.",
    kind: "award",
  },
  {
    title: "Hackathon finalist",
    detail: "Virtusa hackathon.",
    kind: "award",
  },
  {
    title: "Campus Ambassador",
    detail: "GeeksforGeeks.",
    kind: "leadership",
  },
  {
    title: "Symposium Coordinator",
    detail: "Coordinated 10+ workshops for 300+ students.",
    kind: "leadership",
  },
];

export const certifications = [
  { name: "Programming in Java", issuer: "NPTEL · IIT Kharagpur" },
  { name: "AWS Cloud Solutions Architect", issuer: "Coursera" },
  { name: "Efficient LLM Customization", issuer: "NVIDIA" },
];
