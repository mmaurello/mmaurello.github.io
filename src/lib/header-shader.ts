/** Set to true to show and run the header WebGL shader. */
export const HEADER_SHADER_ENABLED = false;

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
    vec2 warp = vec2(
      fbm(uv * 2.0 + u_time * 0.058),
      fbm(uv * 2.0 + vec2(4.2, 1.3) + u_time * 0.022)
    );
    float field = fbm(uv * 2.4 + warp * 8.0 + u_time * 0.016);

    if (u_dark < 0.5) {
      vec3 pale = vec3(1.0, 0.99, 0.995);
      vec3 mid = vec3(0.98, 0.91, 0.93);
      vec3 deep = vec3(0.53, 0.08, 0.02);
      vec3 color = mix(mix(pale, mid, field), deep, field * field * 0.45);
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
