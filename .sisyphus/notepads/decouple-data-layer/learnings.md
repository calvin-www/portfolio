# Learnings - Decouple Data Layer

## Conventions & Patterns

## Task: Extract resume.tsx to resume.json

### Completed Successfully ✓

**File Created:** `/home/calvin/projects/github/portfolio/resume.json` (15KB)

**Data Extracted:**
- All primitive fields: name, initials, url, location, locationLink, description, summary, avatarUrl
- Skills array: 56 items
- Navbar: 1 item with icon converted to "home" string
- Contact object with 5 social links (icons converted to strings: github, linkedin, x, youtube, email)
- Work: 5 entries with full descriptions
- Education: 2 entries
- Projects: 6 entries with links (icons converted to strings: github, youtube, globe)
- Hackathons: 4 entries with JSX descriptions cleaned to plain text

**Key Transformations Applied:**
1. Icon references converted from React components to string identifiers:
   - `Icons.github` → `"github"`
   - `Icons.linkedin` → `"linkedin"`
   - `Icons.x` → `"x"`
   - `Icons.youtube` → `"youtube"`
   - `Icons.email` → `"email"`
   - `Icons.globe` → `"globe"`
   - `HomeIcon` → `"home"`

2. JSX descriptions in hackathons cleaned:
   - Removed `<>`, `</>` wrapper tags
   - Removed `<AnimatedShinyText>` component tags
   - Preserved text content with `\n` for line breaks
   - Example: "Won CapitalOne's \"Best Financial hack\"\nDeveloped a financial chatbot..."

3. Resume URL extracted from hero-section.tsx line 79-80:
   - Added as root-level field: `resumeUrl`
   - Value: `https://drive.google.com/file/d/1aIbBhANoJIwF2334zYdCqqV9EuuxxN5h/view?usp=sharing`

**Validation:**
- JSON syntax verified with Node.js JSON.parse()
- All required fields present
- No JSX elements or React components in output
- No `as const` assertion in JSON

**Pattern Discovered:**
- Icon components in resume.tsx use `Icons.*` pattern from @/components/icons
- Hackathon descriptions use JSX fragments with optional AnimatedShinyText wrapper
- All data is JSON-serializable after icon/JSX transformation

## Task: Create TypeScript Hydration Layer (resume.tsx)

### Completed Successfully ✓

**File Created:** `/home/calvin/projects/github/portfolio/src/data/resume.tsx` (74 lines)

**Purpose:** Hydration layer that imports JSON data and converts string identifiers to React components

**Key Implementation Details:**

1. **Icon Mapping Object:**
   ```typescript
   const iconMap: Record<string, any> = {
     github: Icons.github,
     linkedin: Icons.linkedin,
     x: Icons.x,
     youtube: Icons.youtube,
     email: Icons.email,
     globe: Icons.globe,
     home: HomeIcon,
   };
   ```

2. **Social Icons Hydration:**
   - Used `Object.fromEntries` + `Object.entries` pattern
   - Maps over social object entries
   - Replaces string icon with component from iconMap
   - Preserves all other properties with spread operator

3. **Navbar Icons Hydration:**
   - Simple array map over navbar items
   - Direct icon replacement from iconMap

4. **Project Links Hydration:**
   - Nested map: projects → links
   - Creates JSX element: `<IconComponent className="size-3" />`
   - Matches original pattern exactly

5. **Hackathon Descriptions Hydration:**
   - Splits description by `\n` to get lines
   - Checks if first line starts with "Won" (award indicator)
   - If award: wraps first line in `<AnimatedShinyText>`, rest as plain text in fragment
   - If no award: returns original description unchanged
   - Pattern:
     ```tsx
     <>
       <AnimatedShinyText>{lines[0]}</AnimatedShinyText>
       {lines.slice(1).join("\n")}
     </>
     ```

6. **Export Pattern:**
   - Spreads resumeData as base
   - Overrides specific sections (contact, navbar, projects, hackathons)
   - Uses `as const` assertion for type safety

**File Extension Decision:**
- Initially attempted `.ts` but JSX syntax requires `.tsx`
- TypeScript files with JSX elements MUST use `.tsx` extension
- This is a TypeScript/React requirement, not a choice

**Verification:**
- Build passes: `npm run build` ✓
- No TypeScript errors
- layout.tsx imports successfully
- All hydration patterns match original resume.tsx structure

**Pattern Discovered:**
- Hydration layer pattern: JSON data + component mapping = full React data structure
- Separation of concerns: JSON for data, TypeScript for component wiring
- Icon string identifiers enable JSON serialization while maintaining type safety


## Task: Replace Hardcoded Resume URL in hero-section.tsx

### Completed Successfully ✓

**File Modified:** `/home/calvin/projects/github/portfolio/src/components/hero-section.tsx`

**Change Applied:**
- Lines 79-80: Replaced hardcoded Google Drive URL with `DATA.resumeUrl`
- Before:
  ```typescript
  onClick={() => window.open(
      'https://drive.google.com/file/d/1aIbBhANoJIwF2334zYdCqqV9EuuxxN5h/view?usp=sharing'
      , '_blank')}
  ```
- After:
  ```typescript
  onClick={() => window.open(DATA.resumeUrl, '_blank')}
  ```

**Verification:**
- DATA import already present on line 4 ✓
- Build passes: `npm run build` ✓
- No TypeScript errors ✓
- Single-line onClick handler is cleaner and more maintainable ✓

**Pattern Discovered:**
- Decoupling hardcoded URLs from components enables centralized data management
- DATA object from resume.tsx hydration layer provides single source of truth
- This completes the data layer decoupling for resume URL references


## Task: Verify TypeScript Config

### Completed Successfully ✓

**Verification:** `tsconfig.json` already has `resolveJsonModule: true` on line 11

**No changes needed** - configuration was already correct for JSON imports.

This setting allows TypeScript to:
- Import JSON files as modules
- Provide type inference for JSON data
- Enable `import resumeData from '../../resume.json'` syntax


## Task: Final Build and Type Verification

### Completed Successfully ✓

**Build Verification:**
- ✓ `npm run build` succeeds with no errors
- ✓ All pages generated successfully (5/5)
- ✓ Static content prerendered correctly
- ✓ No TypeScript errors
- ✓ Only pre-existing ESLint warnings in particles.tsx (unrelated to this work)

**Data Flow Verification:**
- ✓ resume.json is valid JSON
- ✓ resumeUrl field present and accessible
- ✓ All data fields intact (skills, projects, work, education, hackathons)
- ✓ Icon string identifiers preserved in JSON
- ✓ DATA import works in layout.tsx
- ✓ DATA import works in hero-section.tsx
- ✓ hero-section.tsx uses DATA.resumeUrl correctly

**Architecture Achieved:**
```
resume.json (root)           → Pure data layer (JSON-serializable)
    ↓
src/data/resume.tsx          → Hydration layer (adds React components)
    ↓
DATA export                  → Consumed by app components
    ↓
layout.tsx, hero-section.tsx → Use DATA object
```

**Benefits:**
1. Data decoupled from presentation logic
2. JSON can be edited without touching TypeScript
3. Resume URL centralized in data layer
4. Type safety maintained through hydration layer
5. Original component API unchanged (DATA object shape preserved)

**All Tasks Complete!**
