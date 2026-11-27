"use client";

import { useEffect, useRef } from "react";

const QUAD_VERTEX_SHADER = `
attribute vec2 aPos;
varying vec2 vUv;

void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

// Sculpted compound-curved fluted champagne brass architectural louvers
const FLUTED_BRASS_FRAGMENT_SHADER = `
precision highp float;

uniform vec2 uSize;
uniform float uTime;
uniform vec3 uCursor;
uniform vec3 uRipple;

varying vec2 vUv;

float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float flutedHeight(vec2 p, float t) {
  // Architectural compound-curved sweep across the facade
  float macroWave =
    0.22 * sin(p.x * 1.35 + p.y * 0.55 - t * 0.38) +
    0.14 * cos(p.y * 1.15 - p.x * 0.65 + t * 0.28);

  // Curved vertical fluted brass louvers (smooth concave scallops + crisp arris ridges)
  float fluteCoord = p.x * 16.5 + 0.95 * sin(p.y * 1.45 - t * 0.34) + 0.35 * sin(p.x * 2.1 + t * 0.22);
  float rib = cos(fluteCoord);
  float scallop = -sqrt(sin(fluteCoord * 0.5) * sin(fluteCoord * 0.5) + 0.015) * 0.26 + rib * 0.06;

  // Interactive pointer magnetic bend
  vec2 d = p - uCursor.xy;
  float pull = uCursor.z * exp(-dot(d, d) * 3.8);
  float cursorSculpt = 0.16 * pull * cos(length(d) * 5.2 - t * 1.5);

  // Click acoustic shockwave across flutes
  float rippleTerm = 0.0;
  float age = uRipple.z;
  if (age < 3.2) {
    float dist = length(p - uRipple.xy);
    float front = dist - age * 0.95;
    rippleTerm = 0.11 * sin(front * 22.0) * exp(-front * front * 16.0 - age * 1.45);
  }

  return macroWave + scallop + cursorSculpt + rippleTerm;
}

float studioPanel(vec3 ray, vec3 dir, vec2 halfSize, float softness) {
  vec3 upRef = abs(dir.y) > 0.95 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0);
  vec3 side = normalize(cross(upRef, dir));
  vec3 up = cross(dir, side);
  vec2 uv = abs(vec2(dot(ray, side), dot(ray, up)));
  float depth = dot(ray, dir);
  float corner = min(halfSize.x, halfSize.y) * 0.4;
  vec2 edge = uv - (halfSize - corner) * depth;
  float dist = length(max(edge, 0.0)) + min(max(edge.x, edge.y), 0.0) - corner * depth;
  return step(0.0, depth) * (1.0 - smoothstep(-softness, softness, dist));
}

