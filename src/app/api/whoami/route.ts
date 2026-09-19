import { profile } from "@/content/profile";
import { projects } from "@/content/projects";

// The hero's terminal calls this endpoint; it's real, so `curl` it.
export const dynamic = "force-static";

export function GET() {
  return Response.json(
    {
      ...profile.whoami,
      links: {
        github: profile.github,
        linkedin: profile.linkedin,
        resume: `${profile.siteUrl}${profile.resume}`,
      },
      projects: projects.map((p) => ({
        name: p.name,
        summary: p.tagline,
        repo: p.repo,
        case_study: `${profile.siteUrl}/projects/${p.slug}`,
      })),
      contact: `mailto:${profile.email}`,
    },
    {
      headers: {
        "Cache-Control": "public, max-age=3600",
        "Access-Control-Allow-Origin": "*",
      },
    },
  );
}
