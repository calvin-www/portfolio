export interface Fish {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  skill: string;
  category: string;
  width: number;
  height: number;
  color: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  language: "#3182CE",
  framework: "#00B5D8",
  tool: "#718096",
  design: "#805AD5",
  ai: "#38A169",
};

const FISH_SPEED = 1.5;
const WALL_PADDING = 80;
const MOUSE_REPULSION_RADIUS = 250;
const MOUSE_REPULSION_STRENGTH = 8;

export function createFish(
  skill: string,
  category: string,
  canvasWidth: number,
  canvasHeight: number
): Fish {
  const angle = Math.random() * Math.PI * 2;
  const speed = FISH_SPEED * (0.5 + Math.random() * 0.5);
  
  return {
    id: `${skill}-${Math.random()}`,
    x: WALL_PADDING + Math.random() * (canvasWidth - WALL_PADDING * 2),
    y: WALL_PADDING + Math.random() * (canvasHeight - WALL_PADDING * 2),
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    skill,
    category,
    width: 80 + skill.length * 4,
    height: 30,
    color: CATEGORY_COLORS[category] || CATEGORY_COLORS.tool,
  };
}

export function updateFish(
  fish: Fish,
  canvasWidth: number,
  canvasHeight: number,
  mouseX: number | null,
  mouseY: number | null
): Fish {
  let { x, y, vx, vy } = fish;

  const wander = 0.1;
  vx += (Math.random() - 0.5) * wander;
  vy += (Math.random() - 0.5) * wander;

  const speed = Math.sqrt(vx * vx + vy * vy);
  if (speed > FISH_SPEED) {
    vx = (vx / speed) * FISH_SPEED;
    vy = (vy / speed) * FISH_SPEED;
  }
  if (speed < FISH_SPEED * 0.3) {
    vx = (vx / speed) * FISH_SPEED * 0.5;
    vy = (vy / speed) * FISH_SPEED * 0.5;
  }

  if (x < WALL_PADDING) vx = Math.abs(vx);
  if (x > canvasWidth - WALL_PADDING) vx = -Math.abs(vx);
  if (y < WALL_PADDING) vy = Math.abs(vy);
  if (y > canvasHeight - WALL_PADDING) vy = -Math.abs(vy);

  if (mouseX !== null && mouseY !== null) {
    const dx = x - mouseX;
    const dy = y - mouseY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist < MOUSE_REPULSION_RADIUS && dist > 0) {
      const force = (MOUSE_REPULSION_RADIUS - dist) / MOUSE_REPULSION_RADIUS;
      vx += (dx / dist) * force * MOUSE_REPULSION_STRENGTH * 0.1;
      vy += (dy / dist) * force * MOUSE_REPULSION_STRENGTH * 0.1;
    }
  }

  x += vx;
  y += vy;

  return { ...fish, x, y, vx, vy };
}

export function drawFish(
  ctx: CanvasRenderingContext2D,
  fish: Fish,
  time: number
): void {
  const { x, y, vx, width, height, skill, color } = fish;
  
  const facingRight = vx > 0;
  const tailWag = Math.sin(time * 0.01 + fish.x) * 5;

  ctx.save();
  ctx.translate(x, y);
  if (!facingRight) ctx.scale(-1, 1);

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(0, 0, width / 2, height / 2, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(-width / 2, 0);
  ctx.lineTo(-width / 2 - 15, -10 + tailWag);
  ctx.lineTo(-width / 2 - 15, 10 + tailWag);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(width / 4, -height / 6, 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.beginPath();
  ctx.arc(width / 4 - 8, -height / 6, 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "white";
  ctx.font = "bold 10px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  
  if (!facingRight) {
    ctx.scale(-1, 1);
  }
  ctx.fillText(skill.toUpperCase(), 0, 2);

  ctx.restore();
}
