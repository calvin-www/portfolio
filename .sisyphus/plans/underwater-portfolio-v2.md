# Underwater Portfolio V2

## TL;DR

> **Quick Summary**: Build a sophisticated underwater-themed portfolio with spring physics animations, 3D shark companion, fish simulation for skills, and immersive scroll-linked depth gauge. Features 6 main sections with unique interactions, dark mode with flashlight effect, and simplified mobile experience.
> 
> **Deliverables**: 
> - Complete portfolio at `/` with all 6 sections
> - Custom cursor with sonar effect (desktop)
> - 3D shark companion following mouse (desktop)
> - Fish simulation for skills section
> - Depth gauge scroll indicator
> - Light/dark mode with flashlight effect
> - Mobile-optimized experience
> - Playwright E2E test suite
> 
> **Estimated Effort**: XL (40-60 hours)
> **Parallel Execution**: YES - 4 waves
> **Critical Path**: Setup → Foundation → Core Sections → Animations → Polish

---

## Context

### Original Request
Build a new interactive portfolio website with an underwater/deep-sea theme in `/src`, using data from `resume.json`, ignoring the `v1` directory (but keeping `/v1` route accessible).

### Interview Summary
**Key Discussions**:
- Animation approach: GSAP (scroll-linked) + Framer Motion (spring physics)
- 3D Shark: Import free low-poly model from Sketchfab, stylized aesthetic
- Horizontal scroll: GSAP ScrollTrigger with pinning
- Theme: next-themes for dark mode management
- Testing: Playwright E2E tests
- Mobile: Simplified experience (no cursor, no shark, vertical scroll)

**Research Findings**:
- Current stack already includes GSAP, Lenis, Three.js, React Three Fiber
- resume.json has 55 skills, 5 work entries, 6 projects, 4 hackathons
- TypeScript types already defined in `/src/types/resume.ts`
- Assets exist in `v1/public/` - need to reference or copy

### Metis Review
**Identified Gaps** (addressed):
- Mobile strategy: Simplified mobile experience confirmed
- Performance: Max 30 fish agents desktop, 15 mobile
- Scroll behavior: Pinned horizontal scroll confirmed
- Loading: Progressive reveal, no loading screen
- Guardrails: Canvas 2D for fish (not Three.js), one animation system per component

### Visual Specifications
**CRITICAL**: All visual design specifications are documented in `.sisyphus/mockup-specs.md`

This file contains:
- Complete color palette (light/dark mode)
- Typography specifications
- Component dimensions and layouts
- Shark illustration specifications
- Fish design specifications
- HUD element designs
- Responsive breakpoints

**Executors MUST reference `.sisyphus/mockup-specs.md` for all visual implementation details.**

---

## Work Objectives

### Core Objective
Create an immersive underwater-themed portfolio that showcases Calvin Wong's work, skills, and experience through sophisticated animations and interactions while maintaining performance and accessibility.

### Concrete Deliverables
- `/src/app/page.tsx` - Main portfolio page with all 6 sections
- `/src/components/` - 25+ reusable components
- `/src/hooks/` - Custom hooks for animations, mouse tracking, scroll
- `/src/contexts/` - Theme and cursor contexts
- `/src/lib/` - Utility functions and constants
- `/public/models/` - 3D shark model (GLTF)
- `/e2e/` - Playwright test suite
- Updated `package.json` with new dependencies

### Definition of Done
- [ ] All 6 sections render with data from resume.json
- [ ] Custom cursor works on desktop, hidden on mobile
- [ ] Shark companion follows mouse with spring physics
- [ ] Fish simulation runs at 60fps with 30 agents
- [ ] Depth gauge updates correctly with scroll (0-4000m)
- [ ] Dark mode toggle works with flashlight effect
- [ ] Horizontal scroll sections pin and scroll correctly
- [ ] Mobile layout works without desktop-only features
- [ ] All Playwright tests pass
- [ ] `prefers-reduced-motion` disables animations

### Must Have
- All interactions from mockups implemented
- Data sourced from existing resume.json
- Responsive design (mobile/tablet/desktop)
- Dark/light mode toggle
- Performance: 60fps desktop, 30fps mobile minimum
- Accessibility: reduced motion support, semantic HTML

### Must NOT Have (Guardrails)
- Sound effects or audio
- More than 30 fish agents (15 on mobile)
- Shark model exceeding 5k triangles
- Mixed animation libraries in single component
- Three.js for fish simulation (use Canvas 2D)
- Procedural generation of any kind
- Interactive fish (clicking, feeding)
- Water surface reflections/refractions
- Day/night cycle beyond dark mode toggle

---

## Verification Strategy (MANDATORY)

### Test Decision
- **Infrastructure exists**: YES (Playwright installed)
- **User wants tests**: YES (Playwright E2E)
- **Framework**: Playwright

### Automated Verification Approach

All acceptance criteria will be verified using Playwright browser automation:

**Desktop Tests:**
```typescript
// Navigate, interact, assert DOM state
await page.goto('http://localhost:3000');
await expect(page.getByTestId('hero-section')).toBeVisible();
```

**Mobile Tests:**
```typescript
// Emulate mobile viewport
await page.setViewportSize({ width: 375, height: 667 });
await expect(page.getByTestId('custom-cursor')).not.toBeVisible();
```

**Animation Tests:**
```typescript
// Test scroll-linked animations
await page.evaluate(() => window.scrollTo(0, 1000));
await page.waitForTimeout(500);
await expect(page.getByTestId('depth-gauge')).toContainText(/\d{3,4}m/);
```

**Reduced Motion Tests:**
```typescript
await page.emulateMedia({ reducedMotion: 'reduce' });
// Verify animations are disabled
```

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately):
├── Task 1: Project setup & dependencies
├── Task 2: Copy/reference assets from v1
└── Task 3: Source 3D shark model

Wave 2 (After Wave 1):
├── Task 4: Theme provider & dark mode setup
├── Task 5: Layout component & navigation
├── Task 6: Custom cursor component
└── Task 7: Depth gauge component

Wave 3 (After Wave 2):
├── Task 8: Hero section
├── Task 9: About section  
├── Task 10: Work section (horizontal scroll)
├── Task 11: Projects section (horizontal scroll)
├── Task 12: Skills section (fish simulation)
└── Task 13: Contact section

Wave 4 (After Wave 3):
├── Task 14: Shark companion (3D)
├── Task 15: Environmental effects (bubbles, blobs)
├── Task 16: Mobile optimizations
├── Task 17: Reduced motion support
└── Task 18: Playwright E2E tests

