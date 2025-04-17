import Navbar from "@/components/ui/navbar";
import Hero from "@/components/sections/hero";
import About from "@/components/sections/about";
import Skills from "@/components/sections/skills";
import Projects from "@/components/sections/projects";
import Experience from "@/components/sections/experience";
import Extracurricular from "@/components/sections/extracurricular";
import Freelance from "@/components/sections/freelance";
import HireMe from "@/components/sections/hire-me";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Extracurricular />
        <Freelance />
        <HireMe />
      </main>
      {}
    </div>
  );
}
