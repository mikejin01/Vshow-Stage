import React, { useEffect, useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, ContactShadows, Environment, Box } from '@react-three/drei';
import * as THREE from 'three';
import DJBooth from './DJBooth';
import VenueMap from './VenueMap';
import Crowd from './Crowd';
import MainStage from './MainStage';
import BoilerRoomPlatform from './BoilerRoomPlatform';
import { VibeConfig } from '../types';

interface ExperienceProps {
  vibe: VibeConfig;
  crowdDensity: number;
  isBoilerRoomMode: boolean;
  brightness: number;
  designMode: boolean;
  closedSections: string[];
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
  const [djTarget] = useState(() => new THREE.Object3D());
  const [laserTarget1] = useState(() => new THREE.Object3D());
  const [laserTarget2] = useState(() => new THREE.Object3D());
  const [laserTarget3] = useState(() => new THREE.Object3D());
  const [laserTarget4] = useState(() => new THREE.Object3D());
  const [ceilingTarget1] = useState(() => new THREE.Object3D());
  const [ceilingTarget2] = useState(() => new THREE.Object3D());
  
  // House light intensity derived from brightness toggle
  const houseIntensity = brightness * 1.5; // Increased from 0.6
  // Keep lasers active in both modes, boosted for visibility
  const laserPower = brightness > 0.1 ? 1.5 : 2.5;
  
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    
    // Update target position directly
    target.position.x = targetPosition[0] + Math.sin(time * 0.5) * 1;
    target.position.y = targetPosition[1];
    target.position.z = targetPosition[2] + Math.cos(time * 0.5) * 1;

    // DJ Spotlight target - fixed on the booth/DJ
    djTarget.position.set(targetPosition[0], targetPosition[1] + 1.2, targetPosition[2]);
    
    // Laser animations
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
      laser1Ref.current.intensity = vibe.intensity * 10 * laserPower;
    }
    if (laser2Ref.current) {
      laser2Ref.current.intensity = vibe.intensity * 10 * laserPower;
    }
    if (laser3Ref.current) {
      laser3Ref.current.intensity = vibe.intensity * 10 * laserPower;
    }
    if (laser4Ref.current) {
      laser4Ref.current.intensity = vibe.intensity * 10 * laserPower;
    }

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
      <ambientLight intensity={1.2 + (brightness * 0.8)} color={brightness > 0.1 ? "#ffffff" : "#404040"} />
      <hemisphereLight 
        intensity={1.0 + (brightness * 0.6)} 
        groundColor={brightness > 0.1 ? "#888888" : "#151515"} 
        color={brightness > 0.1 ? "#ffffff" : "#333333"} 
      />
      
      {/* Explicitly add targets to scene */}
      <primitive object={target} />
      <primitive object={djTarget} />
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
      
      {/* Dedicated DJ Spotlight - White/Warm Light */}
      <spotLight
        position={[targetPosition[0], 15, targetPosition[2] + 2]}
        target={djTarget}
        angle={0.25}
        penumbra={0.8}
        intensity={15}
        color="#fff4e0"
        castShadow
        shadow-mapSize-width={512}
        shadow-mapSize-height={512}
      />
      
      {/* Secondary colored fill light */}
      <pointLight position={[-10, 6, -10]} intensity={vibe.intensity * 0.6} color={vibe.secondaryColor} distance={35} decay={2} />
      <pointLight position={[10, 6, 10]} intensity={vibe.intensity * 0.6} color={vibe.secondaryColor} distance={35} decay={2} />

      {/* Strobe Light */}
      <pointLight ref={strobeRef} position={[0, 10, 0]} distance={50} decay={2} color="#ffffff" />

      {/* --- LASER SHOW & MOVING SPOTLIGHTS --- */}
      <group>
        {/* Laser Beam 1 - Red */}
        <spotLight
          ref={laser1Ref}
          position={[-12, 15, -8]}
          target={laserTarget1}
          angle={0.05}
          penumbra={0.1}
          intensity={vibe.intensity * 20 * laserPower}
          color="#ff0033"
          distance={60}
          decay={1.5}
        />
        
        {/* Laser Beam 2 - Cyan */}
        <spotLight
          ref={laser2Ref}
          position={[12, 16, -6]}
          target={laserTarget2}
          angle={0.05}
          penumbra={0.1}
          intensity={vibe.intensity * 20 * laserPower}
          color="#00ffff"
          distance={60}
          decay={1.5}
        />

        {/* Laser Beam 3 - Green */}
        <spotLight
          ref={laser3Ref}
          position={[-10, 14, 5]}
          target={laserTarget3}
          angle={0.05}
          penumbra={0.1}
          intensity={vibe.intensity * 20 * laserPower}
          color="#00ff00"
          distance={60}
          decay={1.5}
        />

        {/* Laser Beam 4 - Magenta */}
        <spotLight
          ref={laser4Ref}
          position={[10, 15, 8]}
          target={laserTarget4}
          angle={0.05}
          penumbra={0.1}
          intensity={vibe.intensity * 20 * laserPower}
          color="#ff00ff"
          distance={60}
          decay={1.5}
        />

        {/* Ceiling Moving Spotlight 1 */}
        <spotLight
          ref={ceilingSpot1Ref}
          position={[-8, 18, 0]}
          target={ceilingTarget1}
          angle={0.4}
          penumbra={0.6}
          intensity={vibe.intensity * 10 * laserPower}
          color={vibe.primaryColor}
          distance={50}
          decay={2}
          castShadow
        />

        {/* Ceiling Moving Spotlight 2 */}
        <spotLight
          ref={ceilingSpot2Ref}
          position={[8, 18, 0]}
          target={ceilingTarget2}
          angle={0.4}
          penumbra={0.6}
          intensity={vibe.intensity * 10 * laserPower}
          color={vibe.secondaryColor}
          distance={50}
          decay={2}
          castShadow
        />
      </group>

      {/* --- HOUSE LIGHTS (When brightness is ON) --- */}
      {brightness > 0.1 && (
        <group>
            {/* Center Wash - Extremely high distance to illuminate the whole venue */}
            <pointLight position={[0, 20, 0]} intensity={houseIntensity * 2.0} distance={100} decay={1} color="#ffffff" />
            
            {/* Wide Area Fills - Positioned high and wide to prevent dark corners */}
            <pointLight position={[-25, 18, -20]} intensity={houseIntensity * 1.2} distance={80} decay={1.5} color="#ffffff" />
            <pointLight position={[25, 18, -20]} intensity={houseIntensity * 1.2} distance={80} decay={1.5} color="#ffffff" />
            <pointLight position={[-25, 18, 20]} intensity={houseIntensity * 1.2} distance={80} decay={1.5} color="#ffffff" />
            <pointLight position={[25, 18, 20]} intensity={houseIntensity * 1.2} distance={80} decay={1.5} color="#ffffff" />
            
            {/* Floor Bounce - Upward light to illuminate underside of models */}
            <pointLight position={[0, -2, 0]} intensity={houseIntensity * 0.5} distance={50} decay={2} color="#ffffff" />
        </group>
      )}
    </>
  );
};

