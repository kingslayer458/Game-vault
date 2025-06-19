import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Box, Torus } from '@react-three/drei';
import { motion } from 'framer-motion';

function FloatingShape({ position, color, shape }: { position: [number, number, number], color: string, shape: 'sphere' | 'box' | 'torus' }) {
  const meshRef = useRef<any>();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.5;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.5;
    }
  });

  const ShapeComponent = shape === 'sphere' ? Sphere : shape === 'box' ? Box : Torus;
  const args = shape === 'sphere' ? [0.5, 16, 16] : shape === 'box' ? [1, 1, 1] : [0.5, 0.2, 16, 32];

  return (
    <ShapeComponent ref={meshRef} position={position} args={args as any}>
      <meshStandardMaterial color={color} transparent opacity={0.3} />
    </ShapeComponent>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      
      <FloatingShape position={[-8, 2, -5]} color="#3b82f6" shape="sphere" />
      <FloatingShape position={[8, -2, -3]} color="#8b5cf6" shape="box" />
      <FloatingShape position={[-5, -3, -4]} color="#ec4899" shape="torus" />
      <FloatingShape position={[6, 3, -6]} color="#10b981" shape="sphere" />
      <FloatingShape position={[0, -4, -2]} color="#f59e0b" shape="box" />
    </>
  );
}

export function FloatingElements() {
  return (
    <motion.div 
      className="fixed inset-0 -z-10 opacity-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.2 }}
      transition={{ duration: 2 }}
    >
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <Scene />
      </Canvas>
    </motion.div>
  );
}