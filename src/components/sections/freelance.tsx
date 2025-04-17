"use client";

import { useState } from "react";
import Image from "next/image";
import { ExternalLink, Code, CheckCircle2, ArrowRight, Star } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function Freelance() {
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'tech' | 'process'>('overview');
  
  const project = {
    title: "RS Chemtutor",
    subtitle: "Chemistry Tutoring Platform",
    client: "Specialized Chemistry Tutor",
    duration: "6 weeks",
    year: "2023",
    description: "A modern, responsive tutoring platform designed for a specialized chemistry tutor, catering to students from grades VIII-XII, with a focus on NEET and JEE preparation.",
    image: "/images/projects/chemtutor.png",
    liveUrl: "https://rs-chem-tutor.vercel.app/",
    features: [
      "Responsive, mobile-first design",
      "Interactive course catalog with curriculum details",
      "Student testimonials and success stories",
      "Real-time form validation for seamless enrollment",
      "Chemistry-themed UI elements and animations",
      "SEO optimized content structure"
    ],
    technologies: [
      "React 19",
      "Tailwind CSS",
      "Framer Motion",
      "Vercel",
      "React Hook Form",
      "Responsive Design"
    ],
    process: [
      "Client consultation and requirement analysis",
      "Wireframing and design prototype creation",
      "Component-based development using React",
      "Responsive design implementation with Tailwind CSS",
      "Integration of animations and interactive elements",
      "Testing, optimization and deployment"
    ]
  };
  
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'features', label: 'Features' },
    { id: 'tech', label: 'Technology' },
    { id: 'process', label: 'Process' }
  ] as const;

  return (
    <section id="freelance" className="py-24 relative overflow-hidden">
      {/* Decorative cosmic elements */}
      <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-violet-400/10 blur-3xl" />
      <div className="absolute bottom-20 right-40 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl" />
      <div className="absolute top-1/2 left-1/3 w-40 h-40 rounded-full bg-indigo-400/10 blur-2xl" />
      
      {/* Animated stars */}
      <motion.div 
        className="absolute top-1/4 right-1/4"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5] 
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <Star className="text-purple-300/30 h-4 w-4" />
      </motion.div>
      
      <motion.div 
        className="absolute bottom-1/3 left-1/3"
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.7, 0.3] 
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <Star className="text-indigo-300/30 h-5 w-5" />
      </motion.div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Freelance Work</h2>
          <div className="w-24 h-1 bg-purple-500 mx-auto mb-6"></div>
          <p className="text-violet-200 max-w-2xl mx-auto">
            Showcasing client projects where I delivered tailored solutions 
            to meet specific business needs and objectives.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Project Image */}
          <motion.div 
            className="rounded-lg overflow-hidden shadow-lg relative group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            {/* Image with hover effect */}
            <div className="relative aspect-video overflow-hidden">
              <Image
                src={project.image || "/images/projects/placeholder.jpg"}
                alt={project.title}
                width={600}
                height={340}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <a 
                  href={project.liveUrl} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
                >
                  Visit Website
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </div>
            </div>
            
            {/* Project Label */}
            <div className="absolute top-4 right-4 bg-purple-600/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
              Client Project
            </div>
          </motion.div>
          
          {/* Project Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="mb-6">
              <h3 className="text-3xl font-bold text-white">{project.title}</h3>
              <p className="text-lg text-violet-300">{project.subtitle}</p>
            </div>
            
            {/* Project meta */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div>
                <h4 className="text-sm text-violet-400 font-medium">CLIENT</h4>
                <p className="font-medium text-white">{project.client}</p>
              </div>
              <div>
                <h4 className="text-sm text-violet-400 font-medium">DURATION</h4>
                <p className="font-medium text-white">{project.duration}</p>
              </div>
              <div>
                <h4 className="text-sm text-violet-400 font-medium">YEAR</h4>
                <p className="font-medium text-white">{project.year}</p>
              </div>
              <div>
                <h4 className="text-sm text-violet-400 font-medium">ROLE</h4>
                <p className="font-medium text-white">Full Stack Developer</p>
              </div>
            </div>
            
            <p className="mb-8 text-lg text-violet-200">{project.description}</p>
            
            <a 
              href={project.liveUrl} 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-purple-300 hover:text-purple-100 hover:underline mb-8 group"
            >
              View Live Project
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        </div>
        
        {/* Tabs for project details */}
        <div className="mt-16">
          <div className="flex overflow-x-auto space-x-2 border-b border-violet-700/30 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-4 py-3 font-medium whitespace-nowrap transition-colors",
                  activeTab === tab.id 
                    ? "border-b-2 border-purple-500 text-white" 
                    : "text-violet-300 hover:text-violet-100"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          <div className="bg-black/20 backdrop-blur-lg p-8 rounded-lg shadow-lg border border-violet-500/20">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-xl font-bold mb-4 flex items-center text-white">
                  <Code className="mr-2 h-5 w-5 text-purple-400" />
                  Project Overview
                </h3>
                <p className="mb-6 text-violet-200">
                  RS Chemtutor is a specialized educational platform built to showcase a chemistry tutor's services 
                  for students preparing for competitive exams like NEET and JEE. The project aimed to create a 
                  professional online presence with a chemistry-themed design that highlights the tutor's expertise, 
                  course offerings, and success stories.
                </p>
                <p className="mb-6 text-violet-200">
                  The website features a modern, responsive design with interactive elements to engage visitors. 
                  It includes course details, enrollment forms, testimonials, and contact information, all wrapped 
                  in a user-friendly interface that maintains the chemistry education theme throughout.
                </p>
                <p className="text-violet-200">
                  Built with React 19 and styled with Tailwind CSS, the site achieves a balance between aesthetic appeal 
                  and performance optimization. The deployed version on Vercel ensures fast loading times and reliable 
                  accessibility across all devices.
                </p>
              </motion.div>
            )}
            
            {/* Features Tab */}
            {activeTab === 'features' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-xl font-bold mb-4 flex items-center text-white">
                  <CheckCircle2 className="mr-2 h-5 w-5 text-purple-400" />
                  Key Features
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.features.map((feature, index) => (
                    <motion.div 
                      key={index} 
                      className="flex items-start"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <div className="mr-3 mt-1">
                        <CheckCircle2 className="h-5 w-5 text-purple-400" />
                      </div>
                      <p className="text-violet-200">{feature}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
            
            {/* Technologies Tab */}
            {activeTab === 'tech' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-xl font-bold mb-4 flex items-center text-white">
                  <Code className="mr-2 h-5 w-5 text-purple-400" />
                  Technologies Used
                </h3>
                <div className="flex flex-wrap gap-3">
                  {project.technologies.map((tech, index) => (
                    <motion.span 
                      key={index} 
                      className="bg-violet-800/40 text-violet-200 px-4 py-2 rounded-md text-sm border border-violet-700/30"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}
            
            {/* Process Tab */}
            {activeTab === 'process' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-xl font-bold mb-4 flex items-center text-white">
                  <Code className="mr-2 h-5 w-5 text-purple-400" />
                  Development Process
                </h3>
                <div className="space-y-6">
                  {project.process.map((step, index) => (
                    <motion.div 
                      key={index} 
                      className="flex"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.15 }}
                    >
                      <div className="mr-4 flex-shrink-0">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-purple-500 bg-violet-900/30">
                          <span className="text-sm font-medium text-purple-300">{index + 1}</span>
                        </div>
                      </div>
                      <div>
                        <p className="mt-1.5 text-violet-200">{step}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}