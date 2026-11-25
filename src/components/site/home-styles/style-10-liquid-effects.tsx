"use client";

import { useEffect, useRef } from "react";

/* ------------------------------------------------------------------ */
/*  Shared helpers                                                     */
/* ------------------------------------------------------------------ */

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Runs `onChange(visible)` whenever the element enters/leaves the viewport or the tab visibility changes. */
function observeActivity(element: Element, onChange: (active: boolean) => void) {
  let inView = false;
  const emit = () => onChange(inView && !document.hidden);
  const io = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    emit();
  }, { rootMargin: "120px" });
  io.observe(element);
  document.addEventListener("visibilitychange", emit);
  return () => {
    io.disconnect();
    document.removeEventListener("visibilitychange", emit);
  };
}

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ------------------------------------------------------------------ */
/*  Liquid metal (WebGL fragment shader)                               */
/* ------------------------------------------------------------------ */

const VERTEX_SHADER = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAGMENT_SHADER = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uHover;
uniform vec3 uRipple;
uniform float uWarm;
uniform float uScale;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = m * p;
    a *= 0.5;
  }
  return v;
}

float field(vec2 p) {
  float t = uTime * 0.07;
  vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, 1.3) - t));
  vec2 r = vec2(fbm(p + 1.7 * q + vec2(1.7, 9.2) + t * 0.8),
                fbm(p + 1.7 * q + vec2(8.3, 2.8) - t * 0.6));
  float v = fbm(p + 1.6 * r);

  vec2 d = p - uMouse;
  v += uHover * 0.26 * exp(-dot(d, d) * 4.0);

  float rl = length(p - uRipple.xy);
  float age = uRipple.z;
  v += 0.06 * sin(rl * 20.0 - age * 7.0) * exp(-rl * 2.0) * exp(-age * 1.1) * step(0.0, age);
  return v;
}

vec2 studio(vec2 q) {
  float horizon = smoothstep(-0.4, 0.5, q.y);
  float bands = 0.5 + 0.5 * sin(q.y * 6.0 + sin(q.x * 1.7) * 1.4);
  bands = smoothstep(0.25, 0.92, bands);
  float sx = (q.x - 0.6) * 2.6;
  float soft = exp(-sx * sx) * smoothstep(-0.2, 0.7, q.y);
  float ry = (q.y + 0.2) * 9.0;
  float rim = exp(-ry * ry);
  return vec2(0.02 + 0.5 * horizon * bands + 0.75 * soft, rim);
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  vec2 p = uv * uScale;

  float e = 0.012;
  float h = field(p);
  float hx = field(p + vec2(e, 0.0));
  float hy = field(p + vec2(0.0, e));
  vec3 n = normalize(vec3((h - hx) / e * 0.85, (h - hy) / e * 0.85, 1.0));
  vec3 r = reflect(vec3(0.0, 0.0, -1.0), n);
  vec2 q = r.xy * 1.1 + uv * vec2(0.25, 0.5);

  float disp = 0.04;
  vec2 sR = studio(q + n.xy * disp);
  vec2 sG = studio(q);
  vec2 sB = studio(q - n.xy * disp);
  vec3 c = vec3(sR.x, sG.x, sB.x);

  float fres = pow(1.0 - n.z, 2.0);
  vec3 col = mix(vec3(0.012, 0.014, 0.02), vec3(0.9, 0.93, 0.98), clamp(c, 0.0, 1.25));
  col += vec3(1.0, 0.64, 0.28) * sG.y * uWarm * 0.8;
  col += vec3(0.5, 0.58, 0.72) * fres * 0.55;

  float vig = smoothstep(1.3, 0.2, length(uv * vec2(0.8, 1.0)));
  col *= mix(0.3, 1.0, vig);
  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn("[liquid-metal] shader error", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function LiquidMetalCanvas({
  className,
  warm = 0.85,
  scale = 1.55,
  resolution = 0.55,
}: {
  className?: string;
  warm?: number;
  scale?: number;
  resolution?: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, depth: false, powerPreference: "high-performance" });
    const markFallback = () => canvas.setAttribute("data-fallback", "true");
    if (!gl) return markFallback();

    const vs = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    const program = gl.createProgram();
    if (!vs || !fs || !program) return markFallback();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return markFallback();
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const u = {
      res: gl.getUniformLocation(program, "uRes"),
      time: gl.getUniformLocation(program, "uTime"),
      mouse: gl.getUniformLocation(program, "uMouse"),
      hover: gl.getUniformLocation(program, "uHover"),
      ripple: gl.getUniformLocation(program, "uRipple"),
      warm: gl.getUniformLocation(program, "uWarm"),
      scale: gl.getUniformLocation(program, "uScale"),
    };
    gl.uniform1f(u.warm, warm);
    gl.uniform1f(u.scale, scale);

    const reduce = prefersReducedMotion();
    const pointer = { x: 0.35, y: 0.05, tx: 0.35, ty: 0.05, hover: 0, thover: 0 };
    const ripple = { x: 0, y: 0, start: -100 };
    const start = performance.now();
    let raf = 0;
    let active = false;

    const draw = (now: number) => {
      const time = reduce ? 14 : (now - start) / 1000 + 4;
      pointer.x += (pointer.tx - pointer.x) * 0.06;
      pointer.y += (pointer.ty - pointer.y) * 0.06;
      pointer.hover += (pointer.thover - pointer.hover) * 0.04;
      gl.uniform2f(u.res, canvas.width, canvas.height);
      gl.uniform1f(u.time, time);
      gl.uniform2f(u.mouse, pointer.x, pointer.y);
      gl.uniform1f(u.hover, pointer.hover);
      gl.uniform3f(u.ripple, ripple.x, ripple.y, (now - ripple.start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const loop = (now: number) => {
      draw(now);
      raf = active ? requestAnimationFrame(loop) : 0;
    };

    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const k = Math.min(resolution, 1100 / Math.max(w, 1)) * Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(2, Math.round(w * k));
      canvas.height = Math.max(2, Math.round(h * k));
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (!active || reduce) draw(performance.now());
    };

    const toField = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      const inside = clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;
      return {
        inside,
        x: ((clientX - rect.left - rect.width / 2) / rect.height) * scale,
        y: (-(clientY - rect.top - rect.height / 2) / rect.height) * scale,
      };
    };

    const onMove = (event: globalThis.PointerEvent) => {
      if (reduce) return;
      const f = toField(event.clientX, event.clientY);
      pointer.thover = f.inside ? 1 : 0;
      if (f.inside) {
        pointer.tx = f.x;
        pointer.ty = f.y;
      }
    };
    const onDown = (event: globalThis.PointerEvent) => {
      if (reduce) return;
      const f = toField(event.clientX, event.clientY);
      if (!f.inside) return;
      ripple.x = f.x;
      ripple.y = f.y;
      ripple.start = performance.now();
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });

    const stopObserving = observeActivity(canvas, (next) => {
      active = next && !reduce;
      if (active && !raf) raf = requestAnimationFrame(loop);
    });

    return () => {
      active = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      stopObserving();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buffer);
    };
  }, [warm, scale, resolution]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}

