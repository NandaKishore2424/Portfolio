"use client";

import React, { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, Float, OrbitControls, PresentationControls, Text, useGLTF, Environment, ContactShadows } from "@react-three/drei";

function CodeBlock({ position, rotation, scale, color, text }) {
  return (
    <Float
      speed={1.5} 
      rotationIntensity={0.2} 
      floatIntensity={0.5}
      position={position}
    >
      <mesh scale={scale} rotation={rotation}>
        <boxGeometry args={[1, 1, 0.05]} />
        <meshStandardMaterial 
          color={color} 
          transparent 
          opacity={0.8}
          roughness={0.3}
          metalness={0.3}
        />
        <Html
          transform
          occlude
          position={[0, 0, 0.03]}
          className="w-44 h-44 flex items-center justify-center"
          style={{ pointerEvents: 'none' }}
        >
          <div className="bg-transparent p-2 text-[8px] font-mono" style={{ color: '#ffffff' }}>
            {text.split('\n').map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        </Html>
      </mesh>
    </Float>
  );
}

function LaptopModel({ position = [0, -0.1, 0], scale = 0.8 }) {  
  const laptop = useRef();
  const { scene } = useGLTF("/models/laptop.glb");
  
  useFrame((state) => {
    if (laptop.current) {
      laptop.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 0.5) * 0.02;  // Reduced movement
    }
  });

  return (
    <primitive 
      ref={laptop}
      object={scene} 
      position={position} 
      scale={[scale, scale, scale]}
      dispose={null}
    />
  );
}

function FloatingParticles({ count = 50 }) {
  const mesh = useRef();
  const [particles] = useState(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 10;
      const y = (Math.random() - 0.5) * 10;
      const z = (Math.random() - 0.5) * 10;
      temp.push({ position: [x, y, z], speed: Math.random() * 0.01 });
    }
    return temp;
  });

  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.x += 0.001;
      mesh.current.rotation.y += 0.002;
    }
  });

  return (
    <group ref={mesh}>
      {particles.map((particle, i) => (
        <mesh key={i} position={particle.position}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial 
            color="#4285F4" 
            transparent 
            opacity={0.6}
            emissive="#4285F4"
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}
    </group>
  );
}

function SpinningTechStack({ position }) {
  const group = useRef();
  const technologies = [
    { name: "React", color: "#61DAFB" },
    { name: "Next.js", color: "#000000" },
    { name: "TypeScript", color: "#3178C6" },
    { name: "Python", color: "#3776AB" },
    { name: "TensorFlow", color: "#FF6F00" }
  ];

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <group ref={group} position={position}>
      {technologies.map((tech, i) => {
        const angle = (i / technologies.length) * Math.PI * 2;
        const x = Math.cos(angle) * 2;
        const z = Math.sin(angle) * 2;
        return (
          <Float key={i} position={[x, 0, z]} speed={1.5} rotationIntensity={1} floatIntensity={0.5}>
            <Text
              fontSize={0.3}
              color={tech.color}
              anchorX="center"
              anchorY="middle"
            >
              {tech.name}
            </Text>
          </Float>
        );
      })}
    </group>
  );
}

function PlanetModel({ position = [0, 0, 0], scale = 3.0 }) {  
  const planet = useRef();
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  
  const { scene, error } = useGLTF("/models/planet.glb", true);
  
  useEffect(() => {
    if (error) {
      console.error("Error loading planet model:", error);
    }
  }, [error]);

  useFrame((state) => {
    if (planet.current) {
      planet.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 0.5) * 0.03;
      
      if (!hovered && !clicked) {
        planet.current.rotation.y += 0.001;
      }
    }
  });

  if (error) {
    return (
      <mesh position={position}>
        <sphereGeometry args={[3, 32, 32]} /> {}
        <meshStandardMaterial color="#6495ED" metalness={0.4} roughness={0.7} />
      </mesh>
    );
  }

  return (
    <primitive 
      ref={planet}
      object={scene} 
      position={position}
      scale={[scale, scale, scale]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onPointerDown={() => setClicked(true)}
      onPointerUp={() => setClicked(false)}
      dispose={null}
    />
  );
}

export default function Hero3DScene() {
  return (
    <div className="w-full h-[500px]"> {}
      <Canvas
        camera={{
          position: [0, 0, 6], 
          fov: 30 
        }}
        dpr={[1, 2]}
        gl={{ 
          antialias: true,
          alpha: true,
          precision: "highp" 
        }}
        style={{ background: 'transparent' }}
      >
        {/* Ambient lighting */}
        <ambientLight intensity={0.5} />
        
        {/* Directional lighting for planet highlights */}
        <directionalLight position={[5, 5, 5]} intensity={0.6} />
        <directionalLight position={[-5, -5, -5]} intensity={0.4} color="#6e8fff" />
        
        {/* Add Suspense to handle loading */}
        <Suspense fallback={
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[3, 16, 16]} /> {/* Larger fallback sphere */}
            <meshBasicMaterial color="#444" wireframe />
          </mesh>
        }>
          {/* Enhanced user control with full 360 degree rotation */}
          <PresentationControls
            global
            rotation={[0, 0, 0]}
            polar={[-Math.PI / 4, Math.PI / 4]} 
            azimuth={[-Math.PI / 2, Math.PI / 2]}
            config={{ mass: 2, tension: 150, friction: 30 }} 
            snap={false}
          >
            {/* Planet model */}
            <PlanetModel /> 
            
            {/* Environment lighting for better materials */}
            <Environment preset="sunset" intensity={0.5} />
          </PresentationControls>
        </Suspense>
        
        {/* Adjusted shadow position and scale for larger planet */}
        <ContactShadows
          position={[0, -2, 0]}
          opacity={0.1} 
          scale={8} 
          blur={3.5}
          far={3}
        />
      </Canvas>

      {/* Subtle instruction text */}
      <div className="absolute bottom-2 left-0 right-0 text-center text-xs text-muted-foreground opacity-50 pointer-events-none">
        Drag to rotate
      </div>
    </div>
  );
}