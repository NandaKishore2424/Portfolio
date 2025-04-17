"use client";

import React, { useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, Float, PresentationControls, Environment, ContactShadows, Stars } from "@react-three/drei";
import { Vector3, MathUtils } from "three";

interface TechLogoProps {
  position: [number, number, number];
  color: string;
  logoName: string;
  size?: number;
}

function TechLogo({ position, color, logoName, size = 0.5 }: TechLogoProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.scale.x = MathUtils.lerp(
        meshRef.current.scale.x,
        hovered ? 1.2 : 1,
        0.1
      );
      meshRef.current.scale.y = meshRef.current.scale.x;
      meshRef.current.scale.z = meshRef.current.scale.x;
      
      meshRef.current.rotation.y += 0.01;
      if (hovered) meshRef.current.rotation.z += 0.02;
    }
  });
  
  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh 
        ref={meshRef}
        position={position}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onPointerDown={() => setClicked(true)}
        onPointerUp={() => setClicked(false)}
      >
        {}
        {logoName === "React" ? (
          <torusGeometry args={[size, size/4, 16, 32]} />
        ) : logoName === "Next.js" ? (
          <boxGeometry args={[size, size, size/4]} />
        ) : logoName === "TypeScript" ? (
          <octahedronGeometry args={[size]} />
        ) : logoName === "GitHub" ? (
          <sphereGeometry args={[size, 32, 32]} />
        ) : (
          <cylinderGeometry args={[size, size, size/2, 32]} />
        )}
        
        <meshStandardMaterial 
          color={color} 
          transparent 
          opacity={hovered ? 0.7 : 0.9}
          wireframe={hovered}
          metalness={0.6}
          roughness={0.2}
          emissive={hovered ? color : "#000000"}
          emissiveIntensity={hovered ? 0.4 : 0}
        />
        
        <Html
          center
          distanceFactor={10}
          position={[0, -size*1.5, 0]}
          style={{
            opacity: hovered ? 1 : 0.7,
            transition: 'opacity 0.3s',
            backgroundColor: 'rgba(0,0,0,0.5)',
            padding: '3px 6px',
            borderRadius: '4px',
            pointerEvents: 'none',
          }}
        >
          <div className="text-[10px] font-mono text-white">{logoName}</div>
        </Html>
      </mesh>
    </Float>
  );
}

function TechLogoOrbit() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group ref={groupRef} scale={0.7}>
      <TechLogo position={[0, 0, 2]} color="#61DAFB" logoName="React" />
      <TechLogo position={[2, 1, -1]} color="#007acc" logoName="TypeScript" />
      <TechLogo position={[-2, -1, 0]} color="#000000" logoName="Next.js" />
      <TechLogo position={[1, -2, -1]} color="#2496ED" logoName="Docker" />
      <TechLogo position={[-1, 1.5, 1]} color="#6e5494" logoName="GitHub" />
      <TechLogo position={[2, -1, 1]} color="#F1502F" logoName="Git" />
      <TechLogo position={[-2, 0, -2]} color="#339933" logoName="Node.js" />
    </group>
  );
}

export default function Hero3DScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{
          position: [0, 0, 10], 
          fov: 25 
        }}
        dpr={[1, 2]}
        gl={{ 
          antialias: true,
          alpha: true,
          precision: "highp" 
        }}
        style={{ 
          background: 'transparent',
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'auto'
        }}
      >
        <ambientLight intensity={0.5} />
        
        <directionalLight position={[5, 5, 5]} intensity={0.6} />
        <directionalLight position={[-5, -5, -5]} intensity={0.4} color="#6e8fff" />
        
        <Suspense fallback={
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshBasicMaterial color="#444" wireframe />
          </mesh>
        }>
          <PresentationControls
            global
            rotation={[0, 0, 0]}
            polar={[-Math.PI / 4, Math.PI / 4]} 
            azimuth={[-Math.PI / 2, Math.PI / 2]}
            config={{ mass: 2, tension: 150, friction: 30 }} 
            snap={false}
          >
            <TechLogoOrbit /> 
            
            <Environment preset="sunset" intensity={0.5} />
            <Stars 
              radius={100}
              depth={50}
              count={8000}
              factor={6}
              saturation={0}
              fade
              speed={1}
            />
          </PresentationControls>
        </Suspense>
        
        <ContactShadows
          position={[0, -2, 0]}
          opacity={0.1} 
          scale={8} 
          blur={3.5}
          far={3}
        />
      </Canvas>

      <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-white/50 mix-blend-overlay pointer-events-none">
        Drag to rotate • Hover over logos
      </div>
    </div>
  );
}