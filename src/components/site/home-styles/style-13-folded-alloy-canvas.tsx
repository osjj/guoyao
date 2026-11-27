"use client";

import { useEffect, useRef } from "react";

const VERTEX_SHADER = `
attribute vec2 aRibbon;

uniform float uAspect;
uniform float uTime;
uniform vec3 uFrame;
uniform vec3 uCursor;
uniform vec3 uRipple;

varying vec3 vNormal;
varying vec3 vPosition;

const float PI = 3.14159265;

vec3 ribbon(float along, float angle) {
  float t = uTime;
  float across = sin(angle);
  float flow = 4.5 * along - 0.63 * t;
  float center = 0.35 * sin(3.25 * along + 0.45 + 0.22 * sin(t * 0.35));
  center += 0.16 * along + 0.08 * sin(6.0 * along - t * 0.45);
  float width = 0.45 + 0.12 * sin(5.4 * along + 0.85) + 0.044 * sin(flow);

  // A closed section gives the sheet a rounded lip and a reflective back face.
  float crossX = across * width;
  float crossZ = 0.066 * cos(angle) + 0.16 * cos(3.5 * across + 0.48 * sin(flow));
  crossZ += 0.052 * sin(6.3 * across + 0.64 * flow);
  float roll = 0.99 * sin(4.3 * along + 0.38 * sin(t * 0.41)) + 0.28 * sin(flow);
  vec3 p = vec3(
    center + crossX * cos(roll) - crossZ * sin(roll),
    along * 1.38 + 0.12 * across * cos(4.0 * along - t * 0.27),
    crossX * sin(roll) + crossZ * cos(roll)
  );
  p.z += 0.22 * sin(4.6 * along - 0.36 + 0.2 * sin(t * 0.4));

  vec2 cursorDelta = p.xy - uCursor.xy;
  float pull = uCursor.z * exp(-dot(cursorDelta, cursorDelta) * 5.5);
  p.x -= 0.18 * pull * cursorDelta.x;
  p.z += 0.20 * pull;

  float age = uRipple.z;
  if (age < 3.0) {
    float radius = length(p.xy - uRipple.xy);
    float front = radius - age * 0.85;
    p.z += 0.088 * sin(front * 26.0) * exp(-front * front * 20.0 - age * 1.7);
  }
  return p;
}

void main() {
  float along = aRibbon.x;
  float angle = aRibbon.y * PI;
  vec3 p = ribbon(along, angle);
  vec3 tangent = ribbon(along + 0.003, angle) - ribbon(along - 0.003, angle);
  vec3 crossSection = ribbon(along, angle + 0.006) - ribbon(along, angle - 0.006);
  vNormal = normalize(cross(crossSection, tangent));
  vPosition = p;

  float w = 1.0 - p.z * 0.19;
  gl_Position = vec4(p.xy * uFrame.z / vec2(uAspect, 1.0) + uFrame.xy * w, -p.z * 0.48, w);
}
`;

const FRAGMENT_SHADER = `
precision mediump float;

uniform vec2 uSize;
varying vec3 vNormal;
varying vec3 vPosition;

float lightPanel(vec3 ray, vec3 direction, vec2 halfSize, float softness) {
  vec3 side = normalize(cross(vec3(0.0, 1.0, 0.0), direction));
  vec3 up = cross(direction, side);
  vec2 uv = abs(vec2(dot(ray, side), dot(ray, up)));
  float depth = dot(ray, direction);
  float corner = min(halfSize.x, halfSize.y) * 0.45;
  vec2 edge = uv - (halfSize - corner) * depth;
  float distance = length(max(edge, 0.0)) + min(max(edge.x, edge.y), 0.0) - corner * depth;
  return step(0.0, depth) * (1.0 - smoothstep(-softness, softness, distance));
}

void main() {
  vec3 normal = normalize(vNormal);
  vec3 view = normalize(vec3(0.0, 0.0, 5.26) - vPosition);
  vec3 reflected = reflect(-view, normal);

  // Rectangular studio panels reflect as bright bands across the curved steel.
  float key = lightPanel(reflected, normalize(vec3(-0.38, 0.56, 1.0)), vec2(0.27, 0.75), 0.058);
  float strip = lightPanel(reflected, normalize(vec3(0.77, 0.36, 0.68)), vec2(0.12, 0.89), 0.047);
  float fill = lightPanel(reflected, normalize(vec3(-0.64, -0.31, 0.59)), vec2(0.68, 0.64), 0.23);
  float warm = lightPanel(reflected, normalize(vec3(0.43, -0.84, 0.4)), vec2(0.53, 0.16), 0.092);
  float rim = pow(1.0 - clamp(dot(normal, view), 0.0, 1.0), 4.0);
  float ceiling = smoothstep(-0.22, 0.98, reflected.y);

  vec3 color = mix(vec3(0.05, 0.062, 0.083), vec3(0.49, 0.53, 0.61), ceiling);
  color += vec3(0.96, 0.97, 1.0) * key;
  color += vec3(0.78, 0.88, 1.0) * strip;
  color += vec3(0.60, 0.65, 0.72) * fill;
  color += vec3(0.64, 0.42, 0.22) * warm;
  color += vec3(0.16, 0.18, 0.23) * rim;

  vec2 screen = gl_FragCoord.xy / uSize;
  float portrait = 1.0 - smoothstep(0.52, 1.10, uSize.x / uSize.y);
  float textShade = mix(0.36, 1.0, smoothstep(0.40, 0.79, screen.x));
  textShade *= mix(1.0, 0.89, portrait);
  gl_FragColor = vec4(clamp(color, 0.0, 1.0) * textShade, 1.0);
}
`;

