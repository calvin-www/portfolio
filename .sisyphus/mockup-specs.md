# Mockup Visual Specifications

> **Note**: The original mockups were provided as images during the planning conversation.
> This document provides detailed written specifications derived from those mockups.

## Color Palette

### Light Mode
- **Background**: #F5F9FC (very light blue-gray)
- **Primary Text**: #1A202C (near black)
- **Accent Blue**: #3182CE (ocean blue)
- **Accent Cyan**: #00B5D8 (bright cyan for "WONG", tech tags)
- **Secondary Text**: #718096 (gray)
- **Card Background**: #FFFFFF with subtle blue border
- **HUD Text**: #718096 (monospace, uppercase)

### Dark Mode
- **Background**: #0A1628 (deep ocean blue-black)
- **Primary Text**: #F7FAFC (near white)
- **Accent Blue**: #63B3ED (lighter blue)
- **Accent Cyan**: #00B5D8 (same cyan)
- **Card Background**: rgba(255,255,255,0.05) with subtle glow
- **Flashlight**: Radial gradient reveal centered on cursor

## Typography

### Fonts
- **Headings**: Bold, condensed sans-serif (similar to "Bebas Neue" or "Oswald")
- **Body**: Clean sans-serif (Inter, system-ui)
- **HUD/Mono**: Monospace (JetBrains Mono, Consolas)

### Text Styles
- **Hero Name "CALVIN"**: ~150px, bold, black/white, slight letter-spacing
- **Hero Name "WONG"**: ~150px, bold, gradient (black → cyan)
- **Section Titles**: ~80px, bold, black with cyan gradient on second word
- **HUD Labels**: 12px, monospace, uppercase, gray, letter-spacing: 0.1em

## Component Specifications

### 1. Navigation Bar
- **Position**: Fixed top, full width
- **Height**: ~80px
- **Layout**: Theme toggle left, nav links right
- **Nav Links**: Rounded pill buttons with border, ~120px wide
- **HUD Text** (left side):
  - Line 1: "SECTOR: 001 // HOME"
  - Line 2: "SYS.STATUS: OPTIMAL"
- **Spacing**: Links have ~16px gap between them

### 2. Hero Section
- **Layout**: Full viewport height, centered content
- **Badge**: "CREATIVE FRONTEND ENGINEER"
  - Cyan border, cyan dot indicator, cyan text
  - Rounded pill shape, ~250px wide
- **Name Display**:
  - "CALVIN" on first line (black/white)
  - "WONG" on second line (black→cyan gradient)
  - Font size ~150px, bold, condensed
- **Tagline**: "Building immersive web experiences beneath the surface."
  - Cyan text, centered below name
  - Font size ~24px, light weight
- **CTA**: "INITIALIZE DIVE" with chevron down icon
  - Gray text, centered at bottom
  - Fades out on scroll
- **Radar Decoration** (top right):
  - Circular design, ~300px diameter
  - Multiple concentric circles (3-4)
  - Dashed/dotted strokes
  - Small center dot
  - Slow rotation animation
- **Decorative Elements**:
  - L-shaped corner brackets (bottom-left, near shark)
  - Subtle circular blobs in background