void main() {
  float aspect = uSize.x / max(uSize.y, 1.0);
  vec2 p = (vUv * 2.0 - 1.0) * vec2(aspect, 1.0);
  float t = uTime;

  float eps = 0.0045;
  float h = flutedHeight(p, t);
  float hx = flutedHeight(p + vec2(eps, 0.0), t);
  float hy = flutedHeight(p + vec2(0.0, eps), t);
  vec3 normal = normalize(vec3((h - hx) / eps * 0.44, (h - hy) / eps * 0.34, 1.0));

  vec3 view = normalize(vec3(-p * 0.24, 1.0));
  vec3 refl = reflect(-view, normal);

  // Moving studio softboxes tailored to warm champagne brass
  float sweep = sin(t * 0.26) * 0.26;
  vec2 cursorTilt = uCursor.xy * uCursor.z * 0.24;

  vec3 keyDir = normalize(vec3(0.42 + sweep + cursorTilt.x, 0.44 + cursorTilt.y, 0.86));
  vec3 stripDir = normalize(vec3(-0.62 - sweep * 0.6, 0.28, 0.74));
  vec3 warmDir = normalize(vec3(0.28 - sweep * 0.4, -0.58, 0.66));
  vec3 coolDir = normalize(vec3(-0.78, 0.52, 0.48));

  float keyLight = studioPanel(refl, keyDir, vec2(0.24, 0.88), 0.085);
  float stripLight = studioPanel(refl, stripDir, vec2(0.14, 0.92), 0.075);
  float warmGlow = studioPanel(refl, warmDir, vec2(0.56, 0.26), 0.24);
  float coolFill = studioPanel(refl, coolDir, vec2(0.42, 0.62), 0.28);

  float ndotv = clamp(dot(normal, view), 0.0, 1.0);
  float fresnel = pow(1.0 - ndotv, 3.2);

  // Subtle metallic champagne-gold conductor tint
  vec3 shadowTone = vec3(0.055, 0.042, 0.028);
  vec3 midBrass = vec3(0.48, 0.34, 0.17);
  vec3 brightChampagne = vec3(0.98, 0.84, 0.60);
  vec3 hotSpec = vec3(1.0, 0.95, 0.85);
  vec3 coolRim = vec3(0.44, 0.50, 0.60);

  float envGrad = smoothstep(-0.55, 0.85, refl.y * 0.65 + refl.x * 0.35);
  vec3 color = mix(shadowTone, midBrass * 0.62, envGrad);
  color += brightChampagne * keyLight * 0.86;
  color += hotSpec * pow(keyLight, 2.4) * 0.32;
  color += vec3(0.92, 0.72, 0.44) * stripLight * 0.58;
  color += vec3(0.76, 0.47, 0.20) * warmGlow * 0.42;
  color += coolRim * coolFill * 0.16;
  color += brightChampagne * fresnel * 0.28;

  // Silky brushed vertical brass sheen (alias-free color modulation)
  float brushedSheen = 0.96 + 0.04 * sin(p.x * 68.0 + sin(p.y * 2.0) * 1.6);
  color *= brushedSheen;
  float grain = (hash12(gl_FragCoord.xy * 0.5) - 0.5) * 0.009;
  color += grain;

  // Atmospheric vignette keeping left copy crisp while brass gleams across the frame
  float rightReveal = mix(0.42, 1.0, smoothstep(0.08, 0.78, vUv.x));
  float verticalVignette = mix(0.68, 1.0, smoothstep(0.0, 0.32, vUv.y) * smoothstep(1.0, 0.72, vUv.y));
  color *= rightReveal * verticalVignette;

  gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
`;

// Hand-hammered architectural antique bronze & burnished copper patina sheet
const HAMMERED_BRONZE_FRAGMENT_SHADER = `
precision highp float;

uniform vec2 uSize;
uniform float uTime;
uniform vec3 uCursor;
uniform vec3 uRipple;

varying vec2 vUv;

vec2 hash22(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return fract(sin(p) * 43758.5453123);
}

// Smooth cellular hammered facets (hand-beaten bronze dimples)
float hammeredLayer(vec2 x, float t) {
  vec2 n = floor(x);
  vec2 f = fract(x);

  float minDist = 8.0;
  float secondDist = 8.0;

  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 g = vec2(float(i), float(j));
      vec2 o = hash22(n + g);
      // Subtle living metallic breathing
      o = 0.5 + 0.42 * sin(t * 0.24 + 6.2831 * o);
      vec2 r = g + o - f;
      float d = dot(r, r);
      if (d < minDist) {
        secondDist = minDist;
        minDist = d;
      } else if (d < secondDist) {
        secondDist = d;
      }
    }
  }

  float d1 = sqrt(minDist);
  float d2 = sqrt(secondDist);
  // Concave hammered bowl + soft raised ridge between hammer strikes
  float dish = d1 * d1 * 0.78;
  float ridge = smoothstep(0.0, 0.24, d2 - d1) * 0.14;
  return dish - ridge;
}

