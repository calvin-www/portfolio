"use client";

/**
 * v2 — "Desk"
 * The portfolio as a desktop OS: draggable app windows, a dock, desktop icons,
 * a menu bar and a right-click menu. Below 760px it becomes an iOS-style home
 * screen with full-screen sheets. All content comes from resume.json via V2_DATA.
 *
 * Recreated in React from the design handoff (18 Desk). The proprietary <x-dc>
 * runtime is intentionally not ported — only the design, tokens, and behavior.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { V2_DATA, type DeskProject } from "@/data/adapters/v2";

const MOBILE_BREAKPOINT = 760;
const GEOM_KEY = "desk-win-geom";

type WinType = "about" | "finder" | "contact" | "project";

interface WinState {
  type: WinType;
  open: boolean;
  x: number;
  y: number;
  z: number;
  w: number;
  project?: DeskProject;
}

interface SheetState {
  type: "about" | "project" | "contact";
  project?: DeskProject;
}

const ACCENT_LIGHT = "#0a84ff";
const ACCENT_DARK = "#4fa8ff";

function palette(dark: boolean) {
  return {
    accent: dark ? ACCENT_DARK : ACCENT_LIGHT,
    deskBg: dark
      ? "#181a1f"
      : "#ece7dd",
    dot: dark ? "rgba(255,255,255,.05)" : "rgba(0,0,0,.05)",
    text: dark ? "#e7e9ec" : "#201c15",
    winBase: dark ? "#22252b" : "#fffdf8",
    winBar: dark ? "#2c3037" : "#f4efe6",
    divider: dark ? "#33373f" : "#eee7da",
    chipBg: dark ? "#33373f" : "#f0ebe1",
    hoverBg: dark ? "#2c3037" : "#f2ede3",
    winBorder: dark ? "#33373f" : "rgba(0,0,0,.06)",
    winShadow: dark ? "0 24px 60px rgba(0,0,0,.5)" : "0 24px 60px rgba(0,0,0,.22)",
    barBg: dark ? "rgba(28,30,35,.72)" : "rgba(255,253,248,.72)",
    barBorder: dark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.08)",
    barText: dark ? "#e7e9ec" : "#3a3a30",
    dockBg: dark ? "rgba(40,43,49,.7)" : "rgba(255,253,248,.7)",
    dockBorder: dark ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.06)",
    dockShadow: dark ? "0 12px 30px rgba(0,0,0,.35)" : "0 12px 30px rgba(0,0,0,.12)",
    menuBg: dark ? "rgba(40,43,49,.92)" : "rgba(255,253,248,.95)",
    menuBorder: dark ? "rgba(255,255,255,.1)" : "rgba(0,0,0,.08)",
    menuShadow: dark ? "0 16px 40px rgba(0,0,0,.5)" : "0 16px 40px rgba(0,0,0,.2)",
    menuHover: dark ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.06)",
    deskLabel: dark ? "#e7e9ec" : "#201c15",
    deskLabelBg: dark ? "rgba(0,0,0,.25)" : "rgba(255,255,255,.4)",
    phoneBg: dark
      ? "linear-gradient(180deg,#252834,#14161b)"
      : "linear-gradient(180deg,#ffe4d0,#ece7dd)",
    sheetBg: dark ? "#22252b" : "#fffdf8",
  };
}

const mono = "'IBM Plex Mono', ui-monospace, monospace";

const DESK_ICONS = [
  { id: "finder", icon: "📁", label: "Projects", color: "#ffd9a0" },
  { id: "about", icon: "📄", label: "about-me.txt", color: "#e8e8e8" },
  { id: "contact", icon: "✉️", label: "Contact", color: "#c2e0ff" },
] as const;

const DEFAULT_WINS: Record<string, WinState> = {
  about: { type: "about", open: true, x: 60, y: 70, z: 6, w: 440 },
  finder: { type: "finder", open: true, x: 430, y: 150, z: 5, w: 560 },
};

export function Desk() {
  const [mounted, setMounted] = useState(false);
  const [dark, setDark] = useState(false);
  const [vw, setVw] = useState(1200);
  const [clock, setClock] = useState("");
  const [zTop, setZTop] = useState(10);
  const [order, setOrder] = useState<string[]>(["about", "finder"]);
  const [wins, setWins] = useState<Record<string, WinState>>(() => ({
    about: { ...DEFAULT_WINS.about },
    finder: { ...DEFAULT_WINS.finder },
  }));
  const [sheet, setSheet] = useState<SheetState | null>(null);
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null);
  const dragRef = useRef<{ id: string; dx: number; dy: number } | null>(null);
  const winsRef = useRef(wins);
  winsRef.current = wins;

  // Mount: seed theme, clock, viewport, restore saved geometry.
  useEffect(() => {
    setMounted(true);
    setDark(window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false);
    setVw(window.innerWidth);
    const fmt = () =>
      setClock(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    fmt();
    const clk = setInterval(fmt, 15000);
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener("resize", onResize);

    try {
      const saved = JSON.parse(localStorage.getItem(GEOM_KEY) || "{}");
      if (saved && typeof saved === "object") {
        setWins((s) => {
          const next = { ...s };
          Object.keys(saved).forEach((id) => {
            if (next[id]) next[id] = { ...next[id], x: saved[id].x, y: saved[id].y };
          });
          return next;
        });
      }
    } catch {
      /* ignore */
    }
    return () => {
      clearInterval(clk);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const saveGeom = useCallback(() => {
    try {
      const g: Record<string, { x: number; y: number }> = {};
      const w = winsRef.current;
      Object.keys(w).forEach((id) => (g[id] = { x: w[id].x, y: w[id].y }));
      localStorage.setItem(GEOM_KEY, JSON.stringify(g));
    } catch {
      /* ignore */
    }
  }, []);

  const raise = useCallback((id: string) => {
    setZTop((z) => {
      const nz = z + 1;
      setWins((s) => ({ ...s, [id]: { ...s[id], z: nz } }));
      return nz;
    });
  }, []);

  const openWin = useCallback((id: string, cfg: WinState) => {
    setZTop((z) => {
      const nz = z + 1;
      setOrder((o) => (o.includes(id) ? o : [...o, id]));
      setWins((s) => {
        const base = s[id] ?? cfg;
        return { ...s, [id]: { ...base, open: true, z: nz } };
      });
      return nz;
    });
  }, []);

  const closeWin = useCallback((id: string) => {
    setWins((s) => ({ ...s, [id]: { ...s[id], open: false } }));
  }, []);

  const openProject = useCallback(
    (p: DeskProject) => {
      const id = "proj-" + p.id;
      const cx = 200 + Math.round(Math.random() * 260);
      const cy = 120 + Math.round(Math.random() * 120);
      openWin(id, { type: "project", open: true, x: cx, y: cy, z: 0, w: 480, project: p });
    },
    [openWin]
  );

  const startDrag = useCallback(
    (id: string, e: React.PointerEvent) => {
      e.preventDefault();
      raise(id);
      const w = winsRef.current[id];
      dragRef.current = { id, dx: e.clientX - w.x, dy: e.clientY - w.y };
    },
    [raise]
  );

  const onMove = useCallback((e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    setWins((s) => ({
      ...s,
      [d.id]: { ...s[d.id], x: e.clientX - d.dx, y: Math.max(38, e.clientY - d.dy) },
    }));
  }, []);

  const onUp = useCallback(() => {
    if (dragRef.current) {
      dragRef.current = null;
      saveGeom();
    }
  }, [saveGeom]);

  const tidyWindows = useCallback(() => {
    try {
      localStorage.removeItem(GEOM_KEY);
    } catch {
      /* ignore */
    }
    setWins((s) => ({
      ...s,
      about: { ...DEFAULT_WINS.about, z: s.about?.z ?? 6 },
      finder: { ...DEFAULT_WINS.finder, z: s.finder?.z ?? 5 },
    }));
    setMenu(null);
  }, []);

  const openWinById = useCallback(
    (id: string) => {
      if (id === "finder") openWin("finder", { ...DEFAULT_WINS.finder });
      else if (id === "about") openWin("about", { ...DEFAULT_WINS.about });
      else if (id === "contact")
        openWin("contact", { type: "contact", open: true, x: 340, y: 200, z: 0, w: 420 });
    },
    [openWin]
  );

  const p = palette(dark);
  const isMobile = vw < MOBILE_BREAKPOINT;
  const { about, projects, contacts, brand, brandEmoji } = V2_DATA;

  // Active window title (highest z among open).
  const openIds = order.filter((id) => wins[id]?.open);
  const activeId = [...openIds].sort((a, b) => wins[a].z - wins[b].z).pop();
  const activeWin = activeId ? wins[activeId] : null;
  const titleMap: Record<WinType, string> = {
    about: "About This Me",
    finder: "Projects",
    contact: "Contact",
    project: "Preview",
  };
  const activeTitle = activeWin
    ? activeWin.type === "project"
      ? activeWin.project!.name
      : titleMap[activeWin.type]
    : "Finder";

  if (!mounted) {
    // Neutral shell to avoid hydration mismatch (theme/clock/vw are client-only).
    return <div style={{ position: "fixed", inset: 0, background: "#ece7dd" }} />;
  }

  const filename = (id: string, w: WinState) =>
    w.type === "project"
      ? w.project!.name.toLowerCase().replace(/\s+/g, "-") + ".app"
      : id === "about"
        ? "about-me.txt"
        : id === "finder"
          ? "Finder"
          : id + ".app";

  return (
    <div
      className="desk-root"
      onPointerMove={onMove}
      onPointerUp={onUp}
      onContextMenu={(e) => {
        if (isMobile) return;
        e.preventDefault();
        setMenu({ x: Math.min(e.clientX, vw - 210), y: e.clientY });
      }}
      onClick={() => menu && setMenu(null)}
      style={{
        position: "fixed",
        inset: 0,
        userSelect: "none",
        color: p.text,
        background: p.deskBg,
        backgroundImage: isMobile
          ? p.phoneBg
          : `radial-gradient(circle at 1px 1px, ${p.dot} 1px, transparent 0)`,
        backgroundSize: isMobile ? undefined : "26px 26px",
        overflow: "hidden",
        fontFamily: "'Space Grotesk', system-ui, sans-serif",
      }}
    >
      <DeskStyles accent={p.accent} hoverBg={p.hoverBg} menuHover={p.menuHover} />

      {!isMobile && (
        <>
          {/* MENU BAR */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 34,
              zIndex: 99999,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0 18px",
              fontSize: 13,
              background: p.barBg,
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              borderBottom: `1px solid ${p.barBorder}`,
              color: p.barText,
            }}
          >
            <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
              <span style={{ fontWeight: 700, color: p.accent, fontSize: 14 }}>
                {brandEmoji} {brand}
              </span>
              <span style={{ fontWeight: 600, opacity: 0.9 }}>{activeTitle}</span>
            </div>
            <div
              style={{
                display: "flex",
                gap: 16,
                alignItems: "center",
                fontFamily: mono,
                fontSize: 12.5,
              }}
            >
              <span
                onClick={() => setDark((d) => !d)}
                style={{ cursor: "pointer", opacity: 0.75 }}
              >
                {dark ? "☀︎" : "☾"}
              </span>
              <span style={{ opacity: 0.55 }}>◍ 100%</span>
              <span style={{ opacity: 0.9 }}>{clock}</span>
            </div>
          </div>

          {/* DESKTOP ICONS */}
          <div
            style={{
              position: "absolute",
              top: 52,
              right: 22,
              display: "flex",
              flexDirection: "column",
              gap: 22,
              alignItems: "center",
              zIndex: 1,
            }}
          >
            {DESK_ICONS.map((d) => (
              <div
                key={d.id}
                onClick={() => openWinById(d.id)}
                style={{
                  width: 80,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 14,
                    background: d.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 28,
                    boxShadow: "0 6px 16px rgba(0,0,0,.18)",
                  }}
                >
                  {d.icon}
                </div>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    textAlign: "center",
                    color: p.deskLabel,
                    background: p.deskLabelBg,
                    padding: "1px 7px",
                    borderRadius: 5,
                  }}
                >
                  {d.label}
                </span>
              </div>
            ))}
          </div>

          {/* WINDOWS */}
          {openIds.map((id) => {
            const w = wins[id];
            return (
              <div
                key={id}
                style={{
                  position: "absolute",
                  left: w.x,
                  top: w.y,
                  width: w.w,
                  zIndex: w.z,
                  background: p.winBase,
                  color: p.text,
                  borderRadius: 13,
                  overflow: "hidden",
                  boxShadow: p.winShadow,
                  border: `1px solid ${p.winBorder}`,
                  animation: "deskWinIn .18s ease",
                }}
                onPointerDown={() => raise(id)}
              >
                <div
                  onPointerDown={(e) => startDrag(id, e)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "11px 14px",
                    cursor: "grab",
                    background: p.winBar,
                    borderBottom: `1px solid ${p.divider}`,
                  }}
                >
                  <TrafficDot color="#ff5f57" onClick={() => closeWin(id)} />
                  <TrafficDot color="#febc2e" onClick={() => closeWin(id)} />
                  <TrafficDot color="#28c840" />
                  <span
                    style={{ fontSize: 12.5, fontFamily: mono, marginLeft: 8, opacity: 0.7 }}
                  >
                    {filename(id, w)}
                  </span>
                </div>
                <div style={{ maxHeight: "70vh", overflow: "auto" }}>
                  {w.type === "about" && <AboutBody p={p} about={about} />}
                  {w.type === "finder" && (
                    <FinderBody p={p} projects={projects} onOpen={openProject} />
                  )}
                  {w.type === "project" && w.project && (
                    <ProjectBody p={p} project={w.project} />
                  )}
                  {w.type === "contact" && <ContactBody p={p} contacts={contacts} />}
                </div>
              </div>
            );
          })}

          {/* DOCK */}
          <div
            style={{
              position: "absolute",
              bottom: 16,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: 12,
              padding: "10px 16px",
              zIndex: 99998,
              background: p.dockBg,
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              borderRadius: 18,
              border: `1px solid ${p.dockBorder}`,
              boxShadow: p.dockShadow,
            }}
          >
            {[
              { icon: "📁", color: "#ffd9a0", dot: p.accent, act: () => openWinById("finder") },
              { icon: "📄", color: "#e8e8e8", dot: p.accent, act: () => openWinById("about") },
              {
                icon: brandEmoji,
                color: "#c9efe3",
                dot: "transparent",
                act: () => openProject(projects[0]),
              },
              { icon: "✉️", color: "#c2e0ff", dot: p.accent, act: () => openWinById("contact") },
            ].map((d, i) => (
              <div
                key={i}
                className="desk-dock-item"
                onClick={d.act}
                style={{
                  position: "relative",
                  width: 50,
                  height: 50,
                  borderRadius: 13,
                  background: d.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 25,
                  cursor: "pointer",
                }}
              >
                {d.icon}
                <span
                  style={{
                    position: "absolute",
                    bottom: -7,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background: d.dot,
                  }}
                />
              </div>
            ))}
          </div>

          {/* CONTEXT MENU */}
          {menu && (
            <div
              style={{
                position: "absolute",
                left: menu.x,
                top: menu.y,
                zIndex: 99997,
                width: 196,
                padding: 6,
                borderRadius: 11,
                background: p.menuBg,
                color: p.text,
                border: `1px solid ${p.menuBorder}`,
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                boxShadow: p.menuShadow,
              }}
            >
              {[
                { label: "New Window", key: "About", act: () => openWinById("about") },
                { label: "Open Projects", key: "⌘O", act: () => openWinById("finder") },
                {
                  label: dark ? "Light Mode" : "Dark Mode",
                  key: "☾",
                  act: () => {
                    setDark((d) => !d);
                    setMenu(null);
                  },
                },
                { label: "Tidy Up Windows", key: "⌘K", act: tidyWindows },
              ].map((m, i) => (
                <div
                  key={i}
                  className="desk-menu-row"
                  onClick={(e) => {
                    e.stopPropagation();
                    m.act();
                    if (m.label !== (dark ? "Light Mode" : "Dark Mode")) setMenu(null);
                  }}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 26,
                    padding: "8px 14px",
                    fontSize: 13.5,
                    cursor: "pointer",
                    borderRadius: 6,
                  }}
                >
                  <span>{m.label}</span>
                  <span style={{ opacity: 0.45, fontFamily: mono, fontSize: 11 }}>{m.key}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* MOBILE — iOS home screen */}
      {isMobile && (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "15px 24px 4px",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            <span>{clock}</span>
            <span
              onClick={() => setDark((d) => !d)}
              style={{ cursor: "pointer", letterSpacing: ".12em" }}
            >
              {dark ? "☀︎" : "☾"} ◍ ▮
            </span>
          </div>
          <div style={{ padding: "22px 26px 8px" }}>
            <div
              style={{ fontSize: 12, fontFamily: mono, opacity: 0.6, letterSpacing: ".14em" }}
            >
              {brandEmoji} {about.name.toUpperCase()}
            </div>
            <div
              style={{
                fontSize: 27,
                fontWeight: 700,
                letterSpacing: "-.02em",
                marginTop: 6,
                lineHeight: 1.1,
              }}
            >
              {about.role}
            </div>
          </div>
          <div
            style={{
              flex: 1,
              overflow: "auto",
              padding: "18px 18px 12px",
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: "22px 8px",
              alignContent: "start",
            }}
          >
            {[
              {
                icon: "😎",
                name: "About",
                color: dark ? "#33373f" : "#e8e8e8",
                act: () => setSheet({ type: "about" }),
              },
              ...projects.map((pr) => ({
                icon: pr.icon,
                name: pr.name,
                color: pr.color,
                act: () => setSheet({ type: "project", project: pr }),
              })),
              {
                icon: "✉️",
                name: "Contact",
                color: "#c2e0ff",
                act: () => setSheet({ type: "contact" }),
              },
            ].map((a, i) => (
              <div
                key={i}
                onClick={a.act}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 7,
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 16,
                    background: a.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 29,
                    boxShadow: "0 6px 14px rgba(0,0,0,.16)",
                  }}
                >
                  {a.icon}
                </div>
                <span
                  style={{
                    fontSize: 11.5,
                    fontWeight: 500,
                    textAlign: "center",
                    opacity: 0.9,
                  }}
                >
                  {a.name}
                </span>
              </div>
            ))}
          </div>
          <div
            style={{
              margin: "0 16px 20px",
              padding: "13px 16px",
              borderRadius: 26,
              display: "flex",
              justifyContent: "space-around",
              background: p.dockBg,
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: `1px solid ${p.dockBorder}`,
              boxShadow: p.dockShadow,
            }}
          >
            {[
              { icon: "😎", color: dark ? "#33373f" : "#e8e8e8", act: () => setSheet({ type: "about" }) },
              {
                icon: brandEmoji,
                color: "#c9efe3",
                act: () => setSheet({ type: "project", project: projects[0] }),
              },
              { icon: "✉️", color: "#c2e0ff", act: () => setSheet({ type: "contact" }) },
            ].map((d, i) => (
              <div
                key={i}
                onClick={d.act}
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 15,
                  background: d.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 26,
                  cursor: "pointer",
                }}
              >
                {d.icon}
              </div>
            ))}
          </div>

          {/* MOBILE SHEET */}
          {sheet && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 500,
                display: "flex",
                flexDirection: "column",
                background: p.sheetBg,
                color: p.text,
                animation: "deskSheetUp .28s ease",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "15px 20px",
                  borderBottom: `1px solid ${p.divider}`,
                }}
              >
                <span style={{ width: 40 }} />
                <span style={{ fontFamily: mono, fontSize: 12.5, opacity: 0.6 }}>
                  {sheet.type === "project"
                    ? sheet.project!.name.toLowerCase().replace(/\s+/g, "-") + ".app"
                    : sheet.type === "about"
                      ? "about-me.txt"
                      : "contact"}
                </span>
                <span
                  onClick={() => setSheet(null)}
                  style={{
                    width: 40,
                    textAlign: "right",
                    fontSize: 15,
                    fontWeight: 600,
                    color: p.accent,
                    cursor: "pointer",
                  }}
                >
                  Done
                </span>
              </div>
              <div style={{ flex: 1, overflow: "auto" }}>
                {sheet.type === "about" && <AboutBody p={p} about={about} />}
                {sheet.type === "project" && sheet.project && (
                  <ProjectBody p={p} project={sheet.project} />
                )}
                {sheet.type === "contact" && <ContactBody p={p} contacts={contacts} />}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