/* ------------------------------------------------------------------ */
/*  Particle morph (2D canvas, pseudo-3D)                              */
/* ------------------------------------------------------------------ */

export type MorphShape = "cloud" | "facades" | "cladding" | "stairs" | "displays";

function buildShape(shape: MorphShape, count: number) {
  const rand = mulberry32(shape.length * 7919 + count);
  const out = new Float32Array(count * 3);
  const set = (i: number, x: number, y: number, z: number) => {
    out[i * 3] = x;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = z;
  };

  for (let i = 0; i < count; i++) {
    const r = rand();
    if (shape === "cloud") {
      const u = rand() * Math.PI * 2;
      const v = Math.acos(2 * rand() - 1);
      const rad = 0.35 + Math.cbrt(rand()) * 0.75;
      set(i, rad * Math.sin(v) * Math.cos(u), rad * Math.cos(v), rad * Math.sin(v) * Math.sin(u));
    } else if (shape === "facades") {
      // Diamond lattice facade with a frame and a relief layer.
      const W = 0.78;
      if (r < 0.16) {
        const t = rand() * 4;
        const side = Math.floor(t);
        const s = (t - side) * 2 - 1;
        const pts = [[s * W, 1.02], [W, s * 1.02], [s * W, -1.02], [-W, s * 1.02]][side];
        set(i, pts[0], pts[1], 0);
      } else {
        let x = 0;
        let y = 0;
        do {
          const k = Math.round((rand() * 2 - 1) * 7) * 0.26;
          y = rand() * 2 - 1;
          x = rand() < 0.5 ? k - y * 0.75 : k + y * 0.75;
        } while (Math.abs(x) > W);
        set(i, x, y, rand() < 0.3 ? 0.14 : (rand() - 0.5) * 0.04);
      }
    } else if (shape === "cladding") {
      // Fluted column with capitals.
      const ribs = 18;
      if (r < 0.14) {
        const theta = rand() * Math.PI * 2;
        const y = rand() < 0.5 ? -1.05 : 1.05;
        const rad = 0.5 + rand() * 0.16;
        set(i, rad * Math.cos(theta), y, rad * Math.sin(theta));
      } else {
        const rib = Math.round(rand() * ribs);
        const theta = ((rib + (rand() - 0.5) * 0.3) / ribs) * Math.PI * 2;
        const rad = 0.46 + 0.05 * Math.cos(theta * ribs);
        set(i, rad * Math.cos(theta), rand() * 2 - 1, rad * Math.sin(theta));
      }
    } else if (shape === "stairs") {
      // Helical stair: stringers, handrail, treads and balusters.
      const steps = 26;
      const turns = Math.PI * 3.3;
      const inner = 0.3;
      const outer = 0.86;
      let t = rand();
      let rad = outer;
      let lift = 0;
      if (r < 0.26) rad = outer;
      else if (r < 0.46) { rad = outer; lift = 0.2; }
      else if (r < 0.62) rad = inner;
      else if (r < 0.84) { t = Math.round(t * steps) / steps; rad = inner + rand() * (outer - inner); }
      else { t = Math.round(t * steps) / steps; rad = outer; lift = rand() * 0.2; }
      const theta = t * turns;
      set(i, rad * Math.cos(theta), -1 + 1.8 * t + lift, rad * Math.sin(theta));
    } else {
      // Vitrine: glass case edges, plinth, shelves and jewel glints.
      const X = 0.62;
      const Z = 0.4;
      const box = (y0: number, y1: number, x: number, z: number) => {
        const edge = Math.floor(rand() * 12);
        const s = rand() * 2 - 1;
        const yy = y0 + (y1 - y0) * (s * 0.5 + 0.5);
        const sx = rand() < 0.5 ? -x : x;
        const sz = rand() < 0.5 ? -z : z;
        const sy = rand() < 0.5 ? y0 : y1;
        if (edge < 4) return [sx, yy, sz];
        if (edge < 8) return [s * x, sy, sz];
        return [sx, sy, s * z];
      };
      let p: number[];
      if (r < 0.45) p = box(-0.2, 0.95, X, Z);
      else if (r < 0.7) p = box(-1, -0.24, X + 0.06, Z + 0.06);
      else if (r < 0.9) p = [(rand() * 2 - 1) * X, rand() < 0.5 ? 0.2 : 0.58, (rand() * 2 - 1) * Z];
      else {
        const cx = [-0.3, 0, 0.3][Math.floor(rand() * 3)];
        const shelf = rand() < 0.5 ? 0.2 : 0.58;
        p = [cx + (rand() - 0.5) * 0.12, shelf + rand() * 0.12, (rand() - 0.5) * 0.12];
      }
      set(i, p[0], p[1], p[2]);
    }
  }
  return out;
}

