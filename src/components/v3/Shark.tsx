import { cn } from "@/lib/utils";

/**
 * The site's shark: a single-stroke line drawing in the current text color.
 *
 * Every path carries `pathLength={1}` so the CSS draw-in animation in
 * globals.css can use a unit dash without measuring. The body is one closed
 * path traced nose → dorsal fin → tail → belly → nose, so the draw order
 * reads naturally. Fin, gills, mouth and eye are separate so they can appear
 * after the outline.
 */
export function Shark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 400 220"
      fill="none"
      stroke="currentColor"
      strokeWidth={6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      className={cn("shark", className)}
    >
      {title ? <title>{title}</title> : null}
      <path
        className="shark-body"
        pathLength={1}
        d="M32 98 C45 80 78 68 120 66 C140 65 155 64 165 62 C178 44 198 24 218 12 C222 36 234 56 254 64 C290 70 315 80 330 90 C350 80 375 45 388 20 C386 60 372 92 356 106 C365 125 372 148 370 166 C358 158 338 140 318 128 C280 150 230 156 190 154 C125 152 62 146 42 128 Q26 112 32 98 Z"
      />
      <path className="shark-fin" pathLength={1} d="M115 140 C135 168 158 190 182 204 C186 182 192 162 204 150" />
      <path className="shark-gill" pathLength={1} d="M100 94 q-7 12 0 24" />
      <path className="shark-gill" pathLength={1} d="M112 92 q-7 13 0 26" />
      <path className="shark-gill" pathLength={1} d="M124 92 q-7 13 0 26" />
      <path className="shark-mouth" pathLength={1} d="M46 120 q12 9 26 4" />
      <circle className="shark-eye" cx="58" cy="96" r="5.5" fill="currentColor" stroke="none" />
    </svg>
  );
}