type Pal = ReturnType<typeof palette>;

function TrafficDot({ color, onClick }: { color: string; onClick?: () => void }) {
  return (
    <span
      onClick={
        onClick
          ? (e) => {
              e.stopPropagation();
              onClick();
            }
          : undefined
      }
      style={{
        width: 12,
        height: 12,
        borderRadius: "50%",
        background: color,
        cursor: onClick ? "pointer" : "default",
      }}
    />
  );
}

function AboutBody({ p, about }: { p: Pal; about: typeof V2_DATA.about }) {
  return (
    <div style={{ padding: "30px 32px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 20 }}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 18,
            background: p.accent,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 38,
          }}
        >
          {about.emoji}
        </div>
        <div>
          <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: "-.02em" }}>
            {about.name}
          </div>
          <div style={{ fontSize: 15, opacity: 0.65 }}>{about.role}</div>
        </div>
      </div>
      {about.paragraphs.map((para, i) => (
        <div
          key={i}
          style={{
            fontSize: 15.5,
            lineHeight: 1.65,
            opacity: 0.85,
            marginTop: i === 0 ? 0 : 14,
          }}
        >
          {para}
        </div>
      ))}
      <div
        style={{
          display: "flex",
          gap: 10,
          marginTop: 22,
          flexWrap: "wrap",
          fontFamily: mono,
          fontSize: 13,
        }}
      >
        <a
          href={`mailto:${about.email}`}
          style={{ background: p.accent, color: "#fff", padding: "9px 16px", borderRadius: 24 }}
        >
          Hire me
        </a>
        <a
          href={about.resumeUrl}
          target="_blank"
          rel="noreferrer"
          style={{ background: p.chipBg, padding: "9px 16px", borderRadius: 24 }}
        >
          Résumé.pdf
        </a>
        <a
          href={about.githubUrl}
          target="_blank"
          rel="noreferrer"
          style={{ background: p.chipBg, padding: "9px 16px", borderRadius: 24 }}
        >
          GitHub
        </a>
      </div>
    </div>
  );
}

