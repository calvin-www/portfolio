# Portfolio

Use a patched Node.js 24 runtime (24.22.1 or newer within 24.x) and npm 11.12.1. `package-lock.json` is the authoritative dependency lockfile; Vercel explicitly installs with `npm ci`.

```sh
npm ci
npm run build
npm start
```

Bun remains the existing unit-test runner. With Bun 1.4.4 installed, run:

```sh
bun test src
```

The Playwright suite runs with `npm run test:e2e`. Its default configuration starts a development server on port 3000. For production verification, point a separate Playwright configuration at an isolated `next start` server after building.

The old `bun.lock` was removed because Bun lock generation/migration failed in the patch environment; retaining it would let package-manager autodetection install stale security dependencies. Do not restore it without generating and validating it against the intended manifest.

The PostCSS 8.5.31 override addresses advisory-affected versions pinned by Next.js 15.5.28; the project's direct PostCSS uses the same version. Revisit the override when Next's upstream pin includes the fixes. The Tailwind 3 dependency tree uses `postcss-selector-parser` 6.1.5, the maintainer's security backport for GHSA-rj75-hqrm-r3gf. npm's advisory range may continue to flag that patched 6.x version until its metadata is updated; see the [maintainer's release notes](https://github.com/postcss/postcss-selector-parser/releases).
