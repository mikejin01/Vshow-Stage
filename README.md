# VSHOW NYC - Venue Planner

LIVE Preview: https://mikejin01.github.io/Vshow-Stage/

An interactive 3D venue planning and visualization application built with React, Three.js, and Vite.

![VSHOW NYC](https://img.shields.io/badge/VSHOW-NYC-red)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite)
![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react)
![Three.js](https://img.shields.io/badge/Three.js-0.160-000000?logo=three.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?logo=typescript)

## 🎯 Features

- **Interactive 3D Venue Visualization**: Explore a detailed 3D model of a venue with luxury booths, DJ stage, and bar area
- **Real-time Stage Configuration**: Toggle between Boiler Room (center stage) and Standard (end stage) layouts
- **Dynamic Crowd Simulation**: Adjust crowd density from 0-100% with realistic animated crowd members
- **Advanced Lighting System**: Control house lights and experience dynamic vibe-based lighting effects
- **Responsive 3D Controls**: Orbit, zoom, and pan around the venue with smooth camera controls
- **Performance Optimized**: Instanced rendering for handling 500 animated crowd members efficiently

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Modern web browser with WebGL 2.0 support

### Installation

1. Clone or navigate to the project directory:
```bash
cd "Vshow-Stage"
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Set up Google Gemini API for AI vibe generation:
```bash
cp .env.example .env
# Edit .env and add your API key:
# VITE_GEMINI_API_KEY=your_api_key_here
```

### Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Production Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## 🎮 Usage

### Controls

- **Stage Configuration**: Toggle between "Standard" and "Boiler Room" stage layouts
- **Occupancy Slider**: Adjust crowd density from 0% to 100%
- **House Lights Toggle**: Turn venue lighting on/off
- **3D Navigation**: 
  - Left click + drag: Rotate camera
  - Right click + drag: Pan camera
  - Scroll: Zoom in/out

### Venue Layout

The venue includes:
- **Main Stage**: Dynamic positioning with DJ booth and equipment
- **VIP Booths**: Sections A-F with luxury seating and tables
- **Bar Area**: Full-service bar with stools and decorative lighting
- **LED Wall**: Large display screen backdrop
- **Crowd Area**: Dynamic crowd simulation avoiding furniture and stage

## 🏗️ Tech Stack

- **Frontend Framework**: React 18.2
- **3D Rendering**: Three.js 0.160 + React Three Fiber 8.15
- **3D Helpers**: React Three Drei 9.96
- **Build Tool**: Vite 5.0
- **Language**: TypeScript 5.3
- **Styling**: Tailwind CSS (CDN)
- **AI Integration**: Google Generative AI (optional)

## 📁 Project Structure

```
Vshow-Stage/
├── components/
│   ├── Experience.tsx    # Main 3D scene component
│   ├── VenueMap.tsx      # Venue layout (booths, bar, walls)
│   ├── DJBooth.tsx       # DJ booth and character
│   └── Crowd.tsx         # Instanced crowd rendering
├── services/
│   └── geminiService.ts  # AI vibe generation (optional)
├── types.ts              # TypeScript interfaces
├── App.tsx               # Main app component with UI
├── index.tsx             # App entry point
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Dependencies
```

## 🎨 Key Features Explained

### Dynamic Stage Layouts

- **Standard Mode**: Stage positioned against the LED wall (z = -9)
- **Boiler Room Mode**: Stage centered in the venue (z = 0) with 360° crowd access

### Crowd Simulation

- Up to 500 individually animated crowd members
- Intelligent collision avoidance (stage, furniture, walls)
- Realistic dancing animations with:
  - Vertical bouncing synchronized to vibe intensity
  - Random rotation and swaying
  - Arm movements (higher energy = more movement)
  - Diverse skin tones, shirt colors, and pants

### Lighting System

- **Vibe Lights**: Dynamic colored spotlights with strobe effects
- **House Lights**: Toggleable overhead lighting with warm white tones
- **Ambient Lighting**: Balanced base lighting for visibility
- **Fog Effects**: Atmospheric fog with adjustable density

### Performance Optimizations

- Instanced mesh rendering for crowd (5 meshes for 500 people vs 2500 individual meshes)
- Optimized shadow casting and receiving
- Reduced anti-aliasing (dpr: 1-1.5)
- WebGL context loss handling

## 🔧 Configuration

### Environment Variables

Create a `.env` file (based on `.env.example`):

```env
VITE_GEMINI_API_KEY=your_api_key_here  # Optional
```

### Vite Config

The project uses custom Vite configuration:
- Dev server on port 3000
- Path alias: `@/` → project root
- React plugin with Fast Refresh

## 🐛 Known Issues & Solutions

### WebGL Context Lost

If you see "WebGL context was lost":
- Reduce crowd density
- Close other GPU-intensive applications
- Try a different browser
- Update graphics drivers

### Performance Issues

- Lower crowd density
- Disable shadows in `Experience.tsx` (Canvas shadows prop)
- Reduce fog render distance
- Use production build instead of dev mode

## 📝 Development Tips

### Adding New Booth Sections

Edit `VenueMap.tsx` and use the `LuxuryBooth` component:

```tsx
<LuxuryBooth 
  position={[x, 0, z]} 
  rotation={[0, angle, 0]}
  label="X1" 
  color="#ff00ff" 
/>
```

### Customizing Lighting

Modify the `Lights` component in `Experience.tsx`:
- Adjust `vibe.intensity` for brightness
- Change `vibe.primaryColor` and `vibe.secondaryColor`
- Tune strobe speed with `vibe.strobeSpeed`

### Crowd Behavior

Edit `Crowd.tsx`:
- Change `MAX_CROWD` constant for maximum capacity
- Adjust `jumpSpeed` formula for dance intensity
- Modify collision detection in crowd data generation

## 📦 Building for Production

The production build:
- Bundles all dependencies into optimized chunks
- Minifies JavaScript and CSS
- Generates source maps for debugging
- Outputs to `dist/` directory

Note: Bundle size warning is expected due to Three.js library size. Consider code splitting for larger projects.

## 🤝 Contributing

This is a venue planning tool. To extend it:

1. Add new venue sections in `VenueMap.tsx`
2. Create custom furniture components
3. Implement new lighting modes
4. Add stage equipment variations
5. Enhance crowd AI behavior

## 📄 License

This project is private and proprietary.

## 🎬 Credits

- Built with React, Three.js, and modern web technologies
- 3D rendering powered by React Three Fiber and Drei
- UI styled with Tailwind CSS
- Optional AI features via Google Gemini

---

**Made with ❤️ for VSHOW NYC**

For support or questions, please contact the development team.
