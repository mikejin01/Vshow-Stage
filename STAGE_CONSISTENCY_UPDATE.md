# Stage Consistency Update - Main Stage Always at LED Screen

## Summary of Changes

The **Main Stage** next to the LED screen (between E1 and D10) now **remains the same** in both Standard Mode and Boiler Room Mode.

---

## Previous Behavior ❌

### Standard Mode:
```
LED Screen Area (E1/D10):
    ┌─────────────────┐
    │   MainStage     │ ← Large professional stage
    │   (9.0 × 5.0m)  │
    └─────────────────┘
```

### Boiler Room Mode:
```
LED Screen Area (E1/D10):
    ┌─────────────────┐
    │ BoilerPlatform  │ ← Changed to small platform ❌
    │   (3.5 × 2.0m)  │
    └─────────────────┘
```

**Issue:** Stage at LED screen changed appearance when switching modes

---

## New Behavior ✅

### Standard Mode:
```
LED Screen Area (E1/D10):
    ┌─────────────────┐
    │   MainStage     │ ← Large professional stage
    │   (9.0 × 5.0m)  │
    │   with DJ       │
    └─────────────────┘
```

### Boiler Room Mode:
```
LED Screen Area (E1/D10):        Center Stage (K-N):
    ┌─────────────────┐            ┌──────────────┐
    │   MainStage     │ ← SAME!    │  Boiler      │
    │   (9.0 × 5.0m)  │            │  Platform    │
    │  (no DJ booth)  │            │ 3.5 × 2.0m   │
    └─────────────────┘            │  with DJ     │
                                   └──────────────┘
```

**Result:** Stage at LED screen stays consistent ✅

---

## Technical Implementation

### What Changed:

#### 1. **Permanent Main Stage at LED Screen (Position: [0, 0, -9])**
```typescript
// Always renders MainStage when in Boiler Room mode
{isBoilerRoomMode && (
  <group position={[0, 0, -9]}>
    <MainStage 
      width={MAIN_STAGE.width}    // 9.0m
      depth={MAIN_STAGE.depth}    // 5.0m
      height={MAIN_STAGE.height}  // 0.6m
    />
  </group>
)}
```

#### 2. **Dynamic Center Stage (Position: [0, 0, 0] in Boiler Room)**
```typescript
<group position={stagePosition} rotation={stageRotation}>
  {isBoilerRoomMode ? (
    // Boiler Room mode: Small platform at center
    <BoilerRoomPlatform 
      width={BOILER_STAGE.width}   // 3.5m
      depth={BOILER_STAGE.depth}   // 2.0m
      height={BOILER_STAGE.height} // 0.6m
    />
  ) : (
    // Standard mode: Large stage
    <MainStage 
      width={MAIN_STAGE.width}     // 9.0m
      depth={MAIN_STAGE.depth}     // 5.0m
      height={MAIN_STAGE.height}   // 0.6m
    />
  )}
  
  {/* DJ Booth on active stage */}
  <group position={[0, 0.6, 0]} scale={isBoilerRoomMode ? 0.8 : 1}>
    <DJBooth />
  </group>
</group>
```

---

## Stage Layout by Mode

### Standard Mode (Boiler Room OFF):
```
┌────────────────────────────────────┐
│                                    │
│         [LED SCREEN]               │
│                                    │
│      ╔═══════════════╗             │
│      ║   MainStage   ║             │
│      ║  9.0 × 5.0m   ║             │
│      ║   with DJ     ║             │
│      ╚═══════════════╝             │
│                                    │
└────────────────────────────────────┘
   E1              D10
```

### Boiler Room Mode (Boiler Room ON):
```
┌────────────────────────────────────┐
│                                    │
│         [LED SCREEN]               │
│                                    │
│      ╔═══════════════╗             │
│      ║   MainStage   ║ ← SAME!    │
│      ║  9.0 × 5.0m   ║             │
│      ║  (empty)      ║             │
│      ╚═══════════════╝             │
│                                    │
│            Center:                 │
│         ╔═══════════╗              │
│         ║  Boiler   ║              │
│         ║ Platform  ║              │
│         ║ 3.5×2.0m  ║              │
│         ║  with DJ  ║              │
│         ╚═══════════╝              │
│                                    │
└────────────────────────────────────┘
   E1      D10      K-N
```

---

## Key Differences

| Location | Standard Mode | Boiler Room Mode | Change? |
|----------|---------------|------------------|---------|
| **LED Screen Stage** (E1/D10) | MainStage 9.0×5.0m with DJ | MainStage 9.0×5.0m (empty) | ✅ **Same stage** |
| **Center Stage** (K-N) | *(none)* | BoilerRoomPlatform 3.5×2.0m with DJ | - |
| **Active DJ Location** | LED Screen Stage | Center Stage | Moves |

---

## Benefits

✅ **Visual Consistency** - Main stage always looks the same  
✅ **Clear Separation** - Two different stage types for different purposes  
✅ **Professional Look** - Large stage stays professional regardless of mode  
✅ **Boiler Room Aesthetic** - Compact platform only appears at center  
✅ **Better Understanding** - Users can see both stages in Boiler Room mode  

---

## User Experience

### Standard Mode:
- Single large professional stage at LED screen
- DJ performs on MainStage
- Traditional concert setup

### Boiler Room Mode:
- MainStage at LED screen **remains visible** (empty)
- Compact BoilerRoomPlatform appears at center
- DJ performs on center platform
- Dual-stage setup: decorative main stage + active boiler room platform
- Authentic underground club vibe

---

## Stage Specifications

### MainStage (LED Screen Area - Both Modes)
- **Size:** 9.0m × 5.0m × 0.6m
- **Features:**
  - Multi-tiered platform
  - LED strips (pink, cyan)
  - Corner pillars with LED rings
  - Professional glossy finish
  - Wide 3-step staircases

### BoilerRoomPlatform (Center - Boiler Room Only)
- **Size:** 3.5m × 2.0m × 0.6m
- **Features:**
  - Single level platform
  - Minimal red accents
  - Industrial corner supports
  - Matte black finish
  - Compact 2-step staircases

---

**Status**: ✅ Complete - Main stage at LED screen now stays consistent across both modes!




