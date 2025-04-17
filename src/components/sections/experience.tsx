"use client";

import { Briefcase, Calendar, Code, GraduationCap } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function Experience() {
  const experiences = [
    {
      id: "freelance",
      title: "Freelance Developer",
      company: "Self-employed",
      location: "Remote",
      startDate: "Jan 2023",
      endDate: "Present",
      current: true,
      description: [
        "Developed and deployed full-stack web applications for various clients",
        "Created the RSChemtutor website for a specialized chemistry tutor using React and Tailwind CSS",
        "Implemented responsive designs and performance optimizations for client websites",
        "Maintained client relationships and delivered projects on time"
      ],
      skills: ["React", "Next.js", "Tailwind CSS", "TypeScript", "Responsive Design"]
    },
    {
      id: "training",
      title: "In-plant Training",
      company: "Zealsoft Technology Solutions",
      location: "Chennai",
      startDate: "Jun 2023",
      endDate: "Aug 2023",
      description: [
        "Participated in comprehensive web development training program",
        "Worked on real-time projects under professional guidance",
        "Gained hands-on experience with industry standard development practices",
        "Collaborated with team members on project development and problem solving",
        "Applied theoretical knowledge to practical business scenarios"
      ],
      skills: ["Web Development", "Team Collaboration", "Problem Solving", "Industry Standards"]
    }
  ];
  
  const [activeTab, setActiveTab] = useState<string>(experiences[0].id);
  
  return (
    <section 
      id="experience" 
      className="py-24 relative overflow-hidden"
    >
      {/* Decorative cosmic elements */}
      <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-violet-400/10 blur-3xl" />
      <div className="absolute bottom-20 right-40 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl" />
      <div className="absolute top-1/2 left-1/3 w-40 h-40 rounded-full bg-indigo-400/10 blur-2xl" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Professional Experience</h2>
          <div className="w-24 h-1 bg-purple-500 mx-auto mb-6"></div>
          <p className="text-violet-200 max-w-2xl mx-auto">
            My professional journey and practical experiences that have shaped my skills.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto">
          {/* Mobile timeline */}
          <div className="lg:hidden space-y-8">
            {experiences.map((exp) => (
              <div key={exp.id} className="bg-black/20 backdrop-blur-lg rounded-lg p-6 shadow-lg border border-violet-500/20">
                <span className="inline-block text-sm font-medium text-white bg-purple-700/80 px-3 py-1 rounded-full mb-4">
                  {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                </span>
                <h3 className="text-xl font-bold mb-1 text-white">{exp.title}</h3>
                <div className="flex items-center text-violet-300 mb-4">
                  <Briefcase className="h-4 w-4 mr-2" />
                  <span>{exp.company}</span>
                  <span className="mx-2">•</span>
                  <span>{exp.location}</span>
                </div>
                <ul className="list-disc list-inside space-y-2 mb-4">
                  {exp.description.map((item, i) => (
                    <li key={i} className="text-violet-200">{item}</li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2 mt-4">
                  {exp.skills.map((skill, i) => (
                    <span key={i} className="text-xs bg-violet-700/30 text-violet-100 px-2 py-1 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {/* Desktop interactive timeline */}
          <div className="hidden lg:block lg:col-span-12">
            <div className="flex">
              {/* Tab buttons */}
              <div className="w-1/3 border-r border-violet-700/30 pr-4 space-y-1">
                {experiences.map((exp) => (
                  <button
                    key={exp.id}
                    onClick={() => setActiveTab(exp.id)}
                    className={cn(
                      "w-full text-left p-4 rounded-lg transition-colors",
                      activeTab === exp.id 
                        ? "bg-violet-700/30 border-l-4 border-violet-400"
                        : "hover:bg-violet-800/20 text-violet-200"
                    )}
                  >
                    <h3 className={cn(
                      "font-medium mb-1",
                      activeTab === exp.id ? "text-violet-100" : "text-violet-300"
                    )}>
                      {exp.title}
                    </h3>
                    <div className="flex items-center text-sm text-violet-300">
                      <Briefcase className="h-3 w-3 mr-1" />
                      <span>{exp.company}</span>
                    </div>
                    <div className="flex items-center text-xs text-violet-400 mt-1">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{exp.startDate} - {exp.current ? "Present" : exp.endDate}</span>
                    </div>
                  </button>
                ))}
              </div>
              
              {/* Tab content */}
              <div className="w-2/3 pl-8">
                {experiences.map((exp) => (
                  <div 
                    key={exp.id} 
                    className={cn(
                      "transition-opacity duration-300",
                      activeTab === exp.id ? "block opacity-100" : "hidden opacity-0"
                    )}
                  >
                    <div className="bg-black/20 backdrop-blur-lg rounded-lg p-8 shadow-lg border border-violet-500/20">
                      <h3 className="text-2xl font-bold mb-1 text-white">{exp.title}</h3>
                      <div className="flex items-center text-violet-300 mb-6">
                        <Briefcase className="h-4 w-4 mr-2" />
                        <span>{exp.company}</span>
                        <span className="mx-2">•</span>
                        <span>{exp.location}</span>
                      </div>
                      
                      <div className="space-y-4 mb-6">
                        <h4 className="text-sm font-medium uppercase text-violet-400">Responsibilities & Achievements</h4>
                        <ul className="space-y-3">
                          {exp.description.map((item, i) => (
                            <li key={i} className="flex items-start">
                              <div className="mr-3 mt-1">
                                <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
                              </div>
                              <p className="text-violet-200">{item}</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium uppercase text-violet-400 mb-3">Skills Used</h4>
                        <div className="flex flex-wrap gap-2">
                          {exp.skills.map((skill, i) => (
                            <span 
                              key={i} 
                              className="text-xs px-3 py-1 bg-violet-700/30 text-violet-100 rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}