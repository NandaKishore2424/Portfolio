"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ExternalLink, Github, ArrowRight } from "lucide-react";

// Updated project data with your detailed descriptions
const projects = [
  {
    id: "novanest",
    title: "Novanest – AI-Driven Startup Platform",
    description: "A full-stack platform connecting entrepreneurs, mentors, and investors with AI-powered business validation and matchmaking.",
    fullDescription: "Novanest is a full-stack web platform designed to bridge the gap between Entrepreneurs, Mentors, and Investors, making startup success more accessible and guided. Built with the MERN stack and integrated with Google's Gemini PaLM API, Novanest leverages AI to deliver real-time business validation, mentor matchmaking, and investor connections—all within a dynamic, role-based dashboard.\n\nThe platform addresses three core startup challenges: validating business ideas, finding the right mentors, and securing funding. Entrepreneurs can submit their startup details, interact with an AI-powered chatbot for instant insights, and get matched with mentors based on shared interests and expertise. Investors, on the other hand, explore curated pitch decks and connect directly with founders using an intuitive messaging system.\n\nKey features include secure JWT authentication, personalized dashboards, a startup feed for investors, and intelligent mentor-entrepreneur pairing—like a \"Tinder for startups.\" With seamless UI/UX built using React and Tailwind CSS, Novanest transforms the startup experience into a connected, efficient, and empowering journey.\n\nTargeting a global startup ecosystem, Novanest stands out with its AI-first approach, solving real-world startup pain points and creating a launchpad where ideas thrive, mentors guide, and investors invest—with purpose and precision.",
    image: "/images/projects/novanest.png",
    category: "ai",
    tags: ["React", "Node.js", "MongoDB", "Express", "JWT", "Gemini PaLM API", "Tailwind CSS", "MERN Stack"],
    demoLink: null,
    sourceLink: "https://github.com/NandaKishore2424/novanest"
  },
  {
    id: "trainee-management",
    title: "Trainee Management System",
    description: "A full-stack web application built to streamline tracking and management of trainees within organizations.",
    fullDescription: "The Trainee Management System is a full-stack web application built to streamline the tracking and management of trainees within organizations. Featuring secure user authentication via JWT, the system allows users to add, edit, view, and delete trainee records with ease. Built using Spring Boot 3.2, MongoDB, and React 18 with Tailwind CSS, it ensures a responsive UI and seamless performance.\n\nKey features include protected routes, form validation, confirmation prompts, and real-time feedback. With a clean architecture and secure API communication, this system enables organizations to manage trainee data efficiently while maintaining scalability and security.",
    image: "/images/projects/trainee.png",
    category: "web",
    tags: ["Spring Boot 3.2", "MongoDB", "React 18", "Tailwind CSS", "JWT Authentication", "REST API", "CRUD Operations"],
    demoLink: null,
    sourceLink: "https://github.com/NandaKishore2424/Trainee_Management_System"
  },
  {
    id: "rschemtutor",
    title: "RS ChemTutor – Chemistry Education Platform",
    description: "A modern, responsive tutoring platform designed for a specialized chemistry tutor, focusing on NEET and JEE preparation.",
    fullDescription: "A modern, responsive tutoring platform designed for a specialized chemistry tutor, catering to students from grades VIII-XII, with a focus on NEET and JEE preparation.\n\nThe platform features a responsive, mobile-first design with an interactive course catalog detailing curriculum offerings. Students can explore testimonials, success stories, and easily enroll through forms with real-time validation.\n\nThe UI incorporates chemistry-themed elements and animations, and the content structure is optimized for SEO to enhance discoverability.",
    image: "/images/projects/chemtutor.png",
    category: "web",
    tags: ["React", "Next.js", "Tailwind CSS", "Responsive Design", "SEO", "Form Validation"],
    demoLink: "https://rs-chem-tutor.vercel.app/",
    sourceLink: null
  },
  {
    id: "ecoroute",
    title: "EcoRoute AI – Logistics Optimization",
    description: "An ML-powered platform that optimizes logistics operations with intelligent routing and predictive analytics for sustainability.",
    fullDescription: "EcoRoute AI is a machine learning-powered logistics optimization platform built to transform traditional supply chain operations into smart, sustainable, and efficient ecosystems. Addressing key industry pain points—like inefficient routing, underutilized vehicle capacity, inaccurate demand forecasting, and high carbon emissions—EcoRoute AI leverages real-time data and advanced algorithms to deliver dynamic, eco-friendly solutions.\n\nAt the heart of the platform lies a high-accuracy route optimization model, boasting a 0.989 R² score. It intelligently predicts traffic patterns and delivery distances while maximizing vehicle capacity utilization to cut costs and ensure on-time deliveries. Seamlessly integrating with enterprise infrastructures such as IBM Z, the platform guarantees high reliability, security, and scalability for logistics companies of all sizes.\n\nEcoRoute AI empowers logistics teams with real-time decision-making, multi-constraint optimization, and predictive analytics using tools like Python, TensorFlow, scikit-learn, and Pandas. The result: reduced fuel consumption, lower carbon footprints, and enhanced customer satisfaction.\n\nWhether you're optimizing urban last-mile delivery or managing nationwide supply chains, EcoRoute AI sets a new standard in logistics intelligence—combining precision, sustainability, and performance for the future of supply chain management.",
    image: "/images/projects/ecoroute.png",
    category: "ai",
    tags: ["Python", "TensorFlow", "scikit-learn", "Pandas", "Machine Learning", "IBM Z", "Data Visualization", "Predictive Analytics"],
    demoLink: null,
    sourceLink: "https://github.com/NandaKishore2424/ECOROUTE_AI"
  },
  {
    id: "calendar",
    title: "Calendar+ – Smart Scheduling & Goals",
    description: "A full-stack productivity app that combines calendar scheduling, goal setting, and task management into one platform.",
    fullDescription: "Calendar+ is a full-stack productivity web app that combines calendar scheduling, goal setting, and task management in one seamless platform. Users can create categorized events, set personal or professional goals, and track tasks—all visually organized with color-coded time blocks.\n\nWith responsive design, real-time updates, and drag-and-drop support, it offers an intuitive experience across devices. Built using React 19, Redux Toolkit, Node.js, Express, and MongoDB, Calendar+ ensures fast performance and scalable architecture.\n\nWhether planning a day or setting long-term objectives, Calendar+ helps users stay organized, focused, and on track.",
    image: "/images/projects/calendar.png",
    category: "web",
    tags: ["React", "Redux Toolkit", "Node.js", "Express", "MongoDB", "Responsive Design", "Real-time Updates"],
    demoLink: null,
    sourceLink: "https://github.com/NandaKishore2424/Calendar_application"
  }
];

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [visibleProjects, setVisibleProjects] = useState(projects);
  
  const categories = [
    { id: "all", label: "All Projects" },
    { id: "web", label: "Full Stack" },  // Changed label, keeping same ID for filtering
    { id: "ai", label: "ML" },          // Changed label, keeping same ID for filtering
  ];

  // Filter projects when category changes
  useEffect(() => {
    if (activeCategory === "all") {
      setVisibleProjects(projects);
    } else {
      setVisibleProjects(projects.filter(project => project.category === activeCategory));
    }
  }, [activeCategory]);

  // Close modal when clicking escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedProject(null);
    };

    if (selectedProject) {
      document.addEventListener("keydown", handleEscape);
      // Prevent scrolling when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "auto";
    };
  }, [selectedProject]);

  // Find the currently selected project
  const currentProject = selectedProject 
    ? projects.find(p => p.id === selectedProject) 
    : null;

  return (
    <section id="projects" className="py-24 relative overflow-hidden">
      {/* Decorative cosmic elements */}
      <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-violet-400/10 blur-3xl" />
      <div className="absolute bottom-20 right-40 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl" />
      <div className="absolute top-1/2 left-1/3 w-40 h-40 rounded-full bg-indigo-400/10 blur-2xl" />
      
      <div className="container px-4 mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Featured Projects
          </h2>
          <div className="w-24 h-1 bg-purple-500 mx-auto mb-6"></div>
          <p className="text-violet-200 max-w-2xl mx-auto mb-10">
            Explore my recent work - a collection of projects demonstrating my skills in web development, 
            AI integration, and problem-solving.
          </p>
          
          {/* Category filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                  activeCategory === category.id
                    ? "bg-violet-600 text-white"
                    : "bg-black/20 backdrop-blur-sm text-violet-200 hover:bg-violet-800/30"
                )}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleProjects.map((project, index) => (
            <div
              key={project.id}
              className={cn(
                "group bg-black/20 backdrop-blur-lg rounded-lg overflow-hidden shadow-lg border border-violet-500/20 flex flex-col h-full hover:shadow-violet-500/10 hover:border-violet-500/30 transition-all duration-300"
              )}
            >
              {/* Project image */}
              <div className="relative aspect-[16/9] w-full overflow-hidden max-h-[180px]">
                <div className="absolute inset-0 bg-gradient-to-t from-violet-900/60 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Image
                  src={project.image || `/images/projects/placeholder.jpg`}
                  alt={project.title}
                  width={600}
                  height={340}
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              
              {/* Project info */}
              <div className="flex flex-col flex-grow p-6">
                <h3 className="text-xl font-bold mb-2 text-white">{project.title}</h3>
                
                <p className="text-violet-300 mb-4 flex-grow">
                  {project.description}
                </p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-violet-700/30">
                  <button
                    onClick={() => setSelectedProject(project.id)}
                    className="text-sm font-medium text-violet-300 hover:text-white flex items-center"
                  >
                    View Details
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </button>
                  
                  <div className="flex items-center gap-2 ml-auto">
                    {project.sourceLink && (
                      <a
                        href={project.sourceLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full hover:bg-violet-800/30 text-violet-300 hover:text-white"
                        aria-label="View source code"
                      >
                        <Github className="h-5 w-5" />
                      </a>
                    )}
                    {project.demoLink && (
                      <a
                        href={project.demoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full hover:bg-violet-800/30 text-violet-300 hover:text-white"
                        aria-label="View live demo"
                      >
                        <ExternalLink className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Project details modal */}
        {selectedProject && currentProject && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedProject(null)}
          >
            <div 
              className="bg-black/40 backdrop-blur-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-lg shadow-xl border border-violet-500/20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden max-h-[400px]">
                <Image
                  src={currentProject.image || `/images/projects/placeholder.jpg`}
                  alt={currentProject.title}
                  width={1200}
                  height={675}
                  className="w-full h-full object-contain bg-black/60"
                  priority
                />
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 bg-black/30 backdrop-blur-sm p-2 rounded-full hover:bg-violet-900/50 transition-colors text-white"
                  aria-label="Close modal"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18"></path>
                    <path d="m6 6 12 12"></path>
                  </svg>
                </button>
              </div>
              
              <div className="p-8">
                <h2 className="text-2xl font-bold mb-2 text-white">{currentProject.title}</h2>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {currentProject.tags.map((tag, i) => (
                    <span 
                      key={i} 
                      className="text-xs px-3 py-1 bg-violet-800/40 text-violet-200 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <p className="text-violet-200 mb-8 whitespace-pre-line">
                  {currentProject.fullDescription}
                </p>
                
                <div className="flex flex-wrap gap-4">
                  {currentProject.demoLink && (
                    <a 
                      href={currentProject.demoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-500 transition-colors"
                    >
                      Visit Website
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  )}
                  {currentProject.sourceLink && (
                    <a 
                      href={currentProject.sourceLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-violet-900/50 hover:bg-violet-800/70 text-white rounded-md transition-colors"
                    >
                      View Source Code
                      <Github className="ml-2 h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}