import React, { useRef } from 'react';
import { Box, Sphere } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const DJCharacter: React.FC = () => {
    const groupRef = useRef<THREE.Group>(null);
    const leftArmRef = useRef<THREE.Mesh>(null);
    const rightArmRef = useRef<THREE.Mesh>(null);
    const headGroupRef = useRef<THREE.Group>(null);

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        if (leftArmRef.current) {
            // Hand on headphone or mixer
            leftArmRef.current.rotation.x = Math.sin(t * 8) * 0.2 - 0.5;
        }
        if (rightArmRef.current) {
            // Hand moving on mixer
            rightArmRef.current.rotation.x = Math.cos(t * 8) * 0.2 - 0.5;
            rightArmRef.current.position.z = 0.2 + Math.sin(t * 4) * 0.05;
        }
        if (headGroupRef.current) {
            // Head bobbing
            headGroupRef.current.position.y = 1.65 + Math.abs(Math.sin(t * 4)) * 0.05;
            headGroupRef.current.rotation.z = Math.sin(t * 2) * 0.1;
        }
    });

    return (
        <group ref={groupRef} position={[0, 0.1, 0.6]} scale={1.15}>
            {/* Legs */}
            <Box args={[0.15, 0.9, 0.15]} position={[-0.2, 0.45, 0]}>
                <meshStandardMaterial color="#111" />
            </Box>
            <Box args={[0.15, 0.9, 0.15]} position={[0.2, 0.45, 0]}>
                <meshStandardMaterial color="#111" />
            </Box>
            {/* Torso */}
            <Box args={[0.45, 0.5, 0.2]} position={[0, 1.15, 0]}>
                <meshStandardMaterial color="#333" />
            </Box>
            {/* Head */}
            <group ref={headGroupRef} position={[0, 1.65, 0]}>
                 <Sphere args={[0.14, 16, 16]}>
                    <meshStandardMaterial color="#e0ac69" />
                 </Sphere>
                 {/* Headphones */}
                 <Box args={[0.32, 0.05, 0.05]} position={[0, 0.1, 0]}><meshStandardMaterial color="#888" /></Box>
                 <Box args={[0.05, 0.15, 0.15]} position={[-0.15, 0, 0]}><meshStandardMaterial color="#111" /></Box>
                 <Box args={[0.05, 0.15, 0.15]} position={[0.15, 0, 0]}><meshStandardMaterial color="#111" /></Box>
            </group>
            
            {/* Arms */}
            <Box ref={leftArmRef} args={[0.1, 0.5, 0.1]} position={[-0.28, 1.3, 0.2]} rotation={[0.5, 0, -0.2]}>
                <meshStandardMaterial color="#333" />
            </Box>
            <Box ref={rightArmRef} args={[0.1, 0.5, 0.1]} position={[0.28, 1.3, 0.2]} rotation={[0.5, 0, 0.2]}>
                 <meshStandardMaterial color="#333" />
            </Box>
        </group>
    )
}

const DJBooth: React.FC = () => {
  return (
    <group position={[0, 0, 0]}>
      {/* The Booth Stand/Base */}
      <Box args={[3, 1, 1.2]} position={[0, 0.5, 0]} castShadow receiveShadow>
         <meshStandardMaterial 
           color="#0a0a0a" 
           metalness={0.6} 
           roughness={0.4}
           envMapIntensity={0.8}
         />
      </Box>
      {/* LED Front Panel */}
      <Box args={[2.8, 0.8, 0.08]} position={[0, 0.5, 0.62]}>
         <meshStandardMaterial 
           color="#1a1a1a"
           emissive="#ff0033"
           emissiveIntensity={0.3}
           roughness={0.3}
           metalness={0.5}
         />
      </Box>

      {/* The Table Top Area */}
      <Box args={[3.2, 0.06, 1.3]} position={[0, 1.03, 0]} castShadow>
         <meshStandardMaterial 
           color="#0d0d0d" 
           metalness={0.85} 
           roughness={0.15}
           envMapIntensity={1}
         />
      </Box>
      
      {/* DJ Person */}
      <DJCharacter />

      {/* Equipment Group */}
      <group position={[0, 1.06, 0]}>
        {/* CDJs */}
        <Box args={[0.35, 0.1, 0.45]} position={[-0.6, 0.05, 0.1]} castShadow>
            <meshStandardMaterial 
              color="#2a2a2a" 
              emissive="#0a0a0a" 
              roughness={0.4}
              metalness={0.6}
            />
        </Box>
        <Box args={[0.35, 0.1, 0.45]} position={[0.6, 0.05, 0.1]} castShadow>
            <meshStandardMaterial 
              color="#2a2a2a" 
              emissive="#0a0a0a"
              roughness={0.4}
              metalness={0.6}
            />
        </Box>
        
        {/* Mixer */}
        <Box args={[0.5, 0.1, 0.5]} position={[0, 0.05, 0.1]} castShadow>
            <meshStandardMaterial 
              color="#0d0d0d"
              roughness={0.3}
              metalness={0.7}
            />
        </Box>
        
        {/* Laptop */}
        <group position={[1.2, 0.05, 0.2]} rotation={[0, -0.4, 0]}>
            <Box args={[0.4, 0.03, 0.3]} position={[0, 0, 0]}>
                <meshStandardMaterial 
                  color="#666666"
                  metalness={0.8}
                  roughness={0.2}
                />
            </Box>
            <Box args={[0.4, 0.3, 0.03]} position={[0, 0.15, -0.15]} rotation={[-0.2, 0, 0]}>
                <meshStandardMaterial 
                  color="#0a0a0a"
                  emissive="#003366"
                  emissiveIntensity={0.5}
                  roughness={0.1}
                />
            </Box>
        </group>

        {/* Monitors */}
        <Box args={[0.4, 0.6, 0.4]} position={[-1.8, 0.3, 0.3]} rotation={[0, 0.3, 0]} castShadow>
            <meshStandardMaterial 
              color="#0a0a0a"
              roughness={0.2}
              metalness={0.3}
            />
        </Box>
        <Box args={[0.4, 0.6, 0.4]} position={[1.8, 0.3, 0.3]} rotation={[0, -0.3, 0]} castShadow>
            <meshStandardMaterial 
              color="#0a0a0a"
              roughness={0.2}
              metalness={0.3}
            />
        </Box>
      </group>
    </group>
  );
};

export default DJBooth;