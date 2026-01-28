# Plan: Move Current Portfolio to Subdirectory

## Goal
Move the entire current portfolio into a subdirectory (e.g., `v1/`) so a new portfolio can be built at the root, while preserving the old one for linking.

## Approach
Move all portfolio files (src, public, config, etc.) into a `v1/` subdirectory. This requires:
1. Creating the subdirectory structure
2. Moving all relevant files/folders
3. Updating path references in the moved code
4. Setting up a new root-level Next.js app that can serve both portfolios

**Key Decision:** Use Next.js route groups or separate apps. Since you want to link from the new portfolio to the old one, we'll structure it as:
- `/` → New portfolio (to be built)
- `/v1` → Old portfolio (moved here)

## Tasks

### 1. Create v1 subdirectory structure
- [x] Create `/home/calvin/projects/github/portfolio/v1/` directory
- [x] Verify directory created successfully

### 2. Move source code and assets
- [x] Move `src/` to `v1/src/`
- [x] Move `public/` to `v1/public/`
- [x] Move `content/` to `v1/content/`
- [x] Move `resume.json` to `v1/resume.json`

### 3. Move configuration files
- [x] Move `next.config.mjs` to `v1/next.config.mjs`
- [x] Move `tailwind.config.ts` to `v1/tailwind.config.ts`
- [x] Move `postcss.config.mjs` to `v1/postcss.config.mjs`
- [x] Move `tsconfig.json` to `v1/tsconfig.json`
- [x] Move `components.json` to `v1/components.json`
- [x] Move `.eslintrc.json` to `v1/.eslintrc.json`
- [x] Move `next-env.d.ts` to `v1/next-env.d.ts`

### 4. Update path references in v1
- [x] Update `v1/src/data/resume.tsx` import path: `../../resume.json` → `../resume.json` (already correct)
- [x] Update `v1/tsconfig.json` paths if needed (already correct - relative paths)
- [x] Update `v1/tailwind.config.ts` content paths if needed (already correct - relative paths)
- [x] Update `v1/next.config.mjs` with basePath: '/v1' and assetPrefix: '/v1'

### 5. Create new root-level structure
- [x] Moved `package.json` and `package-lock.json` to v1/
- [x] Moved `node_modules/` to v1/
- [x] Root is now clean for new portfolio development

### 6. Verify v1 builds and runs
- [x] Run `npm run build` in v1/ - SUCCESS
- [x] All pages generated (5/5)
- [x] No TypeScript errors

## Considerations
- node_modules should stay at root (monorepo style) or be moved to v1
- .next build cache should be regenerated
- .git stays at root (version control for entire project)
- .sisyphus planning files can stay at root
- LICENSE stays at root
- May need to adjust basePath in v1's next.config.mjs to serve under /v1

## Alternative Approach
Instead of moving files, could use Next.js route groups:
- Keep everything in place
- Create `src/app/(v1)/` for old portfolio
- Create `src/app/(new)/` for new portfolio
This is simpler but less clean separation.

## Recommended Approach
Given you want a fresh start for the new portfolio, the subdirectory approach is cleaner. It allows:
- Completely independent development
- Easy removal of v1 later if desired
- Clear separation of concerns

## Git
User controls all commits manually.