function FinderBody({
  p,
  projects,
  onOpen,
}: {
  p: Pal;
  projects: DeskProject[];
  onOpen: (pr: DeskProject) => void;
}) {
  return (
    <div style={{ padding: "18px 20px" }}>
      <div
        style={{
          fontFamily: mono,
          fontSize: 11.5,
          opacity: 0.5,
          letterSpacing: ".1em",
          marginBottom: 14,
        }}
      >
        PROJECTS — {projects.length} ITEMS
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
        {projects.map((pr) => (
          <div
            key={pr.id}
            className="desk-finder-item"
            onClick={() => onOpen(pr)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
              padding: "14px 8px",
              borderRadius: 12,
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 13,
                background: pr.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 26,
              }}
            >
              {pr.icon}
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, textAlign: "center" }}>{pr.name}</div>
            <div
              style={{ fontFamily: mono, fontSize: 10, opacity: 0.5, textAlign: "center" }}
            >
              {pr.tag}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectBody({ p, project }: { p: Pal; project: DeskProject }) {
  return (
    <div>
      <div
        style={{
          height: 150,
          background: project.color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 64,
        }}
      >
        {project.icon}
      </div>
      <div style={{ padding: "24px 28px" }}>
        <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-.01em" }}>
          {project.name}
        </div>
        <div style={{ fontFamily: mono, fontSize: 12, color: p.accent, marginTop: 6 }}>
          {project.stack}
        </div>
        <div style={{ fontSize: 15, lineHeight: 1.6, opacity: 0.85, marginTop: 14 }}>
          {project.desc}
        </div>

        {project.highlights.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: 20,
              marginTop: 20,
              paddingTop: 16,
              borderTop: `1px solid ${p.divider}`,
            }}
          >
            {project.highlights.map((h, i) => (
              <div key={i}>
                <div style={{ fontSize: 22, fontWeight: 700, color: p.accent }}>{h.value}</div>
                <div style={{ fontSize: 12, opacity: 0.55 }}>{h.label}</div>
              </div>
            ))}
          </div>
        )}

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 7,
            marginTop: 18,
            paddingTop: 16,
            borderTop: `1px solid ${p.divider}`,
            fontFamily: mono,
            fontSize: 11,
          }}
        >
          {project.tech.map((t) => (
            <span
              key={t}
              style={{ background: p.chipBg, padding: "5px 10px", borderRadius: 20, opacity: 0.9 }}
            >
              {t}
            </span>
          ))}
        </div>

        {project.links.length > 0 && (
          <div style={{ display: "flex", gap: 10, marginTop: 18, fontFamily: mono, fontSize: 13 }}>
            {project.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noreferrer"
                style={{
                  background: p.accent,
                  color: "#fff",
                  padding: "9px 16px",
                  borderRadius: 24,
                }}
              >
                {l.type}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ContactBody({ p, contacts }: { p: Pal; contacts: typeof V2_DATA.contacts }) {
  return (
    <div style={{ padding: "30px 32px" }}>
      <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 6 }}>Let&apos;s talk.</div>
      <div style={{ fontSize: 15, opacity: 0.7, lineHeight: 1.6, marginBottom: 22 }}>
        Open to engineering roles — and always up for a good build.
      </div>
      {contacts.map((c) => (
        <a
          key={c.label}
          href={c.href}
          target="_blank"
          rel="noreferrer"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "14px 4px",
            borderBottom: `1px solid ${p.divider}`,
          }}
        >
          <span style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <span style={{ fontSize: 20 }}>{c.icon}</span>
            <span style={{ fontSize: 15, fontWeight: 500 }}>{c.label}</span>
          </span>
          <span style={{ fontFamily: mono, fontSize: 13, color: p.accent }}>{c.value}</span>
        </a>
      ))}
    </div>
  );
}

function DeskStyles({
  accent,
  hoverBg,
  menuHover,
}: {
  accent: string;
  hoverBg: string;
  menuHover: string;
}) {
  return (
    <style>{`
      .desk-root a { color: inherit; text-decoration: none; }
      .desk-root a:hover { opacity: .8; }
      .desk-root ::-webkit-scrollbar { width: 10px; height: 10px; }
      .desk-root ::-webkit-scrollbar-thumb {
        background: rgba(120,120,120,.4); border-radius: 6px;
        border: 2px solid transparent; background-clip: padding-box;
      }
      @keyframes deskWinIn { from { opacity: 0; transform: scale(.96); } to { opacity: 1; transform: scale(1); } }
      @keyframes deskSheetUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
      .desk-dock-item { transition: transform .15s ease; }
      .desk-dock-item:hover { transform: translateY(-8px) scale(1.08); }
      .desk-finder-item { transition: background .15s ease; }
      .desk-finder-item:hover { background: ${hoverBg}; }
      .desk-menu-row:hover { background: ${menuHover}; }
    `}</style>
  );
}