### 3. Shark Companion
- **Style**: Line-art/wireframe illustration
- **Color**: Blue stroke (#3182CE), no fill
- **Size**: ~200px wide
- **Features**:
  - Body: Elongated oval with pointed nose
  - Tail: Forked, angled back
  - Fins: Triangular, one dorsal, two side fins
  - Eye: Small circle
  - Gills: 3 short parallel lines
  - Bubble ring: Dashed circle around body
- **Animation**: Follows cursor with spring physics
- **Position**: Floats freely over content

### 4. Depth Gauge (Right Side)
- **Position**: Fixed, bottom-right corner
- **Layout**: Vertical stack
- **Elements** (top to bottom):
  - Zone name: "EPIPELAGIC ZONE" (uppercase, monospace)
  - Depth number: "0000" (large, bold, ~48px) + "m" subscript
  - Coordinates: "COORDS: 34.052° N, 118.243° W"
  - Depth label: "DEPTH: SURFACE"
  - Vertical progress bar (thin line with indicator)
- **Color Changes**:
  - EPIPELAGIC (0-200m): Blue text
  - MESOPELAGIC (200-1000m): Blue text
  - BATHYPELAGIC (1000-3000m): Indigo text
  - ABYSSOPELAGIC (3000m+): Red text

### 5. About Section
- **Layout**: Two columns (image left, content right)
- **Badge**: "BIO-DATA ANALYSIS" (same style as hero badge)
- **Title**: "DIGITAL" (black) + "ALCHEMIST" (cyan gradient)
- **Image**:
  - Square/portrait aspect ratio (~400px)
  - Blue corner brackets (L-shapes) on all 4 corners
  - Subject label: "SUBJECT: CALVIN" (bottom-left overlay)
  - Grayscale by default, color on hover
  - Scanning effect: Horizontal gradient bar moving vertically
- **Bio Text**: Left-aligned paragraph below title
- **Mission Statement**: Cyan text, all caps, with decorative markers
- **Stats Row**:
  - "05+" with "YEARS EXP." label
  - "20+" with "PROJECTS DEPLOYED" label
  - Large bold numbers, small gray labels

### 6. Work Section (Experience)
- **Section Badge**: "CAREER DATA LOG" (top-left, green indicator)
- **Title**: "EXPERIENCE" (full width, ~100px, bold)
- **Scroll Indicator**: "SCROLL TO SCAN" (top-right with arrow)
- **Card Layout**: Horizontal scroll, cards ~450px wide
- **Card Design**:
  - White/light background with subtle shadow
  - Rounded corners (~16px)
  - Company name: Cyan serif font, ~32px
  - Role badge: Black background, white text, uppercase
  - Date: Gray text, calendar icon
  - Globe icon (top-right of card)
  - Bullet points for responsibilities
  - Tech tags at bottom (bordered pills)
- **3D Effect**: Cards tilt on mouse move (perspective)

### 7. Projects Section (Bioluminescence)
- **Section Badge**: "RESEARCH LABS" (green indicator)
- **Title**: "BIOLUMINESCENCE" (cut off at edge, wide letters)
- **Card Design** (HUD style):
  - "SYSTEM_ONLINE" indicator (green dot + text, top-left)
  - "ID: 01" number (top-right)
  - Project image: Grayscale, full width, ~60% of card height
  - Blue corner brackets around image
  - Project name: Cyan, large, with external link icon
  - Description: Gray text below
  - Tech tags: Bordered pills at bottom
- **Hover Effects**:
  - Image transitions to color
  - Scale up slightly
  - Tags lift up in wave

### 8. Skills Section (Fish Ecosystem)
- **Title**: "SKILL ECOSYSTEM" (centered, bold)
- **Subtitle**: "INTERACTIVE TECHNICAL ORGANISMS" (gray, small)
- **Container**: Large bounded area with rounded corners
- **Fish Design**:
  - Shape: Elongated pill with pointed tail end
  - Two dots for "eyes" (one larger, one smaller)
  - Tail: Triangle/arrow pointing back
  - Size: ~80-120px wide
  - Text: Skill name on body, uppercase
  - Direction indicator: Small arrow/dot on moving end
- **Fish Colors by Category**:
  - Language: Blue fill (#3182CE)
  - Framework: Cyan fill (#00B5D8)
  - Tool: Gray fill (#718096)
  - Design: Purple fill (#805AD5)
  - AI: Green fill (#38A169)
- **Movement**: Constant drift, avoid walls, flee from cursor

### 9. Contact Section
- **Badge**: "UPLINK ACTIVE" (cyan, with signal icon)
- **Title**: "SAY" (black) + "HELLO" (cyan)
- **Subtitle**: "INITIALIZE COMMUNICATION PROTOCOL"
- **Background**: Radar circles (faint, centered)
- **Cards Layout**: 2x2 grid, ~300px wide each
- **Card Design**:
  - White background, rounded corners
  - Icon (left): Large, gray, ~48px
  - Platform name (right): Bold, black
  - "CONNECT >>" text appears on hover (slides from left)
- **Cards**:
  - GitHub (branching icon)
  - LinkedIn (in logo)
  - Twitter (bird icon)
  - Email (envelope icon)
- **Footer**: "SYSTEM VERSION 2.0 // © 2026 CALVIN WONG"

### 10. Environmental Effects

#### Bubbles
- Shape: Perfect circles
- Sizes: 10px to 60px diameter
- Colors: Semi-transparent white/blue
- Count: 20-30 visible at once
- Movement: Rise slowly, slight horizontal wobble
- Parallax: Larger bubbles move more on mouse

#### Organic Blobs
- Shape: Irregular circles/ovals
- Sizes: 100-400px
- Colors: Very faint blue/purple (#3182CE at 5-10% opacity)
- Blur: 50-100px filter
- Movement: Slow drift on scroll

#### Caustics (Light Mode Only)
- Pattern: Overlapping wavy lines
- Color: White at 10-20% opacity
- Animation: Slow shimmer/movement
- Position: Covers entire background

### 11. Custom Cursor
- **Structure**: Central dot + outer ring
- **Default State**:
  - Dot: 8px, solid fill
  - Ring: 24px, 1px stroke, low opacity
- **Hover State** (on interactive elements):
  - Dot: 8px (same)
  - Ring: 64px, expands with spring animation
  - Opacity increases
- **Click State**:
  - Dot scales to 0.8x momentarily
  - Ripple: Expanding ring from click point, fades out
- **Trail**: Spring physics creates slight lag behind cursor

## Responsive Breakpoints

### Desktop (≥1280px)
- Full experience with all animations
- Horizontal scroll sections
- Custom cursor visible
- Shark companion active
- 30 fish in ecosystem

### Tablet (768px - 1279px)
- Reduced animations
- Horizontal scroll may become vertical
- Custom cursor hidden
- Shark companion hidden
- 20 fish in ecosystem

### Mobile (<768px)
- Simplified layout
- All sections vertical scroll
- No custom cursor
- No shark companion
- 15 fish in ecosystem
- Stacked card layouts
