import { ImageResponse } from "next/og";
import { caseStudies, getProject, projects } from "@/content/projects";
import { profile } from "@/content/profile";

// Link-preview card for a case study (LinkedIn Featured, Slack, X). Same
// visual language as the site-wide card in app/opengraph-image.tsx.

export const alt = "Backend case study by Nanda Kishore R";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

const accents = { amber: "#fbbf24", violet: "#a78bfa" } as const;

export default async function CaseStudyImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return new Response("Not found", { status: 404 });
  const cs = caseStudies[project.slug];
  const accent = accents[project.accent];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#05070b",
          color: "#e7edf5",
          position: "relative",
          fontFamily: "sans-serif",
          padding: "64px 72px",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(148,163,184,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.07) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 24, color: "#627085", display: "flex" }}>
            <span style={{ color: "#5eead4" }}>GET</span>&nbsp;/projects/{project.slug} →&nbsp;
            <span style={{ color: "#4ade80" }}>200 OK</span>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 20,
              color: accent,
              border: `2px solid ${accent}`,
              borderRadius: 999,
              padding: "6px 18px",
              background: "rgba(5,7,11,0.85)",
            }}
          >
            Case study
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 96, fontWeight: 700, letterSpacing: -3, marginTop: 40, lineHeight: 1 }}>
          <span>{project.name}</span>
          <span style={{ color: accent, marginLeft: -12 }}>.</span>
        </div>
        <div style={{ fontSize: 36, color: "#c9d3df", marginTop: 24, lineHeight: 1.3, maxWidth: 960 }}>
          {cs.headline}
        </div>

        <div style={{ display: "flex", gap: 16, marginTop: "auto" }}>
          {project.stats.map((s) => (
            <div
              key={s.label}
              style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                padding: "14px 18px",
                borderRadius: 14,
                border: "1px solid rgba(148,163,184,0.22)",
                background: "rgba(11,16,25,0.9)",
              }}
            >
              <div style={{ fontSize: 40, fontWeight: 700, color: accent }}>
                {`${s.prefix ?? ""}${s.value.toLocaleString("en-US")}${s.suffix ?? ""}`}
              </div>
              <div style={{ fontSize: 19, color: "#9aa7b8", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 21, color: "#627085", marginTop: 30 }}>
          <span>{profile.name} · Software Engineer, Backend</span>
          <span>nandakishorer.vercel.app</span>
        </div>
      </div>
    ),
    size,
  );
}
