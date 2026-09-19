import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { SceneCanvas } from "@/components/scene/scene-canvas";
import { HopDivider } from "@/components/hop-divider";
import { InversionCircle } from "@/components/ui/inversion-circle";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Experience } from "@/components/sections/experience";
import { Projects } from "@/components/sections/projects";
import { Stack } from "@/components/sections/stack";
import { Education } from "@/components/sections/education";
import { Contact } from "@/components/sections/contact";

export default function Home() {
  return (
    <>
      <SceneCanvas />
      <SiteHeader />
      <main id="main" className="relative">
        <Hero />
        <HopDivider span={2} service="gateway" message="GET /about · routed to the profile" />
        <About />
        <HopDivider span={3} service="service" message="GET /experience · transaction opened" />
        <Experience />
        <HopDivider span={4} service="broker" message="GET /projects · events published" tone="text-amber" />
        <Projects />
        <HopDivider span={5} service="postgres" message="GET /stack · reading the layers" tone="text-blue" />
        <Stack />
        <HopDivider span={6} service="worker" message="GET /education · message consumed" tone="text-violet" />
        <Education />
        <InversionCircle
          kicker="span 7/7 · HTTP/1.1 200 OK"
          title={
            <>
              Every request
              <br />
              ends with a response.
            </>
          }
          subtitle="Yours is next."
        />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