Critical Path: Task 1 → Task 5 → Task 8 → Task 18
Parallel Speedup: ~50% faster than sequential
```

### Dependency Matrix

| Task | Depends On | Blocks | Can Parallelize With |
|------|------------|--------|---------------------|
| 1 | None | 4,5,6,7 | 2,3 |
| 2 | None | 8,9,10,11 | 1,3 |
| 3 | None | 14 | 1,2 |
| 4 | 1 | 8-13,15 | 5,6,7 |
| 5 | 1 | 8-13 | 4,6,7 |
| 6 | 1 | 14 | 4,5,7 |
| 7 | 1 | 8-13 | 4,5,6 |
| 8 | 4,5,7 | 14,15 | 9,10,11,12,13 |
| 9 | 4,5 | 16 | 8,10,11,12,13 |
| 10 | 4,5 | 16 | 8,9,11,12,13 |
| 11 | 4,5 | 16 | 8,9,10,12,13 |
| 12 | 4,5 | 16 | 8,9,10,11,13 |
| 13 | 4,5 | 16 | 8,9,10,11,12 |
| 14 | 3,6,8 | 17 | 15,16 |
| 15 | 4,8 | 17 | 14,16 |
| 16 | 8-13 | 18 | 14,15,17 |
| 17 | 14,15 | 18 | 16 |
| 18 | 16,17 | None | None |

### Agent Dispatch Summary

| Wave | Tasks | Recommended Approach |
|------|-------|---------------------|
| 1 | 1,2,3 | Parallel - independent setup tasks |
| 2 | 4,5,6,7 | Parallel - foundation components |
| 3 | 8-13 | Parallel - all sections independent |
| 4 | 14-18 | Mixed - some dependencies |

---

## TODOs

### Wave 1: Project Setup

- [ ] 1. Project Setup & Dependencies

  **What to do**:
  - Install new dependencies: `framer-motion`, `next-themes`
  - Update `tailwind.config.ts` with extended theme (ocean colors, fonts, animations)
  - Create folder structure: `components/`, `hooks/`, `contexts/`, `lib/`
  - Update `src/app/page.tsx` to render new portfolio (remove redirect)
  - Configure `next.config.mjs` for GSAP compatibility if needed

  **Must NOT do**:
  - Modify v1 directory
  - Install unnecessary dependencies
  - Add sound/audio libraries

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Standard setup task, well-defined steps
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Tailwind configuration expertise

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 2, 3)
  - **Blocks**: Tasks 4, 5, 6, 7
  - **Blocked By**: None

  **References**:
  - `package.json` - Current dependencies to extend
  - `tailwind.config.ts` - Existing config with ocean colors to extend
  - `src/data/index.ts` - Data export pattern to follow

  **Acceptance Criteria**:
  ```bash
  # Verify dependencies installed
  bun pm ls | grep framer-motion
  # Assert: framer-motion listed
  
  bun pm ls | grep next-themes
  # Assert: next-themes listed
  ```
  
  ```typescript
  // Playwright verification
  await page.goto('http://localhost:3000');
  // Should NOT redirect to /v1
  await expect(page).toHaveURL('http://localhost:3000');
  ```

  **Commit**: YES
  - Message: `feat(setup): initialize portfolio v2 with dependencies and structure`
  - Files: `package.json`, `tailwind.config.ts`, `src/app/page.tsx`

---

- [ ] 2. Asset Management

  **What to do**:
  - Audit assets in `v1/public/` (images: me.png, company logos, project screenshots)
  - Copy necessary assets to root `public/` directory
  - Create `public/models/` directory for 3D assets
  - Verify all image paths in resume.json are accessible

  **Must NOT do**:
  - Modify v1 directory
  - Delete original assets
  - Change resume.json paths unnecessarily

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: File operations, no complex logic
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 3)
  - **Blocks**: Tasks 8, 9, 10, 11 (sections need images)
  - **Blocked By**: None

  **References**:
  - `v1/public/` - Source assets directory
  - `src/data/resume.json` - Image paths referenced (avatarUrl, logoUrl, image)

  **Acceptance Criteria**:
  ```bash
  # Verify assets exist
  ls public/me.png
  # Assert: file exists
  
  ls public/JPMC.png
  # Assert: file exists (work logo)
  
  ls public/mock-owl.png
  # Assert: file exists (project image)
  ```

  **Commit**: YES
  - Message: `chore(assets): copy portfolio assets to public directory`
  - Files: `public/*`

---

- [ ] 3. Source 3D Shark Model

  **What to do**:
  - Search Sketchfab for free low-poly shark models (CC0 or CC-BY license)
  - Download GLTF/GLB format (required for React Three Fiber)
  - Verify model is under 5k triangles
  - Place in `public/models/shark.glb`
  - Test loading with basic R3F setup

  **Model Requirements**:
  - License: CC0 or CC-BY (attribute in code if needed)
  - Format: GLTF/GLB
  - Triangles: <5,000
  - Style: Stylized/geometric to match wireframe aesthetic
  - Rigged: Not required (we'll use spring-based positioning)

  **Must NOT do**:
  - Use copyrighted models
  - Download models >10MB
  - Spend more than 1 hour sourcing

  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`
    - Reason: Research/download task, not coding
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2)
  - **Blocks**: Task 14 (Shark companion)
  - **Blocked By**: None

  **References**:
  - Sketchfab: https://sketchfab.com/search?q=low+poly+shark&type=models&licenses=cc0&licenses=by
  - Poly.pizza: https://poly.pizza/
  - React Three Fiber GLTF loading: https://docs.pmnd.rs/react-three-fiber/tutorials/loading-models

  **Acceptance Criteria**:
  ```bash
  # Verify model exists
  ls public/models/shark.glb
  # Assert: file exists
  
  # Verify file size reasonable
  du -h public/models/shark.glb
  # Assert: <5MB
  ```

  **Commit**: YES
  - Message: `feat(3d): add low-poly shark model`
  - Files: `public/models/shark.glb`, attribution note if CC-BY

---

### Wave 2: Foundation Components

- [ ] 4. Theme Provider & Dark Mode

  **What to do**:
  - Create `src/contexts/ThemeContext.tsx` using next-themes
  - Wrap app in ThemeProvider in `src/app/layout.tsx`
  - Define CSS custom properties for light/dark themes
  - Create theme toggle component with magnetic effect
  - Implement flashlight effect for dark mode (radial gradient mask following cursor)

  **Theme Colors**:
  - Light: Ocean blues (#E8F4FC background, #1A365D text, #3182CE accent)
  - Dark: Deep ocean (#0A1628 background, #E2E8F0 text, #63B3ED accent)

  **Flashlight Effect (Dark Mode)**:
  - Radial gradient mask centered on cursor position
  - Reveals background pattern only where cursor hovers
  - Uses CSS `mask-image` with `radial-gradient`

  **Must NOT do**:
  - Add day/night cycle animation
  - Use JavaScript-based theme detection (next-themes handles this)
  - Create instant toggle (use transition)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: CSS theming, visual effects
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Theme implementation, CSS custom properties

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 5, 6, 7)
  - **Blocks**: Tasks 8-13, 15
  - **Blocked By**: Task 1

  **References**:
  - next-themes docs: https://github.com/pacocoursey/next-themes
  - `v1/src/components/theme-provider.tsx` - Existing pattern (for reference only)
  - Tailwind dark mode: https://tailwindcss.com/docs/dark-mode

  **Acceptance Criteria**:
  ```typescript
  // Playwright
  // Test light mode default
  await page.goto('http://localhost:3000');
  await expect(page.locator('html')).not.toHaveClass(/dark/);
  
  // Test toggle to dark mode
  await page.getByTestId('theme-toggle').click();
  await expect(page.locator('html')).toHaveClass(/dark/);
  
  // Test persistence
  await page.reload();
  await expect(page.locator('html')).toHaveClass(/dark/);
  
  // Test flashlight effect exists in dark mode
  await expect(page.getByTestId('flashlight-overlay')).toBeVisible();
  ```

  **Commit**: YES
  - Message: `feat(theme): add dark mode with flashlight effect`
  - Files: `src/contexts/ThemeContext.tsx`, `src/app/layout.tsx`, `src/components/ui/ThemeToggle.tsx`

---

- [ ] 5. Layout Component & Navigation

  **What to do**:
  - Create `src/components/layout/Layout.tsx` - main layout wrapper
  - Create `src/components/layout/Navigation.tsx` - fixed header with magnetic links
  - Create `src/components/layout/Footer.tsx` - simple footer
  - Implement magnetic effect on nav links (translate toward cursor on hover)
  - Add HUD-style decorations (sector label, status indicator from mockups)
  - Integrate Lenis for smooth scrolling

  **Navigation Items** (from mockups):
  - ABOUT, WORK, PROJECTS, CONTACT
  - Theme toggle on left

  **HUD Elements** (from mockups):
  - "SECTOR: 001 // HOME" text
  - "SYS.STATUS: OPTIMAL" indicator

  **Magnetic Effect**:
  - On mouse enter bounding box, element translates toward cursor
  - Max translation: 30px (strength factor)
  - Spring reset on mouse leave (Framer Motion useSpring)

  **Must NOT do**:
  - Add hamburger menu (nav stays visible on mobile, just simplified)
  - Create dropdown menus
  - Add active section highlighting (keep simple)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Layout, navigation, magnetic effects
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Navigation patterns, Framer Motion springs

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 4, 6, 7)
  - **Blocks**: Tasks 8-13
  - **Blocked By**: Task 1

  **References**:
  - `.sisyphus/mockup-specs.md` Section 1: Navigation Bar - complete specs for nav layout, HUD text, magnetic buttons
  - Framer Motion useSpring: https://www.framer.com/motion/use-spring/
  - Lenis docs: https://lenis.darkroom.engineering/

  **Acceptance Criteria**:
  ```typescript
  // Playwright
  // Navigation visible
  await page.goto('http://localhost:3000');
  await expect(page.getByRole('navigation')).toBeVisible();
  await expect(page.getByRole('link', { name: 'ABOUT' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'WORK' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'PROJECTS' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'CONTACT' })).toBeVisible();
  
  // HUD elements visible
  await expect(page.getByText(/SECTOR/)).toBeVisible();
  await expect(page.getByText(/SYS.STATUS/)).toBeVisible();
  
  // Click navigation scrolls to section
  await page.getByRole('link', { name: 'ABOUT' }).click();
  await page.waitForTimeout(1000);
  await expect(page.getByTestId('about-section')).toBeInViewport();
  ```

  **Commit**: YES
  - Message: `feat(layout): add navigation with magnetic effect and HUD styling`
  - Files: `src/components/layout/*.tsx`

---

- [ ] 6. Custom Cursor Component

  **What to do**:
  - Create `src/components/ui/CustomCursor.tsx`
  - Create `src/hooks/useCursor.ts` for cursor state management
  - Implement central dot + outer sonar ring structure
  - Use Framer Motion spring for trailing effect (damping: 25, stiffness: 300)
  - Detect hover on interactive elements (<a>, <button>, [data-interactive])
  - Implement click ripple animation (expanding ring that fades out)
  - Hide on mobile/touch devices

  **Cursor States**:
  - Default: 8px dot, 24px ring (faint)
  - Hover: 8px dot, 64px ring (visible)
  - Click: Ripple effect, dot scales to 0.8x momentarily

  **Must NOT do**:
  - Show cursor on touch devices
  - Add custom cursor for text selection
  - Create multiple cursor variants

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Complex animation component
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Framer Motion springs, CSS animations

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 4, 5, 7)
  - **Blocks**: Task 14 (shark uses similar tracking)
  - **Blocked By**: Task 1

  **References**:
  - Framer Motion useSpring: https://www.framer.com/motion/use-spring/
  - `.sisyphus/mockup-specs.md` Section 11: Custom Cursor - exact dimensions for dot (8px), ring (24px/64px), states

  **Acceptance Criteria**:
  ```typescript
  // Playwright - Desktop
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('http://localhost:3000');
  
  // Custom cursor visible
  await expect(page.getByTestId('custom-cursor')).toBeVisible();
  
  // Cursor follows mouse (with delay)
  await page.mouse.move(500, 300);
  await page.waitForTimeout(500);
  const cursor = await page.getByTestId('custom-cursor').boundingBox();
  expect(cursor.x).toBeCloseTo(500, -2); // Within ~100px (spring lag)
  
  // Hover state on button
  await page.getByRole('link', { name: 'ABOUT' }).hover();
  await expect(page.getByTestId('cursor-ring')).toHaveCSS('width', '64px');
  
  // Mobile - cursor hidden
  await page.setViewportSize({ width: 375, height: 667 });
  await expect(page.getByTestId('custom-cursor')).not.toBeVisible();
  ```

  **Commit**: YES
  - Message: `feat(cursor): add custom sonar cursor with spring physics`
  - Files: `src/components/ui/CustomCursor.tsx`, `src/hooks/useCursor.ts`

---

- [ ] 7. Depth Gauge Component

  **What to do**:
  - Create `src/components/ui/DepthGauge.tsx`
  - Create `src/hooks/useScrollDepth.ts` for scroll-to-depth mapping
  - Map scroll progress (0-1) to depth (0-4000m)
  - Display ocean zone labels based on depth thresholds
  - Implement color shift animation (blue → indigo → red)
  - Position fixed on right side of viewport

  **Depth Zones**:
  - 0-200m: EPIPELAGIC ZONE (light blue)
  - 200-1000m: MESOPELAGIC ZONE (blue)
  - 1000-3000m: BATHYPELAGIC ZONE (indigo)
  - 3000m+: ABYSSOPELAGIC ZONE (red)

  **Display Elements** (from mockups):
  - Zone name label
  - Depth number (padded: 0000m format)
  - Coordinates text
  - Vertical progress bar

  **Must NOT do**:
  - Add smooth number animation (keep direct mapping)
  - Create depth warnings/alerts
  - Add sound effects for zone changes

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Scroll-linked UI component
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Scroll handling, Tailwind styling

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 4, 5, 6)
  - **Blocks**: None directly (but needed for full UX)
  - **Blocked By**: Task 1

  **References**:
  - `.sisyphus/mockup-specs.md` Section 4: Depth Gauge - complete specs for position, elements, zone colors
  - GSAP ScrollTrigger: https://gsap.com/docs/v3/Plugins/ScrollTrigger/

  **Acceptance Criteria**:
  ```typescript
  // Playwright
  await page.goto('http://localhost:3000');
  
  // Depth gauge visible
  await expect(page.getByTestId('depth-gauge')).toBeVisible();
  
  // At top: 0m, EPIPELAGIC
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(100);
  await expect(page.getByTestId('depth-value')).toContainText('0000');
  await expect(page.getByTestId('depth-zone')).toContainText('EPIPELAGIC');
  
  // At 25% scroll: ~1000m, MESOPELAGIC
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.25));
  await page.waitForTimeout(100);
  await expect(page.getByTestId('depth-zone')).toContainText('MESOPELAGIC');
  
  // At bottom: 4000m, ABYSSOPELAGIC
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(100);
  await expect(page.getByTestId('depth-value')).toContainText('4000');
  await expect(page.getByTestId('depth-zone')).toContainText('ABYSSOPELAGIC');
  ```

  **Commit**: YES
  - Message: `feat(depth): add scroll-linked depth gauge with ocean zones`
  - Files: `src/components/ui/DepthGauge.tsx`, `src/hooks/useScrollDepth.ts`

---

### Wave 3: Section Components

- [ ] 8. Hero Section

  **What to do**:
  - Create `src/components/sections/HeroSection.tsx`
  - Display name (CALVIN / WONG with gradient), title badge, tagline
  - Add rotating radar decoration (SVG, continuous 360deg rotation)
  - Implement parallax on scroll (title moves down, tagline moves up)
  - Add "INITIALIZE DIVE" CTA with chevron icon
  - CTA fades out and moves up as user scrolls

  **Content** (from resume.json):
  - Badge: "CREATIVE FRONTEND ENGINEER"
  - Name: "CALVIN WONG" (split across two lines)
  - Tagline: "Building immersive web experiences beneath the surface."
  - CTA: "INITIALIZE DIVE" + chevron

  **Parallax Values**:
  - Name: y: 0 → 200 on scroll
  - Tagline: y: 0 → -100 on scroll
  - CTA: opacity 1 → 0, y: 0 → -50 on scroll

  **Must NOT do**:
  - Add typing animation to name
  - Make radar functional (just decorative)
  - Add video background

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Hero section with parallax animations
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: GSAP ScrollTrigger, parallax effects

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 9-13)
  - **Blocks**: Tasks 14, 15
  - **Blocked By**: Tasks 4, 5, 7

  **References**:
  - `.sisyphus/mockup-specs.md` Section 2: Hero Section - complete layout, badge, name styling, radar decoration
  - `.sisyphus/mockup-specs.md` Color Palette: Dark Mode - colors for dark variant
  - `src/data/resume.json` - name, description fields
  - GSAP ScrollTrigger parallax: https://gsap.com/docs/v3/Plugins/ScrollTrigger/

  **Acceptance Criteria**:
  ```typescript
  // Playwright
  await page.goto('http://localhost:3000');
  
  // Hero content visible
  await expect(page.getByRole('heading', { name: /CALVIN/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /WONG/i })).toBeVisible();
  await expect(page.getByText(/CREATIVE FRONTEND ENGINEER/i)).toBeVisible();
  await expect(page.getByText(/immersive web experiences/i)).toBeVisible();
  
  // CTA visible at top
  await expect(page.getByText(/INITIALIZE DIVE/i)).toBeVisible();
  
  // Radar decoration exists
  await expect(page.getByTestId('radar-decoration')).toBeVisible();
  
  // CTA fades on scroll
  await page.evaluate(() => window.scrollTo(0, 500));
  await page.waitForTimeout(500);
  await expect(page.getByText(/INITIALIZE DIVE/i)).not.toBeVisible();
  ```

  **Commit**: YES
  - Message: `feat(hero): add hero section with parallax and radar decoration`
  - Files: `src/components/sections/HeroSection.tsx`

---

- [ ] 9. About Section

  **What to do**:
  - Create `src/components/sections/AboutSection.tsx`
  - Display "DIGITAL ALCHEMIST" title, bio text, stats
  - Add profile image with scanning effect (gradient bar moves vertically)
  - Image grayscale by default, color on hover
  - Elements slide in from left/right when entering viewport
  - Display stats: "05+ YEARS EXP." and "20+ PROJECTS DEPLOYED"

  **Content** (from resume.json):
  - Badge: "BIO-DATA ANALYSIS"
  - Title: "DIGITAL ALCHEMIST"
  - Bio: Use `summary` field
  - Mission: "BRIDGING AESTHETIC PRECISION WITH TECHNICAL PERFORMANCE."
  - Image: `/me.png`

  **Scanning Effect**:
  - Semi-transparent gradient bar overlay
  - Animates translateY from -100% to 100%
  - Continuous loop, slow pace (4-6 seconds)

  **Must NOT do**:
  - Add bio editing functionality
  - Include full resume download button (save for contact)
  - Add social links here (they're in contact)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Section with scanning animation
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: CSS animations, viewport detection

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 8, 10-13)
  - **Blocks**: Task 16
  - **Blocked By**: Tasks 4, 5

  **References**:
  - `.sisyphus/mockup-specs.md` Section 5: About Section - two-column layout, image styling, scanning effect, stats row
  - `src/data/resume.json` - summary, avatarUrl fields

  **Acceptance Criteria**:
  ```typescript
  // Playwright
  await page.goto('http://localhost:3000');
  await page.getByRole('link', { name: 'ABOUT' }).click();
  await page.waitForTimeout(1000);
  
  // Content visible
  await expect(page.getByText(/DIGITAL ALCHEMIST/i)).toBeVisible();
  await expect(page.getByText(/BIO-DATA ANALYSIS/i)).toBeVisible();
  await expect(page.getByRole('img', { name: /Calvin/i })).toBeVisible();
  
  // Stats visible
  await expect(page.getByText(/YEARS EXP/i)).toBeVisible();
  await expect(page.getByText(/PROJECTS DEPLOYED/i)).toBeVisible();
  
  // Image has grayscale filter initially
  const img = page.getByTestId('about-image');
  await expect(img).toHaveCSS('filter', /grayscale/);
  
  // On hover, grayscale removed
  await img.hover();
  await page.waitForTimeout(300);
  // Grayscale should be 0 or none
  ```

  **Commit**: YES
  - Message: `feat(about): add about section with scanning effect`
  - Files: `src/components/sections/AboutSection.tsx`

---

- [ ] 10. Work Section (Horizontal Scroll)

  **What to do**:
  - Create `src/components/sections/WorkSection.tsx`
  - Create `src/components/cards/WorkCard.tsx` - 3D tilt card component
  - Display "EXPERIENCE" title with "CAREER DATA LOG" badge
  - Implement horizontal scroll pinned section using GSAP ScrollTrigger
  - Each card has 3D tilt effect based on mouse position
  - Internal parallax: header at translateZ(50px), body at translateZ(30px), footer at translateZ(20px)

  **Content** (from resume.json work array):
  - Company name (Oceanic Tech → actual company names)
  - Job title badge
  - Date range
  - Description bullets
  - Technologies used tags

  **Horizontal Scroll Implementation**:
  - Container is sticky (pinned) to viewport
  - Vertical scroll maps to horizontal translation
  - Scroll progress 0 → 1 maps to x: 0% → -75%
  - "SCROLL TO SCAN" indicator in corner

  **3D Card Effect**:
  - `perspective: 1000px` on container
  - Mouse position relative to card center calculates rotateX/rotateY
  - Max rotation: ±15 degrees
  - Smooth transition on mouse move

  **Must NOT do**:
  - Add card flip animations
  - Make cards clickable (just hover effects)
  - Add snap scrolling

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Complex scroll animation + 3D effects
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: GSAP ScrollTrigger, 3D transforms

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 8, 9, 11-13)
  - **Blocks**: Task 16
  - **Blocked By**: Tasks 4, 5

  **References**:
  - `.sisyphus/mockup-specs.md` Section 6: Work Section - card design, 3D tilt specs, horizontal scroll
  - `src/data/resume.json` - work array (5 entries)
  - GSAP horizontal scroll: https://gsap.com/docs/v3/Plugins/ScrollTrigger/

  **Acceptance Criteria**:
  ```typescript
  // Playwright
  await page.goto('http://localhost:3000');
  await page.getByRole('link', { name: 'WORK' }).click();
  await page.waitForTimeout(1000);
  
  // Section title visible
  await expect(page.getByText(/EXPERIENCE/i)).toBeVisible();
  await expect(page.getByText(/CAREER DATA LOG/i)).toBeVisible();
  
  // Work cards visible (at least first one)
  await expect(page.getByText(/JPMorgan Chase/i)).toBeVisible();
  
  // Horizontal scroll works - scroll down moves cards left
  const firstCard = await page.getByTestId('work-card-0').boundingBox();
  await page.evaluate(() => window.scrollBy(0, 500));
  await page.waitForTimeout(500);
  const afterScroll = await page.getByTestId('work-card-0').boundingBox();
  expect(afterScroll.x).toBeLessThan(firstCard.x);
  ```

  **Commit**: YES
  - Message: `feat(work): add work section with horizontal scroll and 3D cards`
  - Files: `src/components/sections/WorkSection.tsx`, `src/components/cards/WorkCard.tsx`

---

- [ ] 11. Projects Section (Horizontal Scroll)

  **What to do**:
  - Create `src/components/sections/ProjectsSection.tsx`
  - Create `src/components/cards/ProjectCard.tsx` - HUD-style card
  - Display "BIOLUMINESCENCE" title (creative name for projects)
  - Implement horizontal scroll similar to Work section (x: 0% → -60%)
  - HUD card design with "SYSTEM_ONLINE" indicator, ID numbers

  **Hover Animation Sequence**:
  1. Status line pulses ("SYSTEM_ONLINE" indicator)
  2. Image scales up (scale-105) and transitions grayscale → color
  3. Description text opacity increases, shifts right
  4. Tech tags lift up in staggered wave (transitionDelay based on index)

  **Content** (from resume.json projects array):
  - Project title with external link icon
  - Description
  - Project image (grayscale by default)
  - Technologies as chips/tags
  - Links (GitHub, Demo, etc.)

  **Must NOT do**:
  - Add video previews
  - Make entire card clickable (just the links)
  - Add project filtering

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Complex hover animations + horizontal scroll
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Staggered animations, GSAP

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 8-10, 12, 13)
  - **Blocks**: Task 16
  - **Blocked By**: Tasks 4, 5

  **References**:
  - `.sisyphus/mockup-specs.md` Section 7: Projects Section - HUD card design, SYSTEM_ONLINE indicator, hover effects
  - `src/data/resume.json` - projects array (6 entries)

  **Acceptance Criteria**:
  ```typescript
  // Playwright
  await page.goto('http://localhost:3000');
  await page.getByRole('link', { name: 'PROJECTS' }).click();
  await page.waitForTimeout(1000);
  
  // Content visible
  await expect(page.getByText(/BIOLUMINESCENCE/i)).toBeVisible();
  await expect(page.getByText(/MockOwl/i)).toBeVisible();
  
  // Tech tags visible
  await expect(page.getByText(/Next.js/i).first()).toBeVisible();
  
  // Hover effect - image becomes color
  const projectCard = page.getByTestId('project-card-0');
  const projectImg = projectCard.locator('img');
  await expect(projectImg).toHaveCSS('filter', /grayscale/);
  await projectCard.hover();
  await page.waitForTimeout(500);
  // Filter should change
  ```

  **Commit**: YES
  - Message: `feat(projects): add projects section with HUD cards and hover effects`
  - Files: `src/components/sections/ProjectsSection.tsx`, `src/components/cards/ProjectCard.tsx`

---

- [ ] 12. Skills Section (Fish Simulation)

  **What to do**:
  - Create `src/components/sections/SkillsSection.tsx`
  - Create `src/components/canvas/FishSimulation.tsx` - Canvas 2D component
  - Create `src/lib/fishSimulation.ts` - Simulation logic
  - Display "SKILL ECOSYSTEM" title with "INTERACTIVE TECHNICAL ORGANISMS" subtitle
  - Implement autonomous fish agents representing skills

  **Fish Simulation Logic**:
  - Each skill = one fish agent
  - Max 30 fish on desktop, 15 on mobile
  - Movement: Constant velocity with random wander
  - Wall avoidance: Flip direction at container edges (80px padding)
  - Mouse repulsion: If cursor distance < 250px, add repulsion force vector
  - Fish orient (flip horizontally) based on movement direction
  - Animated tail (CSS triangle that wags)

  **Visual Design**:
  - Fish are pill/arrow shaped (like mockups)
  - Color-coded by skill category:
    - Language: Blue
    - Framework: Cyan
    - Tool: Gray
    - Design: Purple
    - AI: Green
  - Skill name displayed on fish body

  **Must NOT do**:
  - Use Three.js (use Canvas 2D)
  - Add flocking/boid algorithm
  - Make fish interactive (no clicking)
  - Add more than 30 fish

  **Recommended Agent Profile**:
  - **Category**: `ultrabrain`
    - Reason: Complex simulation logic requiring deep reasoning
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Canvas 2D, animation loops

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 8-11, 13)
  - **Blocks**: Task 16
  - **Blocked By**: Tasks 4, 5

  **References**:
  - `.sisyphus/mockup-specs.md` Section 8: Skills Section - fish shape, colors by category, movement specs
  - `src/data/resume.json` - skills array (55 skills with categories)
  - Canvas 2D animation: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Basic_animations

  **Acceptance Criteria**:
  ```typescript
  // Playwright
  await page.goto('http://localhost:3000');
  await page.evaluate(() => {
    const skills = document.querySelector('[data-testid="skills-section"]');
    skills?.scrollIntoView();
  });
  await page.waitForTimeout(1000);
  
  // Title visible
  await expect(page.getByText(/SKILL ECOSYSTEM/i)).toBeVisible();
  
  // Canvas exists
  await expect(page.getByTestId('fish-canvas')).toBeVisible();
  
  // Fish count reasonable (verify via data attribute or console)
  const fishCount = await page.evaluate(() => {
    return window.__fishCount || 0;
  });
  expect(fishCount).toBeGreaterThan(0);
  expect(fishCount).toBeLessThanOrEqual(30);
  
  // Mobile: fewer fish
  await page.setViewportSize({ width: 375, height: 667 });
  await page.waitForTimeout(500);
  const mobileFishCount = await page.evaluate(() => window.__fishCount || 0);
  expect(mobileFishCount).toBeLessThanOrEqual(15);
  ```

  **Commit**: YES
  - Message: `feat(skills): add fish simulation for skills visualization`
  - Files: `src/components/sections/SkillsSection.tsx`, `src/components/canvas/FishSimulation.tsx`, `src/lib/fishSimulation.ts`

---

- [ ] 13. Contact Section

  **What to do**:
  - Create `src/components/sections/ContactSection.tsx`
  - Create `src/components/cards/ContactCard.tsx` - Magnetic card component
  - Display "SAY HELLO" title with "UPLINK ACTIVE" badge
  - Show 4 contact cards: GitHub, LinkedIn, Twitter, Email
  - Cards have strong magnetic pull (strength: 50)
  - Hover reveals "CONNECT >>" text sliding from left
  - Add radar background animation (rotating/pulsing rings)
  - Footer with "SYSTEM VERSION 2.0 // 2026 CALVIN WONG"

  **Content** (from resume.json contact.social):
  - GitHub: Link to github.com/calvin-www
  - LinkedIn: Link to LinkedIn profile
  - Twitter/X: Link (even if navbar: false)
  - Email: mailto link

  **Magnetic Card Effect**:
  - Stronger than nav links (strength: 50 instead of 30)
  - Entire card translates toward cursor within bounding box

  **Connect Animation**:
  - On hover, "CONNECT >>" text slides in from left
  - Icon + platform name visible by default
  - Arrow indicates external link

  **Must NOT do**:
  - Add contact form
  - Include phone number display
  - Add multiple email options

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Magnetic effects, hover animations
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Framer Motion springs

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 8-12)
  - **Blocks**: Task 16
  - **Blocked By**: Tasks 4, 5

  **References**:
  - `.sisyphus/mockup-specs.md` Section 9: Contact Section - card layout, magnetic effect, CONNECT animation
  - `src/data/resume.json` - contact.social object

  **Acceptance Criteria**:
  ```typescript
  // Playwright
  await page.goto('http://localhost:3000');
  await page.getByRole('link', { name: 'CONTACT' }).click();
  await page.waitForTimeout(1000);
  
  // Title visible
  await expect(page.getByText(/SAY HELLO/i)).toBeVisible();
  await expect(page.getByText(/UPLINK ACTIVE/i)).toBeVisible();
  
  // Contact cards visible
  await expect(page.getByRole('link', { name: /GitHub/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /LinkedIn/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /Email/i })).toBeVisible();
  
  // Hover shows CONNECT text
  await page.getByTestId('contact-card-github').hover();
  await page.waitForTimeout(300);
  await expect(page.getByText(/CONNECT/i)).toBeVisible();
  
  // Footer visible
  await expect(page.getByText(/SYSTEM VERSION/i)).toBeVisible();
  await expect(page.getByText(/2026 CALVIN WONG/i)).toBeVisible();
  ```

  **Commit**: YES
  - Message: `feat(contact): add contact section with magnetic cards`
  - Files: `src/components/sections/ContactSection.tsx`, `src/components/cards/ContactCard.tsx`

---

### Wave 4: Polish & Integration

- [ ] 14. Shark Companion (3D)

  **What to do**:
  - Create `src/components/3d/SharkCompanion.tsx`
  - Use React Three Fiber to render shark model
  - Implement spring-based mouse following (stiffness: 40, damping: 25)
  - Calculate rotation based on travel direction
  - Add click "dash" animation (scale pulse + speed lines)
  - Emit bubble particles trailing behind during movement
  - Hide on mobile devices

  **Implementation Details**:
  - Use `@react-three/drei` useGLTF to load model
  - Position updates via Framer Motion useSpring
  - Rotation calculated from delta between current and previous position
  - Canvas overlays the entire page (pointer-events: none except for shark)

  **Dash Animation**:
  - Scale: 1 → 1.2 → 0.9 → 1
  - Speed lines: Trail elements that fade out
  - Small lunge in X direction relative to movement

  **Bubble Trail**:
  - Emit bubbles opposite to movement direction
  - Bubbles float up and fade out
  - Max 5-10 bubbles active at a time

  **Must NOT do**:
  - Add idle swimming animation
  - Make shark interact with fish
  - Add shark sound effects
  - Show shark on mobile

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: 3D rendering + spring physics
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: React Three Fiber, Framer Motion

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Tasks 15, 16)
  - **Blocks**: Task 17
  - **Blocked By**: Tasks 3, 6, 8

  **References**:
  - `public/models/shark.glb` - 3D model (from Task 3)
  - `.sisyphus/mockup-specs.md` Section 3: Shark Companion - line-art style, dimensions, features, bubble ring
  - React Three Fiber: https://docs.pmnd.rs/react-three-fiber
  - @react-three/drei useGLTF: https://drei.pmnd.rs/?path=/docs/loaders-gltf--docs

  **Acceptance Criteria**:
  ```typescript
  // Playwright - Desktop only
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(2000); // Wait for 3D to load
  
  // Shark canvas visible
  await expect(page.getByTestId('shark-canvas')).toBeVisible();
  
  // Shark follows mouse (approximately)
  await page.mouse.move(600, 400);
  await page.waitForTimeout(1000);
  // Shark should be somewhere near cursor (hard to test precisely)
  
  // Click triggers dash (verify animation class or scale change)
  await page.mouse.click(600, 400);
  await page.waitForTimeout(500);
  // Visual verification via screenshot
  
  // Mobile: shark hidden
  await page.setViewportSize({ width: 375, height: 667 });
  await expect(page.getByTestId('shark-canvas')).not.toBeVisible();
  ```

  **Commit**: YES
  - Message: `feat(shark): add 3D shark companion with spring physics`
  - Files: `src/components/3d/SharkCompanion.tsx`

---

- [ ] 15. Environmental Effects

  **What to do**:
  - Create `src/components/effects/ParallaxBubbles.tsx` - Background bubbles
  - Create `src/components/effects/OrganicBlobs.tsx` - Ambient blob shapes
  - Create `src/components/effects/CausticsOverlay.tsx` - Light mode sun rays
  - Implement mouse parallax for bubbles (larger bubbles move more)
  - Add scroll-linked movement for blobs

  **Parallax Bubbles**:
  - Generate 20-30 bubbles randomly on mount
  - Varying sizes (10px - 60px)
  - Larger bubbles have more parallax offset on mouse move
  - Bubbles rise slowly (top: 110% → -20%), wobble, rotate, fade

  **Organic Blobs**:
  - 3-5 large blurred colored shapes
  - Move slowly based on scroll position
  - Slight reaction to mouse position
  - Use CSS blur filter (50-100px)

  **Caustics Overlay (Light Mode Only)**:
  - SVG or CSS pattern simulating sun rays through water
  - Subtle animation (opacity pulse, slight movement)
  - Only visible in light mode

  **Must NOT do**:
  - Add fog/mist effects
  - Create water surface reflection
  - Add too many particles (performance)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Visual effects, parallax
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: CSS animations, parallax

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Tasks 14, 16)
  - **Blocks**: Task 17
  - **Blocked By**: Tasks 4, 8

  **References**:
  - `.sisyphus/mockup-specs.md` Section 10: Environmental Effects - bubble specs, blob specs, caustics overlay
  - CSS parallax techniques

  **Acceptance Criteria**:
  ```typescript
  // Playwright
  await page.goto('http://localhost:3000');
  
  // Bubbles exist
  const bubbles = await page.locator('[data-testid="bubble"]').count();
  expect(bubbles).toBeGreaterThan(10);
  
  // Blobs exist
  await expect(page.getByTestId('organic-blobs')).toBeVisible();
  
  // Caustics visible in light mode
  await expect(page.getByTestId('caustics-overlay')).toBeVisible();
  
  // Caustics hidden in dark mode
  await page.getByTestId('theme-toggle').click();
  await page.waitForTimeout(300);
  await expect(page.getByTestId('caustics-overlay')).not.toBeVisible();
  ```

  **Commit**: YES
  - Message: `feat(effects): add environmental effects (bubbles, blobs, caustics)`
  - Files: `src/components/effects/*.tsx`

---

- [ ] 16. Mobile Optimizations

  **What to do**:
  - Create `src/hooks/useIsMobile.ts` - Device detection hook
  - Update all sections for mobile layout
  - Convert horizontal scroll sections to vertical on mobile
  - Reduce fish count to 15 on mobile
  - Hide custom cursor on touch devices
  - Hide shark companion on mobile
  - Simplify/remove complex animations on mobile

  **Mobile Breakpoint**: <768px

  **Section Changes for Mobile**:
  - Hero: Stack vertically, smaller text
  - About: Stack image above text
  - Work: Vertical scroll, full-width cards
  - Projects: Vertical scroll, full-width cards
  - Skills: Reduced fish count, no mouse repulsion
  - Contact: Stack cards in 2x2 grid or vertical

  **Performance Optimizations**:
  - Use `will-change` sparingly
  - Disable parallax on mobile
  - Reduce animation complexity

  **Must NOT do**:
  - Add hamburger menu
  - Create completely different mobile design
  - Remove content on mobile

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Responsive design, mobile optimization
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Responsive Tailwind, mobile patterns

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Tasks 14, 15, 17)
  - **Blocks**: Task 18
  - **Blocked By**: Tasks 8-13

  **References**:
  - All section components
  - Tailwind responsive utilities: https://tailwindcss.com/docs/responsive-design

  **Acceptance Criteria**:
  ```typescript
  // Playwright - Mobile viewport
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('http://localhost:3000');
  
  // No custom cursor
  await expect(page.getByTestId('custom-cursor')).not.toBeVisible();
  
  // No shark
  await expect(page.getByTestId('shark-canvas')).not.toBeVisible();
  
  // All sections still accessible
  await expect(page.getByText(/CALVIN/i)).toBeVisible();
  await page.evaluate(() => document.querySelector('[data-testid="about-section"]')?.scrollIntoView());
  await expect(page.getByText(/DIGITAL ALCHEMIST/i)).toBeVisible();
  
  // Work section scrolls vertically
  await page.evaluate(() => document.querySelector('[data-testid="work-section"]')?.scrollIntoView());
  // Cards should be stacked vertically
  const workCards = await page.locator('[data-testid^="work-card-"]').count();
  expect(workCards).toBeGreaterThanOrEqual(3);
  ```

  **Commit**: YES
  - Message: `feat(mobile): add mobile optimizations and responsive layout`
  - Files: `src/hooks/useIsMobile.ts`, various component updates

---

- [ ] 17. Reduced Motion & Accessibility

  **What to do**:
  - Create `src/hooks/useReducedMotion.ts`
  - Add `prefers-reduced-motion` media query checks to all animations
  - Disable: Parallax, fish movement, shark following, bubbles
  - Keep: Basic transitions (opacity, color)
  - Ensure all interactive elements are keyboard accessible
  - Add proper ARIA labels
  - Test with screen reader

  **What to Disable with Reduced Motion**:
  - Custom cursor animation (show static)
  - Shark companion (hide entirely)
  - Fish simulation movement (show static fish)
  - Parallax effects
  - Bubble floating
  - Magnetic element movement

  **What to Keep**:
  - Basic hover color changes
  - Theme toggle
  - Navigation functionality
  - Content visibility

  **Must NOT do**:
  - Remove functionality (just animations)
  - Break keyboard navigation
  - Hide content

  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`
    - Reason: Cross-cutting concern, checks across components
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Accessibility patterns

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Task 16)
  - **Blocks**: Task 18
  - **Blocked By**: Tasks 14, 15

  **References**:
  - MDN prefers-reduced-motion: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
  - Framer Motion reduced motion: https://www.framer.com/motion/guide-accessibility/

  **Acceptance Criteria**:
  ```typescript
  // Playwright - Reduced motion
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('http://localhost:3000');
  
  // Shark hidden
  await expect(page.getByTestId('shark-canvas')).not.toBeVisible();
  
  // Custom cursor static or hidden
  // Fish static (verify no animation class)
  
  // Content still accessible
  await expect(page.getByText(/CALVIN/i)).toBeVisible();
  
  // Keyboard navigation works
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  const focused = await page.evaluate(() => document.activeElement?.tagName);
  expect(focused).toBe('A'); // Navigation link focused
  
  // Theme toggle still works
  await page.getByTestId('theme-toggle').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('html')).toHaveClass(/dark/);
  ```

  **Commit**: YES
  - Message: `feat(a11y): add reduced motion support and accessibility improvements`
  - Files: `src/hooks/useReducedMotion.ts`, various component updates

---

- [ ] 18. Playwright E2E Test Suite

  **What to do**:
  - Create `e2e/` directory structure
  - Create test files for each major feature
  - Set up Playwright config for local testing
  - Write comprehensive E2E tests covering all acceptance criteria

  **Test Files**:
  - `e2e/navigation.spec.ts` - Nav links, theme toggle
  - `e2e/sections.spec.ts` - All 6 sections render correctly
  - `e2e/cursor.spec.ts` - Custom cursor behavior
  - `e2e/depth-gauge.spec.ts` - Scroll depth tracking
  - `e2e/horizontal-scroll.spec.ts` - Work/Projects scroll
  - `e2e/mobile.spec.ts` - Mobile-specific tests
  - `e2e/accessibility.spec.ts` - Reduced motion, keyboard nav

  **Test Coverage**:
  - All sections visible and contain expected content
  - Navigation scrolls to correct sections
  - Theme toggle works and persists
  - Custom cursor appears/disappears correctly
  - Depth gauge updates with scroll
  - Horizontal scroll sections work
  - Mobile layout is correct
  - Reduced motion disables animations

  **Must NOT do**:
  - Test animation frame-by-frame (too flaky)
  - Test exact pixel positions (use approximate)
  - Create tests that require user interaction

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Comprehensive test suite
  - **Skills**: [`playwright`]
    - `playwright`: E2E testing expertise

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential (final task)
  - **Blocks**: None (final deliverable)
  - **Blocked By**: Tasks 16, 17

  **References**:
  - Playwright docs: https://playwright.dev/docs/intro
  - All acceptance criteria from previous tasks

  **Acceptance Criteria**:
  ```bash
  # All tests pass
  bunx playwright test
  # Assert: All tests pass (exit code 0)
  
  # Test report generated
  ls playwright-report/
  # Assert: Report files exist
  ```

  **Commit**: YES
  - Message: `test(e2e): add comprehensive Playwright test suite`
  - Files: `e2e/*.spec.ts`, `playwright.config.ts`

---

## Commit Strategy

| After Task | Message | Files | Verification |
|------------|---------|-------|--------------|
| 1 | `feat(setup): initialize portfolio v2 with dependencies and structure` | package.json, tailwind.config.ts, src/app/page.tsx | `bun run dev` starts |
| 2 | `chore(assets): copy portfolio assets to public directory` | public/* | Files exist |
| 3 | `feat(3d): add low-poly shark model` | public/models/shark.glb | File exists |
| 4 | `feat(theme): add dark mode with flashlight effect` | contexts, components | Theme toggles |
| 5 | `feat(layout): add navigation with magnetic effect and HUD styling` | layout components | Nav visible |
| 6 | `feat(cursor): add custom sonar cursor with spring physics` | cursor components | Cursor follows |
| 7 | `feat(depth): add scroll-linked depth gauge with ocean zones` | depth components | Gauge updates |
| 8 | `feat(hero): add hero section with parallax and radar decoration` | HeroSection | Hero renders |
| 9 | `feat(about): add about section with scanning effect` | AboutSection | About renders |
| 10 | `feat(work): add work section with horizontal scroll and 3D cards` | WorkSection, WorkCard | Scroll works |
| 11 | `feat(projects): add projects section with HUD cards and hover effects` | ProjectsSection, ProjectCard | Scroll works |
| 12 | `feat(skills): add fish simulation for skills visualization` | SkillsSection, FishSimulation | Fish move |
| 13 | `feat(contact): add contact section with magnetic cards` | ContactSection, ContactCard | Cards render |
| 14 | `feat(shark): add 3D shark companion with spring physics` | SharkCompanion | Shark follows |
| 15 | `feat(effects): add environmental effects (bubbles, blobs, caustics)` | effects components | Effects visible |
| 16 | `feat(mobile): add mobile optimizations and responsive layout` | various | Mobile works |
| 17 | `feat(a11y): add reduced motion support and accessibility improvements` | hooks, components | A11y works |
| 18 | `test(e2e): add comprehensive Playwright test suite` | e2e/* | Tests pass |

---

## Success Criteria

### Verification Commands
```bash
# Development server runs
bun run dev
# Expected: Server starts on localhost:3000

# Build succeeds
bun run build
# Expected: Build completes without errors

# Type check passes
bunx tsc --noEmit
# Expected: No type errors

# E2E tests pass
bunx playwright test
# Expected: All tests pass

# Lighthouse performance
# Expected: Performance score >80
```

### Final Checklist
- [ ] All 6 sections render with resume.json data
- [ ] Custom cursor works on desktop
- [ ] Shark companion follows mouse
- [ ] Fish simulation runs smoothly
- [ ] Depth gauge shows correct zones
- [ ] Dark mode with flashlight effect works
- [ ] Horizontal scroll sections work
- [ ] Mobile layout is correct
- [ ] Reduced motion disables animations
- [ ] All Playwright tests pass
- [ ] Build succeeds
- [ ] No TypeScript errors
