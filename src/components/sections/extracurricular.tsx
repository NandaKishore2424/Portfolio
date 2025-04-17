"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Award, Code, Users, Calendar, ChevronRight, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function Extracurricular() {
  const [activeTab, setActiveTab] = useState<number>(0);
  
  const activities = [
    {
      id: 1,
      title: "Campus Ambassador",
      organization: "GeeksforGeeks",
      period: "Apr 2024 – Apr 2025",
      icon: <Code className="h-5 w-5" />,
      description: "Organized coding events, workshops, and hands-on Java & DSA sessions for 100+ students.",
      details: [
        "Led technical workshops focused on data structures and algorithms",
        "Coordinated with college clubs to organize coding competitions",
        "Served as a liaison between GeeksforGeeks and the student community",
        "Increased student participation in coding activities by 40%"
      ],
      skills: ["Leadership", "Event Management", "Technical Training", "Community Building"],
      image: "/images/extracurricular/campusmantri.png"
    },
    {
      id: 2,
      title: "Paper Presentation - 3rd Place",
      organization: "Jeppiaar Institute of Technology",
      period: "2024",
      icon: <Trophy className="h-5 w-5" />,
      description: "Secured 3rd place for presenting innovative tech solution on AI/ML Domain.",
      details: [
        "Developed a novel approach to ML-based resource optimization",
        "Competed against 30+ teams from various engineering colleges",
        "Received recognition for practical application of theoretical concepts",
        "Conducted thorough research and prepared comprehensive documentation"
      ],
      skills: ["Research", "Technical Writing", "Presentation Skills", "Problem Solving"],
      imageGradient: "from-violet-600/20 via-purple-500/20 to-blue-500/20"
    },
    {
      id: 3,
      title: "Student Coordinator",
      organization: "Drestein 2024, Saveetha Engineering College",
      period: "2024",
      icon: <Users className="h-5 w-5" />,
      description: "Led a 50-member team and assisted in planning & execution of Drestein 2024 tech fest.",
      details: [
        "Coordinated between different departments for smooth event execution",
        "Managed a team of 50 volunteers across various technical events",
        "Handled budget allocation and resource management for key activities",
        "Successfully increased sponsorship by 30% compared to previous year"
      ],
      skills: ["Team Management", "Event Planning", "Budget Allocation", "Cross-functional Coordination"],
      imageGradient: "from-indigo-600/20 via-purple-400/20 to-pink-500/20"
    }
  ];

  return (
    <section id="extracurricular" className="py-24 relative overflow-hidden">
      {/* Decorative cosmic elements with animation */}
      <motion.div 
        className="absolute top-20 left-20 w-64 h-64 rounded-full bg-violet-400/10 blur-3xl" 
        animate={{ 
          y: [0, 15, 0],
          opacity: [0.5, 0.7, 0.5]
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity,
          ease: "easeInOut" 
        }}
      />
      <motion.div 
        className="absolute bottom-20 right-40 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl"
        animate={{ 
          y: [0, -20, 0],
          opacity: [0.6, 0.8, 0.6]
        }}
        transition={{ 
          duration: 10, 
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
      <motion.div 
        className="absolute top-1/2 left-1/3 w-40 h-40 rounded-full bg-indigo-400/10 blur-2xl"
        animate={{ 
          x: [0, 10, 0],
          opacity: [0.4, 0.6, 0.4]
        }}
        transition={{ 
          duration: 7, 
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Extracurricular Activities</h2>
          <div className="w-24 h-1 bg-purple-500 mx-auto mb-6"></div>
          <p className="text-violet-200 max-w-2xl mx-auto">
            Beyond coding and development, I actively participate in activities that enhance my leadership skills, 
            technical knowledge, and community engagement.
          </p>
        </div>
        
        {/* Mobile View: Cards */}
        <div className="lg:hidden space-y-8">
          {activities.map((activity) => (
            <motion.div 
              key={activity.id}
              className="bg-black/20 backdrop-blur-lg rounded-lg overflow-hidden shadow-lg border border-violet-500/20 hover:border-violet-400/40 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="aspect-video w-full relative overflow-hidden max-h-[160px]">
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />
                
                {activity.image ? (
                  <Image 
                    src={activity.image} 
                    alt={activity.title}
                    width={600}
                    height={338}
                    className="w-full h-full object-cover object-center"
                  />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-r ${activity.imageGradient}`}>
                    <div className="absolute inset-0 flex items-center justify-center opacity-30">
                      {activity.icon}
                    </div>
                  </div>
                )}
                
                <div className="absolute bottom-4 left-4 z-20">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-600/80 text-white">
                    <Calendar className="mr-1 h-3 w-3" />
                    {activity.period}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-violet-500/30 flex items-center justify-center mr-3 text-purple-300">
                    {activity.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">{activity.title}</h3>
                    <p className="text-sm text-violet-200">{activity.organization}</p>
                  </div>
                </div>
                
                <p className="mb-4 text-violet-100">{activity.description}</p>
                
                <ul className="space-y-2 mb-4">
                  {activity.details.map((detail, i) => (
                    <li key={i} className="flex items-start text-sm text-violet-200">
                      <ChevronRight className="h-4 w-4 mr-2 mt-0.5 text-purple-400" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="flex flex-wrap gap-2 mt-4">
                  {activity.skills.map((skill, i) => (
                    <span 
                      key={i}
                      className="px-2 py-1 text-xs rounded-full bg-violet-800/40 text-violet-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Desktop View: Interactive Tabs */}
        <div className="hidden lg:grid grid-cols-12 gap-8">
          {/* Tab buttons */}
          <div className="col-span-4">
            <div className="space-y-2 sticky top-24">
              {activities.map((activity, index) => (
                <motion.button
                  key={activity.id}
                  onClick={() => setActiveTab(index)}
                  className={cn(
                    "w-full text-left p-4 rounded-lg transition-all duration-300",
                    activeTab === index 
                      ? "bg-violet-800/30 border-l-4 border-purple-400 backdrop-blur-sm" 
                      : "hover:bg-violet-900/20 text-violet-200"
                  )}
                  whileHover={{ x: 4 }}
                >
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-violet-500/30 flex items-center justify-center mr-3 text-purple-300">
                      {activity.icon}
                    </div>
                    <div>
                      <h3 className={cn(
                        "font-bold",
                        activeTab === index ? "text-white" : "text-violet-200"
                      )}>
                        {activity.title}
                      </h3>
                      <p className="text-sm text-violet-300">{activity.organization}</p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
          
          {/* Tab content */}
          <div className="col-span-8">
            {activities.map((activity, index) => (
              <motion.div 
                key={activity.id}
                className={cn(
                  "transition-all duration-500",
                  activeTab === index ? "block opacity-100" : "hidden opacity-0"
                )}
                initial={{ opacity: 0, y: 20 }}
                animate={activeTab === index ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-black/30 backdrop-blur-lg rounded-lg overflow-hidden shadow-lg border border-violet-500/20">
                  {/* Activity image */}
                  <div className="aspect-video w-full relative overflow-hidden max-h-[300px]">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />
                    
                    {activity.image ? (
                      <Image 
                        src={activity.image} 
                        alt={activity.title}
                        width={800}
                        height={450}
                        className="w-full h-full object-cover object-center transition-transform duration-3000 hover:scale-105"
                      />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-r ${activity.imageGradient}`}>
                        <div className="absolute inset-0 flex items-center justify-center opacity-20 scale-150">
                          {activity.icon}
                        </div>
                      </div>
                    )}
                    
                    <div className="absolute top-4 right-4 z-20">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-600/80 text-white">
                        <Calendar className="mr-1 h-3 w-3" />
                        {activity.period}
                      </span>
                    </div>
                  </div>
                  
                  {/* Activity details */}
                  <div className="p-8">
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold mb-2 text-white">{activity.title}</h2>
                      <p className="text-violet-300">{activity.organization}</p>
                    </div>
                    
                    <p className="mb-6 text-lg text-violet-100">{activity.description}</p>
                    
                    <div className="mb-8">
                      <h3 className="text-lg font-medium mb-4 text-violet-100">Key Achievements</h3>
                      <ul className="space-y-3">
                        {activity.details.map((detail, i) => (
                          <motion.li 
                            key={i} 
                            className="flex items-start text-violet-200"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: i * 0.1 }}
                          >
                            <div className="mr-3 mt-1.5">
                              <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
                            </div>
                            <span>{detail}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4 text-violet-100">Skills Developed</h3>
                      <div className="flex flex-wrap gap-2">
                        {activity.skills.map((skill, i) => (
                          <motion.span 
                            key={i}
                            className="px-3 py-1 rounded-full bg-violet-800/40 text-violet-200 border border-violet-700/30"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: 0.3 + (i * 0.1) }}
                          >
                            {skill}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}