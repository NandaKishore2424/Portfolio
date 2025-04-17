import React from 'react';
import Projects from '@/components/sections/projects';
import Navbar from '@/components/ui/navbar';

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <div className="py-20"></div> {/* Spacer for navbar */}
        <Projects />
      </main>
    </div>
  );
}