import React, { useEffect, useRef, useState } from 'react';
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
  const laser1Ref = useRef<THREE.SpotLight>(null);
  const laser2Ref = useRef<THREE.SpotLight>(null);
  const laser3Ref = useRef<THREE.SpotLight>(null);
  const laser4Ref = useRef<THREE.SpotLight>(null);
  const ceilingSpot1Ref = useRef<THREE.SpotLight>(null);
  const ceilingSpot2Ref = useRef<THREE.SpotLight>(null);
  
  // Use a state-managed Object3D for the spotlight target
  const [target] = useState(() => new THREE.Object3D());
  const [laserTarget1] = useState(() => new THREE.Object3D());
  const [laserTarget2] = useState(() => new THREE.Object3D());
  const [laserTarget3] = useState(() => new THREE.Object3D());
  const [laserTarget4] = useState(() => new THREE.Object3D());
  const [ceilingTarget1] = useState(() => new THREE.Object3D());
  const [ceilingTarget2] = useState(() => new THREE.Object3D());
  
  // House light intensity derived from brightness toggle
  const houseIntensity = brightness * 0.6;
  const isDarkMode = brightness < 0.1;
  
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

    // Laser animations (only in dark mode)
    if (isDarkMode) {
      // Laser 1 - Sweeping horizontally
      laserTarget1.position.x = Math.sin(time * 1.2) * 15;
      laserTarget1.position.y = 0.5;
      laserTarget1.position.z = Math.cos(time * 0.8) * 10;

      // Laser 2 - Circular motion
      laserTarget2.position.x = Math.cos(time * 1.5) * 12;
      laserTarget2.position.y = 1 + Math.sin(time * 2) * 0.5;
      laserTarget2.position.z = Math.sin(time * 1.5) * 12;

      // Laser 3 - Figure-8 pattern
      laserTarget3.position.x = Math.sin(time * 0.9) * 10;
      laserTarget3.position.y = 0.8;
      laserTarget3.position.z = Math.sin(time * 1.8) * 8;

      // Laser 4 - Random sweeps
      laserTarget4.position.x = Math.sin(time * 1.1) * -12;
      laserTarget4.position.y = 1.2;
      laserTarget4.position.z = Math.cos(time * 1.3) * 10;

      // Ceiling spotlights - sweeping across the crowd
      ceilingTarget1.position.x = Math.sin(time * 0.6) * 18;
      ceilingTarget1.position.y = 0;
      ceilingTarget1.position.z = Math.cos(time * 0.6) * 15;

      ceilingTarget2.position.x = Math.cos(time * 0.8 + Math.PI) * 18;
      ceilingTarget2.position.y = 0;
      ceilingTarget2.position.z = Math.sin(time * 0.8 + Math.PI) * 15;

      // Dynamic laser intensity based on vibe
      if (laser1Ref.current) {
        laser1Ref.current.intensity = vibe.intensity * (2 + Math.sin(time * 3) * 0.5);
      }
      if (laser2Ref.current) {
        laser2Ref.current.intensity = vibe.intensity * (2 + Math.cos(time * 2.5) * 0.5);
      }
      if (laser3Ref.current) {
        laser3Ref.current.intensity = vibe.intensity * (2 + Math.sin(time * 3.2) * 0.5);
      }
      if (laser4Ref.current) {
        laser4Ref.current.intensity = vibe.intensity * (2 + Math.cos(time * 2.8) * 0.5);
      }
    }
  });

  return (
    <>
      {/* --- BASE LIGHTING (Always present but brighter) --- */}
      <ambientLight intensity={0.5 + (brightness * 0.5)} color={brightness > 0.1 ? "#ffffff" : "#404040"} />
      <hemisphereLight 
        intensity={0.5 + (brightness * 0.4)} 
        groundColor={brightness > 0.1 ? "#555555" : "#151515"} 
        color={brightness > 0.1 ? "#ffffff" : "#333333"} 
      />
      
      {/* Explicitly add targets to scene */}
      <primitive object={target} />
      <primitive object={laserTarget1} />
      <primitive object={laserTarget2} />
      <primitive object={laserTarget3} />
      <primitive object={laserTarget4} />
      <primitive object={ceilingTarget1} />
      <primitive object={ceilingTarget2} />

      {/* --- VIBE LIGHTING --- */}
      {/* Main Overhead Vibe Light */}
      <spotLight
        position={[0, 20, 0]}
        target={target}
        angle={0.6}
        penumbra={0.5}
        intensity={vibe.intensity * 1.5}
        color={vibe.primaryColor}
        castShadow
        shadow-mapSize-width={512}
        shadow-mapSize-height={512}
        shadow-bias={-0.0001}
        shadow-camera-near={1}
        shadow-camera-far={50}
      />
      
      {/* Secondary colored fill light */}
      <pointLight position={[-10, 6, -10]} intensity={vibe.intensity * 0.6} color={vibe.secondaryColor} distance={35} decay={2} />
      <pointLight position={[10, 6, 10]} intensity={vibe.intensity * 0.6} color={vibe.secondaryColor} distance={35} decay={2} />

      {/* Strobe Light */}
      <pointLight ref={strobeRef} position={[0, 10, 0]} distance={50} decay={2} color="#ffffff" />

      {/* --- LASER SHOW (When lights are OFF - Club Mode) --- */}
      {isDarkMode && (
        <group>
          {/* Laser Beam 1 - Red */}
          <spotLight
            ref={laser1Ref}
            position={[-12, 15, -8]}
            target={laserTarget1}
            angle={0.08}
            penumbra={0.1}
            intensity={vibe.intensity * 2}
            color="#ff0033"
            distance={60}
            decay={1.5}
          />
          
          {/* Laser Beam 2 - Cyan */}
          <spotLight
            ref={laser2Ref}
            position={[12, 16, -6]}
            target={laserTarget2}
            angle={0.08}
            penumbra={0.1}
            intensity={vibe.intensity * 2}
            color="#00ffff"
            distance={60}
            decay={1.5}
          />

          {/* Laser Beam 3 - Green */}
          <spotLight
            ref={laser3Ref}
            position={[-10, 14, 5]}
            target={laserTarget3}
            angle={0.08}
            penumbra={0.1}
            intensity={vibe.intensity * 2}
            color="#00ff00"
            distance={60}
            decay={1.5}
          />

          {/* Laser Beam 4 - Magenta */}
          <spotLight
            ref={laser4Ref}
            position={[10, 15, 8]}
            target={laserTarget4}
            angle={0.08}
            penumbra={0.1}
            intensity={vibe.intensity * 2}
            color="#ff00ff"
            distance={60}
            decay={1.5}
          />

          {/* Ceiling Spotlight 1 - Following primary color */}
          <spotLight
            ref={ceilingSpot1Ref}
            position={[-8, 18, 0]}
            target={ceilingTarget1}
            angle={0.4}
            penumbra={0.6}
            intensity={vibe.intensity * 3}
            color={vibe.primaryColor}
            distance={50}
            decay={2}
          />

          {/* Ceiling Spotlight 2 - Following secondary color */}
          <spotLight
            ref={ceilingSpot2Ref}
            position={[8, 18, 0]}
            target={ceilingTarget2}
            angle={0.4}
            penumbra={0.6}
            intensity={vibe.intensity * 3}
            color={vibe.secondaryColor}
            distance={50}
            decay={2}
          />

          {/* Additional atmospheric point lights from ceiling */}
          <pointLight position={[-15, 16, -10]} intensity={vibe.intensity * 1.5} color={vibe.primaryColor} distance={40} decay={2} />
          <pointLight position={[15, 16, -10]} intensity={vibe.intensity * 1.5} color={vibe.secondaryColor} distance={40} decay={2} />
          <pointLight position={[-15, 16, 10]} intensity={vibe.intensity * 1.5} color={vibe.secondaryColor} distance={40} decay={2} />
          <pointLight position={[15, 16, 10]} intensity={vibe.intensity * 1.5} color={vibe.primaryColor} distance={40} decay={2} />
        </group>
      )}

      {/* --- HOUSE LIGHTS (When brightness is ON) --- */}
      {brightness > 0.1 && (
        <group>
            {/* Center Wash */}
            <pointLight position={[0, 16, 0]} intensity={houseIntensity * 1.2} distance={50} decay={2} color="#fff8e8" />
            
            {/* Corner Fills - reduced from 4 to 2 for performance */}
            <pointLight position={[-15, 12, 0]} intensity={houseIntensity * 0.8} distance={40} decay={2} color="#fff5e6" />
            <pointLight position={[15, 12, 0]} intensity={houseIntensity * 0.8} distance={40} decay={2} color="#fff5e6" />
        </group>
      )}
    </>
  );
};

