"use client";

import Image from "next/image";
import { ArrowRight, Award, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";

export default function About() {
  const stats = [
    { label: "Projects Completed", value: "6+" },
    { label: "Years of Experience", value: "2+" },
    { label: "Coding Problems Solved", value: "150+" },
  ];
  
  // Personal information
  const aboutInfo = {
    name: "Nanda Kishore R",
    title: "Aspiring Software Engineer",
    image: "/images/profile.jpg", 
    bio: "I'm a versatile software engineer with experience in full stack development, machine learning, and enterprise Java applications. My passion lies in creating robust, scalable solutions that solve real-world problems while delivering exceptional user experiences.",
    additionalInfo: "With over 2 years of project experience, I've developed a diverse technical portfolio spanning web applications, AI solutions, and Spring Boot microservices. I'm continuously expanding my skills through practical implementation and problem solving, having tackled 150+ challenges across various coding platforms. I'm particularly focused on the intersection of modern frontend frameworks, cloud architectures, and AI integration."
  };

  // Achievements and roles
  const achievements = [
    {
      title: "Campus Ambassador – GeeksforGeeks",
      period: "Apr 2024 – Apr 2025",
      description: "Organized coding events, workshops, and hands-on Java & DSA sessions for 20+ students."
    },
    {
      title: "3rd Place – Paper Presentation, Jeppiaar Institute of Technology",
      period: "2024",
      description: "Secured 3rd place for presenting innovative tech solution on 'AI in Power Stations'."
    },
    {
      title: "ECE Department Drestein Student Coordinator – Saveetha Engineering College",
      period: "2024",
      description: "Led a 50-member team and assisted in planning & execution of Drestein 2024 tech fest."
    },
    {
      title: "Hackathon Team Lead",
      period: "2023 – 2024",
      description: "Led multiple hackathon teams, coordinating development efforts and architecting solutions in time-constrained environments, resulting in successful project completions and valuable experience in rapid prototyping."
    }
  ];

  // Certifications
  const certifications = [
    { name: "Programming in Java – NPTEL (IIT Kharagpur)" },
    { name: "The Complete MySQL Bootcamp – Udemy" },
    { name: "Introduction to Cloud Computing – IBM" }
  ];

  return (
    <motion.section id="about" className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">About Me</h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Image column */}
          <div className="order-2 lg:order-1">
            <div className="relative">
              {/* Main image with decorative elements */}
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src={aboutInfo.image}
                  alt={aboutInfo.name}
                  width={500}
                  height={600}
                  className="w-full h-auto object-cover"
                  priority
                />
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-primary rounded-2xl -z-10"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-20"></div>
            </div>
          </div>
          
          {/* Content column */}
          <div className="order-1 lg:order-2">
            <h3 className="text-2xl font-bold mb-2">{aboutInfo.name}</h3>
            <p className="text-lg text-muted-foreground mb-6">{aboutInfo.title}</p>
            <p className="mb-4">{aboutInfo.bio}</p>
            <p className="mb-6">{aboutInfo.additionalInfo}</p>
            
            {/* Technologies section */}
            <div className="mb-6">
              <h4 className="text-sm uppercase tracking-wider text-muted-foreground mb-3">Technical Expertise</h4>
              <div className="flex flex-wrap gap-2">
                {["React", "Next.js", "Node.js", "Spring Boot", "TensorFlow", "Python", "Java", "MongoDB", "SQL", "Cloud Computing"].map((tech, i) => (
                  <span key={i} className="px-3 py-1 bg-muted/30 rounded-full text-sm">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Statistics */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center p-4 bg-muted/20 rounded-lg">
                  <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
            
            <a 
              href="#contact" 
              className="inline-flex items-center text-sm font-medium text-primary hover:underline"
            >
              Get in touch
              <ArrowRight className="ml-1 h-4 w-4" />
            </a>
          </div>
        </div>
        
        {/* Achievements and Certifications Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-20">
          {/* Achievements */}
          <div>
            <div className="flex items-center mb-6">
              <Award className="h-6 w-6 text-primary mr-3" />
              <h3 className="text-2xl font-bold">Achievements & Roles</h3>
            </div>
            
            <div className="space-y-8">
              {achievements.map((achievement, index) => (
                <div key={index} className="relative pl-8 border-l-2 border-muted">
                  <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-primary"></div>
                  <h4 className="font-semibold text-lg">{achievement.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{achievement.period}</p>
                  <p>{achievement.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Certifications */}
          <div>
            <div className="flex items-center mb-6">
              <GraduationCap className="h-6 w-6 text-primary mr-3" />
              <h3 className="text-2xl font-bold">Certifications</h3>
            </div>
            
            <div className="space-y-4">
              {certifications.map((cert, index) => (
                <div 
                  key={index} 
                  className="p-4 border border-muted rounded-lg hover:border-primary transition-colors"
                >
                  <div className="flex items-center">
                    <div className="bg-muted/30 p-2 rounded-full mr-4">
                      <GraduationCap className="h-5 w-5 text-primary" />
                    </div>
                    <p className="font-medium">{cert.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}