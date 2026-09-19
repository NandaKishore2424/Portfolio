import { ImageResponse } from "next/og";

export const alt = "Nanda Kishore R, Software Engineer (Backend)";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const nodes = [
  { x: 870, y: 70, c: "#5eead4", l: "REST API" },
  { x: 1000, y: 165, c: "#4ade80", l: "Auth" },
  { x: 880, y: 255, c: "#5eead4", l: "Services" },
  { x: 960, y: 350, c: "#60a5fa", l: "PostgreSQL" },
  { x: 870, y: 450, c: "#fbbf24", l: "RabbitMQ" },
  { x: 1010, y: 540, c: "#a78bfa", l: "Worker" },
];

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#05070b",
          color: "#e7edf5",
          position: "relative",
          fontFamily: "sans-serif",
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
        {nodes.map((n) => (
          <div
            key={n.l}
            style={{
              position: "absolute",
              left: n.x,
              top: n.y,
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 16px",
              borderRadius: 999,
              border: `2px solid ${n.c}`,
              color: n.c,
              fontSize: 22,
              background: "rgba(5,7,11,0.85)",
              boxShadow: `0 0 40px ${n.c}55`,
            }}
          >
            <div style={{ width: 10, height: 10, borderRadius: 999, background: n.c }} />
            {n.l}
          </div>
        ))}
        <div style={{ display: "flex", flexDirection: "column", padding: "80px 72px" }}>
          <div style={{ fontSize: 26, color: "#627085", display: "flex" }}>
            <span style={{ color: "#5eead4" }}>GET</span>&nbsp;/whoami →&nbsp;<span style={{ color: "#4ade80" }}>200 OK</span>
          </div>
          <div style={{ fontSize: 92, fontWeight: 700, letterSpacing: -3, marginTop: 28, lineHeight: 1 }}>Nanda Kishore R</div>
          <div style={{ fontSize: 44, marginTop: 22, display: "flex" }}>
            Software Engineer —&nbsp;<span style={{ color: "#5eead4", fontStyle: "italic" }}>Backend</span>
          </div>
          <div style={{ fontSize: 26, color: "#9aa7b8", marginTop: 34, maxWidth: 560, lineHeight: 1.4 }}>
            Java 17 · Spring Boot · PostgreSQL · Python / FastAPI · RabbitMQ
          </div>
          <div style={{ fontSize: 22, color: "#627085", marginTop: 60 }}>nandakishorer.vercel.app</div>
        </div>
      </div>
    ),
    size,
  );
}
