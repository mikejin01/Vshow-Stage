# Stage Models Update - Different 3D Models for Main Stage and Boiler Room Platform

## Summary
Created two distinct 3D stage models with different designs, sizes, and aesthetics:

### 1. **MainStage Component** (`components/MainStage.tsx`)
**Location:** Next to LED screen, between E1 and D10 booths

**Size:** **9.0m wide × 5.0m deep** (significantly bigger)

**Design Features:**
- ✨ **Multi-tiered platform** - Two-level stage with base and upper platform
- 🎨 **Professional finish** - Glossy black top surface with metallic accents
- 💡 **LED lighting system**:
  - Front edge LED strip (pink/magenta)
  - Side edge LED strips
  - Corner pillar LED rings
  - Step LED accents (cyan)
- 🏛️ **Corner accent pillars** - 4 cylindrical pillars with LED rings
- 🪜 **Professional grade steps** - Wide 3-step staircase on both sides (1.8m wide)
- ✨ **Rounded edges** - Smooth RoundedBox geometry for premium look
- 🎭 **High metalness materials** - Glossy, reflective surfaces

**Visual Style:** High-end concert stage, professional, eye-catching, modern

---

### 2. **BoilerRoomPlatform Component** (`components/BoilerRoomPlatform.tsx`)
**Location:** Center stage (K-N range) in Boiler Room mode

**Size:** **3.5m wide × 2.0m deep** (compact and intimate)

**Design Features:**
- 🔲 **Minimalist design** - Simple box geometry, raw industrial aesthetic
- ⚫ **Matte black finish** - Low reflectivity, understated look
- 🔴 **Subtle red accent** - Single front edge glow (very subdued)
- 🏗️ **Industrial corner supports** - 4 simple pillar legs
- 🪜 **Minimal steps** - Compact 2-step staircase on both sides (1.0m wide)
- 💨 **Underglow effect** - Subtle red underglow lighting
- 🎚️ **Cable management detail** - Aesthetic industrial touch
- 📦 **Sharp edges** - Raw box geometry for utilitarian look

**Visual Style:** Underground club, intimate, raw, Boiler Room aesthetic

---

## Technical Implementation

### New Files Created:
1. **`components/MainStage.tsx`** - Professional stage component
2. **`components/BoilerRoomPlatform.tsx`** - Minimal platform component

### Updated Files:
- **`components/Experience.tsx`**
  - Added imports for both new stage components
  - Updated rendering logic to use appropriate stage based on mode
  - Standard mode → `<MainStage>` component (bigger, professional)
  - Boiler Room mode → `<BoilerRoomPlatform>` component (smaller, industrial)

### Stage Dimensions:

| Stage Type | Width | Depth | Area | Use Case |
|------------|-------|-------|------|----------|
| **Main Stage** | 9.0m | 5.0m | 45m² | Standard mode, next to LED screen |
| **Boiler Room** | 3.5m | 2.0m | 7m² | Boiler Room mode, center stage |

### Key Differences:

| Feature | MainStage | BoilerRoomPlatform |
|---------|-----------|-------------------|
| **Geometry** | RoundedBox (smooth) | Box (sharp) |
| **Tiers** | 2-level platform | Single level |
| **LED Strips** | Multiple (front, sides, pillars, steps) | Single front + underglow |
| **Steps** | 3 steps, 1.8m wide | 2 steps, 1.0m wide |
| **Pillars** | 4 decorative with LEDs | 4 minimal corner supports |
| **Material** | Glossy, metallic (0.9 metalness) | Matte, rough (0.2 metalness) |
| **Colors** | Pink/Cyan LEDs, dark gray | Red glow, pure black |
| **Aesthetic** | Professional concert | Underground club |

---

## Visual Comparison

### MainStage (Standard Mode - E1/D10 Area)
```
     ╔════════════════════════════════════════╗
     ║  💡  Glossy Black Stage  💡           ║
     ║  ╭────────────────────────────────╮   ║
     ║  │     9.0m × 5.0m Platform      │   ║
     ║  │   Multi-tier with LED strips   │   ║
     ║  │        Professional            │   ║
     ║  ╰────────────────────────────────╯   ║
     ║  ⚫                            ⚫      ║
     ║  LED Pillars            LED Pillars   ║
     ╚════════════════════════════════════════╝
           🪜  Wide Steps  🪜
```

### BoilerRoomPlatform (Boiler Room Mode - K-N Area)
```
          ┌─────────────────┐
          │  3.5m × 2.0m    │
          │  Matte Black    │
          │   Minimal       │
          └─────────────────┘
          ▓                 ▓
        🔴 Red Underglow  🔴
            🪜   🪜
          Small  Small
          Steps  Steps
```

---

## How It Works

### Standard Mode:
- Shows **MainStage** at position `[0, 0, -9]` (between E1/D10)
- Large 9.0×5.0m professional stage with LED lighting
- DJ booth scaled to 100%

### Boiler Room Mode:
- Shows **BoilerRoomPlatform** at both positions:
  - Static platform at `[0, 0, -9]` (E1/D10 area)
  - Active center stage at `[0, 0, 0]`
- Small 3.5×2.0m industrial platform
- DJ booth scaled to 80%

---

## Benefits

✅ **Visual Distinction** - Each stage has unique appearance matching its purpose
✅ **Size Appropriate** - Main stage is noticeably bigger for performances
✅ **Aesthetic Match** - Professional look for main, raw look for Boiler Room
✅ **Reusable Components** - Clean, modular React components
✅ **Proper Lighting** - LED systems appropriate for each venue type
✅ **No Linter Errors** - All TypeScript checks pass

---

## Testing

To see the different stages:
1. **Standard Mode**: Toggle "Boiler Room Mode" OFF → See large MainStage
2. **Boiler Room Mode**: Toggle "Boiler Room Mode" ON → See compact BoilerRoomPlatform

Both stages will be visible in the 3D venue with distinct visual styles!

---

**Status**: ✅ Complete - Two distinct 3D stage models implemented successfully!


