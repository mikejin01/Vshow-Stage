import React, { useMemo } from 'react';
import { Box, Cylinder, Text, RoundedBox, Sphere } from '@react-three/drei';
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

const SeatedPerson: React.FC<{ position: [number, number, number]; rotation?: number }> = ({ position, rotation = 0 }) => {
  const skinColor = useMemo(() => {
    const tones = ['#ffdbac', '#f1c27d', '#e0ac69', '#8d5524', '#c68642', '#573719'];
    return tones[Math.floor(Math.random() * tones.length)];
  }, []);
  
  const shirtColor = useMemo(() => {
    const colors = ['#eeeeee', '#111111', '#cc3333', '#3333cc', '#ffff33', '#ff6600', '#9933ff'];
    return colors[Math.floor(Math.random() * colors.length)];
  }, []);

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Legs (sitting position) */}
      <Box args={[0.22, 0.35, 0.15]} position={[0, 0.175, 0.1]}>
        <meshStandardMaterial color="#111111" roughness={0.8} />
      </Box>
      
      {/* Torso */}
      <Box args={[0.35, 0.4, 0.18]} position={[0, 0.55, 0]}>
        <meshStandardMaterial color={shirtColor} roughness={0.7} />
      </Box>
      
      {/* Head */}
      <Sphere args={[0.12, 12, 12]} position={[0, 0.85, 0]}>
        <meshStandardMaterial color={skinColor} roughness={0.5} />
      </Sphere>
      
      {/* Arms resting on table */}
      <Box args={[0.08, 0.3, 0.08]} position={[-0.22, 0.5, 0.15]} rotation={[0.8, 0, 0]}>
        <meshStandardMaterial color={skinColor} roughness={0.5} />
      </Box>
      <Box args={[0.08, 0.3, 0.08]} position={[0.22, 0.5, 0.15]} rotation={[0.8, 0, 0]}>
        <meshStandardMaterial color={skinColor} roughness={0.5} />
      </Box>
    </group>
  );
};

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
       {/* Table Top - Round */}
       <Cylinder args={[width * 0.5, width * 0.5, 0.04, 24]} position={[0, height, 0]} castShadow>
          <meshStandardMaterial 
            color="#1a1a1a" 
            roughness={0.3} 
            metalness={0.8} 
          />
       </Cylinder>
       
       {/* Table Leg - Center pedestal */}
       <Cylinder args={[0.08, 0.12, height - 0.1, 12]} position={[0, height / 2, 0]}>
           <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.2} />
       </Cylinder>
       
       {/* Base */}
       <Cylinder args={[width * 0.4, width * 0.4, 0.03, 16]} position={[0, 0.015, 0]}>
           <meshStandardMaterial color="#0a0a0a" metalness={0.8} roughness={0.3} />
       </Cylinder>
       
       {/* Chairs around the table - 4 chairs */}
       {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((angle, i) => {
         const chairDist = width * 0.8;
         const x = Math.cos(angle) * chairDist;
         const z = Math.sin(angle) * chairDist;
         
         return (
           <group key={i} position={[x, 0, z]} rotation={[0, angle + Math.PI, 0]}>
             {/* Chair Seat */}
             <RoundedBox args={[0.35, 0.06, 0.35]} radius={0.02} position={[0, 0.45, 0]} castShadow>
               <meshStandardMaterial color="#1a1a1a" roughness={0.7} />
             </RoundedBox>
             
             {/* Chair Back */}
             <RoundedBox args={[0.35, 0.4, 0.04]} radius={0.02} position={[0, 0.65, -0.15]} castShadow>
               <meshStandardMaterial color="#1a1a1a" roughness={0.7} />
             </RoundedBox>
             
             {/* Chair Legs - 4 legs */}
             {[-0.15, 0.15].map((xOff, xi) => 
               [-0.15, 0.15].map((zOff, zi) => (
                 <Cylinder 
                   key={`${xi}-${zi}`}
                   args={[0.02, 0.02, 0.45, 8]} 
                   position={[xOff, 0.225, zOff]}
                 >
                   <meshStandardMaterial color="#0a0a0a" metalness={0.8} />
                 </Cylinder>
               ))
             )}
           </group>
         );
       })}
       
       {/* Decorative drinks on table */}
       <Drink position={[0, height + 0.02, 0]} />
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
  occupancy?: number; // 0-1, controls how many people are seated
}

