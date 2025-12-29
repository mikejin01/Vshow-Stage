import React from 'react';
import { Box, RoundedBox, Cylinder } from '@react-three/drei';

interface MainStageProps {
  width: number;
  depth: number;
  height: number;
}

/**
 * MainStage - Large professional stage next to LED screen (E1/D10 area)
 * Features: Multi-tiered platform, LED strips, professional finish
 */
const MainStage: React.FC<MainStageProps> = ({ width, depth, height }) => {
  return (
    <group>
      {/* Base Platform - Lower tier */}
      <Box 
        args={[width + 1, height * 0.4, depth + 0.8]} 
        position={[0, (height * 0.4) / 2, 0]} 
        castShadow 
        receiveShadow
      >
        <meshStandardMaterial 
          color="#1a1a1a" 
          roughness={0.6}
          metalness={0.4}
        />
      </Box>

      {/* Main Stage Platform - Upper tier */}
      <RoundedBox 
        args={[width, height, depth]} 
        radius={0.1}
        smoothness={4}
        position={[0, height / 2 + (height * 0.4), 0]} 
        castShadow 
        receiveShadow
      >
        <meshStandardMaterial 
          color="#2a2a2a" 
          roughness={0.5}
          metalness={0.5}
        />
      </RoundedBox>

      {/* Stage Top Surface - Glossy black finish */}
      <RoundedBox 
        args={[width - 0.2, 0.08, depth - 0.2]} 
        radius={0.05}
        smoothness={4}
        position={[0, height + (height * 0.4) + 0.04, 0]} 
        castShadow
      >
        <meshStandardMaterial 
          color="#0a0a0a"
          roughness={0.2}
          metalness={0.9}
        />
      </RoundedBox>

      {/* LED Strip - Front edge */}
      <Box args={[width, 0.06, 0.15]} position={[0, height + (height * 0.4) + 0.03, depth / 2 + 0.1]}>
        <meshStandardMaterial 
          color="#ff0066" 
          emissive="#ff0066" 
          emissiveIntensity={2.5}
          toneMapped={false}
        />
      </Box>

      {/* LED Strip - Side edges */}
      <Box args={[0.15, 0.06, depth]} position={[-width / 2 - 0.1, height + (height * 0.4) + 0.03, 0]}>
        <meshStandardMaterial 
          color="#ff0066" 
          emissive="#ff0066" 
          emissiveIntensity={1.8}
          toneMapped={false}
        />
      </Box>
      <Box args={[0.15, 0.06, depth]} position={[width / 2 + 0.1, height + (height * 0.4) + 0.03, 0]}>
        <meshStandardMaterial 
          color="#ff0066" 
          emissive="#ff0066" 
          emissiveIntensity={1.8}
          toneMapped={false}
        />
      </Box>

      {/* Corner Accent Pillars */}
      {[
        [-width / 2 - 0.3, depth / 2 + 0.3],
        [width / 2 + 0.3, depth / 2 + 0.3],
        [-width / 2 - 0.3, -depth / 2 - 0.3],
        [width / 2 + 0.3, -depth / 2 - 0.3]
      ].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <Cylinder args={[0.15, 0.2, height + (height * 0.4), 12]} position={[0, (height + (height * 0.4)) / 2, 0]}>
            <meshStandardMaterial 
              color="#333333" 
              metalness={0.7}
              roughness={0.3}
            />
          </Cylinder>
          {/* LED ring on pillar */}
          <Cylinder args={[0.18, 0.18, 0.08, 16]} position={[0, height + (height * 0.4), 0]}>
            <meshStandardMaterial 
              color="#ff0066" 
              emissive="#ff0066" 
              emissiveIntensity={2}
            />
          </Cylinder>
        </group>
      ))}

      {/* Professional Grade Steps - Left side */}
      <group position={[(-width / 2) + 1, 0, depth / 2 + 0.5]}>
        {/* Step 1 */}
        <RoundedBox args={[1.8, 0.2, 0.7]} radius={0.05} position={[0, 0.1, 0.4]} castShadow receiveShadow>
          <meshStandardMaterial color="#1a1a1a" roughness={0.6} metalness={0.4} />
        </RoundedBox>
        {/* Step 2 */}
        <RoundedBox args={[1.8, 0.4, 0.7]} radius={0.05} position={[0, 0.2, 1.0]} castShadow receiveShadow>
          <meshStandardMaterial color="#1a1a1a" roughness={0.6} metalness={0.4} />
        </RoundedBox>
        {/* Step 3 */}
        <RoundedBox args={[1.8, 0.6, 0.7]} radius={0.05} position={[0, 0.3, 1.6]} castShadow receiveShadow>
          <meshStandardMaterial color="#1a1a1a" roughness={0.6} metalness={0.4} />
        </RoundedBox>
        {/* LED strip on steps */}
        <Box args={[1.8, 0.03, 0.05]} position={[0, 0.21, 0.05]}>
          <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={1.5} />
        </Box>
      </group>

      {/* Professional Grade Steps - Right side */}
      <group position={[(width / 2) - 1, 0, depth / 2 + 0.5]}>
        {/* Step 1 */}
        <RoundedBox args={[1.8, 0.2, 0.7]} radius={0.05} position={[0, 0.1, 0.4]} castShadow receiveShadow>
          <meshStandardMaterial color="#1a1a1a" roughness={0.6} metalness={0.4} />
        </RoundedBox>
        {/* Step 2 */}
        <RoundedBox args={[1.8, 0.4, 0.7]} radius={0.05} position={[0, 0.2, 1.0]} castShadow receiveShadow>
          <meshStandardMaterial color="#1a1a1a" roughness={0.6} metalness={0.4} />
        </RoundedBox>
        {/* Step 3 */}
        <RoundedBox args={[1.8, 0.6, 0.7]} radius={0.05} position={[0, 0.3, 1.6]} castShadow receiveShadow>
          <meshStandardMaterial color="#1a1a1a" roughness={0.6} metalness={0.4} />
        </RoundedBox>
        {/* LED strip on steps */}
        <Box args={[1.8, 0.03, 0.05]} position={[0, 0.21, 0.05]}>
          <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={1.5} />
        </Box>
      </group>

      {/* Front Trim - Professional finish */}
      <Box 
        args={[width, 0.12, 0.15]} 
        position={[0, height + (height * 0.4) + 0.06, depth / 2 + 0.15]} 
        castShadow
      >
        <meshStandardMaterial 
          color="#0a0a0a" 
          roughness={0.3}
          metalness={0.85}
        />
      </Box>
    </group>
  );
};

export default MainStage;


