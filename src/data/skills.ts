export type Skill = {
  name: string;
  level: number; // 0-100
  icon?: string;
  category: 'frontend' | 'backend' | 'design' | 'tools' | 'soft' | 'other';
};

export const skills: Skill[] = [
  // Frontend
  { name: "React", level: 90, category: "frontend" },
  { name: "Next.js", level: 85, category: "frontend" },
  { name: "TypeScript", level: 80, category: "frontend" },
  { name: "Tailwind CSS", level: 95, category: "frontend" },
  { name: "JavaScript", level: 90, category: "frontend" },
  { name: "HTML/CSS", level: 95, category: "frontend" },
  
  // Backend
  { name: "Node.js", level: 85, category: "backend" },
  { name: "Express", level: 80, category: "backend" },
  { name: "MongoDB", level: 75, category: "backend" },
  { name: "SQL", level: 70, category: "backend" },
  { name: "GraphQL", level: 65, category: "backend" },
  
  // Design
  { name: "Figma", level: 80, category: "design" },
  { name: "UI/UX Design", level: 75, category: "design" },
  { name: "Adobe XD", level: 70, category: "design" },
  
  // Tools
  { name: "Git", level: 85, category: "tools" },
  { name: "Docker", level: 70, category: "tools" },
  { name: "CI/CD", level: 65, category: "tools" },
  { name: "AWS", level: 60, category: "tools" },
  
  // Soft Skills
  { name: "Communication", level: 90, category: "soft" },
  { name: "Problem Solving", level: 95, category: "soft" },
  { name: "Team Work", level: 85, category: "soft" },
  { name: "Time Management", level: 80, category: "soft" },
];