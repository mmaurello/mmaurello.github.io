/** Set to true to show and run the header WebGL shader. */
export const HEADER_SHADER_ENABLED = true;

/** Cursor repulsion radius in normalized header coordinates (0–1). */
const CURSOR_RADIUS = 0.17;
/** How strongly the noise field is displaced at the cursor center. */
const CURSOR_STRENGTH = 0.15;
/** Pointer follow smoothing per frame (0–1, higher = snappier). */
const CURSOR_LERP = 0.24;
/** Fade-out multiplier per frame when the pointer leaves the header. */
const CURSOR_FADE = 0.88;

const VERTEX_SHADER = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision mediump float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform float u_dark;
  uniform vec2 u_mouse;
  uniform float u_cursor;
  uniform float u_cursor_radius;
  uniform float u_cursor_strength;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 4; i++) {
      value += amplitude * noise(p);
      p *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;

    if (u_cursor > 0.001) {
      vec2 delta = uv - u_mouse;
      float dist = length(delta);
      float radius = max(u_cursor_radius, 0.001);
      float falloff = smoothstep(radius, 0.0, dist);
      falloff *= falloff;
      vec2 push = normalize(delta + vec2(0.0001)) * falloff * u_cursor_strength;
      uv += push * u_cursor;
    }

    vec2 warp = vec2(
      fbm(uv * 2.0 + u_time * 0.058),
      fbm(uv * 2.0 + vec2(4.2, 1.3) + u_time * 0.022)
    );
    float field = fbm(uv * 2.4 + warp * 8.0 + u_time * 0.016);

    if (u_dark < 0.5) {
      vec3 pale = vec3(1.0, 0.995, 0.992);
      vec3 mid = vec3(0.99, 0.96, 0.965);
      vec3 deep = vec3(0.74, 0.78, 0.86);
      vec3 color = mix(mix(pale, mid, field), deep, field * field * 0.3);
      gl_FragColor = vec4(color, 1.0);
    } else {
      vec3 darkA = vec3(0.180, 0.024, 0.082);
      vec3 darkB = vec3(0.420, 0.055, 0.165);
      vec3 color = mix(darkA, darkB, field);
      float alpha = mix(0.08, 0.18, field);
      gl_FragColor = vec4(color, alpha);
    }
  }
`;

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl: WebGLRenderingContext) {
  const vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  if (!vs || !fs) return null;

  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

export function initHeaderShader(canvas: HTMLCanvasElement, header: HTMLElement) {
  if (!HEADER_SHADER_ENABLED) return () => {};

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const gl = canvas.getContext("webgl", {
    alpha: true,
    antialias: false,
    powerPreference: "low-power",
  });
  if (!gl) return () => {};

  const program = createProgram(gl);
  if (!program) return () => {};

  const positionLoc = gl.getAttribLocation(program, "a_position");
  const timeLoc = gl.getUniformLocation(program, "u_time");
  const resolutionLoc = gl.getUniformLocation(program, "u_resolution");
  const darkLoc = gl.getUniformLocation(program, "u_dark");
  const mouseLoc = gl.getUniformLocation(program, "u_mouse");
  const cursorLoc = gl.getUniformLocation(program, "u_cursor");
  const cursorRadiusLoc = gl.getUniformLocation(program, "u_cursor_radius");
  const cursorStrengthLoc = gl.getUniformLocation(program, "u_cursor_strength");

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
    gl.STATIC_DRAW,
  );

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  let animationId = 0;
  const startTime = performance.now();
  let visible = true;
  let width = 0;
  let height = 0;

  let pointerInside = false;
  let cursorInfluence = 0;
  const mouseTarget = { x: 0.5, y: 0.5 };
  const mouseCurrent = { x: 0.5, y: 0.5 };

  const pointerToUv = (clientX: number, clientY: number) => {
    const rect = header.getBoundingClientRect();
    return {
      x: (clientX - rect.left) / rect.width,
      y: 1 - (clientY - rect.top) / rect.height,
    };
  };

  const onPointerMove = (event: PointerEvent) => {
    if (reduceMotion) return;
    const uv = pointerToUv(event.clientX, event.clientY);
    mouseTarget.x = uv.x;
    mouseTarget.y = uv.y;
    pointerInside = true;
  };

  const onPointerLeave = () => {
    pointerInside = false;
  };

  const updateCursor = () => {
    if (reduceMotion) return;

    if (pointerInside) {
      cursorInfluence = Math.min(1, cursorInfluence + 0.12);
    } else {
      cursorInfluence *= CURSOR_FADE;
    }

    mouseCurrent.x += (mouseTarget.x - mouseCurrent.x) * CURSOR_LERP;
    mouseCurrent.y += (mouseTarget.y - mouseCurrent.y) * CURSOR_LERP;
  };

  const stopAnimation = () => {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = 0;
    }
  };

  const resize = () => {
    const rect = header.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(1, Math.floor(rect.width * dpr));
    height = Math.max(1, Math.floor(rect.height * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      gl.viewport(0, 0, width, height);
    }
  };

  const isDark = () => document.documentElement.classList.contains("dark");

  const draw = (time: number) => {
    if (!visible) return;
    updateCursor();
    const dark = isDark();
    gl.clearColor(dark ? 0 : 1, dark ? 0 : 1, dark ? 0 : 1, dark ? 0 : 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    if (dark) {
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    } else {
      gl.disable(gl.BLEND);
    }
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
    gl.uniform1f(timeLoc, reduceMotion ? 0 : (time - startTime) * 0.001);
    gl.uniform2f(resolutionLoc, width, height);
    gl.uniform1f(darkLoc, dark ? 1 : 0);
    gl.uniform2f(mouseLoc, mouseCurrent.x, mouseCurrent.y);
    gl.uniform1f(cursorLoc, reduceMotion ? 0 : cursorInfluence);
    gl.uniform1f(cursorRadiusLoc, CURSOR_RADIUS);
    gl.uniform1f(cursorStrengthLoc, CURSOR_STRENGTH);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };

  const tick = (time: number) => {
    animationId = 0;
    if (!visible) return;
    draw(time);
    if (!reduceMotion) {
      animationId = requestAnimationFrame(tick);
    }
  };

  const startAnimation = () => {
    if (!reduceMotion && !animationId) {
      animationId = requestAnimationFrame(tick);
    }
  };

  if (!reduceMotion) {
    header.addEventListener("pointermove", onPointerMove);
    header.addEventListener("pointerleave", onPointerLeave);
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(header);
  resize();

  const visibilityObserver = new IntersectionObserver(
    (entries) => {
      visible = entries[0]?.isIntersecting ?? true;
      if (visible) {
        startAnimation();
      } else {
        stopAnimation();
      }
    },
    { threshold: 0 },
  );
  visibilityObserver.observe(header);

  const themeObserver = new MutationObserver(() => {
    draw(performance.now());
  });
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });

  if (reduceMotion) {
    draw(performance.now());
  } else {
    startAnimation();
  }

  return () => {
    stopAnimation();
    resizeObserver.disconnect();
    visibilityObserver.disconnect();
    themeObserver.disconnect();
    gl.deleteProgram(program);
    gl.deleteBuffer(buffer);
  };
}