float bronzeHeight(vec2 p, float t) {
  // Slow molten sheet undulation
  float swell =
    0.20 * sin(p.x * 1.15 - t * 0.26 + sin(p.y * 1.1 + t * 0.18)) +
    0.13 * cos(p.y * 1.6 + p.x * 0.7 - t * 0.22);

  // Two octaves of hand-hammered architectural bronze dimples
  float largeHammer = hammeredLayer(p * 4.4 + vec2(t * 0.03, -t * 0.02), t) * 0.34;
  float fineHammer = hammeredLayer(p * 9.2 - vec2(t * 0.02, t * 0.025), t * 1.2) * 0.11;

  // Interactive cursor facet lift
  vec2 d = p - uCursor.xy;
  float pull = uCursor.z * exp(-dot(d, d) * 3.4);
  float cursorDome = 0.22 * pull;

  // Click thermal shockwave ripple
  float rippleTerm = 0.0;
  float age = uRipple.z;
  if (age < 3.2) {
    float dist = length(p - uRipple.xy);
    float front = dist - age * 0.9;
    rippleTerm = 0.14 * sin(front * 20.0) * exp(-front * front * 14.0 - age * 1.4);
  }

  return swell + largeHammer + fineHammer + cursorDome + rippleTerm;
}

float lightBand(vec3 ray, vec3 dir, vec2 halfSize, float softness) {
  vec3 upRef = abs(dir.y) > 0.95 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0);
  vec3 side = normalize(cross(upRef, dir));
  vec3 up = cross(dir, side);
  vec2 uv = abs(vec2(dot(ray, side), dot(ray, up)));
  float depth = dot(ray, dir);
  float corner = min(halfSize.x, halfSize.y) * 0.45;
  vec2 edge = uv - (halfSize - corner) * depth;
  float dist = length(max(edge, 0.0)) + min(max(edge.x, edge.y), 0.0) - corner * depth;
  return step(0.0, depth) * (1.0 - smoothstep(-softness, softness, dist));
}

