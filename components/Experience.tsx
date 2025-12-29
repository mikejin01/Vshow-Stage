import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, ContactShadows, Environment, Box } from '@react-three/drei';
import * as THREE from 'three';
import DJBooth from './DJBooth';
import VenueMap from './VenueMap';
import Crowd from './Crowd';
import { VibeConfig } from '../types';

interface ExperienceProps {
  vibe: VibeConfig;
  crowdDensity: number;
  isBoilerRoomMode: boolean;
  brightness: number;
}

const Lights: React.FC<{ vibe: VibeConfig; targetPosition: [number, number, number]; brightness: number }> = ({ vibe, targetPosition, brightness }) => {
  const strobeRef = useRef<THREE.PointLight>(null);
  
  // Use a state-managed Object3D for the spotlight target
  const [target] = useState(() => new THREE.Object3D());
  
  // House light intensity derived from brightness toggle
  const houseIntensity = brightness * 0.6;
  
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    
    // Update target position directly
    target.position.x = targetPosition[0] + Math.sin(time * 0.5) * 1;
    target.position.y = targetPosition[1];
    target.position.z = targetPosition[2] + Math.cos(time * 0.5) * 1;
    
    // Strobe logic
    if (strobeRef.current) {
        strobeRef.current.position.set(targetPosition[0], 10, targetPosition[2]);

        if (vibe.strobeSpeed > 0) {
            const flash = Math.sin(time * vibe.strobeSpeed * 5) > 0 ? vibe.intensity * 2 : 0;
            strobeRef.current.intensity = flash;
        } else {
            strobeRef.current.intensity = vibe.intensity;
        }
    }
  });

  return (
    <>
      {/* --- BASE LIGHTING (Always present but brighter) --- */}
      <ambientLight intensity={0.4 + (brightness * 0.6)} color={brightness > 0.1 ? "#ffffff" : "#404040"} />
      <hemisphereLight 
        intensity={0.4 + (brightness * 0.5)} 
        groundColor={brightness > 0.1 ? "#444444" : "#111111"} 
        color={brightness > 0.1 ? "#ffffff" : "#333333"} 
      />
      
      {/* Explicitly add target to scene so Spotlight can track it */}
      <primitive object={target} />

      {/* --- VIBE LIGHTING --- */}
      {/* Main Overhead Vibe Light */}
      <spotLight
        position={[0, 20, 0]}
        target={target}
        angle={0.6}
        penumbra={0.5}
        intensity={vibe.intensity * 2.0}
        color={vibe.primaryColor}
        castShadow
        shadow-bias={-0.0001}
      />
      
      {/* Secondary colored fill light */}
      <pointLight position={[-10, 5, -10]} intensity={vibe.intensity * 0.8} color={vibe.secondaryColor} distance={30} />
      <pointLight position={[10, 5, 10]} intensity={vibe.intensity * 0.8} color={vibe.secondaryColor} distance={30} />

      {/* Strobe Light */}
      <pointLight ref={strobeRef} position={[0, 10, 0]} distance={60} decay={1.5} color="#ffffff" />

      {/* --- HOUSE LIGHTS (When brightness is ON) --- */}
      {brightness > 0.1 && (
        <group>
            {/* Center Wash */}
            <pointLight position={[0, 15, 0]} intensity={houseIntensity} distance={50} decay={2} color="#fff5e6" />
            
            {/* Corner Fills to remove dark spots */}
            <pointLight position={[-20, 10, -20]} intensity={houseIntensity * 0.8} distance={40} color="#fff5e6" />
            <pointLight position={[20, 10, -20]} intensity={houseIntensity * 0.8} distance={40} color="#fff5e6" />
            <pointLight position={[-20, 10, 20]} intensity={houseIntensity * 0.8} distance={40} color="#fff5e6" />
            <pointLight position={[20, 10, 20]} intensity={houseIntensity * 0.8} distance={40} color="#fff5e6" />
            
            {/* Bar Area Light */}
            <pointLight position={[-16, 8, 0]} intensity={houseIntensity} distance={20} color="#ffccaa" />
        </group>
      )}
    </>
  );
};

const Experience: React.FC<ExperienceProps> = ({ vibe, crowdDensity, isBoilerRoomMode, brightness }) => {
  
  const stagePosition: [number, number, number] = isBoilerRoomMode ? [0, 0, 0] : [0, 0, -9];
  const stageRotation: [number, number, number] = [0, Math.PI, 0];
  
  // Brighter background when house lights are on
  const bgColor = brightness > 0.1 ? '#151515' : vibe.fogColor;

  return (
    <Canvas shadows dpr={[1, 2]}>
      {/* Clearer Fog settings: Push back start/end when bright */}
      <fog attach="fog" args={[bgColor, brightness > 0.1 ? 25 : 10, brightness > 0.1 ? 90 : 60]} />
      <color attach="background" args={[bgColor]} />

      <PerspectiveCamera makeDefault position={[0, 15, 30]} fov={50} />
      
      <OrbitControls 
        maxPolarAngle={Math.PI / 2 - 0.05}
        minDistance={2}
        maxDistance={70}
        enablePan={true}
        enableZoom={true}
        target={[0, 0, 0]} 
      />

      <Lights vibe={vibe} targetPosition={stagePosition} brightness={brightness} />

      <group>
        <VenueMap />
        
        {/* DYNAMIC STAGE PLACEMENT */}
        <group position={stagePosition} rotation={stageRotation}>
             {/* The Small Stage Platform */}
             <Box args={[4.5, 0.5, 3]} position={[0, 0.25, 0]} castShadow receiveShadow>
                <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
             </Box>
             {/* Stage Step */}
             <Box args={[1.5, 0.25, 0.5]} position={[0, 0.125, 1.75]} castShadow receiveShadow>
                 <meshStandardMaterial color="#111" />
             </Box>
             
             <group position={[0, 0.5, 0]}>
                <DJBooth />
             </group>
        </group>

        <Crowd 
          density={crowdDensity} 
          vibeIntensity={vibe.intensity} 
          stageRadius={3.5} 
          isBoilerRoomMode={isBoilerRoomMode}
        />

        <ContactShadows resolution={1024} scale={60} blur={2} opacity={0.4} far={2} color="#000000" />
      </group>
      
      <Environment preset={brightness > 0.1 ? "city" : "night"} background={false} blur={1} />
    </Canvas>
  );
};

export default Experience;