export function ParticleMorph({ shape, className }: { shape: MorphShape; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const api = useRef<{ setShape: (next: MorphShape) => void } | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = prefersReducedMotion();
    const count = window.innerWidth < 700 ? 1100 : 2000;
    const cache = new Map<MorphShape, Float32Array>();
    const getShape = (s: MorphShape) => {
      let pts = cache.get(s);
      if (!pts) {
        pts = buildShape(s, count);
        cache.set(s, pts);
      }
      return pts;
    };

    const pos = new Float32Array(getShape("cloud"));
    const vel = new Float32Array(count * 3);
    let target = getShape("cloud");
    const pointer = { x: -9999, y: -9999, rot: 0, trot: 0 };
    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let active = false;
    const start = performance.now();

    const render = (now: number) => {
      const time = (now - start) / 1000;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "lighter";

      pointer.rot += (pointer.trot - pointer.rot) * 0.05;
      const a = reduce ? 0.6 : time * 0.28 + pointer.rot;
      const cosA = Math.cos(a);
      const sinA = Math.sin(a);
      const tilt = 0.22;
      const cosB = Math.cos(tilt);
      const sinB = Math.sin(tilt);
      const S = Math.min(width, height) * 0.4;
      const cx = width / 2;
      const cy = height / 2;
      const repel = Math.min(width, height) * 0.13;

      for (let i = 0; i < count; i++) {
        const ix = i * 3;
        if (!reduce) {
          const shimmer = Math.sin(time * 1.6 + i) * 0.004;
          vel[ix] += (target[ix] + shimmer - pos[ix]) * 0.045;
          vel[ix + 1] += (target[ix + 1] - pos[ix + 1]) * 0.045;
          vel[ix + 2] += (target[ix + 2] - shimmer - pos[ix + 2]) * 0.045;
          vel[ix] *= 0.84;
          vel[ix + 1] *= 0.84;
          vel[ix + 2] *= 0.84;
          pos[ix] += vel[ix];
          pos[ix + 1] += vel[ix + 1];
          pos[ix + 2] += vel[ix + 2];
        }

        const x = pos[ix];
        const y = pos[ix + 1];
        const z = pos[ix + 2];
        const xr = x * cosA - z * sinA;
        const zr = x * sinA + z * cosA;
        const yr = y * cosB - zr * sinB;
        const zt = y * sinB + zr * cosB;
        const persp = 2.8 / (2.8 + zt);
        const sx = cx + xr * S * persp;
        const sy = cy - yr * S * persp;

        if (!reduce) {
          const dx = sx - pointer.x;
          const dy = sy - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < repel * repel && d2 > 1) {
            const d = Math.sqrt(d2);
            const f = ((1 - d / repel) * 0.03) / d;
            const px = dx * f;
            vel[ix] += px * cosA;
            vel[ix + 2] -= px * sinA;
            vel[ix + 1] -= dy * f;
          }
        }

        const depth = (1 - zt) * 0.5;
        const size = (0.7 + depth * 1.3) * dpr;
        ctx.globalAlpha = 0.25 + depth * 0.65;
        ctx.fillStyle = i % 9 === 0 ? "#f2c27a" : i % 4 === 0 ? "#9fb6d4" : "#e9edf2";
        ctx.fillRect(sx * dpr - size / 2, sy * dpr - size / 2, size, size);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    };

    const loop = (now: number) => {
      render(now);
      raf = active ? requestAnimationFrame(loop) : 0;
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      if (!active || reduce) render(performance.now());
    };

    api.current = {
      setShape(next) {
        target = getShape(next);
        if (reduce) {
          pos.set(target);
          render(performance.now());
          return;
        }
        for (let i = 0; i < vel.length; i++) vel[i] += (Math.random() - 0.5) * 0.09;
      },
    };

    const onMove = (event: globalThis.PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.trot = ((pointer.x / Math.max(width, 1)) - 0.5) * 1.2;
    };
    const onLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
      pointer.trot = 0;
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    canvas.addEventListener("pointermove", onMove, { passive: true });
    canvas.addEventListener("pointerleave", onLeave);
    const stopObserving = observeActivity(canvas, (next) => {
      active = next && !reduce;
      if (active && !raf) raf = requestAnimationFrame(loop);
    });

    return () => {
      active = false;
      api.current = null;
      cancelAnimationFrame(raf);
      ro.disconnect();
      stopObserving();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  useEffect(() => {
    api.current?.setShape(shape);
  }, [shape]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}

/* ------------------------------------------------------------------ */
/*  Rising embers (2D canvas)                                          */
/* ------------------------------------------------------------------ */

export function EmberField({ className, density = 70 }: { className?: string; density?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || prefersReducedMotion()) return;

    const rand = Math.random;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let active = false;
    const embers = Array.from({ length: density }, () => ({
      x: rand(),
      y: rand(),
      r: 0.6 + rand() * 1.8,
      speed: 0.0006 + rand() * 0.0016,
      drift: rand() * Math.PI * 2,
      gold: rand() < 0.6,
    }));

    const loop = (now: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "lighter";
      for (const e of embers) {
        e.y -= e.speed;
        if (e.y < -0.05) {
          e.y = 1.05;
          e.x = rand();
        }
        const x = (e.x + Math.sin(now / 1800 + e.drift) * 0.015) * width * dpr;
        const y = e.y * height * dpr;
        const fade = Math.min(1, e.y * 2.2) * Math.min(1, (1 - e.y) * 6);
        const radius = e.r * dpr * 3;
        const glow = ctx.createRadialGradient(x, y, 0, x, y, radius);
        glow.addColorStop(0, e.gold ? `rgba(255,196,120,${0.9 * fade})` : `rgba(220,230,245,${0.8 * fade})`);
        glow.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = glow;
        ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
      }
      ctx.globalCompositeOperation = "source-over";
      raf = active ? requestAnimationFrame(loop) : 0;
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    const stopObserving = observeActivity(canvas, (next) => {
      active = next;
      if (active && !raf) raf = requestAnimationFrame(loop);
    });

    return () => {
      active = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      stopObserving();
    };
  }, [density]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
