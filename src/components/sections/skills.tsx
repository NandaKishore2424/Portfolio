"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Code, Database, Laptop, Palette, Wrench, Users,
  Server, Globe, GitBranch, Github, Box, Workflow, FileCode,
  Terminal, ChartPie, PanelsTopLeft, Braces, Star, Container
} from "lucide-react";

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  
  const categories = [
    { id: "all", name: "All Skills" },
    { id: "languages", name: "Languages" },
    { id: "frontend", name: "Frontend" },
    { id: "backend", name: "Backend" },
    { id: "database", name: "Database" },
    { id: "tools", name: "Tools" },
    { id: "concepts", name: "Concepts" },
  ];
  
  const skillsData = [
    // Languages
    { name: "Java", icon: <FileCode />, category: "languages" },
    { name: "Python", icon: <FileCode />, category: "languages" },
    { name: "JavaScript", icon: <FileCode />, category: "languages" },
    { name: "TypeScript", icon: <FileCode />, category: "languages" },
    { name: "SQL", icon: <Database />, category: "languages" },
    
    // Frontend
    { name: "React.js", icon: <Code />, category: "frontend" },
    { name: "Next.js", icon: <PanelsTopLeft />, category: "frontend" },
    { name: "Tailwind CSS", icon: <Palette />, category: "frontend" },
    { name: "HTML/CSS", icon: <Globe />, category: "frontend" },
    { name: "Chart.js", icon: <ChartPie />, category: "frontend" },
    
    // Backend
    { name: "Node.js", icon: <Server />, category: "backend" },
    { name: "Spring Boot", icon: <Server />, category: "backend" },
    { name: "Django", icon: <Server />, category: "backend" },
    { name: "REST APIs", icon: <Globe />, category: "backend" },
    
    // Database
    { name: "MongoDB", icon: <Database />, category: "database" },
    { name: "MySQL", icon: <Database />, category: "database" },
    { name: "NoSQL", icon: <Database />, category: "database" },
    
    // Tools
    { name: "Git", icon: <GitBranch />, category: "tools" }, // Changed from Git to GitBranch
    { name: "GitHub", icon: <Github />, category: "tools" },
    { name: "IntelliJ IDEA", icon: <Laptop />, category: "tools" },
    { name: "Docker", icon: <Container />, category: "tools" },
    { name: "CI/CD", icon: <Workflow />, category: "tools" },
    { name: "Pandas", icon: <Box />, category: "tools" },
    
    // Concepts
    { name: "Data Structures & Algorithms", icon: <Braces />, category: "concepts" },
    { name: "Object-oriented Programming", icon: <Box />, category: "concepts" },
    { name: "System Design", icon: <Wrench />, category: "concepts" }, // Changed from Tool to Wrench
  ];
  
  // Filter skills based on active category
  const filteredSkills = activeCategory === "all" 
    ? skillsData 
    : skillsData.filter(skill => skill.category === activeCategory);
  
  return (
    <section id="skills" className="py-24 relative overflow-hidden">
      {/* Remove the background gradient since we have stars now */}
      {/* We'll keep the decorative elements for added depth */}
      <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-violet-400/10 blur-3xl" />
      <div className="absolute bottom-20 right-40 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl" />
      <div className="absolute top-1/2 left-1/3 w-40 h-40 rounded-full bg-indigo-400/10 blur-2xl" />
      
      {/* No need for the static stars anymore */}
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Technical Expertise</h2>
          <div className="w-24 h-1 bg-violet-400 mx-auto mb-6"></div>
          <p className="text-violet-200 max-w-2xl mx-auto">
            These are the technologies and concepts I've mastered to build innovative solutions 
            that combine performance, scalability, and elegant design.
          </p>
        </div>
        
        {/* Category Tabs */}
        <div className="flex justify-center flex-wrap gap-3 mb-12">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                activeCategory === category.id
                  ? "bg-violet-500 text-white"
                  : "bg-violet-900/50 text-violet-200 hover:bg-violet-800/70"
              )}
            >
              {category.name}
            </button>
          ))}
        </div>
        
        {/* Skills Grid - Icon Based */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {filteredSkills.map((skill, index) => (
            <div 
              key={index}
              className="group bg-violet-800/30 backdrop-blur-sm hover:bg-violet-700/40 p-4 rounded-xl 
                        border border-violet-700/30 hover:border-violet-500/50 transition-all duration-300
                        flex flex-col items-center justify-center text-center hover:-translate-y-1"
            >
              <div className="p-4 rounded-full bg-violet-600/20 group-hover:bg-violet-500/30 transition-colors mb-3">
                <div className="text-violet-300 group-hover:text-violet-200 w-6 h-6">
                  {skill.icon}
                </div>
              </div>
              <h3 className="font-medium text-violet-100 group-hover:text-white">{skill.name}</h3>
            </div>
          ))}
        </div>
        
        {/* Call to action */}
        <div className="mt-16 text-center">
          <p className="text-violet-300 mb-6">
            I'm continuously expanding my knowledge and exploring new technologies to solve complex problems.
          </p>
          <a 
            href="#projects" 
            className="inline-flex items-center px-6 py-3 bg-violet-600 hover:bg-violet-500 
                      text-white rounded-md transition-colors border border-violet-500"
          >
            See My Projects
          </a>
        </div>
      </div>
    </section>
  );
}