function buildRibbon() {
  const lengthSegments = 112;
  const ringSegments = 64;
  const vertices: number[] = [];
  const indices: number[] = [];
  const row = ringSegments + 1;

  for (let i = 0; i <= lengthSegments; i += 1) {
    for (let j = 0; j <= ringSegments; j += 1) {
      vertices.push((2 * i) / lengthSegments - 1, (2 * j) / ringSegments - 1);
      if (i === lengthSegments || j === ringSegments) continue;
      const a = i * row + j;
      indices.push(a, a + 1, a + row, a + 1, a + row + 1, a + row);
    }
  }

  return { vertices: new Float32Array(vertices), indices: new Uint16Array(indices) };
}

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
  console.warn("[folded-alloy] shader error", gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
  return null;
}

function createProgram(gl: WebGLRenderingContext) {
  const vertex = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  const program = vertex && fragment ? gl.createProgram() : null;

  if (program && vertex && fragment) {
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
  }
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);

  if (!program) return null;
  if (gl.getProgramParameter(program, gl.LINK_STATUS)) return program;
  console.warn("[folded-alloy] link error", gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
  return null;
}

type AlloyPlacement = "hero" | "footer";

function startAlloy(canvas: HTMLCanvasElement, placement: AlloyPlacement) {
  const isFooter = placement === "footer";
  const hero = isFooter ? null : canvas.closest("section");
  const gl = canvas.getContext("webgl", { alpha: true, antialias: true, depth: true });
  if (!gl) return;

  const program = createProgram(gl);
  const vertexBuffer = gl.createBuffer();
  const indexBuffer = gl.createBuffer();
  const release = () => {
    gl.deleteProgram(program);
    gl.deleteBuffer(vertexBuffer);
    gl.deleteBuffer(indexBuffer);
  };
  if (!program || !vertexBuffer || !indexBuffer) {
    release();
    return;
  }

  const { vertices, indices } = buildRibbon();
  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  const attribute = gl.getAttribLocation(program, "aRibbon");
  gl.enableVertexAttribArray(attribute);
  gl.vertexAttribPointer(attribute, 2, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
  gl.enable(gl.DEPTH_TEST);
  gl.clearColor(0, 0, 0, 0);

  const uniforms = {
    aspect: gl.getUniformLocation(program, "uAspect"),
    frame: gl.getUniformLocation(program, "uFrame"),
    size: gl.getUniformLocation(program, "uSize"),
    time: gl.getUniformLocation(program, "uTime"),
    cursor: gl.getUniformLocation(program, "uCursor"),
    ripple: gl.getUniformLocation(program, "uRipple"),
  };
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const cursor = { x: 0, y: 0, strength: 0 };
  const target = { x: 0, y: 0, strength: 0 };
  const ripple = { x: 0, y: 0, start: -3 };
  const composition = { x: 0, y: 0, scale: 1, aspect: 1 };
  let inView = false;
  let frame = 0;
  let previous = 0;
  let time = 0;

  const draw = () => {
    const still = motion.matches;
    gl.uniform1f(uniforms.time, still ? 0 : time * (isFooter ? 0.44 : 1));
    gl.uniform3f(uniforms.cursor, cursor.x, cursor.y, still ? 0 : cursor.strength);
    gl.uniform3f(uniforms.ripple, ripple.x, ripple.y, still ? 3 : time - ripple.start);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
    if (!canvas.dataset.rendered) canvas.dataset.rendered = "true";
  };

  const tick = (now: number) => {
    const delta = previous ? Math.min((now - previous) / 1000, 0.05) : 0;
    previous = now;
    time += delta;
    const easing = 1 - Math.exp(-8 * delta);
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
      ripple.start = -3;
      draw();
    }
  };

  const resize = () => {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (!width || !height) return;
    const aspect = width / height;
    const blend = Math.max(0, Math.min(1, (aspect - 0.52) / (1.1 - 0.52)));
    const portrait = 1 - blend * blend * (3 - 2 * blend);
    composition.x = isFooter ? 0.63 + 0.12 * portrait : 0.44 + 0.23 * portrait;
    composition.y = isFooter ? -0.17 + 0.12 * portrait : 0.11 * portrait;
    composition.scale = isFooter ? 1.28 - 0.49 * portrait : 1 - 0.28 * portrait;
    composition.aspect = aspect;
    const maxPixels = isFooter ? 680_000 : 1_050_000;
    const resolution = Math.min(window.devicePixelRatio || 1, 1.25, Math.sqrt(maxPixels / (width * height)));
    canvas.width = Math.round(width * resolution);
    canvas.height = Math.round(height * resolution);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform1f(uniforms.aspect, composition.aspect);
    gl.uniform3f(uniforms.frame, composition.x, composition.y, composition.scale);
    gl.uniform2f(uniforms.size, canvas.width, canvas.height);
    draw();
  };

  const toRibbon = (event: PointerEvent) => {
    const bounds = canvas.getBoundingClientRect();
    const x = 2 * (event.clientX - bounds.left) / bounds.width - 1;
    const y = 1 - 2 * (event.clientY - bounds.top) / bounds.height;
    return {
      x: ((x - composition.x) * composition.aspect) / composition.scale,
      y: (y - composition.y) / composition.scale,
    };
  };

  const onMove = (event: PointerEvent) => {
    if (motion.matches || event.pointerType === "touch") return;
    Object.assign(target, toRibbon(event), { strength: 1 });
  };
  const onLeave = () => { target.strength = 0; };
  const onDown = (event: PointerEvent) => {
    if (motion.matches || event.button !== 0) return;
    if (event.target instanceof Element && event.target.closest("a, button")) return;
    Object.assign(ripple, toRibbon(event), { start: time });
  };

  const intersection = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    syncAnimation();
  });
  const size = new ResizeObserver(resize);
  intersection.observe(canvas);
  size.observe(canvas);
  motion.addEventListener("change", syncAnimation);
  document.addEventListener("visibilitychange", syncAnimation);
  hero?.addEventListener("pointermove", onMove, { passive: true });
  hero?.addEventListener("pointerleave", onLeave);
  hero?.addEventListener("pointerdown", onDown, { passive: true });
  resize();

  return () => {
    cancelAnimationFrame(frame);
    intersection.disconnect();
    size.disconnect();
    motion.removeEventListener("change", syncAnimation);
    document.removeEventListener("visibilitychange", syncAnimation);
    hero?.removeEventListener("pointermove", onMove);
    hero?.removeEventListener("pointerleave", onLeave);
    hero?.removeEventListener("pointerdown", onDown);
    delete canvas.dataset.rendered;
    release();
  };
}

export function FoldedAlloyCanvas({ className, placement = "hero" }: { className: string; placement?: AlloyPlacement }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    let stop = startAlloy(canvas, placement);
    const onLost = (event: Event) => {
      event.preventDefault();
      stop?.();
      stop = undefined;
    };
    const onRestored = () => { stop = startAlloy(canvas, placement); };
    canvas.addEventListener("webglcontextlost", onLost);
    canvas.addEventListener("webglcontextrestored", onRestored);
    return () => {
      stop?.();
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
    };
  }, [placement]);

  return <canvas ref={ref} className={className} data-folded-alloy={placement} aria-hidden="true" />;
}