const LuxuryBooth: React.FC<BoothProps> = ({ 
    position, 
    rotation = [0,0,0], 
    color, 
    label, 
    width = 2.2, 
    depth = 1.6,
    occupancy = 0,
}) => {
  const seatHeight = 0.45;
  const backHeight = 0.9;
  const thickness = 0.4;
  
  // Determine how many people to show (0-4 per booth based on occupancy)
  const maxPeople = 4;
  const numPeople = Math.floor(occupancy * maxPeople);

  return (
    <group position={position} rotation={rotation}>
      
      {/* --- BASE PLINTH --- */}
      <RoundedBox args={[width, 0.2, depth]} radius={0.05} smoothness={4} position={[0, 0.1, 0]} castShadow receiveShadow>
         <meshStandardMaterial 
           color="#0a0a0a" 
           roughness={0.7}
           metalness={0.1}
         />
      </RoundedBox>

      {/* --- THE SOFA --- */}
      <group position={[0, 0.2, 0]}>
          {/* Back Rest */}
          <RoundedBox args={[width, backHeight, thickness]} radius={0.1} position={[0, backHeight/2, -depth/2 + thickness/2]} castShadow receiveShadow>
             <meshStandardMaterial 
               color="#2a2a2a" 
               roughness={0.8}
               metalness={0.05}
             />
          </RoundedBox>
          {/* Back Rest Cushion Detail */}
          <RoundedBox args={[width - 0.2, backHeight - 0.2, 0.1]} radius={0.05} position={[0, backHeight/2 + 0.1, -depth/2 + thickness/2 + 0.1]}>
              <meshStandardMaterial 
                color="#353535" 
                roughness={0.9}
              />
          </RoundedBox>
          {/* Neon Strip on Top of Back */}
          <Box args={[width, 0.03, 0.06]} position={[0, backHeight, -depth/2 + thickness/2]}>
              <meshStandardMaterial 
                color={color} 
                emissive={color} 
                emissiveIntensity={3}
                toneMapped={false}
              />
          </Box>

          {/* Left Arm */}
          <RoundedBox args={[thickness, 0.6, depth - thickness]} radius={0.05} position={[-width/2 + thickness/2, 0.3, 0]} castShadow receiveShadow>
               <meshStandardMaterial color="#2a2a2a" roughness={0.8} />
          </RoundedBox>
           {/* Right Arm */}
           <RoundedBox args={[thickness, 0.6, depth - thickness]} radius={0.05} position={[width/2 - thickness/2, 0.3, 0]} castShadow receiveShadow>
               <meshStandardMaterial color="#2a2a2a" roughness={0.8} />
          </RoundedBox>

          {/* Seat Cushion */}
          <RoundedBox args={[width - thickness*2, 0.2, depth - thickness]} radius={0.05} position={[0, 0.15, 0]} receiveShadow>
               <meshStandardMaterial color="#303030" roughness={0.85} />
          </RoundedBox>
          
          {/* SEATED PEOPLE */}
          {numPeople >= 1 && <SeatedPerson position={[-width * 0.25, seatHeight - 0.2, -0.1]} rotation={0} />}
          {numPeople >= 2 && <SeatedPerson position={[width * 0.25, seatHeight - 0.2, -0.1]} rotation={0} />}
          {numPeople >= 3 && <SeatedPerson position={[-width * 0.25, seatHeight - 0.2, 0.3]} rotation={Math.PI} />}
          {numPeople >= 4 && <SeatedPerson position={[width * 0.25, seatHeight - 0.2, 0.3]} rotation={Math.PI} />}
      </group>

      <ModernTable width={width * 0.5} depth={depth * 0.5} height={0.55} />

      {label && (
        <Text 
            position={[0, 2.5, 0]} 
            fontSize={0.6} 
            color={color}
            anchorX="center" 
            anchorY="middle"
            outlineWidth={0.015}
            outlineColor="#000000"
            fontWeight={700}
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

const Bartender: React.FC<{ position: [number, number, number]; rotation?: number }> = ({ position, rotation = 0 }) => {
    const skinColor = '#e0ac69';
    
    return (
        <group position={position} rotation={[0, rotation, 0]}>
            {/* Legs */}
            <Box args={[0.15, 0.9, 0.15]} position={[-0.1, 0.45, 0]}>
                <meshStandardMaterial color="#111" roughness={0.8} />
            </Box>
            <Box args={[0.15, 0.9, 0.15]} position={[0.1, 0.45, 0]}>
                <meshStandardMaterial color="#111" roughness={0.8} />
            </Box>
            
            {/* Torso - Black shirt */}
            <Box args={[0.4, 0.55, 0.2]} position={[0, 1.15, 0]}>
                <meshStandardMaterial color="#000000" roughness={0.7} />
            </Box>
            
            {/* Head */}
            <Sphere args={[0.13, 12, 12]} position={[0, 1.6, 0]}>
                <meshStandardMaterial color={skinColor} roughness={0.5} />
            </Sphere>
            
            {/* Arms - working position */}
            <Box args={[0.09, 0.45, 0.09]} position={[-0.25, 1.0, 0.15]} rotation={[0.5, 0, 0]}>
                <meshStandardMaterial color={skinColor} roughness={0.5} />
            </Box>
            <Box args={[0.09, 0.45, 0.09]} position={[0.25, 1.0, 0.15]} rotation={[0.5, 0, 0]}>
                <meshStandardMaterial color={skinColor} roughness={0.5} />
            </Box>
            
            {/* Apron */}
            <Box args={[0.38, 0.4, 0.02]} position={[0, 1.05, 0.11]}>
                <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
            </Box>
        </group>
    );
};

const StandingCustomer: React.FC<{ position: [number, number, number]; rotation?: number }> = ({ position, rotation = 0 }) => {
    const skinColor = useMemo(() => {
        const tones = ['#ffdbac', '#f1c27d', '#e0ac69', '#8d5524', '#c68642', '#573719'];
        return tones[Math.floor(Math.random() * tones.length)];
    }, []);
    
    const shirtColor = useMemo(() => {
        const colors = ['#eeeeee', '#111111', '#cc3333', '#3333cc', '#ffff33', '#ff6600', '#9933ff'];
        return colors[Math.floor(Math.random() * colors.length)];
    }, []);
    
    return (
        <group position={position} rotation={[0, rotation, 0]}>
            {/* Legs */}
            <Box args={[0.2, 0.85, 0.18]} position={[0, 0.425, 0]}>
                <meshStandardMaterial color="#1a2a40" roughness={0.8} />
            </Box>
            
            {/* Torso */}
            <Box args={[0.38, 0.5, 0.2]} position={[0, 1.1, 0]}>
                <meshStandardMaterial color={shirtColor} roughness={0.7} />
            </Box>
            
            {/* Head */}
            <Sphere args={[0.12, 12, 12]} position={[0, 1.5, 0]}>
                <meshStandardMaterial color={skinColor} roughness={0.5} />
            </Sphere>
            
            {/* Arms - one holding drink */}
            <Box args={[0.08, 0.4, 0.08]} position={[-0.24, 1.05, 0]} rotation={[0.3, 0, 0]}>
                <meshStandardMaterial color={skinColor} roughness={0.5} />
            </Box>
            <Box args={[0.08, 0.4, 0.08]} position={[0.24, 1.15, 0.15]} rotation={[-1.2, 0, 0]}>
                <meshStandardMaterial color={skinColor} roughness={0.5} />
            </Box>
            
            {/* Drink in hand */}
            <Cylinder args={[0.03, 0.025, 0.12, 8]} position={[0.24, 1.35, 0.2]}>
                <meshPhysicalMaterial 
                    color="#00ffff" 
                    transparent 
                    opacity={0.8} 
                    roughness={0.1}
                    emissive="#00ffff"
                    emissiveIntensity={0.3}
                />
            </Cylinder>
        </group>
    );
};

const BarArea: React.FC = () => {
    return (
        <group position={[-16, 0, 0]}>
            {/* ELEVATED PLATFORM FOR BAR AREA (Compact) */}
            <group position={[0, 0, 0]}>
                {/* Platform Base - Compact size */}
                <Box args={[6, 0.4, 20]} position={[0, 0.2, 0]} castShadow receiveShadow>
                    <meshStandardMaterial 
                        color="#2a2a2a" 
                        roughness={0.6}
                        metalness={0.2}
                    />
                </Box>
                {/* Platform Top Surface */}
                <Box args={[6.2, 0.05, 20.2]} position={[0, 0.425, 0]} receiveShadow>
                    <meshStandardMaterial 
                        color="#1a1a1a" 
                        roughness={0.4}
                        metalness={0.5}
                    />
                </Box>
                {/* LED Strip - Front edge */}
                <Box args={[6, 0.04, 0.08]} position={[0, 0.42, 10.1]}>
                    <meshStandardMaterial 
                        color={COLORS.BAR} 
                        emissive={COLORS.BAR} 
                        emissiveIntensity={2}
                    />
                </Box>
                
                {/* Steps - Two access points */}
                {[-2, 2].map((xPos, idx) => (
                    <group key={idx} position={[xPos, 0, 10.5]}>
                        <Box args={[1.2, 0.15, 0.5]} position={[0, 0.075, 0]} castShadow receiveShadow>
                            <meshStandardMaterial color="#222" roughness={0.7} />
                        </Box>
                        <Box args={[1.2, 0.3, 0.5]} position={[0, 0.15, 0.6]} castShadow receiveShadow>
                            <meshStandardMaterial color="#222" roughness={0.7} />
                        </Box>
                    </group>
                ))}
            </group>
            
            {/* Main Bar Structure - On elevated platform */}
            <group position={[0, 0.45, 0]}>
                {/* Counter Base */}
                <Box args={[2.5, 1.1, 20]} position={[0, 0.55, 0]} castShadow receiveShadow>
                    <meshStandardMaterial color="#2a2a2a" roughness={0.2} />
                </Box>
                {/* Counter Top */}
                <Box args={[3, 0.1, 20.2]} position={[0.15, 1.15, 0]}>
                    <meshStandardMaterial color="#111" metalness={0.9} roughness={0.05} />
                </Box>
                {/* Under Counter LED */}
                <Box args={[2.8, 0.05, 20.1]} position={[0.05, 1.1, 0]}>
                    <meshStandardMaterial color={COLORS.BAR} emissive={COLORS.BAR} emissiveIntensity={2} />
                </Box>
            </group>
            
            {/* Back Wall Shelving Unit - On platform */}
            <group position={[-3.5, 0.45, 0]}>
                {/* Back Panel */}
                <Box args={[1, 4, 20]} position={[0, 2, 0]}>
                    <meshStandardMaterial color="#222" />
                </Box>
                {/* Shelves */}
                {[1.5, 2.2, 2.9, 3.6].map((y, i) => (
                    <Box key={i} args={[0.8, 0.05, 19]} position={[0.2, y, 0]}>
                        <meshStandardMaterial color="#444" />
                    </Box>
                ))}
                
                {/* Bottles - reduced count for performance */}
                {Array.from({ length: 40 }).map((_, i) => (
                    <Box key={i} args={[0.1, 0.3, 0.1]} position={[0.3, 1.6 + (Math.floor(i/10) * 0.7), (i%10) - 4.5]}>
                        <meshStandardMaterial 
                            color={`hsl(${(i * 36) % 360}, 70%, 60%)`} 
                            emissive={`hsl(${(i * 36) % 360}, 70%, 30%)`}
                            emissiveIntensity={0.5}
                        />
                    </Box>
                ))}
            </group>

            {/* BAR Label - Horizontal above the bar */}
            <Text 
                position={[0, 3.0, 0]} 
                rotation={[0, 0, 0]} 
                color={COLORS.BAR} 
                fontSize={0.6} 
                letterSpacing={0.2}
                anchorX="center" 
                anchorY="middle"
                outlineWidth={0.015}
                outlineColor="#000000"
                fontWeight={700}
            >
                BAR
            </Text>
            
            {/* BARTENDERS - Behind the bar (4 bartenders along the bar) */}
            {[-7, -2.5, 2.5, 7].map((zPos, idx) => (
                <Bartender 
                    key={`bartender-${idx}`}
                    position={[-1.5, 0.45, zPos]} 
                    rotation={Math.PI / 2}
                />
            ))}
            
            {/* STANDING CUSTOMERS - In front of bar (customer side) */}
            {Array.from({ length: 12 }).map((_, i) => (
                <StandingCustomer 
                    key={`customer-${i}`}
                    position={[3.2, 0.45, (i - 5.5) * 1.6]} 
                    rotation={-Math.PI / 2}
                />
            ))}
            
            {/* Bar Stools - Along customer side */}
            {Array.from({ length: 10 }).map((_, i) => (
                <group key={i} position={[3, 0.45, (i - 4.5) * 1.8]}>
                    <Cylinder args={[0.25, 0.25, 0.05, 12]} position={[0, 0.8, 0]}>
                        <meshStandardMaterial color="#444" />
                    </Cylinder>
                    <Cylinder args={[0.05, 0.05, 0.8, 6]} position={[0, 0.4, 0]}>
                        <meshStandardMaterial color="#666" metalness={0.8} />
                    </Cylinder>
                </group>
            ))}
        </group>
    )
}

const VenueMap: React.FC<{ occupancy?: number }> = ({ occupancy = 0 }) => {
  return (
    <group>
      {/* --- IMPROVED FLOOR WITH NO Z-FIGHTING --- */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial 
            color="#e8e8e8"
            roughness={0.6} 
            metalness={0.1}
        />
      </mesh>
      
      {/* Grid lines at a safe height above floor to prevent z-fighting */}
      <gridHelper args={[60, 20, '#888888', '#aaaaaa']} position={[0, 0.02, 0]} />

      {/* --- LED SCREEN & BACKGROUND --- */}
      <group position={[0, 3, -14.5]}>
          {/* Support Structure */}
          <Box args={[16, 6, 1]} position={[0, 0, 0]} castShadow receiveShadow>
             <meshStandardMaterial 
               color="#1a1a1a" 
               metalness={0.8} 
               roughness={0.3}
               envMapIntensity={1}
             />
          </Box>
          
          {/* LED Screen Panel */}
          <Box args={[15, 5, 0.15]} position={[0, 0, 0.55]}>
             <meshStandardMaterial 
               color="#000000" 
               roughness={0.1}
               metalness={0.2}
               emissive="#111111"
               emissiveIntensity={0.5}
             />
          </Box>

          {/* Display Text */}
          <Text 
            position={[0, 0, 0.65]} 
            fontSize={2.5} 
            color="#ffffff"
            anchorX="center" 
            anchorY="middle"
            outlineWidth={0.05}
            outlineColor="#ff0088"
            letterSpacing={0.05}
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
      <LuxuryBooth position={[-11, 0, -9]} label="E3" color={COLORS.PINK} occupancy={occupancy} />
      <LuxuryBooth position={[-8, 0, -9]} label="E2" color={COLORS.PINK} occupancy={occupancy} />
      <LuxuryBooth position={[-5, 0, -9]} label="E1" color={COLORS.PINK} occupancy={occupancy} />
      
      <LuxuryBooth position={[-13, 0, -6]} rotation={[0, Math.PI/2, 0]} label="E5" color={COLORS.PINK} occupancy={occupancy} />
      <LuxuryBooth position={[-9, 0, -6]} label="E6" color={COLORS.ORANGE} occupancy={occupancy} />


      {/* --- SECTION D (Top Right) --- */}
      <LuxuryBooth position={[5, 0, -9]} label="D10" color={COLORS.PINK} occupancy={occupancy} />
      <LuxuryBooth position={[8, 0, -9]} label="D9" color={COLORS.PINK} occupancy={occupancy} />
      <LuxuryBooth position={[11, 0, -9]} label="D8" color={COLORS.PINK} occupancy={occupancy} />

      <group position={[13, 0, 0]}>
         <LuxuryBooth position={[0, 0, -6]} rotation={[0, -Math.PI/2, 0]} label="D7" color={COLORS.PINK} occupancy={occupancy} />
         <LuxuryBooth position={[0, 0, -3]} rotation={[0, -Math.PI/2, 0]} label="D6" color={COLORS.PINK} occupancy={occupancy} />
         <LuxuryBooth position={[0, 0, 0]} rotation={[0, -Math.PI/2, 0]} label="D5" color={COLORS.PINK} occupancy={occupancy} />
         <LuxuryBooth position={[0, 0, 3]} rotation={[0, -Math.PI/2, 0]} label="D3" color={COLORS.PINK} occupancy={occupancy} />
      </group>

      <group position={[9.5, 0, 0]}>
         <LuxuryBooth position={[0, 0, -3]} rotation={[0, -Math.PI/2, 0]} label="D1" color={COLORS.ORANGE} occupancy={occupancy} />
         <LuxuryBooth position={[0, 0, 0]} rotation={[0, -Math.PI/2, 0]} label="D2" color={COLORS.ORANGE} occupancy={occupancy} />
      </group>


      {/* --- SECTION F (On Bar Elevated Platform) --- */}
      <group position={[-13, 0.45, 0]}>
          <LuxuryBooth position={[0, 0, -2]} rotation={[0, Math.PI/2, 0]} label="F1" color={COLORS.PINK} occupancy={occupancy} />
          <LuxuryBooth position={[0, 0, 1]} rotation={[0, Math.PI/2, 0]} label="F2" color={COLORS.PINK} occupancy={occupancy} />
          {/* Fillers */}
          <LuxuryBooth position={[0, 0, -5]} rotation={[0, Math.PI/2, 0]} label="" color={COLORS.PINK} occupancy={occupancy} />
          <LuxuryBooth position={[0, 0, 4]} rotation={[0, Math.PI/2, 0]} label="" color={COLORS.PINK} occupancy={occupancy} />
      </group>


      {/* --- ELEVATED PLATFORM FOR SECTION B --- */}
      <group position={[0, 0, 6.5]}>
        {/* Main Platform Base */}
        <Box args={[18, 0.3, 7]} position={[0, 0.15, 0]} castShadow receiveShadow>
          <meshStandardMaterial 
            color="#2a2a2a" 
            roughness={0.6}
            metalness={0.2}
          />
        </Box>
        {/* Platform Top Surface */}
        <Box args={[18.2, 0.05, 7.2]} position={[0, 0.325, 0]} receiveShadow>
          <meshStandardMaterial 
            color="#1a1a1a" 
            roughness={0.4}
            metalness={0.5}
          />
        </Box>
        {/* LED Strip - Front */}
        <Box args={[18, 0.04, 0.08]} position={[0, 0.32, 3.6]}>
          <meshStandardMaterial 
            color={COLORS.GREEN} 
            emissive={COLORS.GREEN} 
            emissiveIntensity={1.5}
          />
        </Box>
        {/* Steps - Front Left */}
        <Box args={[2, 0.12, 0.5]} position={[-7, 0.06, 4.2]} castShadow receiveShadow>
          <meshStandardMaterial color="#222" roughness={0.7} />
        </Box>
        <Box args={[2, 0.24, 0.5]} position={[-7, 0.12, 4.8]} castShadow receiveShadow>
          <meshStandardMaterial color="#222" roughness={0.7} />
        </Box>
        {/* Steps - Front Right */}
        <Box args={[2, 0.12, 0.5]} position={[7, 0.06, 4.2]} castShadow receiveShadow>
          <meshStandardMaterial color="#222" roughness={0.7} />
        </Box>
        <Box args={[2, 0.24, 0.5]} position={[7, 0.12, 4.8]} castShadow receiveShadow>
          <meshStandardMaterial color="#222" roughness={0.7} />
        </Box>
      </group>

      {/* --- SECTION B --- */}
      <group position={[0, 0.35, 5]}>
         <LuxuryBooth position={[-4.5, 0, 0]} rotation={[0, Math.PI, 0]} label="B6" color={COLORS.GREEN} occupancy={occupancy} />
         <LuxuryBooth position={[-1.5, 0, 0]} rotation={[0, Math.PI, 0]} label="B7" color={COLORS.GREEN} occupancy={occupancy} />
         <LuxuryBooth position={[1.5, 0, 0]} rotation={[0, Math.PI, 0]} label="B8" color={COLORS.GREEN} occupancy={occupancy} />
         <LuxuryBooth position={[4.5, 0, 0]} rotation={[0, Math.PI, 0]} label="B9" color={COLORS.GREEN} occupancy={occupancy} />
      </group>

      <group position={[0, 0.35, 8]}>
         <LuxuryBooth position={[-4.5, 0, 0]} rotation={[0, Math.PI, 0]} label="B5" color={COLORS.GREEN} occupancy={occupancy} />
         <LuxuryBooth position={[-1.5, 0, 0]} rotation={[0, Math.PI, 0]} label="B3" color={COLORS.GREEN} occupancy={occupancy} />
         <LuxuryBooth position={[1.5, 0, 0]} rotation={[0, Math.PI, 0]} label="B2" color={COLORS.GREEN} occupancy={occupancy} />
         <LuxuryBooth position={[4.5, 0, 0]} rotation={[0, Math.PI, 0]} label="B1" color={COLORS.GREEN} occupancy={occupancy} />
      </group>


      {/* --- ELEVATED PLATFORM FOR SECTION A --- */}
      <group position={[0, 0, 12.5]}>
        {/* Main Platform Base */}
        <Box args={[20, 0.35, 3.5]} position={[0, 0.175, 0]} castShadow receiveShadow>
          <meshStandardMaterial 
            color="#2a2a2a" 
            roughness={0.6}
            metalness={0.2}
          />
        </Box>
        {/* Platform Top Surface */}
        <Box args={[20.2, 0.05, 3.7]} position={[0, 0.375, 0]} receiveShadow>
          <meshStandardMaterial 
            color="#1a1a1a" 
            roughness={0.4}
            metalness={0.5}
          />
        </Box>
        {/* LED Strip - Front */}
        <Box args={[20, 0.04, 0.08]} position={[0, 0.37, 1.85]}>
          <meshStandardMaterial 
            color={COLORS.PINK} 
            emissive={COLORS.PINK} 
            emissiveIntensity={1.5}
          />
        </Box>
        {/* Steps - Front Left */}
        <Box args={[2.5, 0.14, 0.5]} position={[-8, 0.07, 2.35]} castShadow receiveShadow>
          <meshStandardMaterial color="#222" roughness={0.7} />
        </Box>
        <Box args={[2.5, 0.28, 0.5]} position={[-8, 0.14, 2.9]} castShadow receiveShadow>
          <meshStandardMaterial color="#222" roughness={0.7} />
        </Box>
        {/* Steps - Front Right */}
        <Box args={[2.5, 0.14, 0.5]} position={[8, 0.07, 2.35]} castShadow receiveShadow>
          <meshStandardMaterial color="#222" roughness={0.7} />
        </Box>
        <Box args={[2.5, 0.28, 0.5]} position={[8, 0.14, 2.9]} castShadow receiveShadow>
          <meshStandardMaterial color="#222" roughness={0.7} />
        </Box>
      </group>

      {/* --- SECTION A --- */}
      <group position={[0, 0.4, 12.5]}>
         <LuxuryBooth position={[-7.5, 0, 0]} rotation={[0, Math.PI, 0]} label="A7" color={COLORS.PINK} occupancy={occupancy} />
         <LuxuryBooth position={[-4.5, 0, 0]} rotation={[0, Math.PI, 0]} label="A6" color={COLORS.PINK} occupancy={occupancy} />
         <LuxuryBooth position={[-1.5, 0, 0]} rotation={[0, Math.PI, 0]} label="A5" color={COLORS.PINK} occupancy={occupancy} />
         <LuxuryBooth position={[1.5, 0, 0]} rotation={[0, Math.PI, 0]} label="A3" color={COLORS.PINK} occupancy={occupancy} />
         <LuxuryBooth position={[4.5, 0, 0]} rotation={[0, Math.PI, 0]} label="A2" color={COLORS.PINK} occupancy={occupancy} />
         <LuxuryBooth position={[7.5, 0, 0]} rotation={[0, Math.PI, 0]} label="A1" color={COLORS.PINK} occupancy={occupancy} />
      </group>

      <BarArea />

    </group>
  );
};

export default VenueMap;