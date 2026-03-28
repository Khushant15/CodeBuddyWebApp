"use client";
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, Points, PointMaterial } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

function ParticleField({ count = 1000 }) {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 20;
      p[i * 3 + 1] = (Math.random() - 0.5) * 20;
      p[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return p;
  }, [count]);

  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
      pointsRef.current.rotation.x = state.clock.getElapsedTime() * 0.03;
    }
  });

  return (
    <Points positions={points} ref={pointsRef}>
      <PointMaterial
        transparent
        color="#3B82F6"
        size={0.03}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.2}
      />
    </Points>
  );
}

function FloatingShape({ position, color, speed, distort }: any) {
  return (
    <Float speed={speed} rotationIntensity={1} floatIntensity={1}>
      <Sphere args={[1.2, 64, 64]} position={position}>
        <MeshDistortMaterial
          color={color}
          speed={speed}
          distort={distort}
          radius={1}
          opacity={0.05}
          transparent
        />
      </Sphere>
    </Float>
  );
}

export default function Scene3D() {
  return (
    <div className="fixed inset-0 layer-0 pointer-events-none overflow-hidden">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }} dpr={[1, 2]} performance={{ min: 0.5 }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={0.5} color="#3B82F6" />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#6366f1" />
        
        <SceneContent />
      </Canvas>
    </div>
  );
}

function SceneContent() {
  const { size } = useThree();
  const isMobile = size.width < 768;

  return (
    <>
      <ParticleField count={isMobile ? 200 : 500} />
      
      {!isMobile && (
        <>
          <FloatingShape position={[5, 2, -3]} color="#3B82F6" speed={1} distort={0.2} />
          <FloatingShape position={[-5, -3, -2]} color="#6366f1" speed={0.8} distort={0.3} />
        </>
      )}
      
      {isMobile && (
        <FloatingShape position={[0, 0, -6]} color="#3B82F6" speed={0.5} distort={0.1} />
      )}
    </>
  );
}