void main() {
  float aspect = uSize.x / max(uSize.y, 1.0);
  vec2 p = (vUv * 2.0 - 1.0) * vec2(aspect, 1.0);
  float t = uTime;

  float eps = 0.0065;
  float h = bronzeHeight(p, t);
  float hx = bronzeHeight(p + vec2(eps, 0.0), t);
  float hy = bronzeHeight(p + vec2(0.0, eps), t);
  vec3 normal = normalize(vec3((h - hx) / eps * 0.48, (h - hy) / eps * 0.48, 1.0));

  vec3 view = normalize(vec3(-p * 0.22, 1.0));
  vec3 refl = reflect(-view, normal);

  // Grazing warm bronze & copper gallery lighting
  float drift = sin(t * 0.28) * 0.34;
  vec2 cursorLight = uCursor.xy * uCursor.z * 0.36;

  vec3 keyDir = normalize(vec3(0.32 + drift + cursorLight.x, 0.56 + cursorLight.y, 0.80));
  vec3 copperDir = normalize(vec3(-0.52 - drift * 0.7, -0.24, 0.76));
  vec3 rimDir = normalize(vec3(0.74, -0.45, 0.52));

  float keySpec = lightBand(refl, keyDir, vec2(0.46, 0.32), 0.14);
  float copperSpec = lightBand(refl, copperDir, vec2(0.55, 0.42), 0.24);
  float coolSpec = lightBand(refl, rimDir, vec2(0.28, 0.64), 0.18);

  // Cursor local gallery spotlight illuminating individual hammered facets
  float spotDist = length(p - uCursor.xy);
  float cursorSpot = uCursor.z * exp(-spotDist * spotDist * 2.4) * pow(max(dot(normal, normalize(vec3(uCursor.xy - p, 0.65))), 0.0), 4.0);

  float ndotv = clamp(dot(normal, view), 0.0, 1.0);
  float fresnel = pow(1.0 - ndotv, 2.8);

  // Oxidized architectural bronze & burnished copper palette
  vec3 deepPatina = vec3(0.048, 0.036, 0.030);
  vec3 agedBronze = vec3(0.24, 0.15, 0.095);
  vec3 burnishedCopper = vec3(0.84, 0.50, 0.26);
  vec3 champagneGlint = vec3(1.0, 0.87, 0.68);
  vec3 slateCounter = vec3(0.32, 0.40, 0.50);

  float patinaVar = smoothstep(-0.35, 0.65, refl.y * 0.5 + h * 0.9);
  vec3 color = mix(deepPatina, agedBronze * 0.76, patinaVar);
  color += burnishedCopper * copperSpec * 0.62;
  color += champagneGlint * keySpec * 0.74;
  color += champagneGlint * pow(keySpec, 3.0) * 0.28;
  color += slateCounter * coolSpec * 0.22;
  color += burnishedCopper * fresnel * 0.34;
  color += champagneGlint * cursorSpot * 0.68;

  // Keep broadsheet typography high-contrast while letting hammered bronze shimmer
  float centerLift = mix(0.52, 1.0, smoothstep(0.04, 0.62, vUv.x) * 0.7 + 0.3);
  float bottomFade = smoothstep(0.0, 0.24, vUv.y);
  color *= centerLift * mix(0.74, 1.0, bottomFade);

  gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
`;

function compileShader(gl: WebGLRenderingContext, type: number, source: string, tag: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
  console.warn(`[${tag}] shader error`, gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
  return null;
}

function startMetalShader(canvas: HTMLCanvasElement, fragmentSource: string, tag: string) {
  const container = canvas.closest<HTMLElement>("section, header");
  const gl = canvas.getContext("webgl", { alpha: false, antialias: true, depth: false });
  if (!gl) {
    canvas.dataset.fallback = "true";
    return;
  }

  const vert = compileShader(gl, gl.VERTEX_SHADER, QUAD_VERTEX_SHADER, tag);
  const frag = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource, tag);
  const program = vert && frag ? gl.createProgram() : null;
  if (program && vert && frag) {
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);
  }
  gl.deleteShader(vert);
  gl.deleteShader(frag);

  if (!program || !gl.getProgramParameter(program, gl.LINK_STATUS)) {
    if (program) {
      console.warn(`[${tag}] link error`, gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
    }
    canvas.dataset.fallback = "true";
    return;
  }

  const buffer = gl.createBuffer();
  if (!buffer) {
    gl.deleteProgram(program);
    canvas.dataset.fallback = "true";
    return;
  }

  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW,
  );
  const posLoc = gl.getAttribLocation(program, "aPos");
  gl.enableVertexAttribArray(posLoc);
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

  const uniforms = {
    size: gl.getUniformLocation(program, "uSize"),
    time: gl.getUniformLocation(program, "uTime"),
    cursor: gl.getUniformLocation(program, "uCursor"),
    ripple: gl.getUniformLocation(program, "uRipple"),
  };

  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const cursor = { x: 0.25, y: 0.1, strength: 0 };
  const target = { x: 0.25, y: 0.1, strength: 0 };
  const ripple = { x: 0, y: 0, start: -4 };
  let aspect = 1;
  let inView = false;
  let frame = 0;
  let previous = 0;
  let time = 0;

  const draw = () => {
    const still = motion.matches;
    gl.uniform1f(uniforms.time, still ? 0 : time);
    gl.uniform3f(uniforms.cursor, cursor.x, cursor.y, still ? 0 : cursor.strength);
    gl.uniform3f(uniforms.ripple, ripple.x, ripple.y, still ? 4 : time - ripple.start);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    if (!canvas.dataset.rendered) canvas.dataset.rendered = "true";
  };

  const tick = (now: number) => {
    const delta = previous ? Math.min((now - previous) / 1000, 0.05) : 0;
    previous = now;
    time += delta;
    const easing = 1 - Math.exp(-7 * delta);
    cursor.x += (target.x - cursor.x) * easing;
    cursor.y += (target.y - cursor.y) * easing;
    cursor.strength += (target.strength - cursor.strength) * easing;
    draw();
    frame = requestAnimationFrame(tick);
  };

  const syncAnimation = () => {
    if (inView && !document.hidden && !motion.matches) {
      if (!frame) frame = requestAnimationFrame(tick);
      return;
    }
    cancelAnimationFrame(frame);
    frame = 0;
    previous = 0;
    if (motion.matches) {
      cursor.strength = 0;
      target.strength = 0;
      ripple.start = -4;
      draw();
    }
  };

  const resize = () => {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (!width || !height) return;
    aspect = width / height;
    const maxPixels = 850_000;
    const resolution = Math.min(window.devicePixelRatio || 1, 1.35, Math.sqrt(maxPixels / (width * height)));
    canvas.width = Math.max(1, Math.round(width * resolution));
    canvas.height = Math.max(1, Math.round(height * resolution));
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uniforms.size, canvas.width, canvas.height);
    draw();
  };

  const toPlane = (event: PointerEvent) => {
    const bounds = canvas.getBoundingClientRect();
    const nx = (2 * (event.clientX - bounds.left)) / Math.max(bounds.width, 1) - 1;
    const ny = 1 - (2 * (event.clientY - bounds.top)) / Math.max(bounds.height, 1);
    return { x: nx * aspect, y: ny };
  };

  const onMove = (event: PointerEvent) => {
    if (motion.matches || event.pointerType === "touch") return;
    Object.assign(target, toPlane(event), { strength: 1 });
  };
  const onLeave = () => {
    target.strength = 0;
  };
  const onDown = (event: PointerEvent) => {
    if (motion.matches || event.button !== 0) return;
    if (event.target instanceof Element && event.target.closest("a, button")) return;
    Object.assign(ripple, toPlane(event), { start: time });
  };

  const intersection = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    syncAnimation();
  });
  const observer = new ResizeObserver(resize);
  intersection.observe(canvas);
  observer.observe(canvas);
  motion.addEventListener("change", syncAnimation);
  document.addEventListener("visibilitychange", syncAnimation);
  container?.addEventListener("pointermove", onMove, { passive: true });
  container?.addEventListener("pointerleave", onLeave);
  container?.addEventListener("pointerdown", onDown, { passive: true });
  resize();

  return () => {
    cancelAnimationFrame(frame);
    intersection.disconnect();
    observer.disconnect();
    motion.removeEventListener("change", syncAnimation);
    document.removeEventListener("visibilitychange", syncAnimation);
    container?.removeEventListener("pointermove", onMove);
    container?.removeEventListener("pointerleave", onLeave);
    container?.removeEventListener("pointerdown", onDown);
    delete canvas.dataset.rendered;
    gl.deleteProgram(program);
    gl.deleteBuffer(buffer);
  };
}

function MetalShaderCanvas({
  className,
  fragmentSource,
  alloyId,
}: {
  className: string;
  fragmentSource: string;
  alloyId: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    let stop = startMetalShader(canvas, fragmentSource, alloyId);
    const onLost = (event: Event) => {
      event.preventDefault();
      stop?.();
      stop = undefined;
    };
    const onRestored = () => {
      stop = startMetalShader(canvas, fragmentSource, alloyId);
    };
    canvas.addEventListener("webglcontextlost", onLost);
    canvas.addEventListener("webglcontextrestored", onRestored);
    return () => {
      stop?.();
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
    };
  }, [fragmentSource, alloyId]);

  return <canvas ref={ref} className={className} data-alloy-canvas={alloyId} aria-hidden="true" />;
}

export function FlutedBrassCanvas({ className }: { className: string }) {
  return (
    <MetalShaderCanvas
      className={className}
      fragmentSource={FLUTED_BRASS_FRAGMENT_SHADER}
      alloyId="fluted-champagne-brass"
    />
  );
}

export function HammeredBronzeCanvas({ className }: { className: string }) {
  return (
    <MetalShaderCanvas
      className={className}
      fragmentSource={HAMMERED_BRONZE_FRAGMENT_SHADER}
      alloyId="hammered-architectural-bronze"
    />
  );
}
