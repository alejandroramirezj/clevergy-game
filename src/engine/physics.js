import { TILE, LW, LH } from "../config/constants.js";

export const grid = Array.from({ length: LH }, () => Array(LW).fill("."));

export function rct(x, y, w, h, ch) {
  for (let j = y; j < y + h; j++) {
    for (let i = x; i < x + w; i++) {
      if (grid[j] && grid[j][i] !== undefined) {
        grid[j][i] = ch;
      }
    }
  }
}

export function initLevelGrid() {
  // Ground and platforms
  rct(0, 15, 44, 3, "#");
  rct(28, 12, 3, 1, "=");
  rct(33, 10, 3, 1, "=");
  rct(38, 12, 3, 1, "=");
  rct(44, 8, 3, 10, "#"); // THE TALL WALL
  rct(47, 15, 33, 3, "#");
  rct(56, 12, 3, 1, "=");
  rct(62, 10, 3, 1, "=");
  rct(70, 12, 4, 1, "=");
  rct(85, 11, 2, 1, "="); // pit island (pit 80..91)
  rct(92, 15, 122, 3, "#");
  rct(100, 12, 3, 1, "=");
  rct(106, 10, 3, 1, "=");
  rct(52, 14, 2, 1, "^");
  rct(96, 14, 2, 1, "^");
  rct(118, 12, 3, 1, "=");
  rct(128, 12, 3, 1, "=");
}

export function tileAt(px, py) {
  const i = Math.floor(px / TILE);
  const j = Math.floor(py / TILE);
  if (i < 0 || i >= LW || j < 0 || j >= LH) {
    return j >= LH ? "." : "#";
  }
  return grid[j][i];
}

export const solidAt = (px, py) => tileAt(px, py) === "#";

export function moveX(e, dx, isPlayer = false, arenaBounds = null) {
  e.x += dx;
  const dir = Math.sign(dx);
  if (dir !== 0) {
    const edge = dir > 0 ? e.x + e.w : e.x;
    for (let py = e.y + 2; py < e.y + e.h; py += TILE / 2) {
      if (solidAt(edge, py) || solidAt(edge, e.y + e.h - 2)) {
        e.x = dir > 0 ? Math.floor(edge / TILE) * TILE - e.w - 0.01 : (Math.floor(edge / TILE) + 1) * TILE + 0.01;
        return true;
      }
    }
  }

  if (isPlayer && arenaBounds && arenaBounds.active && !arenaBounds.dead) {
    if (e.x < arenaBounds.L) {
      e.x = arenaBounds.L;
      return true;
    }
    if (e.x + e.w > arenaBounds.R) {
      e.x = arenaBounds.R - e.w;
      return true;
    }
  }

  if (e.x < 0) {
    e.x = 0;
    return true;
  }
  if (e.x + e.w > LW * TILE) {
    e.x = LW * TILE - e.w;
    return true;
  }
  return false;
}

export function moveY(e, dy, allowOneWay, printed = []) {
  e.y += dy;
  if (dy > 0) {
    const foot = e.y + e.h;
    const prevFoot = foot - dy;
    for (let px = e.x + 3; px <= e.x + e.w - 3; px += (e.w - 6) / 2) {
      if (solidAt(px, foot)) {
        e.y = Math.floor(foot / TILE) * TILE - e.h;
        e.vy = 0;
        return true;
      }
      if (allowOneWay) {
        if (tileAt(px, foot) === "=") {
          const sy = Math.floor(foot / TILE) * TILE;
          if (prevFoot <= sy + 10) {
            e.y = sy - e.h;
            e.vy = 0;
            return true;
          }
        }
        for (const pl of printed) {
          if (px >= pl.x && px <= pl.x + pl.w && foot >= pl.y && prevFoot <= pl.y + 10) {
            e.y = pl.y - e.h;
            e.vy = 0;
            return true;
          }
        }
      }
    }
  } else if (dy < 0) {
    const head = e.y;
    for (let px = e.x + 3; px <= e.x + e.w - 3; px += (e.w - 6) / 2) {
      if (solidAt(px, head)) {
        e.y = (Math.floor(head / TILE) + 1) * TILE + 0.01;
        e.vy = 0;
        return true;
      }
    }
  }
  return false;
}

export function touchingWall(e) {
  const l = solidAt(e.x - 2, e.y + 6) || solidAt(e.x - 2, e.y + e.h - 6);
  const r = solidAt(e.x + e.w + 2, e.y + 6) || solidAt(e.x + e.w + 2, e.y + e.h - 6);
  return l ? -1 : (r ? 1 : 0);
}

export const rectsHit = (x1, y1, w1, h1, x2, y2, w2, h2) =>
  x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
