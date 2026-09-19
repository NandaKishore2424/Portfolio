"use client";

import { useMemo, useRef, useState, type ReactNode, type RefObject } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { Edges, Grid, Html, Line, PerformanceMonitor, Sparkles } from "@react-three/drei";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { easing } from "maath";
import { journey } from "@/content/profile";
import { scrollToTarget } from "@/components/providers/smooth-scroll";
import { cn } from "@/lib/utils";
import { journeyStore, useActiveStop } from "./journey-store";
import { edges, nodeById, nodes, waypoints, type TopologyEdge, type TopologyNode } from "./topology";

const FLOOR_Y = -3.7;
const stopOrder = journey.map((s) => s.id);
const nodeForStop = Object.fromEntries(journey.map((s) => [s.id, s.node])) as Record<string, string>;
const pathForSection = Object.fromEntries(journey.map((s) => [s.id, s.path])) as Record<string, string>;

/** Pointer events reach the scene only through the hero backdrop, never through content. */
function passesThrough(e: ThreeEvent<PointerEvent | MouseEvent>) {
  const target = e.nativeEvent.target as HTMLElement | null;
  if (!target?.closest) return false;
  return !!target.closest("[data-scene-pass]") && !target.closest("[data-scene-block]");
}

/** Deterministic PRNG so geometry is stable across renders (mulberry32). */
function seeded(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function glow(color: string, strength: number) {
  return new THREE.Color(color).multiplyScalar(strength);
}

/* ------------------------------------------------------------------ */
/* Camera                                                              */
/* ------------------------------------------------------------------ */

function CameraRig({ reduced }: { reduced: boolean }) {
  const scratch = useRef({
    look: new THREE.Vector3(...waypoints.top.target),
    pos: new THREE.Vector3(),
    target: new THREE.Vector3(),
    a: new THREE.Vector3(),
    b: new THREE.Vector3(),
  });

  useFrame((state, delta) => {
    const { look, pos, target, a, b } = scratch.current;
    const { progress } = journeyStore.get();
    const i = Math.min(Math.floor(progress), stopOrder.length - 1);
    const f = progress - i;
    const from = waypoints[stopOrder[i]];
    const to = waypoints[stopOrder[Math.min(i + 1, stopOrder.length - 1)]];

    pos.lerpVectors(a.set(...from.position), b.set(...to.position), f);
    target.lerpVectors(a.set(...from.target), b.set(...to.target), f);

    // Portrait screens need the camera further back to keep the graph in frame.
    const aspect = state.size.width / state.size.height;
    const pullBack = aspect < 1.5 ? Math.min(2.1, 1.5 / aspect) : 1;
    pos.sub(target).multiplyScalar(pullBack).add(target);

    // Lens shift: wide screens keep the graph clear of the left-hand copy.
    const w = state.size.width;
    const h = state.size.height;
    const shift = aspect > 1.2 ? THREE.MathUtils.lerp(from.shift ?? 0, to.shift ?? 0, f) : 0;
    const cam = state.camera as THREE.PerspectiveCamera;
    cam.setViewOffset(w, h, -shift * w, 0, w, h);

    if (!reduced) {
      pos.x += state.pointer.x * 0.7;
      pos.y += state.pointer.y * 0.4;
      easing.damp3(state.camera.position, pos, 0.5, delta);
      easing.damp3(look, target, 0.5, delta);
    } else {
      state.camera.position.copy(pos);
      look.copy(target);
    }
    state.camera.lookAt(look);
  });

  return null;
}

/* ------------------------------------------------------------------ */
/* Edges and packets                                                   */
/* ------------------------------------------------------------------ */

function FlowEdge({ edge, reduced }: { edge: TopologyEdge; reduced: boolean }) {
  const curve = useMemo(() => {
    const start = new THREE.Vector3(...nodeById[edge.from].position);
    const end = new THREE.Vector3(...nodeById[edge.to].position);
    const mid = start.clone().lerp(end, 0.5);
    mid.y += edge.lift;
    mid.z += edge.lift * 0.35;
    return new THREE.QuadraticBezierCurve3(start, mid, end);
  }, [edge]);

  const points = useMemo(() => curve.getPoints(56), [curve]);
  const packetColor = useMemo(() => glow(edge.color, 2.6), [edge.color]);
  // drei's Line forwards a Line2; its material exposes dashOffset/opacity.
  const line = useRef<{ material: { dashOffset: number; opacity: number } } | null>(null);
  const packets = useRef<THREE.InstancedMesh>(null);
  const heat = useRef(0);
  const dummy = useRef(new THREE.Object3D());
  const offsets = useMemo(() => {
    const rand = seeded(edge.from.length * 31 + edge.to.length * 7 + edge.packets);
    return Array.from({ length: edge.packets }, (_, i) => i / edge.packets + rand() * 0.08);
  }, [edge.from, edge.to, edge.packets]);

  useFrame((state, delta) => {
    const hot = edge.hot.includes(journeyStore.get().active);
    heat.current = THREE.MathUtils.damp(heat.current, hot ? 1 : 0, 3, delta);

    if (line.current) {
      if (!reduced) line.current.material.dashOffset -= delta * (0.5 + heat.current * 1.2);
      line.current.material.opacity = 0.16 + heat.current * 0.5;
    }

    const mesh = packets.current;
    const d = dummy.current;
    if (!mesh) return;
    const t = reduced ? 0 : state.clock.elapsedTime;
    const speed = edge.speed * (1 + heat.current * 0.7);
    for (let i = 0; i < edge.packets; i++) {
      const u = (t * speed + offsets[i]) % 1;
      curve.getPointAt(u, d.position);
      d.scale.setScalar((0.04 + heat.current * 0.025) * (0.6 + Math.sin(u * Math.PI) * 0.6));
      d.updateMatrix();
      mesh.setMatrixAt(i, d.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      <Line
        // @ts-expect-error drei's Line ref is a Line2; we only touch its material.
        ref={line}
        points={points}
        color={edge.color}
        lineWidth={1.25}
        dashed
        dashSize={0.22}
        gapSize={0.16}
        transparent
        opacity={0.2}
        toneMapped={false}
      />
      <instancedMesh ref={packets} args={[undefined, undefined, edge.packets]} frustumCulled={false}>
        <sphereGeometry args={[1, 14, 14]} />
        <meshBasicMaterial color={packetColor} toneMapped={false} />
      </instancedMesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Nodes                                                               */
/* ------------------------------------------------------------------ */

const bodyMaterial = (
  <meshStandardMaterial color="#0c1320" metalness={0.55} roughness={0.32} envMapIntensity={0.4} />
);

function Outlined({ color, children }: { color: string; children: ReactNode }) {
  return (
    <>
      {children}
      {bodyMaterial}
      <Edges color={color} threshold={20} />
    </>
  );
}

function VectorCloud({ color }: { color: string }) {
  const geometry = useMemo(() => {
    const count = 180;
    const rand = seeded(1337);
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 0.75 * Math.cbrt(rand());
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.cos(phi);
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, []);
  return (
    <points geometry={geometry}>
      <pointsMaterial color={glow(color, 1.6)} size={0.045} sizeAttenuation toneMapped={false} />
    </points>
  );
}

function NodeShape({ node, spin }: { node: TopologyNode; spin: React.RefObject<THREE.Group | null> }) {
  const { color } = node;
  switch (node.kind) {
    case "client":
      return (
        <group>
          <mesh>
            <Outlined color={color}>
              <boxGeometry args={[1.7, 1.08, 0.08]} />
            </Outlined>
          </mesh>
          {[0.26, 0.08, -0.1, -0.28].map((y, i) => (
            <mesh key={y} position={[-0.32 + (i % 2) * 0.12, y, 0.05]}>
              <planeGeometry args={[0.9 - i * 0.14, 0.05]} />
              <meshBasicMaterial color={glow(color, 0.9)} transparent opacity={0.45} toneMapped={false} />
            </mesh>
          ))}
          <mesh position={[0, -0.74, 0]}>
            <Outlined color={color}>
              <boxGeometry args={[0.5, 0.06, 0.3]} />
            </Outlined>
          </mesh>
        </group>
      );
    case "gateway":
      return (
        <group ref={spin}>
          <mesh>
            <Outlined color={color}>
              <octahedronGeometry args={[0.72, 0]} />
            </Outlined>
          </mesh>
        </group>
      );
    case "auth":
      return (
        <group>
          <group ref={spin}>
            <mesh>
              <Outlined color={color}>
                <dodecahedronGeometry args={[0.46, 0]} />
              </Outlined>
            </mesh>
          </group>
          <mesh rotation={[Math.PI / 2.4, 0, 0]}>
            <torusGeometry args={[0.78, 0.018, 8, 64]} />
            <meshBasicMaterial color={glow(color, 1.4)} toneMapped={false} />
          </mesh>
        </group>
      );
    case "service":
      return (
        <group>
          {[0.26, -0.18].map((y) => (
            <group key={y} position={[0, y, 0]}>
              <mesh>
                <Outlined color={color}>
                  <boxGeometry args={[1.4, 0.34, 0.95]} />
                </Outlined>
              </mesh>
              {[-0.5, -0.38, -0.26].map((x) => (
                <mesh key={x} position={[x, 0, 0.48]}>
                  <boxGeometry args={[0.06, 0.06, 0.02]} />
                  <meshBasicMaterial color={glow(color, 2)} toneMapped={false} />
                </mesh>
              ))}
            </group>
          ))}
        </group>
      );
    case "database":
      return (
        <group>
          {[0.36, 0, -0.36].map((y) => (
            <mesh key={y} position={[0, y, 0]}>
              <Outlined color={color}>
                <cylinderGeometry args={[0.74, 0.74, 0.26, 40]} />
              </Outlined>
            </mesh>
          ))}
        </group>
      );
    case "outbox":
      return (
        <group ref={spin} rotation={[0.35, 0.6, 0]}>
          <mesh>
            <Outlined color={color}>
              <boxGeometry args={[0.8, 0.8, 0.8]} />
            </Outlined>
          </mesh>
        </group>
      );
    case "broker":
      return (
        <group>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.7, 0.05, 12, 72]} />
            <meshStandardMaterial color="#0c1320" metalness={0.6} roughness={0.3} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.7, 0.012, 6, 72]} />
            <meshBasicMaterial color={glow(color, 1.6)} toneMapped={false} />
          </mesh>
          <group ref={spin}>
            {Array.from({ length: 7 }, (_, i) => {
              const a = (i / 7) * Math.PI * 2;
              return (
                <mesh key={i} position={[Math.cos(a) * 0.7, 0, Math.sin(a) * 0.7]} rotation={[0, -a, 0]}>
                  <boxGeometry args={[0.16, 0.16, 0.16]} />
                  <meshBasicMaterial color={glow(color, 1.8)} toneMapped={false} />
                </mesh>
              );
            })}
          </group>
        </group>
      );
    case "worker":
      return (
        <group ref={spin}>
          <mesh>
            <icosahedronGeometry args={[0.7, 1]} />
            <meshBasicMaterial color={glow(color, 1.2)} wireframe transparent opacity={0.55} toneMapped={false} />
          </mesh>
        </group>
      );
    case "vector":
      return (
        <group ref={spin}>
          <VectorCloud color={color} />
        </group>
      );
  }
}

function TopologyNodeMesh({
  node,
  reduced,
  labelsRef,
}: {
  node: TopologyNode;
  reduced: boolean;
  labelsRef: RefObject<HTMLDivElement | null>;
}) {
  const group = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const core = useRef<THREE.MeshBasicMaterial>(null);
  const halo = useRef<THREE.MeshBasicMaterial>(null);
  const heat = useRef(0);
  const [hovered, setHovered] = useState(false);
  const active = useActiveStop();
  const base = useMemo(() => new THREE.Color(node.color), [node.color]);
  const seed = useMemo(() => node.position[0] * 1.7, [node.position]);

  const isFocus = nodeForStop[active] === node.id;
  // Labels belong to the hero, where the graph is the subject. Behind section
  // copy they'd collide with headings, and on phones the scene is decoration.
  const narrow = useThree((state) => state.size.width < 768);
  const showLabel = !narrow && ((active === "top" && !node.quietInHero) || hovered);

  useFrame((state, delta) => {
    const focus = nodeForStop[journeyStore.get().active] === node.id || hovered;
    heat.current = THREE.MathUtils.damp(heat.current, focus ? 1 : 0, 4, delta);
    const t = reduced ? 0 : state.clock.elapsedTime;
    if (group.current) {
      group.current.position.y = node.position[1] + Math.sin(t * 0.8 + seed) * 0.07;
      const s = 1 + heat.current * 0.12;
      group.current.scale.setScalar(s);
    }
    if (spin.current && !reduced) spin.current.rotation.y += delta * (0.2 + heat.current * 0.7);
    core.current?.color.copy(base).multiplyScalar(1.2 + heat.current * 3.2);
    if (halo.current) halo.current.opacity = 0.08 + heat.current * 0.55;
  });

  const onOver = (e: ThreeEvent<PointerEvent>) => {
    if (!passesThrough(e)) return;
    e.stopPropagation();
    setHovered(true);
    journeyStore.set({ hovered: node.id });
    if (node.section) document.body.style.cursor = "pointer";
  };
  const onOut = () => {
    setHovered(false);
    if (journeyStore.get().hovered === node.id) journeyStore.set({ hovered: null });
    document.body.style.cursor = "";
  };
  const onClick = (e: ThreeEvent<MouseEvent>) => {
    if (!node.section || !passesThrough(e)) return;
    e.stopPropagation();
    scrollToTarget(`#${node.section}`);
  };

  return (
    <group position={node.position}>
      <group ref={group} position={[0, 0, 0]}>
        <group onPointerOver={onOver} onPointerOut={onOut} onClick={onClick}>
          <NodeShape node={node} spin={spin} />
          <mesh>
            <sphereGeometry args={[node.kind === "client" ? 0.08 : 0.15, 20, 20]} />
            <meshBasicMaterial ref={core} color={base} toneMapped={false} />
          </mesh>
        </group>
        <Html
          portal={labelsRef as RefObject<HTMLElement>}
          position={[0, node.kind === "database" ? 1.05 : 1.15, 0]}
          center
          distanceFactor={11}
          zIndexRange={[5, 0]}
          style={{ pointerEvents: "none" }}
        >
          <div
            className={cn(
              "flex select-none flex-col items-center whitespace-nowrap font-mono transition-all duration-500",
              showLabel ? "opacity-100" : "opacity-0",
              hovered || isFocus ? "scale-110" : "scale-100",
            )}
          >
            <span
              className="rounded-full border px-2.5 py-0.5 text-[13px] font-medium tracking-tight backdrop-blur-sm"
              style={{
                color: node.color,
                borderColor: `${node.color}55`,
                background: "rgba(5,7,11,0.72)",
              }}
            >
              {node.label}
            </span>
            <span className="mt-1 text-[10.5px] text-fg-muted">{node.sub}</span>
            {hovered && node.section ? (
              <span className="mt-1 text-[10px] text-fg-dim">click → {pathForSection[node.section]}</span>
            ) : null}
          </div>
        </Html>
      </group>

      {/* ground pin + halo */}
      <Line
        points={[
          [0, -0.9, 0],
          [0, FLOOR_Y - node.position[1], 0],
        ]}
        color={node.color}
        lineWidth={0.6}
        transparent
        opacity={0.18}
        dashed
        dashSize={0.08}
        gapSize={0.08}
      />
      <mesh position={[0, FLOOR_Y - node.position[1] + 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.62, 0.7, 64]} />
        <meshBasicMaterial ref={halo} color={glow(node.color, 1.5)} transparent opacity={0.1} toneMapped={false} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Scene                                                               */
/* ------------------------------------------------------------------ */

export default function TopologyScene({
  reduced,
  labelsRef,
  onReady,
}: {
  reduced: boolean;
  labelsRef: RefObject<HTMLDivElement | null>;
  onReady?: () => void;
}) {
  const [degraded, setDegraded] = useState(false);

  return (
    <Canvas
      dpr={degraded ? 1 : [1, 1.75]}
      camera={{ position: waypoints.top.position, fov: 40, near: 0.1, far: 90 }}
      gl={{ antialias: false, powerPreference: "high-performance", alpha: false, stencil: false }}
      eventSource={typeof document !== "undefined" ? document.body : undefined}
      eventPrefix="client"
      onCreated={() => onReady?.()}
    >
      <color attach="background" args={["#05070b"]} />
      <fog attach="fog" args={["#05070b", 14, 40]} />
      <PerformanceMonitor onDecline={() => setDegraded(true)} flipflops={2} onFallback={() => setDegraded(true)} />

      <ambientLight intensity={0.45} />
      <hemisphereLight args={["#bcd7ff", "#05070b", 0.5]} />
      <pointLight position={[0, 6, 8]} intensity={40} distance={30} color="#a5e8ff" />
      <pointLight position={[8, 2, 4]} intensity={18} distance={20} color="#c4b5fd" />

      <CameraRig reduced={reduced} />

      {nodes.map((n) => (
        <TopologyNodeMesh key={n.id} node={n} reduced={reduced} labelsRef={labelsRef} />
      ))}
      {edges.map((e) => (
        <FlowEdge key={`${e.from}-${e.to}`} edge={e} reduced={reduced} />
      ))}

      <Grid
        position={[0, FLOOR_Y, 0]}
        args={[80, 80]}
        cellSize={0.6}
        cellThickness={0.6}
        cellColor="#142030"
        sectionSize={3}
        sectionThickness={1}
        sectionColor="#1d3346"
        fadeDistance={42}
        fadeStrength={1.6}
        infiniteGrid
      />
      {!reduced && (
        <Sparkles count={80} scale={[30, 10, 16]} size={1.8} speed={0.22} opacity={0.35} color="#9fb6cc" />
      )}

      {!degraded && (
        <EffectComposer multisampling={0}>
          <Bloom mipmapBlur intensity={0.95} luminanceThreshold={0.62} luminanceSmoothing={0.2} />
          <Vignette offset={0.28} darkness={0.72} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
