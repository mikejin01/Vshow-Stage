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
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
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
  
  // State - Using actual customer count (0-300)
  const [crowdCount, setCrowdCount] = useState(75);
  const [isBoilerRoomMode, setIsBoilerRoomMode] = useState(true);
  const brightness = 1.0; // Set to bright mode so venue is visible
  const [isPanelExpanded, setIsPanelExpanded] = useState(true);
  const [isDesignMode, setIsDesignMode] = useState(false);
  const [closedSections, setClosedSections] = useState<string[]>([]);

  // Convert crowd count to density for the Experience component
  const maxCapacity = 300;
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
            designMode={isDesignMode}
            closedSections={closedSections}
          />
        </Suspense>
      </div>

      {/* Main UI Overlay - Top Left */}
      <div className="absolute top-0 left-0 p-3 md:p-8 z-10 w-full max-w-sm pointer-events-none">
        <div className="pointer-events-auto">
            {/* Header */}
            <div className="mb-4 md:mb-8">
                <h1 className="text-3xl md:text-5xl font-black tracking-tighter italic mb-1 drop-shadow-lg text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                VSHOW <span className="text-red-600">NYC</span>
                </h1>
                <div className="flex md:block gap-2 items-center">
                    <p className="text-[7px] md:text-[9px] font-mono text-white/50 md:text-white tracking-wide ml-1 mt-1">
                    Mike Jin
                    </p>
                    <p className="text-[7px] md:text-[10px] font-mono text-gray-500 md:text-gray-400 uppercase tracking-[0.1em] md:tracking-[0.3em] ml-1 md:mt-0.5">
                    Venue Planner v2.0
                    </p>
                </div>
            </div>

            {/* Glass Control Panel */}
            <div className={`backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden group transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] hover:bg-white/10 ${isPanelExpanded ? 'p-4 md:p-6' : 'p-3 md:p-4'}`}>
                
                {/* Panel Header & Toggle */}
                <div className="flex justify-between items-center relative z-20">
                     <div className="flex items-center gap-2">
                        <div className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-cyan-500 text-cyan-500 shadow-[0_0_8px_currentColor] transition-colors duration-500" />
                        <h2 className="text-[9px] md:text-xs font-bold uppercase tracking-widest text-white/90">
                            Controls
                        </h2>
                     </div>
                     <button 
                        onClick={() => setIsPanelExpanded(!isPanelExpanded)}
                        className="p-1 rounded-lg bg-white/5 hover:bg-white/20 text-white/70 hover:text-white transition-all duration-200 border border-transparent hover:border-white/10"
                        aria-label={isPanelExpanded ? "Minimize controls" : "Expand controls"}
                     >
                        {isPanelExpanded ? (
                             // Chevron Up
                             <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" className="md:w-[14px] md:height-[14px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
                        ) : (
                             // Chevron Down
                             <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" className="md:w-[14px] md:height-[14px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                        )}
                     </button>
                </div>

                {/* Decorative glow - only visible when expanded */}
                <div className={`absolute -top-10 -right-10 w-32 h-32 bg-red-500/20 rounded-full blur-3xl pointer-events-none transition-opacity duration-500 ${isPanelExpanded ? 'opacity-100' : 'opacity-0'}`} />
                
                {/* Collapsible Content */}
                <div className={`transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden ${isPanelExpanded ? 'max-h-[80vh] md:max-h-[500px] opacity-100 mt-4 md:mt-6' : 'max-h-0 opacity-0 mt-0'}`}>
                    
                    {/* 1. Stage Layout Control */}
                    <div className="mb-4 md:mb-6 relative z-10">
                        <div className="flex justify-between items-center mb-2 md:mb-3">
                            <h2 className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-gray-300">Stage Configuration</h2>
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
                                className={`flex-1 relative z-10 py-2 md:py-2.5 text-[9px] md:text-[10px] font-bold uppercase tracking-wider transition-colors duration-300 ${!isBoilerRoomMode ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                            >
                                Standard
                            </button>
                            <button 
                                onClick={() => setIsBoilerRoomMode(true)}
                                className={`flex-1 relative z-10 py-2 md:py-2.5 text-[9px] md:text-[10px] font-bold uppercase tracking-wider transition-colors duration-300 ${isBoilerRoomMode ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                            >
                                Boiler Room
                            </button>
                        </div>
                    </div>

                    {/* 2. Crowd Density Control */}
                    <div className="relative z-10 mb-4 md:mb-6">
                        <div className="flex justify-between items-end mb-2 md:mb-3">
                            <h2 className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-gray-300">Capacity</h2>
                            <span className="text-[9px] md:text-[10px] font-mono text-cyan-400 bg-cyan-900/30 px-2 py-0.5 rounded border border-cyan-500/30">
                                {crowdCount} / {maxCapacity}
                            </span>
                        </div>
                        
                        <div className="relative w-full h-1.5 md:h-2 bg-gray-800/50 rounded-full overflow-hidden group/slider">
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

                    {/* 3. Design Mode */}
                    <div className="relative z-10 mt-4 md:mt-6">
                        <div className="flex justify-between items-center mb-2 md:mb-3">
                            <h2 className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-gray-300">Design Mode</h2>
                        </div>
                        <button
                            onClick={() => setIsDesignMode((prev) => !prev)}
                            className={`w-full rounded-xl border transition-all duration-300 overflow-hidden relative ${
                                isDesignMode 
                                  ? 'bg-emerald-500/15 border-emerald-500/40 shadow-[0_0_20px_rgba(52,211,153,0.2)]' 
                                  : 'bg-black/40 border-gray-800 hover:border-gray-600'
                            }`}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/5 opacity-60" />
                            <div className="relative flex items-center justify-between p-2.5 md:p-3">
                                <span className={`text-[9px] md:text-[10px] font-bold uppercase tracking-wider ${isDesignMode ? 'text-emerald-100' : 'text-gray-400'}`}>
                                    {isDesignMode ? 'ACTIVE' : 'INACTIVE'}
                                </span>
                                <div className={`w-7 md:w-8 h-3.5 md:h-4 rounded-full p-0.5 transition-colors duration-300 ${isDesignMode ? 'bg-emerald-500' : 'bg-gray-700'}`}>
                                    <div className={`h-2.5 w-2.5 md:h-3 md:w-3 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${isDesignMode ? 'translate-x-3 md:translate-x-4' : 'translate-x-0'}`} />
                                </div>
                            </div>
                        </button>
                        
                        {/* Close Sections Control - Only visible in Design Mode */}
                        {isDesignMode && (
                            <div className="mt-3 p-3 rounded-xl bg-black/40 border border-gray-800 max-h-[180px] overflow-y-auto custom-scrollbar">
                                <h3 className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-gray-300 mb-2">Close Sections</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {['A', 'B', 'D', 'E'].map((section) => {
                                        const isClosed = closedSections.includes(section);
                                        return (
                                            <button
                                                key={section}
                                                onClick={() => {
                                                    setClosedSections(prev => 
                                                        isClosed 
                                                            ? prev.filter(s => s !== section)
                                                            : [...prev, section]
                                                    );
                                                }}
                                                className={`py-1.5 px-2 rounded-lg text-[8px] md:text-[9px] font-bold uppercase tracking-wider transition-all duration-200 ${
                                                    isClosed
                                                        ? 'bg-red-900/30 border border-red-500/50 text-red-200'
                                                        : 'bg-gray-800/50 border border-gray-700 text-gray-400 hover:border-gray-500'
                                                }`}
                                            >
                                                Sect {section}
                                                <span className="block text-[7px] mt-0.5 opacity-70">
                                                    {isClosed ? 'CLOSED' : 'OPEN'}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default App;