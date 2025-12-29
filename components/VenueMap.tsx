import React, { useMemo } from 'react';
import { Box, Cylinder, Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

// --- CONSTANTS & TYPES ---
const COLORS = {
  PINK: '#ff00ff',    // A, D(outer), E(outer), F
  ORANGE: '#ff8800',  // D(inner), E6
  GREEN: '#00ff44',   // B
  BAR: '#9370DB',
  FLOOR: '#f5f5f5',   // Very Light Grey for brightness
  WALL: '#ffffff',
  CONCRETE: '#444444', 
  NEON_BLUE: '#00ffff',
  NEON_PURPLE: '#bf00ff',
};

// --- SUB-COMPONENTS ---

const Drink: React.FC<{ position: [number, number, number] }> = ({ position }) => {
    const color = useMemo(() => {
        const colors = ['#ff0', '#f0f', '#0ff', '#f00', '#0f0'];
        return colors[Math.floor(Math.random() * colors.length)];
    }, []);
    return (
        <group position={position}>
            <Cylinder args={[0.04, 0.03, 0.15, 8]} position={[0, 0.075, 0]}>
                <meshPhysicalMaterial 
                    color={color} 
                    transparent 
                    opacity={0.8} 
                    roughness={0.1} 
                    metalness={0.1} 
                    emissive={color}
                    emissiveIntensity={0.5}
                />
            </Cylinder>
        </group>
    );
};

const ModernTable: React.FC<{ width: number; depth: number; height: number }> = ({ width, depth, height }) => {
  return (
    <group position={[0, 0, 0]}>
       {/* Table Top - Marble-ish */}
       <RoundedBox args={[width, 0.02, depth]} radius={0.02} smoothness={4} position={[0, height, 0]} castShadow>
          <meshStandardMaterial 
            color="#333" 
            roughness={0.05} 
            metalness={0.7} 
          />
       </RoundedBox>
       {/* Table Frame/Base */}
       <Box args={[width * 0.8, height, depth * 0.8]} position={[0, height / 2, 0]}>
           <meshStandardMaterial color="#222" metalness={0.8} roughness={0.2} />
       </Box>
       {/* Glow under table */}
       <pointLight position={[0, height/2, 0]} intensity={0.5} color="white" distance={1.5} />
       
       <Drink position={[width * 0.15, height, depth * 0.15]} />
    </group>
  );
};

interface BoothProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  color: string; 
  label: string;
  width?: number;
  depth?: number;
}

const LuxuryBooth: React.FC<BoothProps> = ({ 
    position, 
    rotation = [0,0,0], 
    color, 
    label, 
    width = 2.2, 
    depth = 1.6,
}) => {
  const seatHeight = 0.45;
  const backHeight = 0.9;
  const thickness = 0.4;

  return (
    <group position={position} rotation={rotation}>
      
      {/* --- BASE PLINTH --- */}
      <RoundedBox args={[width, 0.2, depth]} radius={0.05} smoothness={4} position={[0, 0.1, 0]} castShadow>
         <meshStandardMaterial color="#080808" />
      </RoundedBox>

      {/* --- THE SOFA --- */}
      <group position={[0, 0.2, 0]}>
          {/* Back Rest */}
          <RoundedBox args={[width, backHeight, thickness]} radius={0.1} position={[0, backHeight/2, -depth/2 + thickness/2]} castShadow>
             <meshStandardMaterial color="#2a2a2a" roughness={0.6} />
          </RoundedBox>
          {/* Back Rest Cushion Detail */}
          <RoundedBox args={[width - 0.2, backHeight - 0.2, 0.1]} radius={0.05} position={[0, backHeight/2 + 0.1, -depth/2 + thickness/2 + 0.1]}>
              <meshStandardMaterial color="#3a3a3a" roughness={0.7} />
          </RoundedBox>
          {/* Neon Strip on Top of Back */}
          <Box args={[width, 0.02, 0.05]} position={[0, backHeight, -depth/2 + thickness/2]}>
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={4} />
          </Box>

          {/* Left Arm */}
          <RoundedBox args={[thickness, 0.6, depth - thickness]} radius={0.05} position={[-width/2 + thickness/2, 0.3, 0]} castShadow>
               <meshStandardMaterial color="#2a2a2a" roughness={0.6} />
          </RoundedBox>
           {/* Right Arm */}
           <RoundedBox args={[thickness, 0.6, depth - thickness]} radius={0.05} position={[width/2 - thickness/2, 0.3, 0]} castShadow>
               <meshStandardMaterial color="#2a2a2a" roughness={0.6} />
          </RoundedBox>

          {/* Seat Cushion */}
          <RoundedBox args={[width - thickness*2, 0.2, depth - thickness]} radius={0.05} position={[0, 0.15, 0]}>
               <meshStandardMaterial color="#333" roughness={0.8} />
          </RoundedBox>
      </group>

      <ModernTable width={width * 0.5} depth={depth * 0.5} height={0.55} />

      {label && (
        <Text 
            position={[0, 2.5, 0]} 
            fontSize={0.7} 
            color={color}
            anchorX="center" 
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#000"
        >
            {label}
        </Text>
      )}
    </group>
  );
};