const Experience: React.FC<ExperienceProps> = ({ vibe, crowdDensity, isBoilerRoomMode, brightness, designMode, closedSections }) => {
  console.log('🎬 Experience component rendering...', { crowdDensity, isBoilerRoomMode, brightness });
  
  const [glStatus, setGlStatus] = useState<'ok' | 'lost'>('ok');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const [isSceneReady, setIsSceneReady] = useState(false);

  // Handle window resize for mobile detection and camera adjustment
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  // Camera settings based on device
  const cameraPosition: [number, number, number] = isMobile ? [0, 30, 50] : [0, 15, 30];
  const cameraFov = isMobile ? 45 : 50;

  // Separate sizing: keep LED-wall stage larger, boiler-room pad smaller
  // Larger LED-wall stage (next to E1/D10), smaller boiler pad centered on K–N range
  const MAIN_STAGE = { width: 9.0, depth: 5.0, height: 0.6 };
  const BOILER_STAGE = { width: 3.5, depth: 2.0, height: 0.6 };
  const activeStage = isBoilerRoomMode ? BOILER_STAGE : MAIN_STAGE;

  const stepX = (activeStage.width / 2) - 0.5;
  const stepFront1 = activeStage.depth / 2 + 0.35;
  const stepFront2 = activeStage.depth / 2 + 0.9;
  
  // Brighter background when house lights are on
  const bgColor = brightness > 0.1 ? '#333333' : vibe.fogColor;

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
        frameloop="always"
        onCreated={({ gl }) => {
          console.log('✅ WebGL Canvas created successfully!', gl);
          const canvas = gl.domElement;
          canvasRef.current = canvas;
          // Ensure the loading overlay clears after the first frame
          requestAnimationFrame(() => setIsSceneReady(true));

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
      {/* Optimized fog settings: pushed much further back in bright mode to avoid darkening the zoomed-out view */}
      <fog attach="fog" args={[bgColor, brightness > 0.1 ? 150 : 20, brightness > 0.1 ? 300 : 60]} />
      <color attach="background" args={[bgColor]} />

      <PerspectiveCamera makeDefault position={cameraPosition} fov={cameraFov} near={0.5} far={200} />
      
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

      <Suspense fallback={null}>
        <group>
          <VenueMap occupancy={crowdDensity} designMode={designMode} closedSections={closedSections} />
          
          {/* PERMANENT MAIN STAGE: Always at LED screen (E1/D10), regardless of mode */}
          {isBoilerRoomMode && (
            <group position={[0, 0, -9]}>
              <MainStage 
                width={MAIN_STAGE.width} 
                depth={MAIN_STAGE.depth} 
                height={MAIN_STAGE.height} 
              />
            </group>
          )}
          
          {/* DYNAMIC CENTER STAGE (Standard Mode = MainStage, Boiler Room Mode = BoilerRoomPlatform) */}
          <group position={stagePosition} rotation={stageRotation}>
              {isBoilerRoomMode ? (
                // Center stage in Boiler Room mode - use compact BoilerRoomPlatform
                <BoilerRoomPlatform 
                  width={BOILER_STAGE.width} 
                  depth={BOILER_STAGE.depth} 
                  height={BOILER_STAGE.height} 
                />
              ) : (
                // Standard mode - use MainStage with professional design
                <MainStage 
                  width={MAIN_STAGE.width} 
                  depth={MAIN_STAGE.depth} 
                  height={MAIN_STAGE.height} 
                />
              )}
               
              <group position={[0, 0.6, 0]} scale={isBoilerRoomMode ? 0.9 : 1.1}>
                 <DJBooth />
              </group>
          </group>

          <Crowd 
            density={crowdDensity} 
            vibeIntensity={vibe.intensity} 
            stageRadius={isBoilerRoomMode ? 2.0 : 3.5}
            isBoilerRoomMode={isBoilerRoomMode}
            closedSections={closedSections}
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
      </Suspense>
      </Canvas>
      {!isSceneReady && (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#050505',
          color: 'white',
          fontFamily: 'monospace',
          fontSize: '14px',
          letterSpacing: '0.15em',
          zIndex: 30
        }}>
          Loading Venue Assets...
        </div>
      )}
    </div>
  );
};

export default Experience;