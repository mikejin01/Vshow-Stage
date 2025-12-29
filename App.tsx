import React, { useState, Suspense } from 'react';
import Experience from './components/Experience';
import { VibeConfig } from './types';

// Fixed Vibe Config
const DEFAULT_VIBE: VibeConfig = {
  primaryColor: '#ff0055',
  secondaryColor: '#2200cc',
  fogColor: '#050505',
  strobeSpeed: 2,
  intensity: 1.2,
  description: 'Resident Night',
};

const LoadingScreen = () => {
  console.log('📦 Loading screen displayed');
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#050505',
      color: 'white',
      zIndex: 50
    }}>
      <div style={{
        fontFamily: 'monospace',
        fontSize: '14px',
        letterSpacing: '0.2em',
        animation: 'pulse 2s infinite'
      }}>
        LOADING VENUE ASSETS...
      </div>
    </div>
  );
};

const App: React.FC = () => {
  console.log('🎨 App component rendering...');
  
  // State - Using actual customer count (0-500)
  const [crowdCount, setCrowdCount] = useState(75);
  const [isBoilerRoomMode, setIsBoilerRoomMode] = useState(true);
  const [brightness, setBrightness] = useState(1.0); // 1.0 = ON, 0.0 = OFF
  const [isPanelExpanded, setIsPanelExpanded] = useState(true);

  // Convert crowd count to density for the Experience component
  const maxCapacity = 500;
  const crowdDensity = crowdCount / maxCapacity;

  console.log('🎚️ State:', { crowdCount, crowdDensity, isBoilerRoomMode, brightness, isPanelExpanded });

  return (
    <div style={{ 
      position: 'relative', 
      width: '100%', 
      height: '100vh', 
      backgroundColor: '#050505',
      color: 'white',
      fontFamily: 'sans-serif',
      overflow: 'hidden'
    }}>
      {/* 3D Canvas Container */}
      <div style={{ 
        position: 'absolute', 
        inset: 0, 
        zIndex: 0,
        backgroundColor: '#050505'
      }}>
        <Suspense fallback={<LoadingScreen />}>
          <Experience 
            vibe={DEFAULT_VIBE} 
            crowdDensity={crowdDensity} 
            isBoilerRoomMode={isBoilerRoomMode}
            brightness={brightness} 
          />
        </Suspense>
      </div>

      {/* Main UI Overlay - Top Left */}
      <div className="absolute top-0 left-0 p-8 z-10 w-full max-w-sm pointer-events-none">
        <div className="pointer-events-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-5xl font-black tracking-tighter italic mb-1 drop-shadow-lg text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                VSHOW <span className="text-red-600">NYC</span>
                </h1>
                <p className="text-[10px] font-mono text-gray-400 uppercase tracking-[0.3em] ml-1">
                Venue Planner v2.0
                </p>
            </div>

            {/* Glass Control Panel */}
            <div className={`backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden group transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] hover:bg-white/10 ${isPanelExpanded ? 'p-6' : 'p-4'}`}>
                
                {/* Panel Header & Toggle */}
                <div className="flex justify-between items-center relative z-20">
                     <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor] transition-colors duration-500 ${brightness > 0.1 ? 'bg-green-500 text-green-500' : 'bg-red-500 text-red-500'}`} />
                        <h2 className="text-xs font-bold uppercase tracking-widest text-white/90">
                            Controls
                        </h2>
                     </div>
                     <button 
                        onClick={() => setIsPanelExpanded(!isPanelExpanded)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/20 text-white/70 hover:text-white transition-all duration-200 border border-transparent hover:border-white/10"
                        aria-label={isPanelExpanded ? "Minimize controls" : "Expand controls"}
                     >
                        {isPanelExpanded ? (
                             // Chevron Up
                             <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
                        ) : (
                             // Chevron Down
                             <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                        )}
                     </button>
                </div>

                {/* Decorative glow - only visible when expanded */}
                <div className={`absolute -top-10 -right-10 w-32 h-32 bg-red-500/20 rounded-full blur-3xl pointer-events-none transition-opacity duration-500 ${isPanelExpanded ? 'opacity-100' : 'opacity-0'}`} />
                
                {/* Collapsible Content */}
                <div className={`transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden ${isPanelExpanded ? 'max-h-[500px] opacity-100 mt-6' : 'max-h-0 opacity-0 mt-0'}`}>
                    
                    {/* 1. Stage Layout Control */}
                    <div className="mb-6 relative z-10">
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-300">Stage Configuration</h2>
                        </div>
                        
                        {/* Custom Segmented Control */}
                        <div className="relative bg-black/40 p-1 rounded-xl flex items-center border border-white/5">
                            <div 
                                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg bg-gray-700 shadow-sm transition-all duration-300 ease-out ${
                                    isBoilerRoomMode ? 'left-[calc(50%+2px)] bg-red-600' : 'left-1 bg-gray-700'
                                }`} 
                            />
                            <button 
                                onClick={() => setIsBoilerRoomMode(false)}
                                className={`flex-1 relative z-10 py-2.5 text-[10px] font-bold uppercase tracking-wider transition-colors duration-300 ${!isBoilerRoomMode ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                            >
                                Standard
                            </button>
                            <button 
                                onClick={() => setIsBoilerRoomMode(true)}
                                className={`flex-1 relative z-10 py-2.5 text-[10px] font-bold uppercase tracking-wider transition-colors duration-300 ${isBoilerRoomMode ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                            >
                                Boiler Room
                            </button>
                        </div>

                        <p className="text-[10px] text-gray-400 mt-3 leading-relaxed font-light border-l-2 border-white/20 pl-3">
                            {isBoilerRoomMode 
                                ? "Center-stage configuration. 360° audience wrap-around."
                                : "End-stage configuration against the LED wall."}
                        </p>
                    </div>

                    {/* 2. Crowd Density Control */}
                    <div className="relative z-10 mb-6">
                        <div className="flex justify-between items-end mb-3">
                            <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-300">Capacity</h2>
                            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-900/30 px-2 py-0.5 rounded border border-cyan-500/30">
                                {crowdCount} / {maxCapacity}
                            </span>
                        </div>
                        
                        <div className="relative w-full h-2 bg-gray-800/50 rounded-full overflow-hidden group/slider">
                            <div 
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-600 to-blue-500 rounded-full transition-all duration-100 ease-linear"
                                style={{ width: `${(crowdCount / maxCapacity) * 100}%` }}
                            />
                            <input 
                                type="range" 
                                min="0" 
                                max={maxCapacity} 
                                step="10"
                                value={crowdCount}
                                onChange={(e) => setCrowdCount(parseInt(e.target.value))}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                        </div>
                    </div>

                    {/* 3. Global Brightness Toggle */}
                    <div className="relative z-10">
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-300">House Lights</h2>
                        </div>
                        
                        <button
                            onClick={() => setBrightness(prev => prev > 0.1 ? 0.0 : 1.0)}
                            className={`relative w-full overflow-hidden rounded-xl border transition-all duration-300 group ${
                                brightness > 0.1 
                                ? 'bg-yellow-500/10 border-yellow-500/50 shadow-[0_0_20px_rgba(234,179,8,0.1)]' 
                                : 'bg-black/40 border-gray-800 hover:border-gray-600'
                            }`}
                        >
                            {/* Glow effect */}
                            <div className={`absolute inset-0 bg-yellow-500/20 blur-xl transition-opacity duration-500 ${brightness > 0.1 ? 'opacity-100' : 'opacity-0'}`} />
                            
                            <div className="relative flex items-center justify-between p-3">
                                <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors duration-300 ${brightness > 0.1 ? 'text-yellow-100' : 'text-gray-400'}`}>
                                    {brightness > 0.1 ? 'Lights On' : 'Lights Off'}
                                </span>
                                
                                {/* Toggle Switch Visual */}
                                <div className={`w-8 h-4 rounded-full p-0.5 transition-colors duration-300 ${brightness > 0.1 ? 'bg-yellow-500' : 'bg-gray-700'}`}>
                                    <div className={`h-3 w-3 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${brightness > 0.1 ? 'translate-x-4' : 'translate-x-0'}`} />
                                </div>
                            </div>
                        </button>
                    </div>

                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default App;