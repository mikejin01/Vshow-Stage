import React from 'react';
import { Box, RoundedBox } from '@react-three/drei';

interface BoilerRoomPlatformProps {
  width: number;
  depth: number;
  height: number;
}

/**
 * BoilerRoomPlatform - Minimal, industrial DJ platform (K-N area)
 * Features: Raw, minimalist design, industrial aesthetic, compact footprint
 */
const BoilerRoomPlatform: React.FC<BoilerRoomPlatformProps> = ({ width, depth, height }) => {
  return (
    <group>
      {/* Main Platform - Raw industrial look */}
      <Box 
        args={[width, height, depth]} 
        position={[0, height / 2, 0]} 
        castShadow 
        receiveShadow
      >
        <meshStandardMaterial 
          color="#0a0a0a" 
          roughness={0.8}
          metalness={0.2}
        />
      </Box>

      {/* Minimal Top Surface - Matte black */}
      <Box 
        args={[width - 0.1, 0.04, depth - 0.1]} 
        position={[0, height + 0.02, 0]} 
        castShadow
      >
        <meshStandardMaterial 
          color="#000000"
          roughness={0.9}
          metalness={0.1}
        />
      </Box>

      {/* Simple front edge accent - Subtle red glow */}
      <Box args={[width, 0.04, 0.08]} position={[0, height + 0.02, depth / 2 + 0.06]}>
        <meshStandardMaterial 
          color="#330000" 
          emissive="#ff0033" 
          emissiveIntensity={0.6}
          roughness={0.4}
          metalness={0.6}
        />
      </Box>

      {/* Industrial corner supports */}
      {[
        [-width / 2 + 0.15, -depth / 2 + 0.15],
        [width / 2 - 0.15, -depth / 2 + 0.15],
        [-width / 2 + 0.15, depth / 2 - 0.15],
        [width / 2 - 0.15, depth / 2 - 0.15]
      ].map(([x, z], i) => (
        <Box 
          key={i}
          args={[0.15, height, 0.15]} 
          position={[x, height / 2, z]}
          castShadow
        >
          <meshStandardMaterial 
            color="#1a1a1a" 
            roughness={0.7}
            metalness={0.3}
          />
        </Box>
      ))}

      {/* Minimal Steps - Left */}
      <group position={[(-width / 2) + 0.5, 0, depth / 2 + 0.4]}>
        <Box args={[1.0, 0.15, 0.5]} position={[0, 0.075, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#0d0d0d" roughness={0.8} metalness={0.2} />
        </Box>
        <Box args={[1.0, 0.3, 0.5]} position={[0, 0.15, 0.6]} castShadow receiveShadow>
          <meshStandardMaterial color="#0d0d0d" roughness={0.8} metalness={0.2} />
        </Box>
      </group>

      {/* Minimal Steps - Right */}
      <group position={[(width / 2) - 0.5, 0, depth / 2 + 0.4]}>
        <Box args={[1.0, 0.15, 0.5]} position={[0, 0.075, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#0d0d0d" roughness={0.8} metalness={0.2} />
        </Box>
        <Box args={[1.0, 0.3, 0.5]} position={[0, 0.15, 0.6]} castShadow receiveShadow>
          <meshStandardMaterial color="#0d0d0d" roughness={0.8} metalness={0.2} />
        </Box>
      </group>

      {/* Underglow - Subtle ambient lighting */}
      <Box args={[width - 0.3, 0.02, depth - 0.3]} position={[0, 0.01, 0]}>
        <meshStandardMaterial 
          color="#ff0033" 
          emissive="#ff0033" 
          emissiveIntensity={0.3}
          transparent
          opacity={0.4}
        />
      </Box>

      {/* Industrial cable management bar (aesthetic detail) */}
      <Box args={[width * 0.6, 0.04, 0.06]} position={[0, height * 0.3, -depth / 2 - 0.05]}>
        <meshStandardMaterial color="#333333" roughness={0.6} metalness={0.5} />
      </Box>
    </group>
  );
};

export default BoilerRoomPlatform;


