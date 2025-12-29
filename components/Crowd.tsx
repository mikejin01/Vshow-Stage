import React, { useRef, useMemo, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CrowdMember } from '../types';

interface CrowdProps {
  density: number; // 0.0 to 1.0
  vibeIntensity: number;
  stageRadius: number; // Exclusion radius for the center
  isBoilerRoomMode: boolean;
}

const MAX_CROWD = 400;

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

const Crowd: React.FC<CrowdProps> = ({ density, vibeIntensity, stageRadius, isBoilerRoomMode }) => {
  // Refs for each body part
  const headRef = useRef<THREE.InstancedMesh>(null);
  const torsoRef = useRef<THREE.InstancedMesh>(null);
  const legsRef = useRef<THREE.InstancedMesh>(null);
  const armLRef = useRef<THREE.InstancedMesh>(null);
  const armRRef = useRef<THREE.InstancedMesh>(null);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const colorHelper = useMemo(() => new THREE.Color(), []);

  // Pre-calculate arm geometry with pivot adjustment
  const armGeometry = useMemo(() => {
    const geo = new THREE.BoxGeometry(0.11, 0.65, 0.11);
    geo.translate(0, -0.3, 0); // Move pivot to top (shoulder)
    return geo;
  }, []);

  // Calculate actual count based on density
  const count = Math.floor(density * MAX_CROWD);

  // Generate crowd data
  const crowdData = useMemo(() => {
    const temp: CrowdMember[] = [];
    
    let attempts = 0;
    while (temp.length < MAX_CROWD && attempts < MAX_CROWD * 5) {
      // Random position in the room
      const x = (Math.random() - 0.5) * 40;
      const z = (Math.random() - 0.5) * 30;
      const dist = Math.sqrt(x*x + z*z);

      // --- COLLISION / EXCLUSION LOGIC ---
      let valid = true;
      
      // 1. Stage Collision
      if (isBoilerRoomMode) {
          // Center Boiler Room
          if (dist < stageRadius) valid = false;
      } else {
          // Standard Stage Logic (Updated for position z = -9)
          // Stage is approx width=4.5, depth=3 centered at [0,0,-9]
          // Bounds: X[-2.5, 2.5], Z[-10.5, -7.5]
          if (x > -3 && x < 3 && z > -11 && z < -7) valid = false;
      }
      
      // 2. Room Bounds
      if (x < -28 || x > 28 || z < -28 || z > 28) valid = false;
      // 3. Furniture Exclusion
      if (x < -4 && z < -7) valid = false; // E
      if (x > 4 && z < -7) valid = false;  // D
      if (x > 12) valid = false;           // Right Wall
      if (z > 4 && z < 10 && Math.abs(x) < 8) valid = false; // B
      if (z > 11) valid = false;           // A
      if (x < -13) valid = false;          // Bar

      if (valid) {
        temp.push({
          position: [x, 0, z],
          height: 1 + Math.random() * 0.15, // Scaling factor for height
          offset: Math.random() * 100,
          skinColor: SKIN_TONES[Math.floor(Math.random() * SKIN_TONES.length)],
          shirtColor: SHIRT_COLORS[Math.floor(Math.random() * SHIRT_COLORS.length)],
          pantsColor: PANTS_COLORS[Math.floor(Math.random() * PANTS_COLORS.length)],
        });
      }
      attempts++;
    }
    return temp;
  }, [stageRadius, isBoilerRoomMode]); 

  // Apply colors to instances
  useLayoutEffect(() => {
    if (!headRef.current || !torsoRef.current || !legsRef.current || !armLRef.current || !armRRef.current) return;

    crowdData.forEach((member, i) => {
      // Skin
      colorHelper.set(member.skinColor);
      headRef.current!.setColorAt(i, colorHelper);
      armLRef.current!.setColorAt(i, colorHelper); // Arms are skin (short sleeves)
      armRRef.current!.setColorAt(i, colorHelper);

      // Shirt
      colorHelper.set(member.shirtColor);
      torsoRef.current!.setColorAt(i, colorHelper);

      // Pants
      colorHelper.set(member.pantsColor);
      legsRef.current!.setColorAt(i, colorHelper);
    });

    headRef.current.instanceColor!.needsUpdate = true;
    torsoRef.current.instanceColor!.needsUpdate = true;
    legsRef.current.instanceColor!.needsUpdate = true;
    armLRef.current.instanceColor!.needsUpdate = true;
    armRRef.current.instanceColor!.needsUpdate = true;
  }, [crowdData, colorHelper]);

  // ANIMATION LOOP
  useFrame(({ clock }) => {
    if (!headRef.current || !torsoRef.current) return;
    
    const time = clock.getElapsedTime();
    const jumpSpeed = 8 + (vibeIntensity * 3); 
    const isHighEnergy = vibeIntensity > 1.2;

    crowdData.forEach((member, i) => {
      // Hide excess instances
      if (i >= count) {
          dummy.scale.set(0, 0, 0);
          dummy.updateMatrix();
          headRef.current!.setMatrixAt(i, dummy.matrix);
          torsoRef.current!.setMatrixAt(i, dummy.matrix);
          legsRef.current!.setMatrixAt(i, dummy.matrix);
          armLRef.current!.setMatrixAt(i, dummy.matrix);
          armRRef.current!.setMatrixAt(i, dummy.matrix);
          return;
      }

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

      // --- 1. LEGS ---
      // Legs are static relative to body, just moving up/down with bounce
      dummy.scale.set(1, member.height, 1);
      dummy.position.set(posX, 0.45 * member.height + posY, posZ);
      dummy.rotation.set(0, baseRotY, 0);
      dummy.updateMatrix();
      legsRef.current!.setMatrixAt(i, dummy.matrix);

      // --- 2. TORSO ---
      // Sits on top of legs
      const torsoY = (0.9 * member.height) + 0.25 + posY;
      dummy.scale.set(1, 1, 1); // Torso usually standard size
      dummy.position.set(posX, torsoY, posZ);
      dummy.rotation.set(Math.sin(time * 4 + member.offset) * 0.05, baseRotY, 0); // Slight chest heave
      dummy.updateMatrix();
      torsoRef.current!.setMatrixAt(i, dummy.matrix);

      // Store torso rotation/pos for arms/head attachment
      const torsoPos = dummy.position.clone();
      const torsoRot = dummy.rotation.clone();

      // --- 3. HEAD ---
      dummy.position.set(posX, torsoY + 0.35, posZ);
      dummy.rotation.set(
          Math.sin(time * 2 + member.offset) * 0.1, // Look up/down slightly
          baseRotY + Math.sin(time * 1.5) * 0.2,    // Look around
          0
      );
      dummy.updateMatrix();
      headRef.current!.setMatrixAt(i, dummy.matrix);

      // --- 4. ARMS (Complex) ---
      // We need to calculate shoulder position based on torso rotation
      // Simple approximation: Just use relative offsets rotated by Y
      
      // Arm movement intensity
      const armEnergy = isHighEnergy ? 1.5 : 0.5;
      
      // Left Arm
      const leftArmRotZ = Math.PI / 1.1 + Math.sin(time * 3 + member.offset) * armEnergy; 
      const leftArmRotX = Math.sin(time * 2.5 + member.offset) * 0.5;
      
      // Pivot logic handled by Geometry translation (pivot at top)
      // We position the "origin" of the arm at the shoulder
      
      // Math for shoulder position (offset from center of torso)
      const shoulderWidth = 0.22;
      const sx = Math.cos(baseRotY) * shoulderWidth;
      const sz = Math.sin(baseRotY) * shoulderWidth;

      // Left Arm Update
      dummy.position.set(torsoPos.x - sx, torsoPos.y + 0.15, torsoPos.z + sz); // Left Shoulder
      dummy.rotation.set(torsoRot.x + leftArmRotX, baseRotY, leftArmRotZ);
      dummy.updateMatrix();
      armLRef.current!.setMatrixAt(i, dummy.matrix);

      // Right Arm
      const rightArmRotZ = -Math.PI / 1.1 - Math.sin(time * 3 + member.offset + 1) * armEnergy;
      const rightArmRotX = Math.sin(time * 2.5 + member.offset + 2) * 0.5;

      // Right Arm Update
      dummy.position.set(torsoPos.x + sx, torsoPos.y + 0.15, torsoPos.z - sz); // Right Shoulder
      dummy.rotation.set(torsoRot.x + rightArmRotX, baseRotY, rightArmRotZ);
      dummy.updateMatrix();
      armRRef.current!.setMatrixAt(i, dummy.matrix);
    });

    headRef.current.instanceMatrix.needsUpdate = true;
    torsoRef.current.instanceMatrix.needsUpdate = true;
    legsRef.current.instanceMatrix.needsUpdate = true;
    armLRef.current.instanceMatrix.needsUpdate = true;
    armRRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
        {/* LEGS: Box (0.28w, 0.9h, 0.18d) */}
        <instancedMesh ref={legsRef} args={[undefined, undefined, MAX_CROWD]} castShadow receiveShadow>
            <boxGeometry args={[0.26, 0.9, 0.18]} />
            <meshStandardMaterial roughness={0.8} />
        </instancedMesh>

        {/* TORSO: Box (0.45w, 0.5h, 0.22d) */}
        <instancedMesh ref={torsoRef} args={[undefined, undefined, MAX_CROWD]} castShadow receiveShadow>
            {/* Tapered torso effect by using a slightly different geometry could be cool, but box is fine for low poly */}
            <boxGeometry args={[0.42, 0.5, 0.22]} />
            <meshStandardMaterial roughness={0.6} />
        </instancedMesh>

        {/* HEAD: Sphere (0.22 dia) */}
        <instancedMesh ref={headRef} args={[undefined, undefined, MAX_CROWD]} castShadow receiveShadow>
            <sphereGeometry args={[0.13, 8, 8]} />
            <meshStandardMaterial roughness={0.4} />
        </instancedMesh>

        {/* LEFT ARM: Box (0.1w, 0.65h, 0.1d) - Pivoted at top */}
        <instancedMesh ref={armLRef} args={[armGeometry, undefined, MAX_CROWD]} castShadow receiveShadow>
            <meshStandardMaterial roughness={0.4} />
        </instancedMesh>

        {/* RIGHT ARM */}
        <instancedMesh ref={armRRef} args={[armGeometry, undefined, MAX_CROWD]} castShadow receiveShadow>
            <meshStandardMaterial roughness={0.4} />
        </instancedMesh>
    </group>
  );
};

export default Crowd;