const NeonPillar: React.FC<{ position: [number, number, number], color: string }> = ({ position, color }) => {
    return (
        <group position={position}>
            <Cylinder args={[0.3, 0.3, 6, 16]} position={[0, 3, 0]}>
                <meshStandardMaterial color="#333" />
            </Cylinder>
            {/* Neon Rings */}
            <Cylinder args={[0.32, 0.32, 0.1, 16]} position={[0, 1, 0]}>
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} />
            </Cylinder>
            <Cylinder args={[0.32, 0.32, 0.1, 16]} position={[0, 3, 0]}>
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} />
            </Cylinder>
            <Cylinder args={[0.32, 0.32, 0.1, 16]} position={[0, 5, 0]}>
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} />
            </Cylinder>
        </group>
    )
}

const BarArea: React.FC = () => {
    return (
        <group position={[-16, 0, 0]}>
            {/* Main Bar Structure L-Shape */}
            <group position={[0, 0, 0]}>
                {/* Counter Base */}
                <Box args={[4, 1.1, 20]} position={[0, 0.55, 0]} castShadow receiveShadow>
                    <meshStandardMaterial color="#2a2a2a" roughness={0.2} map={null} />
                </Box>
                {/* Counter Top */}
                <Box args={[4.5, 0.1, 20.2]} position={[0.25, 1.15, 0]}>
                    <meshStandardMaterial color="#111" metalness={0.9} roughness={0.05} />
                </Box>
                {/* Under Counter LED */}
                <Box args={[4.1, 0.05, 20.1]} position={[0.1, 1.1, 0]}>
                    <meshStandardMaterial color={COLORS.BAR} emissive={COLORS.BAR} emissiveIntensity={2} />
                </Box>
            </group>
            
            {/* Back Wall Shelving Unit */}
            <group position={[-3.5, 0, 0]}>
                {/* Back Panel */}
                <Box args={[1, 4, 20]} position={[0, 2, 0]}>
                    <meshStandardMaterial color="#222" />
                </Box>
                {/* Shelves */}
                {[1.5, 2.2, 2.9, 3.6].map((y, i) => (
                    <Box key={i} args={[0.8, 0.05, 19]} position={[0.2, y, 0]}>
                        <meshStandardMaterial color="#444" />
                        {/* Shelf Light */}
                        <meshBasicMaterial attach="material-1" color={COLORS.BAR} /> 
                    </Box>
                ))}
                
                {/* Bottles */}
                 {Array.from({ length: 80 }).map((_, i) => (
                     <Box key={i} args={[0.1, 0.3, 0.1]} position={[0.3, 1.6 + (Math.floor(i/20) * 0.7), (i%20) - 9.5]}>
                          <meshStandardMaterial 
                            color={`hsl(${Math.random() * 360}, 80%, 60%)`} 
                            emissive={`hsl(${Math.random() * 360}, 80%, 40%)`}
                            emissiveIntensity={0.8}
                            transparent opacity={0.9}
                          />
                     </Box>
                 ))}
            </group>

            <Text position={[0, 2.5, 0]} rotation={[0, 0, Math.PI/2]} color={COLORS.BAR} fontSize={3} letterSpacing={0.2}>
                BAR
            </Text>
            
            {/* Stools */}
            {Array.from({ length: 15 }).map((_, i) => (
                 <group key={i} position={[3, 0, (i - 7) * 1.3]}>
                    <Cylinder args={[0.25, 0.25, 0.05, 16]} position={[0, 0.8, 0]}>
                        <meshStandardMaterial color="#444" />
                    </Cylinder>
                    <Cylinder args={[0.05, 0.05, 0.8, 8]} position={[0, 0.4, 0]}>
                        <meshStandardMaterial color="#666" metalness={0.8} />
                    </Cylinder>
                    <Cylinder args={[0.2, 0.2, 0.05, 16]} position={[0, 0.025, 0]}>
                        <meshStandardMaterial color="#333" />
                    </Cylinder>
                 </group>
            ))}
        </group>
    )
}

