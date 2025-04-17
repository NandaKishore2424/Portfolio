"use client";

import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Hero3DScene from "@/components/hero-3d-scene";

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section 
      id="home" 
      className="relative min-h-screen flex items-center pt-16 overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 z-0" />

      {/* Floating shapes decoration */}
      <div className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 rounded-full bg-accent/5 blur-3xl" />

      {/* Main content */}
      <div className="container mx-auto px-6 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div className="max-w-3xl">
            <p 
              className={cn(
                "text-lg font-medium text-primary mb-3 transition-all duration-700",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
              style={{ transitionDelay: "200ms" }}
            >
              Transforming Ideas Into Reality
            </p>
            <h1 
              className={cn(
                "text-5xl md:text-6xl lg:text-7xl font-bold mb-6 transition-all duration-700",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
              style={{ transitionDelay: "400ms" }}
            >
              <span className="text-primary">Nanda Kishore R</span>
            </h1>
            <div 
              className={cn(
                "flex items-center text-xl md:text-2xl mb-6 transition-all duration-700",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
              style={{ transitionDelay: "500ms" }}
            >
              <span className="text-muted-foreground">Full Stack Developer</span>
              <span className="mx-3 text-muted-foreground">|</span>
              <span className="text-muted-foreground">ML Engineer</span>
            </div>
            <p 
              className={cn(
                "text-xl text-muted-foreground max-w-2xl mb-10 transition-all duration-700",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
              style={{ transitionDelay: "600ms" }}
            >
              Architecting scalable solutions that drive innovation and business growth. 
              Combining cutting-edge technologies with elegant design to create experiences 
              that exceed expectations and deliver measurable results.
            </p>

            {/* CTA Buttons */}
            <div 
              className={cn(
                "flex flex-col sm:flex-row gap-4 transition-all duration-700",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
              style={{ transitionDelay: "800ms" }}
            >
              <a 
                href="#projects" 
                className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                View My Portfolio
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
              <a 
                href="#contact" 
                className="inline-flex items-center justify-center px-6 py-3 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                Contact Me
              </a>
            </div>
          </div>

          {/* Three.js 3D Scene */}
          <div 
            className={cn(
              "lg:block relative transition-all duration-1000 min-h-[500px]", // Add min-height
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-24"
            )}
            style={{ transitionDelay: "600ms" }}
          >
            <Hero3DScene />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div 
        className={cn(
          "absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}
        style={{ transitionDelay: "1000ms" }}
      >
        <span className="text-sm text-muted-foreground mb-2">Scroll Down</span>
        <div className="w-0.5 h-8 bg-border animate-pulse" />
      </div>
    </section>
  );
}