import React, { useRef, useMemo, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CrowdMember } from '../types';

interface CrowdProps {
  density: number; // 0.0 to 1.0
  vibeIntensity: number;
  stageRadius: number; // Exclusion radius for the center
  isBoilerRoomMode: boolean;
  closedSections: string[];
}

const MAX_CROWD = 500;

// --- PALETTES ---
const SKIN_TONES = [
  '#ffdbac', '#f1c27d', '#e0ac69', '#8d5524', '#c68642', '#573719'
];
const SHIRT_COLORS = [
  '#eeeeee', '#111111', '#cc3333', '#33cc33', '#3333cc', 
  '#ffff33', '#00ffff', '#ff00ff', '#ff6600', '#9933ff'
];
const PANTS_COLORS = [
  '#111111', // Black
  '#2f3e46', // Dark Grey
  '#1a2a40', // Navy / Denim
  '#3e2723', // Brown
  '#5d4037', // Khaki
];
const HAIR_COLORS = [
  '#1a1a1a', // Black
  '#2c1810', // Dark Brown
  '#5c3a21', // Brown
  '#8b5a3c', // Light Brown
  '#d4a574', // Blonde
  '#b55239', // Red
  '#808080', // Gray
];

const Crowd: React.FC<CrowdProps> = ({ density, vibeIntensity, stageRadius, isBoilerRoomMode, closedSections }) => {
  // Refs for each body part
  const headRef = useRef<THREE.InstancedMesh>(null);
  const torsoRef = useRef<THREE.InstancedMesh>(null);
  const legLRef = useRef<THREE.InstancedMesh>(null);
  const legRRef = useRef<THREE.InstancedMesh>(null);
  const armLRef = useRef<THREE.InstancedMesh>(null);
  const armRRef = useRef<THREE.InstancedMesh>(null);
  const hairRef = useRef<THREE.InstancedMesh>(null);
  const neckRef = useRef<THREE.InstancedMesh>(null);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const colorHelper = useMemo(() => new THREE.Color(), []);

  // Calculate actual count based on density
  const count = Math.floor(density * MAX_CROWD);

  // Generate crowd data
  const crowdData = useMemo(() => {
    const temp: CrowdMember[] = [];
    
    // REDESIGNED DISTRIBUTION:
    // Standard Mode: 15% of customers are on dance floor
    // Boiler Room: 40-60% of customers are on dance floor (using 50% as average)
    const danceFloorPercentage = isBoilerRoomMode ? 0.50 : 0.15;
    const danceFloorCount = Math.floor(count * danceFloorPercentage);
    const venueCount = count - danceFloorCount;
    
    // Adjust radius based on mode
    // Standard: Larger spread around main stage
    // Boiler Room: Very tight around DJ booth for intimate feel
    const danceFloorRadius = isBoilerRoomMode ? 5.0 : 7.0;
    
    // Generate DANCE FLOOR crowd (near DJ/stage)
    let attempts = 0;
    while (temp.length < danceFloorCount && attempts < danceFloorCount * 10) {
      const angle = Math.random() * Math.PI * 2;
      
      // Distribution pattern differs by mode:
      // Boiler Room: Very concentrated near center (power 1.2 = tighter)
      // Standard: More spread out (power 0.5 = wider distribution)
      const radiusPower = isBoilerRoomMode ? 1.2 : 0.5;
      const radiusFactor = Math.pow(Math.random(), radiusPower);
      const radius = radiusFactor * danceFloorRadius;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      let valid = true;
      
      // Stage exclusion for dance floor area
      if (isBoilerRoomMode) {
          // Center Boiler Room stage - very close allowed for intimate feel
          const dist = Math.sqrt(x*x + z*z);
          if (dist < stageRadius + 0.2) valid = false; // Only 0.2m buffer
          
          // Permanent stage at LED screen - larger exclusion
          // Stage dimensions: 9m width, 5m depth, centered at [0, 0, -9]
          if (x > -5 && x < 5 && z > -12 && z < -6) valid = false;
      } else {
          // Standard Mode Stage at LED screen - larger exclusion
          if (x > -5 && x < 5 && z > -12 && z < -6) valid = false;
      }
      
      // Don't go behind the LED screen
      if (z < -12) valid = false;

      if (valid) {
        temp.push({
          position: [x, 0, z],
          height: 1 + Math.random() * 0.15,
          offset: Math.random() * 100,
          skinColor: SKIN_TONES[Math.floor(Math.random() * SKIN_TONES.length)],
          shirtColor: SHIRT_COLORS[Math.floor(Math.random() * SHIRT_COLORS.length)],
          pantsColor: PANTS_COLORS[Math.floor(Math.random() * PANTS_COLORS.length)],
          hairColor: HAIR_COLORS[Math.floor(Math.random() * HAIR_COLORS.length)],
          hairStyle: Math.floor(Math.random() * 4),
        });
      }
      attempts++;
    }
    
    // Generate VENUE crowd (tables, bar, periphery)
    attempts = 0;
    while (temp.length < count && attempts < venueCount * 10) {
      // Random positioning throughout entire venue
      const x = (Math.random() - 0.5) * 40; // -20 to 20
      const z = (Math.random() - 0.5) * 32; // -16 to 16
      const dist = Math.sqrt(x*x + z*z);

      let valid = true;
      
      // Skip dance floor area (already filled) - adjust based on mode
      // Standard: Larger exclusion around stage (7.5m) since fewer on dance floor
      // Boiler Room: Smaller exclusion (5.5m) to pack them tighter
      const danceFloorExclusionRadius = isBoilerRoomMode ? 5.5 : 7.5;
      if (dist < danceFloorExclusionRadius) valid = false;
      
      // Stage Collision - LARGER EXCLUSION ZONES
      if (isBoilerRoomMode) {
          // Center Boiler Room stage - smaller buffer
          if (dist < stageRadius + 0.8) valid = false;
          
          // Permanent stage at LED screen - LARGER buffer
          if (x > -5.5 && x < 5.5 && z > -13 && z < -5.5) valid = false;
          
          // No customers behind the stage or LED screen
          if (z < -13) valid = false;
      } else {
          // Standard Mode Stage - LARGER buffer
          if (x > -5.5 && x < 5.5 && z > -13 && z < -5.5) valid = false;
          
          // No customers behind the stage or LED screen
          if (z < -13) valid = false;
      }
      
      // Room Bounds
      if (x < -18 || x > 18 || z < -15 || z > 15) valid = false;
      
      // Furniture Exclusion (booths, bar, etc.)
      if (x < -6 && z < -5) valid = false;  // E section
      if (x > 6 && z < -5) valid = false;   // D section
      if (x > 13) valid = false;            // Right Wall (D side)
      if (z > 4.5 && z < 10.5 && Math.abs(x) < 6) valid = false; // B section (rows 14-17)
      if (z > 10.5) valid = false;            // A section
      if (x < -12) valid = false;           // Bar area
      
      // Closed Sections Exclusion - Match exact platform dimensions
      if (closedSections.includes('A')) {
        // Section A Platform: [0, 0, 11.25], size [15, 0.6, 3.5]
        // X: -7.5 to 7.5, Z: 9.5 to 13
        if (z > 9 && z < 13.5 && Math.abs(x) < 8) valid = false;
      }
      if (closedSections.includes('B')) {
        // Section B Platform: [0, 0, 7.5], size [12, 0.3, 6]
        // X: -6 to 6, Z: 4.5 to 10.5
        if (z > 4 && z < 11 && Math.abs(x) < 6.5) valid = false;
      }
      if (closedSections.includes('D')) {
        // Section D Platform (L-shaped):
        // Horizontal: [8.5, 0, -9], size [8, 0.3, 3] → X: 4.5 to 12.5, Z: -10.5 to -7.5
        // Vertical: [13.5, 0, -1.5], size [4, 0.3, 11.5] → X: 11.5 to 15.5, Z: -7.25 to 4.25
        const inHorizontal = x > 4.5 && x < 12.5 && z > -10.5 && z < -7.5;
        const inVertical = x > 11.5 && x < 15.5 && z > -7.25 && z < 4.25;
        if (inHorizontal || inVertical) valid = false;
      }
      if (closedSections.includes('E')) {
        // Section E Platform (L-shaped):
        // Horizontal: [-8.5, 0, -9], size [8, 0.3, 3] → X: -12.5 to -4.5, Z: -10.5 to -7.5
        // Vertical: [-14.25, 0, -6], size [3, 0.3, 3] → X: -15.75 to -12.75, Z: -7.5 to -4.5
        const inHorizontal = x < -4.5 && x > -12.5 && z > -10.5 && z < -7.5;
        const inVertical = x < -12.75 && x > -15.75 && z > -7.5 && z < -4.5;
        if (inHorizontal || inVertical) valid = false;
      }

      if (valid) {
        temp.push({
          position: [x, 0, z],
          height: 1 + Math.random() * 0.15,
          offset: Math.random() * 100,
          skinColor: SKIN_TONES[Math.floor(Math.random() * SKIN_TONES.length)],
          shirtColor: SHIRT_COLORS[Math.floor(Math.random() * SHIRT_COLORS.length)],
          pantsColor: PANTS_COLORS[Math.floor(Math.random() * PANTS_COLORS.length)],
          hairColor: HAIR_COLORS[Math.floor(Math.random() * HAIR_COLORS.length)],
          hairStyle: Math.floor(Math.random() * 4),
        });
      }
      attempts++;
    }
    
    return temp;
  }, [count, stageRadius, isBoilerRoomMode, closedSections]); 

  // Apply colors to instances
  useLayoutEffect(() => {
    if (!headRef.current || !torsoRef.current || !legLRef.current || !legRRef.current || 
        !armLRef.current || !armRRef.current || !hairRef.current || !neckRef.current) return;

    crowdData.forEach((member, i) => {
      // Skin
      colorHelper.set(member.skinColor);
      headRef.current!.setColorAt(i, colorHelper);
      neckRef.current!.setColorAt(i, colorHelper);
      armLRef.current!.setColorAt(i, colorHelper);
      armRRef.current!.setColorAt(i, colorHelper);

      // Hair
      colorHelper.set(member.hairColor);
      hairRef.current!.setColorAt(i, colorHelper);

      // Shirt
      colorHelper.set(member.shirtColor);
      torsoRef.current!.setColorAt(i, colorHelper);

      // Pants
      colorHelper.set(member.pantsColor);
      legLRef.current!.setColorAt(i, colorHelper);
      legRRef.current!.setColorAt(i, colorHelper);
    });

    if (headRef.current && headRef.current.instanceColor) headRef.current.instanceColor.needsUpdate = true;
    if (torsoRef.current && torsoRef.current.instanceColor) torsoRef.current.instanceColor.needsUpdate = true;
    if (legLRef.current && legLRef.current.instanceColor) legLRef.current.instanceColor.needsUpdate = true;
    if (legRRef.current && legRRef.current.instanceColor) legRRef.current.instanceColor.needsUpdate = true;
    if (armLRef.current && armLRef.current.instanceColor) armLRef.current.instanceColor.needsUpdate = true;
    if (armRRef.current && armRRef.current.instanceColor) armRRef.current.instanceColor.needsUpdate = true;
    if (hairRef.current && hairRef.current.instanceColor) hairRef.current.instanceColor.needsUpdate = true;
    if (neckRef.current && neckRef.current.instanceColor) neckRef.current.instanceColor.needsUpdate = true;
  }, [crowdData, colorHelper]);

  // ANIMATION LOOP
  useFrame(({ clock }) => {
    if (!headRef.current || !torsoRef.current || !legLRef.current || !legRRef.current || 
        !armLRef.current || !armRRef.current || !hairRef.current || !neckRef.current) return;
    
    const time = clock.getElapsedTime();
    const jumpSpeed = 8 + (vibeIntensity * 3); 
    const isHighEnergy = vibeIntensity > 1.2;

    for (let i = 0; i < MAX_CROWD; i++) {
      // Hide instances if they are beyond the current count or if data hasn't been generated for them
      if (i >= count || i >= crowdData.length) {
          dummy.scale.set(0, 0, 0);
          dummy.updateMatrix();
          headRef.current!.setMatrixAt(i, dummy.matrix);
          torsoRef.current!.setMatrixAt(i, dummy.matrix);
          legLRef.current!.setMatrixAt(i, dummy.matrix);
          legRRef.current!.setMatrixAt(i, dummy.matrix);
          armLRef.current!.setMatrixAt(i, dummy.matrix);
          armRRef.current!.setMatrixAt(i, dummy.matrix);
          hairRef.current!.setMatrixAt(i, dummy.matrix);
          neckRef.current!.setMatrixAt(i, dummy.matrix);
          continue;
      }

      const member = crowdData[i];

      // --- DANCE MATH ---
      // Base bounce
      const bounce = Math.abs(Math.sin(time * jumpSpeed + member.offset));
      const yOffset = isHighEnergy ? bounce * 0.15 : bounce * 0.05;
      
      // Base Rotation (facing random + sway)
      const baseRotY = member.offset + (Math.sin(time * 2 + member.offset) * 0.15);
      
      // Master Position
      const posX = member.position[0];
      const posZ = member.position[2];
      const posY = yOffset; // Ground level displacement

      // Hip width for leg separation
      const hipWidth = 0.08;
      const hipX = Math.cos(baseRotY) * hipWidth;
      const hipZ = Math.sin(baseRotY) * hipWidth;

      // --- 1. LEFT LEG ---
      // Capsule height = 0.75, so center to bottom = 0.375
      const legLRotX = Math.sin(time * 6 + member.offset) * 0.3;
      const legLength = 0.75 + (0.065 * 2); // capsule length + cap radii
      dummy.scale.set(1, member.height, 1);
      dummy.position.set(posX - hipX, (legLength / 2 * member.height) + posY, posZ + hipZ);
      dummy.rotation.set(legLRotX, baseRotY, 0);
      dummy.updateMatrix();
      legLRef.current!.setMatrixAt(i, dummy.matrix);

      // --- 2. RIGHT LEG ---
      const legRRotX = Math.sin(time * 6 + member.offset + Math.PI) * 0.3;
      dummy.position.set(posX + hipX, (legLength / 2 * member.height) + posY, posZ - hipZ);
      dummy.rotation.set(legRRotX, baseRotY, 0);
      dummy.updateMatrix();
      legRRef.current!.setMatrixAt(i, dummy.matrix);

      // --- 3. TORSO ---
      // Sits on top of legs
      const torsoHeight = 0.35 + (0.18 * 2); // capsule length + cap radii
      const torsoY = (legLength * member.height) + (torsoHeight / 2) + posY;
      dummy.scale.set(1, 1, 1);
      dummy.position.set(posX, torsoY, posZ);
      dummy.rotation.set(Math.sin(time * 4 + member.offset) * 0.05, baseRotY, 0);
      dummy.updateMatrix();
      torsoRef.current!.setMatrixAt(i, dummy.matrix);

      // Store torso rotation/pos for arms/head attachment
      const torsoPos = dummy.position.clone();
      const torsoRot = dummy.rotation.clone();

      // --- 4. NECK ---
      const neckHeight = 0.15;
      const neckY = torsoY + (torsoHeight / 2) + (neckHeight / 2);
      dummy.scale.set(0.8, 1, 0.8);
      dummy.position.set(posX, neckY, posZ);
      dummy.rotation.set(0, baseRotY, 0);
      dummy.updateMatrix();
      neckRef.current!.setMatrixAt(i, dummy.matrix);

      // --- 5. HEAD ---
      const headRadius = 0.13;
      const headY = neckY + (neckHeight / 2) + headRadius;
      dummy.scale.set(1, 1, 1);
      dummy.position.set(posX, headY, posZ);
      dummy.rotation.set(
          Math.sin(time * 2 + member.offset) * 0.1, // Look up/down slightly
          baseRotY + Math.sin(time * 1.5) * 0.2,    // Look around
          0
      );
      dummy.updateMatrix();
      headRef.current!.setMatrixAt(i, dummy.matrix);

      // --- 6. HAIR ---
      // Position hair based on hairstyle
      let hairScaleX = 1.1;
      let hairScaleY = 1.0;
      let hairScaleZ = 1.1;
      let hairOffsetY = 0.08;

      switch(member.hairStyle) {
        case 0: // Short hair
          hairScaleX = 1.05;
          hairScaleY = 0.6;
          hairScaleZ = 1.05;
          hairOffsetY = 0.06;
          break;
        case 1: // Medium/curly
          hairScaleX = 1.2;
          hairScaleY = 0.9;
          hairScaleZ = 1.2;
          hairOffsetY = 0.08;
          break;
        case 2: // Long hair
          hairScaleX = 1.1;
          hairScaleY = 1.3;
          hairScaleZ = 1.1;
          hairOffsetY = 0.05;
          break;
        case 3: // Bald/buzz
          hairScaleX = 0.01;
          hairScaleY = 0.01;
          hairScaleZ = 0.01;
          break;
      }

      dummy.scale.set(hairScaleX, hairScaleY, hairScaleZ);
      dummy.position.set(posX, headY + hairOffsetY, posZ);
      dummy.rotation.set(
          Math.sin(time * 2 + member.offset) * 0.1,
          baseRotY + Math.sin(time * 1.5) * 0.2,
          0
      );
      dummy.updateMatrix();
      hairRef.current!.setMatrixAt(i, dummy.matrix);

      // --- 7. ARMS ---
      const shoulderWidth = 0.22;
      const sx = Math.cos(baseRotY) * shoulderWidth;
      const sz = Math.sin(baseRotY) * shoulderWidth;
      const shoulderY = torsoY + (torsoHeight / 2) - 0.05; // Near top of torso

      // Arm movement intensity
      const armEnergy = isHighEnergy ? 1.5 : 0.5;
      
      // Left Arm
      const leftArmRotZ = Math.PI / 1.1 + Math.sin(time * 3 + member.offset) * armEnergy; 
      const leftArmRotX = Math.sin(time * 2.5 + member.offset) * 0.5;
      
      dummy.scale.set(1, 1, 1);
      dummy.position.set(posX - sx, shoulderY, posZ + sz);
      dummy.rotation.set(torsoRot.x + leftArmRotX, baseRotY, leftArmRotZ);
      dummy.updateMatrix();
      armLRef.current!.setMatrixAt(i, dummy.matrix);

      // Right Arm
      const rightArmRotZ = -Math.PI / 1.1 - Math.sin(time * 3 + member.offset + 1) * armEnergy;
      const rightArmRotX = Math.sin(time * 2.5 + member.offset + 2) * 0.5;

      dummy.position.set(posX + sx, shoulderY, posZ - sz);
      dummy.rotation.set(torsoRot.x + rightArmRotX, baseRotY, rightArmRotZ);
      dummy.updateMatrix();
      armRRef.current!.setMatrixAt(i, dummy.matrix);
    }

    headRef.current.instanceMatrix.needsUpdate = true;
    torsoRef.current.instanceMatrix.needsUpdate = true;
    legLRef.current.instanceMatrix.needsUpdate = true;
    legRRef.current.instanceMatrix.needsUpdate = true;
    armLRef.current.instanceMatrix.needsUpdate = true;
    armRRef.current.instanceMatrix.needsUpdate = true;
    hairRef.current.instanceMatrix.needsUpdate = true;
    neckRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
        {/* LEFT LEG: Capsule for rounded, realistic legs */}
        <instancedMesh ref={legLRef} args={[undefined, undefined, MAX_CROWD]} castShadow receiveShadow>
            <capsuleGeometry args={[0.065, 0.75, 4, 8]} />
            <meshStandardMaterial roughness={0.8} />
        </instancedMesh>

        {/* RIGHT LEG */}
        <instancedMesh ref={legRRef} args={[undefined, undefined, MAX_CROWD]} castShadow receiveShadow>
            <capsuleGeometry args={[0.065, 0.75, 4, 8]} />
            <meshStandardMaterial roughness={0.8} />
        </instancedMesh>

        {/* TORSO: Rounded box for more realistic chest */}
        <instancedMesh ref={torsoRef} args={[undefined, undefined, MAX_CROWD]} castShadow receiveShadow>
            <capsuleGeometry args={[0.18, 0.35, 4, 8]} />
            <meshStandardMaterial roughness={0.7} />
        </instancedMesh>

        {/* NECK: Small cylinder connecting head to torso */}
        <instancedMesh ref={neckRef} args={[undefined, undefined, MAX_CROWD]} castShadow receiveShadow>
            <cylinderGeometry args={[0.06, 0.07, 0.15, 8]} />
            <meshStandardMaterial roughness={0.5} />
        </instancedMesh>

        {/* HEAD: Sphere with better resolution for realistic head */}
        <instancedMesh ref={headRef} args={[undefined, undefined, MAX_CROWD]} castShadow receiveShadow>
            <sphereGeometry args={[0.13, 12, 12]} />
            <meshStandardMaterial roughness={0.5} />
        </instancedMesh>

        {/* HAIR: Slightly larger sphere positioned on top of head */}
        <instancedMesh ref={hairRef} args={[undefined, undefined, MAX_CROWD]} castShadow>
            <sphereGeometry args={[0.14, 10, 10]} />
            <meshStandardMaterial roughness={0.9} />
        </instancedMesh>

        {/* LEFT ARM: Capsule for rounded, realistic arms */}
        <instancedMesh ref={armLRef} args={[undefined, undefined, MAX_CROWD]} castShadow receiveShadow>
            <capsuleGeometry args={[0.055, 0.55, 4, 8]} />
            <meshStandardMaterial roughness={0.5} />
        </instancedMesh>

        {/* RIGHT ARM */}
        <instancedMesh ref={armRRef} args={[undefined, undefined, MAX_CROWD]} castShadow receiveShadow>
            <capsuleGeometry args={[0.055, 0.55, 4, 8]} />
            <meshStandardMaterial roughness={0.5} />
        </instancedMesh>
    </group>
  );
};

export default Crowd;