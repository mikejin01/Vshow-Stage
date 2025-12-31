import React, { useMemo } from 'react';
import { Box, Cylinder, Text, RoundedBox, Sphere, Line, Billboard } from '@react-three/drei';
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

const GRID_COLUMNS = 24; // A-X
const GRID_ROWS = 20; // 1-20
const CELL_SIZE = 1.5; // meters per tile for finer granularity
const GRID_WIDTH = GRID_COLUMNS * CELL_SIZE;
const GRID_HEIGHT = GRID_ROWS * CELL_SIZE;
const GRID_HALF_WIDTH = GRID_WIDTH / 2;
const GRID_HALF_HEIGHT = GRID_HEIGHT / 2;

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

const ModernTable: React.FC<{ width: number; depth: number; height: number; fancy?: boolean }> = ({ width, depth, height, fancy = false }) => {
  const rimColor = fancy ? '#d4af37' : '#0a0a0a';
  const topColor = fancy ? '#111111' : '#1a1a1a';
  const accentColor = fancy ? '#f1c40f' : '#0a0a0a';
  return (
    <group position={[0, 0, 0]}>
       {/* Table Top - Round */}
       <Cylinder args={[width * 0.5, width * 0.5, 0.04, 24]} position={[0, height, 0]} castShadow>
          <meshStandardMaterial 
            color={topColor} 
            roughness={0.3} 
            metalness={0.8} 
          />
       </Cylinder>
       {fancy && (
        <Cylinder args={[width * 0.55, width * 0.55, 0.015, 32]} position={[0, height + 0.03, 0]}>
          <meshStandardMaterial color={rimColor} emissive={rimColor} emissiveIntensity={0.6} metalness={1} roughness={0.2} />
        </Cylinder>
       )}
       
       {/* Table Leg - Center pedestal */}
       <Cylinder args={[0.08, 0.12, height - 0.1, 12]} position={[0, height / 2, 0]}>
           <meshStandardMaterial color={accentColor} metalness={0.9} roughness={0.2} />
       </Cylinder>
       
       {/* Base */}
       <Cylinder args={[width * 0.4, width * 0.4, 0.03, 16]} position={[0, 0.015, 0]}>
           <meshStandardMaterial color={rimColor} metalness={0.8} roughness={0.25} />
       </Cylinder>
       {fancy && (
        <Cylinder args={[width * 0.5, width * 0.5, 0.015, 24]} position={[0, 0.035, 0]}>
          <meshStandardMaterial color={rimColor} emissive={rimColor} emissiveIntensity={0.4} metalness={1} roughness={0.2} />
        </Cylinder>
       )}
       
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
  variant?: 'standard' | 'showcase';
}

const LuxuryBooth: React.FC<BoothProps> = ({ 
    position, 
    rotation = [0,0,0], 
    color, 
    label, 
    width = 2.2, 
    depth = 1.6,
    occupancy = 0,
    variant = 'standard',
}) => {
  const seatHeight = 0.45;
  const backHeight = 0.9;
  const thickness = 0.4;
  
  // Determine how many people to show (0-4 per booth based on occupancy)
  const maxPeople = 4;
  const numPeople = Math.floor(occupancy * maxPeople);

  const isShowcase = variant === 'showcase';
  const scale = isShowcase ? 1.25 : 1;
  const glowColor = isShowcase ? '#f5d142' : color;

  return (
    <group position={position} rotation={rotation} scale={scale}>

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

      <ModernTable width={width * 0.5} depth={depth * 0.5} height={0.55} fancy={isShowcase} />

      {label && (
        <Billboard
            position={[0, 2.5, 0]}
            follow={true}
            lockX={false}
            lockY={false}
            lockZ={false}
        >
            <Text 
                fontSize={0.7} 
                color={color}
                anchorX="center" 
                anchorY="middle"
                outlineWidth={0.02}
                outlineColor="#000000"
                fontWeight={700}
            >
                {label}
            </Text>
        </Billboard>
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

const CurtainPanel: React.FC<{ 
  args: [number, number, number], 
  position: [number, number, number], 
  rotation?: [number, number, number],
  isHorizontal?: boolean 
}> = ({ args, position, rotation = [0, 0, 0], isHorizontal = true }) => {
  const [width, height, depth] = args;
  
  // Create an array for the vertical lines
  // We'll place a line every 0.25m for a dense curtain look
  // If isHorizontal is false, we swap width/depth for line placement
  const dimensionForLines = isHorizontal ? width : depth;
  const numLines = Math.floor(dimensionForLines / 0.25);
  
  return (
    <group position={position} rotation={rotation}>
      {/* Main Dark Grey Panel */}
      <Box args={args} castShadow receiveShadow>
        <meshStandardMaterial 
          color="#222222" 
          roughness={0.9}
          metalness={0.1}
          side={THREE.DoubleSide}
        />
      </Box>
      
      {/* Light Grey Vertical Lines (simulating folds) */}
      {Array.from({ length: numLines }).map((_, i) => {
        const linePos = (i * 0.25) - (dimensionForLines / 2) + 0.125;
        const lineArgs: [number, number, number] = isHorizontal 
          ? [0.03, height, depth + 0.02] 
          : [width + 0.02, height, 0.03];
        
        const linePosition: [number, number, number] = isHorizontal
          ? [linePos, 0, 0]
          : [0, 0, linePos];

        return (
          <Box 
            key={i} 
            args={lineArgs} 
            position={linePosition}
          >
            <meshStandardMaterial color="#444444" roughness={0.8} />
          </Box>
        );
      })}
    </group>
  );
};

const BarArea: React.FC<{ occupancy: number }> = ({ occupancy }) => {
    return (
        <group position={[-14.25, 0, 3]}>
            {/* ELEVATED PLATFORM FOR BAR AREA (Extended from A to E) */}
            <group position={[0, 0, 0]}>
                {/* Platform Base - Extended to columns A-E */}
                <Box args={[7.5, 0.4, 12]} position={[0, 0.2, 0]} castShadow receiveShadow>
                    <meshStandardMaterial 
                        color="#2a2a2a" 
                        roughness={0.6}
                        metalness={0.2}
                    />
                </Box>
                {/* Platform Top Surface */}
                <Box args={[7.7, 0.05, 12.2]} position={[0, 0.425, 0]} receiveShadow>
                    <meshStandardMaterial 
                        color="#1a1a1a" 
                        roughness={0.4}
                        metalness={0.5}
                    />
                </Box>
                {/* LED Strip - Front edge */}
                <Box args={[7.5, 0.04, 0.08]} position={[0, 0.42, 6]}>
                    <meshStandardMaterial 
                        color={COLORS.BAR} 
                        emissive={COLORS.BAR} 
                        emissiveIntensity={2}
                    />
                </Box>
                
                {/* Steps - Three access points for wider platform */}
                {[-2.5, 0, 2.5].map((xPos, idx) => (
                    <group key={idx} position={[xPos, 0, 6.2]}>
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
                {/* Counter Base - Extended */}
                <Box args={[2.0, 1.1, 12]} position={[0, 0.55, 0]} castShadow receiveShadow>
                    <meshStandardMaterial color="#2a2a2a" roughness={0.2} />
                </Box>
                {/* Counter Top - Extended */}
                <Box args={[2.3, 0.1, 12.2]} position={[0, 1.15, 0]}>
                    <meshStandardMaterial color="#111" metalness={0.9} roughness={0.05} />
                </Box>
                {/* Under Counter LED - Extended */}
                <Box args={[2.1, 0.05, 12.1]} position={[0, 1.1, 0]}>
                    <meshStandardMaterial color={COLORS.BAR} emissive={COLORS.BAR} emissiveIntensity={2} />
                </Box>
            </group>
            
            {/* Back Wall Shelving Unit - Moved further back to create space */}
            <group position={[-3.0, 0.45, 0]}>
                {/* Back Panel */}
                <Box args={[1, 4, 12]} position={[0, 2, 0]}>
                    <meshStandardMaterial color="#222" />
                </Box>
                {/* Shelves */}
                {[1.5, 2.2, 2.9, 3.6].map((y, i) => (
                    <Box key={i} args={[0.8, 0.05, 11]} position={[0.2, y, 0]}>
                        <meshStandardMaterial color="#444" />
                    </Box>
                ))}
                
                {/* Bottles on shelves */}
                {Array.from({ length: 54 }).map((_, i) => {
                    const shelfIndex = Math.floor(i / 9); // 0-5 shelves (we use first 6 rows of 9)
                    const y = 1.55 + shelfIndex * 0.55;
                    const z = (i % 9) * 1.25 - 5;
                    const hue = (i * 22) % 360;
                    return (
                        <Box key={`bottle-${i}`} args={[0.12, 0.32, 0.12]} position={[0.25, y, z]}>
                            <meshStandardMaterial 
                                color={`hsl(${hue}, 70%, 55%)`} 
                                emissive={`hsl(${hue}, 70%, 35%)`}
                                emissiveIntensity={0.45}
                                metalness={0.3}
                                roughness={0.35}
                            />
                        </Box>
                    );
                })}
            </group>

            {/* BAR Label - Always facing camera */}
            <Billboard
                position={[0, 3.0, 0]}
            >
                <Text 
                    color={COLORS.BAR} 
                    fontSize={0.8} 
                    letterSpacing={0.2}
                    anchorX="center" 
                    anchorY="middle"
                    outlineWidth={0.02}
                    outlineColor="#000000"
                    fontWeight={700}
                >
                    BAR
                </Text>
            </Billboard>
            
            {/* BARTENDERS - In the space between counter and shelf (2 bartenders) */}
            {[-3, 3].map((zPos, idx) => (
                <Bartender 
                    key={`bartender-${idx}`}
                    position={[-1.5, 0.45, zPos]} 
                    rotation={Math.PI / 2}
                />
            ))}
            
            {/* STANDING CUSTOMERS - In front of bar (scaled by occupancy) */}
            {Array.from({ length: Math.floor(occupancy * 14) }).map((_, i) => (
                <StandingCustomer 
                    key={`customer-${i}`}
                    position={[1.8, 0.45, (i - (Math.floor(occupancy * 14) - 1) / 2) * 0.95]} 
                    rotation={-Math.PI / 2}
                />
            ))}
        </group>
    )
}

const VenueMap: React.FC<{ occupancy?: number; designMode?: boolean; closedSections?: string[] }> = ({ occupancy = 0, designMode = false, closedSections = [] }) => {
  const tileLabels = useMemo(() => {
    const labels: { x: number; z: number; text: string }[] = [];
    for (let col = 0; col < GRID_COLUMNS; col++) {
      const letter = String.fromCharCode(65 + col);
      const x = -GRID_HALF_WIDTH + CELL_SIZE * col + CELL_SIZE / 2;
      for (let row = 0; row < GRID_ROWS; row++) {
        const z = -GRID_HALF_HEIGHT + CELL_SIZE * row + CELL_SIZE / 2;
        labels.push({ x, z, text: `${letter}${row + 1}` });
      }
    }
    return labels;
  }, []);

  const axisLabels = useMemo(() => {
    const letters = Array.from({ length: GRID_COLUMNS }, (_, col) => ({
      x: -GRID_HALF_WIDTH + CELL_SIZE * col + CELL_SIZE / 2,
      text: String.fromCharCode(65 + col),
    }));
    const numbers = Array.from({ length: GRID_ROWS }, (_, row) => ({
      z: -GRID_HALF_HEIGHT + CELL_SIZE * row + CELL_SIZE / 2,
      text: `${row + 1}`,
    }));
    return { letters, numbers };
  }, []);

  return (
    <group>
      {/* --- IMPROVED FLOOR WITH NO Z-FIGHTING --- */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[GRID_WIDTH, GRID_HEIGHT]} />
        <meshStandardMaterial 
            color="#e8e8e8"
            roughness={0.6} 
            metalness={0.1}
        />
      </mesh>
      
      {/* Grid lines at a safe height above floor to prevent z-fighting */}
      <group position={[0, 0.02, 0]}>
        {/* Vertical lines (columns) */}
        {Array.from({ length: GRID_COLUMNS + 1 }).map((_, idx) => {
          const x = -GRID_HALF_WIDTH + idx * CELL_SIZE;
          return (
            <Line
              key={`v-${idx}`}
              points={[
                [x, 0, -GRID_HALF_HEIGHT],
                [x, 0, GRID_HALF_HEIGHT],
              ]}
              color="#aaaaaa"
              opacity={0.8}
              transparent
            />
          );
        })}
        {/* Horizontal lines (rows) */}
        {Array.from({ length: GRID_ROWS + 1 }).map((_, idx) => {
          const z = -GRID_HALF_HEIGHT + idx * CELL_SIZE;
          return (
            <Line
              key={`h-${idx}`}
              points={[
                [-GRID_HALF_WIDTH, 0, z],
                [GRID_HALF_WIDTH, 0, z],
              ]}
              color="#888888"
              opacity={0.8}
              transparent
            />
          );
        })}
      </group>

      {designMode && (
        <group position={[0, 0.05, 0]}>
          {tileLabels.map((tile) => (
            <Text
              key={tile.text}
              position={[tile.x, 0, tile.z]}
              rotation={[-Math.PI / 2, 0, 0]}
              fontSize={0.35}
              color="#1f2937"
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.015}
              outlineColor="#f9fafb"
            >
              {tile.text}
            </Text>
          ))}

          {/* Axis labels outside the grid */}
          {/* Bottom (Z positive) and top (Z negative) letters */}
          {axisLabels.letters.map((letter) => (
            <React.Fragment key={`letter-${letter.text}`}>
              <Text
                position={[letter.x, 0, GRID_HALF_HEIGHT + 0.8]}
                rotation={[-Math.PI / 2, 0, 0]}
                fontSize={0.35}
                color="#111827"
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.015}
                outlineColor="#f9fafb"
              >
                {letter.text}
              </Text>
              <Text
                position={[letter.x, 0, -GRID_HALF_HEIGHT - 0.8]}
                rotation={[-Math.PI / 2, 0, 0]}
                fontSize={0.35}
                color="#111827"
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.015}
                outlineColor="#f9fafb"
              >
                {letter.text}
              </Text>
            </React.Fragment>
          ))}

          {/* Left (X negative) and right (X positive) numbers */}
          {axisLabels.numbers.map((num) => (
            <React.Fragment key={`num-${num.text}`}>
              <Text
                position={[-GRID_HALF_WIDTH - 0.8, 0, num.z]}
                rotation={[-Math.PI / 2, 0, 0]}
                fontSize={0.35}
                color="#111827"
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.015}
                outlineColor="#f9fafb"
              >
                {num.text}
              </Text>
              <Text
                position={[GRID_HALF_WIDTH + 0.8, 0, num.z]}
                rotation={[-Math.PI / 2, 0, 0]}
                fontSize={0.35}
                color="#111827"
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.015}
                outlineColor="#f9fafb"
              >
                {num.text}
              </Text>
            </React.Fragment>
          ))}
        </group>
      )}

      {/* --- LED SCREEN & BACKGROUND (Right behind stage, no gap) --- */}
      <group position={[0, 3, -12]}>
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


      {/* --- ELEVATED PLATFORM FOR SECTION E (E1-E5) - CONNECTED TO STAGE --- */}
      {/* Horizontal part: E1, E2, E3 - Adjacent to left side of stage */}
      <group position={[-8.5, 0, -9]}>
        <Box args={[8, 0.3, 3]} position={[0, 0.15, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#2a2a2a" roughness={0.6} metalness={0.2} />
        </Box>
        <Box args={[8.2, 0.05, 3.2]} position={[0, 0.325, 0]} receiveShadow>
          <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.5} />
        </Box>
        <Box args={[8, 0.04, 0.08]} position={[0, 0.32, 1.5]}>
          <meshStandardMaterial color={COLORS.PINK} emissive={COLORS.PINK} emissiveIntensity={1.5} />
        </Box>
      </group>

      {/* Vertical part: E5 (connected to E3) - Only for E5 table, NOT covering D6-E7 */}
      <group position={[-14.25, 0, -6]}>
        <Box args={[3, 0.3, 3]} position={[0, 0.15, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#2a2a2a" roughness={0.6} metalness={0.2} />
        </Box>
        <Box args={[3.2, 0.05, 3.2]} position={[0, 0.325, 0]} receiveShadow>
          <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.5} />
        </Box>
        <Box args={[0.08, 0.04, 3]} position={[1.5, 0.32, 0]}>
          <meshStandardMaterial color={COLORS.PINK} emissive={COLORS.PINK} emissiveIntensity={1.5} />
        </Box>
        {/* Steps for E5 section */}
        <Box args={[0.5, 0.12, 1.5]} position={[1.6, 0.06, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#222" roughness={0.7} />
        </Box>
        <Box args={[0.5, 0.24, 1.5]} position={[2.1, 0.12, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#222" roughness={0.7} />
        </Box>
      </group>

      {/* --- SECTION E (E1-E5 on elevated platform, E6 on floor) --- */}
      {/* Hide booths when section is closed */}
      {!closedSections.includes('E') && (
        <group position={[0, 0.35, 0]}>
          <LuxuryBooth position={[-13, 0, -9]} label="E3" color={COLORS.PINK} occupancy={occupancy} />
          <LuxuryBooth position={[-10, 0, -9]} label="E2" color={COLORS.PINK} occupancy={occupancy} />
          <LuxuryBooth position={[-7, 0, -9]} label="E1" color={COLORS.PINK} occupancy={occupancy} />
          
          <LuxuryBooth position={[-15, 0, -6]} rotation={[0, Math.PI/2, 0]} label="E5" color={COLORS.PINK} occupancy={occupancy} />
        </group>
      )}
      
      {/* E6 Showcase - On dance floor (not on platform) - Moved toward center */}
      <LuxuryBooth position={[-7.5, 0, -5]} label="E6" color={COLORS.ORANGE} occupancy={occupancy} variant="showcase" />


      {/* --- ELEVATED PLATFORM FOR SECTION D (D3-D10) - CONNECTED TO STAGE --- */}
      {/* Horizontal part: D10, D9, D8 - Adjacent to right side of stage */}
      <group position={[8.5, 0, -9]}>
        <Box args={[8, 0.3, 3]} position={[0, 0.15, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#2a2a2a" roughness={0.6} metalness={0.2} />
        </Box>
        <Box args={[8.2, 0.05, 3.2]} position={[0, 0.325, 0]} receiveShadow>
          <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.5} />
        </Box>
        <Box args={[8, 0.04, 0.08]} position={[0, 0.32, 1.5]}>
          <meshStandardMaterial color={COLORS.PINK} emissive={COLORS.PINK} emissiveIntensity={1.5} />
        </Box>
      </group>

      {/* Vertical part: D7, D6, D5, D3 (connected to D8) - NOT covering S column */}
      <group position={[13.5, 0, -1.5]}>
        <Box args={[4, 0.3, 11.5]} position={[0, 0.15, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#2a2a2a" roughness={0.6} metalness={0.2} />
        </Box>
        <Box args={[4.2, 0.05, 11.7]} position={[0, 0.325, 0]} receiveShadow>
          <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.5} />
        </Box>
        <Box args={[0.08, 0.04, 11.5]} position={[-2, 0.32, 0]}>
          <meshStandardMaterial color={COLORS.PINK} emissive={COLORS.PINK} emissiveIntensity={1.5} />
        </Box>
        {/* Steps for D section */}
        <Box args={[0.5, 0.12, 2]} position={[-2.1, 0.06, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#222" roughness={0.7} />
        </Box>
        <Box args={[0.5, 0.24, 2]} position={[-2.6, 0.12, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#222" roughness={0.7} />
        </Box>
      </group>

      {/* --- SECTION D (D3-D10 on elevated platform, D1 & D2 on floor) --- */}
      {/* Hide booths when section is closed */}
      {!closedSections.includes('D') && (
        <group position={[0, 0.35, 0]}>
          <LuxuryBooth position={[7, 0, -9]} label="D10" color={COLORS.PINK} occupancy={occupancy} />
          <LuxuryBooth position={[10, 0, -9]} label="D9" color={COLORS.PINK} occupancy={occupancy} />
          <LuxuryBooth position={[13, 0, -9]} label="D8" color={COLORS.PINK} occupancy={occupancy} />

          <group position={[15, 0, 0]}>
         <LuxuryBooth position={[0, 0, -6]} rotation={[0, -Math.PI/2, 0]} label="D7" color={COLORS.PINK} occupancy={occupancy} />
         <LuxuryBooth position={[0, 0, -3]} rotation={[0, -Math.PI/2, 0]} label="D6" color={COLORS.PINK} occupancy={occupancy} />
         <LuxuryBooth position={[0, 0, 0]} rotation={[0, -Math.PI/2, 0]} label="D5" color={COLORS.PINK} occupancy={occupancy} />
         <LuxuryBooth position={[0, 0, 3]} rotation={[0, -Math.PI/2, 0]} label="D3" color={COLORS.PINK} occupancy={occupancy} />
      </group>
        </group>
      )}

      {/* D1 & D2 Showcase - On dance floor (not on platform) - Moved toward center */}
      <group position={[7.5, 0, 0]}>
         <LuxuryBooth position={[0, 0, -3]} rotation={[0, -Math.PI/2, 0]} label="D1" color={COLORS.ORANGE} occupancy={occupancy} variant="showcase" />
         <LuxuryBooth position={[0, 0, 0]} rotation={[0, -Math.PI/2, 0]} label="D2" color={COLORS.ORANGE} occupancy={occupancy} variant="showcase" />
      </group>


      {/* --- ELEVATED PLATFORM FOR B4-D5 AREA (Left side, near stage) --- */}
      <group position={[-14.25, 0, -9]}>
        {/* Main Platform Base */}
        <Box args={[4.5, 0.3, 3]} position={[0, 0.15, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#2a2a2a" roughness={0.6} metalness={0.2} />
        </Box>
        {/* Top Surface */}
        <Box args={[4.6, 0.05, 3.1]} position={[0, 0.325, 0]} receiveShadow>
          <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.5} />
        </Box>
        {/* Front Edge Strip */}
        <Box args={[4.5, 0.04, 0.08]} position={[0, 0.32, 1.5]}>
          <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.3} />
        </Box>
        {/* Back Edge Strip */}
        <Box args={[4.5, 0.04, 0.08]} position={[0, 0.32, -1.5]}>
          <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.3} />
        </Box>
        {/* Left Edge Strip */}
        <Box args={[0.08, 0.04, 3]} position={[-2.25, 0.32, 0]}>
          <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.3} />
        </Box>
        {/* Right Edge Strip */}
        <Box args={[0.08, 0.04, 3]} position={[2.25, 0.32, 0]}>
          <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.3} />
        </Box>
      </group>


      {/* --- ELEVATED PLATFORM FOR U4-W5 AREA (Right side, near stage) --- */}
      <group position={[14.25, 0, -9]}>
        {/* Main Platform Base */}
        <Box args={[4.5, 0.3, 3]} position={[0, 0.15, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#2a2a2a" roughness={0.6} metalness={0.2} />
        </Box>
        {/* Top Surface */}
        <Box args={[4.6, 0.05, 3.1]} position={[0, 0.325, 0]} receiveShadow>
          <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.5} />
        </Box>
        {/* Front Edge Strip */}
        <Box args={[4.5, 0.04, 0.08]} position={[0, 0.32, 1.5]}>
          <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.3} />
        </Box>
        {/* Back Edge Strip */}
        <Box args={[4.5, 0.04, 0.08]} position={[0, 0.32, -1.5]}>
          <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.3} />
        </Box>
        {/* Left Edge Strip */}
        <Box args={[0.08, 0.04, 3]} position={[-2.25, 0.32, 0]}>
          <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.3} />
        </Box>
        {/* Right Edge Strip */}
        <Box args={[0.08, 0.04, 3]} position={[2.25, 0.32, 0]}>
          <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.3} />
        </Box>
      </group>


      {/* --- SECTION F (On Bar Elevated Platform - Extended A-E) --- */}
      <group position={[-11.25, 0.45, 3]}>
          <LuxuryBooth position={[0, 0, -2]} rotation={[0, Math.PI/2, 0]} label="F1" color={COLORS.PINK} occupancy={occupancy} />
          <LuxuryBooth position={[0, 0, 1]} rotation={[0, Math.PI/2, 0]} label="F2" color={COLORS.PINK} occupancy={occupancy} />
      </group>


      {/* --- ELEVATED PLATFORM FOR SECTION B (Rows 14-17, NOT row 13) --- */}
      <group position={[0, 0, 7.5]}>
        {/* Main Platform Base - Rows 14-17 only (6m depth, not 7.5m) */}
        <Box args={[12, 0.3, 6]} position={[0, 0.15, 0]} castShadow receiveShadow>
          <meshStandardMaterial 
            color="#2a2a2a" 
            roughness={0.6}
            metalness={0.2}
          />
        </Box>
        {/* Platform Top Surface */}
        <Box args={[12.2, 0.05, 6.2]} position={[0, 0.325, 0]} receiveShadow>
          <meshStandardMaterial 
            color="#1a1a1a" 
            roughness={0.4}
            metalness={0.5}
          />
        </Box>
        {/* LED Strip - Front */}
        <Box args={[12, 0.04, 0.08]} position={[0, 0.32, 3]}>
          <meshStandardMaterial 
            color={COLORS.GREEN} 
            emissive={COLORS.GREEN} 
            emissiveIntensity={1.5}
          />
        </Box>
        {/* Steps - Front Left */}
        <Box args={[2, 0.12, 0.5]} position={[-5, 0.06, 3.1]} castShadow receiveShadow>
          <meshStandardMaterial color="#222" roughness={0.7} />
        </Box>
        <Box args={[2, 0.24, 0.5]} position={[-5, 0.12, 3.65]} castShadow receiveShadow>
          <meshStandardMaterial color="#222" roughness={0.7} />
        </Box>
        {/* Steps - Front Right */}
        <Box args={[2, 0.12, 0.5]} position={[5, 0.06, 3.1]} castShadow receiveShadow>
          <meshStandardMaterial color="#222" roughness={0.7} />
        </Box>
        <Box args={[2, 0.24, 0.5]} position={[5, 0.12, 3.65]} castShadow receiveShadow>
          <meshStandardMaterial color="#222" roughness={0.7} />
        </Box>
      </group>

      {/* --- SECTION B (On rows 14-17 platform, NOT row 13) --- */}
      {/* Hide booths when section is closed */}
      {!closedSections.includes('B') && (
        <>
          <group position={[0, 0.35, 6]}>
         <LuxuryBooth position={[-3.3, 0, 0]} rotation={[0, Math.PI, 0]} label="B6" color={COLORS.GREEN} occupancy={occupancy} />
         <LuxuryBooth position={[-1.1, 0, 0]} rotation={[0, Math.PI, 0]} label="B7" color={COLORS.GREEN} occupancy={occupancy} />
         <LuxuryBooth position={[1.1, 0, 0]} rotation={[0, Math.PI, 0]} label="B8" color={COLORS.GREEN} occupancy={occupancy} />
         <LuxuryBooth position={[3.3, 0, 0]} rotation={[0, Math.PI, 0]} label="B9" color={COLORS.GREEN} occupancy={occupancy} />
      </group>

          <group position={[0, 0.35, 9]}>
         <LuxuryBooth position={[-3.3, 0, 0]} rotation={[0, Math.PI, 0]} label="B5" color={COLORS.GREEN} occupancy={occupancy} />
         <LuxuryBooth position={[-1.1, 0, 0]} rotation={[0, Math.PI, 0]} label="B3" color={COLORS.GREEN} occupancy={occupancy} />
         <LuxuryBooth position={[1.1, 0, 0]} rotation={[0, Math.PI, 0]} label="B2" color={COLORS.GREEN} occupancy={occupancy} />
         <LuxuryBooth position={[3.3, 0, 0]} rotation={[0, Math.PI, 0]} label="B1" color={COLORS.GREEN} occupancy={occupancy} />
      </group>
        </>
      )}


      {/* --- ELEVATED PLATFORM FOR SECTION A (Adjacent to B, rows 18-20) --- */}
      <group position={[0, 0, 11.25]}>
        {/* Main Platform Base (taller than B) */}
        <Box args={[15, 0.6, 3.5]} position={[0, 0.3, 0]} castShadow receiveShadow>
          <meshStandardMaterial 
            color="#2a2a2a" 
            roughness={0.6}
            metalness={0.2}
          />
        </Box>
        {/* Platform Top Surface */}
        <Box args={[15.2, 0.05, 3.7]} position={[0, 0.65, 0]} receiveShadow>
          <meshStandardMaterial 
            color="#1a1a1a" 
            roughness={0.4}
            metalness={0.5}
          />
        </Box>
        {/* LED Strip - Front */}
        <Box args={[15, 0.04, 0.08]} position={[0, 0.64, 1.85]}>
          <meshStandardMaterial 
            color={COLORS.PINK} 
            emissive={COLORS.PINK} 
            emissiveIntensity={1.5}
          />
        </Box>
        {/* Steps - Front Left */}
        <Box args={[2.5, 0.18, 0.5]} position={[-6, 0.09, 2.35]} castShadow receiveShadow>
          <meshStandardMaterial color="#222" roughness={0.7} />
        </Box>
        <Box args={[2.5, 0.36, 0.5]} position={[-6, 0.18, 2.9]} castShadow receiveShadow>
          <meshStandardMaterial color="#222" roughness={0.7} />
        </Box>
        {/* Steps - Front Right */}
        <Box args={[2.5, 0.18, 0.5]} position={[6, 0.09, 2.35]} castShadow receiveShadow>
          <meshStandardMaterial color="#222" roughness={0.7} />
        </Box>
        <Box args={[2.5, 0.36, 0.5]} position={[6, 0.18, 2.9]} castShadow receiveShadow>
          <meshStandardMaterial color="#222" roughness={0.7} />
        </Box>
      </group>

      {/* --- SECTION A (Adjacent to Section B) --- */}
      {/* Hide booths when section is closed */}
      {!closedSections.includes('A') && (
        <group position={[0, 0.7, 11.25]}>
         <LuxuryBooth position={[-5.5, 0, 0]} rotation={[0, Math.PI, 0]} label="A7" color={COLORS.PINK} occupancy={occupancy} />
         <LuxuryBooth position={[-3.3, 0, 0]} rotation={[0, Math.PI, 0]} label="A6" color={COLORS.PINK} occupancy={occupancy} />
         <LuxuryBooth position={[-1.1, 0, 0]} rotation={[0, Math.PI, 0]} label="A5" color={COLORS.PINK} occupancy={occupancy} />
         <LuxuryBooth position={[1.1, 0, 0]} rotation={[0, Math.PI, 0]} label="A3" color={COLORS.PINK} occupancy={occupancy} />
         <LuxuryBooth position={[3.3, 0, 0]} rotation={[0, Math.PI, 0]} label="A2" color={COLORS.PINK} occupancy={occupancy} />
         <LuxuryBooth position={[5.5, 0, 0]} rotation={[0, Math.PI, 0]} label="A1" color={COLORS.PINK} occupancy={occupancy} />
      </group>
      )}

      <BarArea occupancy={occupancy} />

      {/* --- CURTAINS FOR CLOSED SECTIONS --- */}
      {/* Curtains precisely match platform dimensions */}
      {/* Curtain Material: Red velvet-like fabric with texture */}
      
      {closedSections.includes('A') && (
        // Section A Platform: [0, 0, 11.25], size [15, 0.6, 3.5]
        <group position={[0, 4, 11.25]}>
          {/* Front curtain */}
          <CurtainPanel args={[15, 8, 0.15]} position={[0, 0, 1.75]} />
          {/* Back curtain */}
          <CurtainPanel args={[15, 8, 0.15]} position={[0, 0, -1.75]} />
          {/* Left curtain */}
          <CurtainPanel args={[0.15, 8, 3.5]} position={[-7.5, 0, 0]} isHorizontal={false} />
          {/* Right curtain */}
          <CurtainPanel args={[0.15, 8, 3.5]} position={[7.5, 0, 0]} isHorizontal={false} />
        </group>
      )}

      {closedSections.includes('B') && (
        // Section B Platform: [0, 0, 7.5], size [12, 0.3, 6] (rows 14-17 only)
        <group position={[0, 4, 7.5]}>
          {/* Front curtain */}
          <CurtainPanel args={[12, 8, 0.15]} position={[0, 0, 3]} />
          {/* Back curtain */}
          <CurtainPanel args={[12, 8, 0.15]} position={[0, 0, -3]} />
          {/* Left curtain */}
          <CurtainPanel args={[0.15, 8, 6]} position={[-6, 0, 0]} isHorizontal={false} />
          {/* Right curtain */}
          <CurtainPanel args={[0.15, 8, 6]} position={[6, 0, 0]} isHorizontal={false} />
        </group>
      )}

      {closedSections.includes('D') && (
        // Section D Platform (L-shaped): Complete enclosure
        // Horizontal: [8.5, 0, -9], size [8, 0.3, 3] → X: 4.5 to 12.5, Z: -10.5 to -7.5
        // Vertical: [13.5, 0, -1.5], size [4, 0.3, 11.5] → X: 11.5 to 15.5, Z: -7.25 to 4.25
        <>
          {/* 1. Bottom wall (horizontal back) - Full width 8m */}
          <CurtainPanel args={[8, 8, 0.15]} position={[8.5, 4, -10.575]} />
          
          {/* 2. Bottom-left wall (horizontal left side) */}
          <CurtainPanel args={[0.15, 8, 3]} position={[4.425, 4, -9]} isHorizontal={false} />
          
          {/* 3. Left connector front (horizontal front, left portion) */}
          <CurtainPanel args={[3.5, 8, 0.15]} position={[6.25, 4, -7.425]} />
          
          {/* 3b. MISSING SEGMENT - Junction connector (fills gap from horizontal to vertical) */}
          <CurtainPanel args={[4.25, 8, 0.15]} position={[10.375, 4, -7.425]} />
          
          {/* 4. Inner L wall (vertical left edge) - Full height */}
          <CurtainPanel args={[0.15, 8, 11.5]} position={[11.425, 4, -1.5]} isHorizontal={false} />
          
          {/* 5. Top wall (vertical front) */}
          <CurtainPanel args={[4, 8, 0.15]} position={[13.5, 4, 4.325]} />
          
          {/* 6. Right wall (vertical right edge) - Full height */}
          <CurtainPanel args={[0.15, 8, 11.5]} position={[15.575, 4, -1.5]} isHorizontal={false} />
          
          {/* 7. Back connector (vertical back, connects to horizontal) */}
          <CurtainPanel args={[4, 8, 0.15]} position={[13.5, 4, -7.325]} />
          
          {/* 8. Bottom-right connector (horizontal right side) */}
          <CurtainPanel args={[0.15, 8, 3]} position={[12.575, 4, -9]} isHorizontal={false} />
        </>
      )}

      {closedSections.includes('E') && (
        // Section E Platform (L-shaped): Complete enclosure
        // Horizontal: [-8.5, 0, -9], size [8, 0.3, 3] → X: -12.5 to -4.5, Z: -10.5 to -7.5
        // Vertical: [-14.25, 0, -6], size [3, 0.3, 3] → X: -15.75 to -12.75, Z: -7.5 to -4.5
        <>
          {/* 1. Bottom wall (horizontal back) - Full width 8m */}
          <CurtainPanel args={[8, 8, 0.15]} position={[-8.5, 4, -10.575]} />
          
          {/* 2. Bottom-right wall (horizontal right side) */}
          <CurtainPanel args={[0.15, 8, 3]} position={[-4.425, 4, -9]} isHorizontal={false} />
          
          {/* 3. Right connector front (horizontal front, right portion) */}
          <CurtainPanel args={[3.5, 8, 0.15]} position={[-6.25, 4, -7.425]} />
          
          {/* 3b. MISSING SEGMENT - Junction connector (fills gap from horizontal to vertical) */}
          <CurtainPanel args={[4.25, 8, 0.15]} position={[-10.375, 4, -7.425]} />
          
          {/* 4. Inner L wall (vertical right edge) - Full height */}
          <CurtainPanel args={[0.15, 8, 3]} position={[-12.675, 4, -6]} isHorizontal={false} />
          
          {/* 5. Top wall (vertical front) */}
          <CurtainPanel args={[3, 8, 0.15]} position={[-14.25, 4, -4.425]} />
          
          {/* 6. Left wall (vertical left edge) - Full height */}
          <CurtainPanel args={[0.15, 8, 3]} position={[-15.825, 4, -6]} isHorizontal={false} />
          
          {/* 7. Back connector (vertical back, connects to horizontal) */}
          <CurtainPanel args={[3, 8, 0.15]} position={[-14.25, 4, -7.575]} />
          
          {/* 8. Bottom-left connector (horizontal left side) */}
          <CurtainPanel args={[0.15, 8, 3]} position={[-12.575, 4, -9]} isHorizontal={false} />
        </>
      )}

    </group>
  );
};

export default VenueMap;