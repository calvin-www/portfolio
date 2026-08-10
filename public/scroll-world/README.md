# Scroll-world assets

`/v3` runs with **no assets in this folder**. Until real clips land here, each
scene is drawn by the procedural CSS dive renderer
(`src/components/v3/CssDive.tsx`), which uses the same config, copy and pacing
the video chain would. Generating assets is an upgrade, not a prerequisite.

## What goes here

Copy the `assets/` tree the scroll-world skill produces into this folder, so the
final layout is:

```
public/scroll-world/
├── stills/
│   ├── scene_0.png  …  scene_6.png
├── stills_mobile/            # only if you generate the 9:16 chain
│   ├── scene_0_m.png  …  scene_6_m.png
└── vid/
    ├── dive_0.mp4  …  dive_6.mp4          # one per scene (7)
    ├── connector_0.mp4  …  connector_5.mp4 # one per seam (6 = scenes - 1)
    ├── dive_0_m.mp4  …                     # 9:16 variants, optional
    └── connector_0_m.mp4  …
```

Then flip `HAS_ASSETS` to `true` in `src/data/adapters/v3.ts`. The paths are
already wired to these names — no other code change is needed. `VideoChain`
takes over from `CssDive`, and the CSS dive stays on as the
`prefers-reduced-motion` and missing-file fallback.

The scene order is defined by `sections` in `src/data/adapters/v3.ts`:

| # | id | Scene |
|---|----|-------|
| 0 | `arrival` | Name, location, intro |
| 1 | `rice` | Rice University |
| 2 | `classics` | Classics National Championship |
| 3 | `work` | The 5 roles |
| 4 | `projects` | The 6 builds |
| 5 | `hackathons` | The 4 hackathons |
| 6 | `contact` | Email, socials, résumé |

## Generating them

This has to be run locally — it needs paid CLIs, an interactive OAuth login, and
tools that aren't in the CI container.

**Prerequisites**

- `ffmpeg` and `ffprobe` — `brew install ffmpeg` (or your distro's package)
- Python 3 with Pillow — `pip install Pillow`
- The Monid CLI, with an API key and a funded balance (the primary backend)
- The Higgsfield CLI, with credits — `higgsfield auth login` (opens a browser)

**Steps**

1. Open a local Claude Code session in this repo. `.claude/settings.json` already
   registers the marketplace, so the plugin installs with:
   `/plugin install scroll-world@scroll-world`
2. Invoke the skill and work through its interview. Give it the seven scenes
   above, and the accents already chosen in `v3.ts` so the generated art matches
   the copy layer.
3. **Choose desktop-only for the first pass.** The 9:16 mobile chain is a second
   camera chain rendered natively in portrait, not a crop, and roughly doubles
   the spend. Decide on it after seeing the desktop result.
4. Copy the generated `assets/` into `public/scroll-world/`, flip `HAS_ASSETS`,
   and run `bun run dev`.

**Cost.** Monid is pay-per-clip with no subscription; the skill's own reference
point is roughly **$27 for a 6-scene 1080p desktop chain**. This is seven scenes,
so budget somewhat above that — and roughly double again if you add the portrait
chain.

## Keeping the engine in sync

The skill copies its own `references/scrub-engine.js` into a project on every
build. `src/components/v3/VideoChain.tsx` deliberately mirrors that engine's
config contract (`sections[]` with `still`/`clip`/`clipMobile`, a top-level
`connectors[]`, and the `--sw-*` CSS tokens). If a regenerated engine differs,
prefer adopting its file over hand-editing `VideoChain.tsx`.