const Experience: React.FC<ExperienceProps> = ({ vibe, crowdDensity, isBoilerRoomMode, brightness }) => {
  console.log('🎬 Experience component rendering...', { crowdDensity, isBoilerRoomMode, brightness });
  
  const [glStatus, setGlStatus] = useState<'ok' | 'lost'>('ok');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  // Detach WebGL event listeners on unmount
  useEffect(() => {
    console.log('🔧 Experience component mounted');
    return () => {
      console.log('🔌 Experience component unmounting, cleaning up...');
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, []);

  const stagePosition: [number, number, number] = isBoilerRoomMode ? [0, 0, 0] : [0, 0, -9];
  const stageRotation: [number, number, number] = [0, Math.PI, 0];
  
  // Brighter background when house lights are on
  const bgColor = brightness > 0.1 ? '#151515' : vibe.fogColor;

  console.log('🎭 Stage setup:', { stagePosition, bgColor });

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {glStatus === 'lost' && (
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,0.8)',
          color: 'white',
          fontSize: '14px',
          fontFamily: 'monospace'
        }}>
          WebGL context was lost. Please reload the page or try lowering crowd density.
        </div>
      )}
      <Canvas 
        shadows 
        dpr={[0.75, 1.5]}
        gl={{
          powerPreference: 'high-performance',
          antialias: false,
          alpha: false,
          stencil: false,
          depth: true,
        }}
        performance={{ min: 0.5 }}
        frameloop="demand"
        onCreated={({ gl }) => {
          console.log('✅ WebGL Canvas created successfully!', gl);
          const canvas = gl.domElement;
          canvasRef.current = canvas;

          const handleLost = (event: Event) => {
            event.preventDefault();
            console.error('❌ WebGL context lost!');
            setGlStatus('lost');
          };

          const handleRestored = () => {
            console.log('✅ WebGL context restored');
            setGlStatus('ok');
          };

          canvas.addEventListener('webglcontextlost', handleLost, false);
          canvas.addEventListener('webglcontextrestored', handleRestored, false);

          cleanupRef.current = () => {
            canvas.removeEventListener('webglcontextlost', handleLost, false);
            canvas.removeEventListener('webglcontextrestored', handleRestored, false);
          };
        }}
      >
      {/* Optimized fog settings to reduce visual artifacts */}
      <fog attach="fog" args={[bgColor, brightness > 0.1 ? 40 : 20, brightness > 0.1 ? 80 : 60]} />
      <color attach="background" args={[bgColor]} />

      <PerspectiveCamera makeDefault position={[0, 15, 30]} fov={50} near={0.5} far={200} />
      
      <OrbitControls 
        makeDefault
        maxPolarAngle={Math.PI / 2 - 0.05}
        minDistance={5}
        maxDistance={60}
        enablePan={true}
        enableZoom={true}
        enableDamping={true}
        dampingFactor={0.05}
        rotateSpeed={0.5}
        zoomSpeed={0.8}
        target={[0, 0, 0]} 
      />

      <Lights vibe={vibe} targetPosition={stagePosition} brightness={brightness} />

      <group>
        <VenueMap occupancy={crowdDensity} />
        
        {/* BOILER ROOM MODE: Permanent Black Stage between E1 and D10 */}
        {isBoilerRoomMode && (
          <group position={[0, 0, -9]}>
            {/* Main Stage Platform */}
            <Box args={[6, 0.6, 3.5]} position={[0, 0.3, 0]} castShadow receiveShadow>
              <meshStandardMaterial 
                color="#0a0a0a" 
                roughness={0.5}
                metalness={0.4}
              />
            </Box>
            {/* Stage Front Edge Trim */}
            <Box args={[6, 0.08, 0.1]} position={[0, 0.64, 1.8]}>
              <meshStandardMaterial 
                color="#000000" 
                roughness={0.3}
                metalness={0.8}
              />
            </Box>
            {/* Stage Steps - Left */}
            <Box args={[1.2, 0.15, 0.6]} position={[-2.5, 0.075, 2]} castShadow receiveShadow>
              <meshStandardMaterial color="#0d0d0d" roughness={0.7} />
            </Box>
            <Box args={[1.2, 0.3, 0.6]} position={[-2.5, 0.15, 2.6]} castShadow receiveShadow>
              <meshStandardMaterial color="#0d0d0d" roughness={0.7} />
            </Box>
            {/* Stage Steps - Right */}
            <Box args={[1.2, 0.15, 0.6]} position={[2.5, 0.075, 2]} castShadow receiveShadow>
              <meshStandardMaterial color="#0d0d0d" roughness={0.7} />
            </Box>
            <Box args={[1.2, 0.3, 0.6]} position={[2.5, 0.15, 2.6]} castShadow receiveShadow>
              <meshStandardMaterial color="#0d0d0d" roughness={0.7} />
            </Box>
          </group>
        )}
        
        {/* DYNAMIC STAGE PLACEMENT (Standard Mode or Center Boiler Room) */}
        <group position={stagePosition} rotation={stageRotation}>
             {/* The Stage Platform - Same size as boiler room stage */}
             <Box args={[6, 0.6, 3.5]} position={[0, 0.3, 0]} castShadow receiveShadow>
                <meshStandardMaterial 
                  color="#1a1a1a" 
                  roughness={0.7}
                  metalness={0.3}
                />
             </Box>
             {/* Stage Front Edge Trim */}
             <Box args={[6, 0.08, 0.1]} position={[0, 0.64, 1.8]} castShadow receiveShadow>
                 <meshStandardMaterial 
                   color="#0d0d0d"
                   roughness={0.3}
                   metalness={0.8}
                 />
             </Box>
             {/* Stage Steps - Left */}
             <Box args={[1.2, 0.15, 0.6]} position={[-2.5, 0.075, 2]} castShadow receiveShadow>
               <meshStandardMaterial color="#0d0d0d" roughness={0.7} />
             </Box>
             <Box args={[1.2, 0.3, 0.6]} position={[-2.5, 0.15, 2.6]} castShadow receiveShadow>
               <meshStandardMaterial color="#0d0d0d" roughness={0.7} />
             </Box>
             {/* Stage Steps - Right */}
             <Box args={[1.2, 0.15, 0.6]} position={[2.5, 0.075, 2]} castShadow receiveShadow>
               <meshStandardMaterial color="#0d0d0d" roughness={0.7} />
             </Box>
             <Box args={[1.2, 0.3, 0.6]} position={[2.5, 0.15, 2.6]} castShadow receiveShadow>
               <meshStandardMaterial color="#0d0d0d" roughness={0.7} />
             </Box>
             
             <group position={[0, 0.6, 0]}>
                <DJBooth />
             </group>
        </group>

        <Crowd 
          density={crowdDensity} 
          vibeIntensity={vibe.intensity} 
          stageRadius={3.5} 
          isBoilerRoomMode={isBoilerRoomMode}
        />

        <ContactShadows 
          resolution={256} 
          scale={40} 
          blur={1} 
          opacity={0.4} 
          far={8} 
          position={[0, 0.01, 0]}
          color="#000000" 
        />
      </group>
      
      <Environment preset="warehouse" background={false} />
      </Canvas>
    </div>
  );
};

export default Experience;