const VenueMap: React.FC = () => {
  return (
    <group>
      {/* --- LIGHT GREY TILED FLOOR WITH GLOSS --- */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial 
            color={COLORS.FLOOR} 
            roughness={0.2} 
            metalness={0.05} // Low metalness for non-metallic bright floor
        />
      </mesh>
      <gridHelper args={[60, 30, 0x999999, 0xcccccc]} position={[0, 0.01, 0]} />

      {/* --- LED SCREEN & BACKGROUND --- */}
      <group position={[0, 3, -14.5]}>
          {/* Support Structure */}
          <Box args={[16, 6, 1]} position={[0, 0, 0]} castShadow>
             <meshStandardMaterial color="#222" metalness={0.8} roughness={0.2} />
          </Box>
          
          {/* LED Screen Panel */}
          <Box args={[15, 5, 0.1]} position={[0, 0, 0.51]}>
             <meshStandardMaterial color="black" roughness={0.2} />
          </Box>

          {/* Display Text */}
          <Text 
            position={[0, 0, 0.6]} 
            fontSize={2.5} 
            color="#ffffff"
            anchorX="center" 
            anchorY="middle"
            outlineWidth={0.05}
            outlineColor="#ff0088"
          >
            VSHOW NYC
          </Text>
          
          {/* Decorative Side Beams */}
          <Box args={[0.5, 8, 0.5]} position={[-8.5, 0, 0]}>
             <meshStandardMaterial color={COLORS.PINK} emissive={COLORS.PINK} emissiveIntensity={2} />
          </Box>
           <Box args={[0.5, 8, 0.5]} position={[8.5, 0, 0]}>
             <meshStandardMaterial color={COLORS.PINK} emissive={COLORS.PINK} emissiveIntensity={2} />
          </Box>
      </group>

      {/* --- DECORATIVE PILLARS --- */}
      <NeonPillar position={[-18, 0, -18]} color={COLORS.NEON_BLUE} />
      <NeonPillar position={[18, 0, -18]} color={COLORS.NEON_BLUE} />
      <NeonPillar position={[-18, 0, 18]} color={COLORS.NEON_PURPLE} />
      <NeonPillar position={[18, 0, 18]} color={COLORS.NEON_PURPLE} />

      {/* --- PARTITION WALLS (Internal Dividers) --- */}
      {/* Top Left Wall E */}
      <Box args={[14, 1, 0.5]} position={[-8, 0.5, -11]}><meshStandardMaterial color={COLORS.WALL} /></Box>
      <Box args={[0.5, 1, 8]} position={[-15, 0.5, -7]}><meshStandardMaterial color={COLORS.WALL} /></Box>
      
      {/* Top Right Wall D */}
      <Box args={[14, 1, 0.5]} position={[8, 0.5, -11]}><meshStandardMaterial color={COLORS.WALL} /></Box>
      <Box args={[0.5, 1, 14]} position={[15, 0.5, -4]}><meshStandardMaterial color={COLORS.WALL} /></Box>

      {/* Bottom B Enclosure */}
      <Box args={[22, 0.5, 0.5]} position={[0, 0.25, 10]}><meshStandardMaterial color={COLORS.WALL} /></Box>
      <Box args={[0.5, 0.5, 6]} position={[-11, 0.25, 7]}><meshStandardMaterial color={COLORS.WALL} /></Box>
      <Box args={[0.5, 0.5, 6]} position={[11, 0.25, 7]}><meshStandardMaterial color={COLORS.WALL} /></Box>

      {/* Bottom A Enclosure */}
      <Box args={[22, 0.5, 0.5]} position={[0, 0.25, 14]}><meshStandardMaterial color={COLORS.WALL} /></Box>


      {/* --- SECTION E (Top Left) --- */}
      <LuxuryBooth position={[-11, 0, -9]} label="E3" color={COLORS.PINK} />
      <LuxuryBooth position={[-8, 0, -9]} label="E2" color={COLORS.PINK} />
      <LuxuryBooth position={[-5, 0, -9]} label="E1" color={COLORS.PINK} />
      
      <LuxuryBooth position={[-13, 0, -6]} rotation={[0, Math.PI/2, 0]} label="E5" color={COLORS.PINK} />
      <LuxuryBooth position={[-9, 0, -6]} label="E6" color={COLORS.ORANGE} />


      {/* --- SECTION D (Top Right) --- */}
      <LuxuryBooth position={[5, 0, -9]} label="D10" color={COLORS.PINK} />
      <LuxuryBooth position={[8, 0, -9]} label="D9" color={COLORS.PINK} />
      <LuxuryBooth position={[11, 0, -9]} label="D8" color={COLORS.PINK} />

      <group position={[13, 0, 0]}>
         <LuxuryBooth position={[0, 0, -6]} rotation={[0, -Math.PI/2, 0]} label="D7" color={COLORS.PINK} />
         <LuxuryBooth position={[0, 0, -3]} rotation={[0, -Math.PI/2, 0]} label="D6" color={COLORS.PINK} />
         <LuxuryBooth position={[0, 0, 0]} rotation={[0, -Math.PI/2, 0]} label="D5" color={COLORS.PINK} />
         <LuxuryBooth position={[0, 0, 3]} rotation={[0, -Math.PI/2, 0]} label="D3" color={COLORS.PINK} />
      </group>

      <group position={[9.5, 0, 0]}>
         <LuxuryBooth position={[0, 0, -3]} rotation={[0, -Math.PI/2, 0]} label="D1" color={COLORS.ORANGE} />
         <LuxuryBooth position={[0, 0, 0]} rotation={[0, -Math.PI/2, 0]} label="D2" color={COLORS.ORANGE} />
      </group>


      {/* --- SECTION F --- */}
      <group position={[-13, 0, 0]}>
          <LuxuryBooth position={[0, 0, -2]} rotation={[0, Math.PI/2, 0]} label="F1" color={COLORS.PINK} />
          <LuxuryBooth position={[0, 0, 1]} rotation={[0, Math.PI/2, 0]} label="F2" color={COLORS.PINK} />
          {/* Fillers */}
          <LuxuryBooth position={[0, 0, -5]} rotation={[0, Math.PI/2, 0]} label="" color={COLORS.PINK} />
          <LuxuryBooth position={[0, 0, 4]} rotation={[0, Math.PI/2, 0]} label="" color={COLORS.PINK} />
      </group>


      {/* --- SECTION B --- */}
      <group position={[0, 0, 5]}>
         <LuxuryBooth position={[-4.5, 0, 0]} label="B6" color={COLORS.GREEN} />
         <LuxuryBooth position={[-1.5, 0, 0]} label="B7" color={COLORS.GREEN} />
         <LuxuryBooth position={[1.5, 0, 0]} label="B8" color={COLORS.GREEN} />
         <LuxuryBooth position={[4.5, 0, 0]} label="B9" color={COLORS.GREEN} />
      </group>

      <group position={[0, 0, 8]}>
         <LuxuryBooth position={[-4.5, 0, 0]} label="B5" color={COLORS.GREEN} />
         <LuxuryBooth position={[-1.5, 0, 0]} label="B3" color={COLORS.GREEN} />
         <LuxuryBooth position={[1.5, 0, 0]} label="B2" color={COLORS.GREEN} />
         <LuxuryBooth position={[4.5, 0, 0]} label="B1" color={COLORS.GREEN} />
      </group>


      {/* --- SECTION A --- */}
      <group position={[0, 0, 12.5]}>
         <LuxuryBooth position={[-7.5, 0, 0]} label="A7" color={COLORS.PINK} />
         <LuxuryBooth position={[-4.5, 0, 0]} label="A6" color={COLORS.PINK} />
         <LuxuryBooth position={[-1.5, 0, 0]} label="A5" color={COLORS.PINK} />
         <LuxuryBooth position={[1.5, 0, 0]} label="A3" color={COLORS.PINK} />
         <LuxuryBooth position={[4.5, 0, 0]} label="A2" color={COLORS.PINK} />
         <LuxuryBooth position={[7.5, 0, 0]} label="A1" color={COLORS.PINK} />
      </group>

      <BarArea />

    </group>
  );
};

export default VenueMap;