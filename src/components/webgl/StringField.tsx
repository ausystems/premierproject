import { useEffect, useRef } from "react";
import type { WebGLRenderer } from "three";
import { gsap, ScrollTrigger, prefersReducedMotion, whenPageReady } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/*
 * The Programs hero: the site's strings, many of them, seen in depth. Horizontal strings run across a
 * plane above the eye and recede into the dark like the inside of an instrument. Each is as long as the
 * view is wide at its depth, so nearer strings are shorter and ring higher, like a harp. A soft light
 * follows the pointer across them; crossing them strums them; scrolling carries the eye forward under
 * the strings and each one is struck as it passes overhead. When the page arrives the field is played
 * once, far to near. Rendering is on demand and stops whenever nothing moves or the hero is out of view.
 */

const MODES = 8;
const PICK_DEPTH = 3.6;

const VERT = /* glsl */ `
  #define PI 3.141592653589793
  attribute float aT;
  attribute float aSide;
  attribute float aIdx;
  uniform vec4 uModes[STRINGS * 2];
  uniform vec2 uClip[STRINGS];
  uniform vec2 uRes;
  uniform float uZ0, uDZ, uY, uSpanK, uSpanB, uCamZ0, uDT, uWNear, uWFar;
  varying float vEdge, vHalf, vDepth, vSwing, vT;
  varying vec2 vXZ;

  float swing(float t, int i) {
    vec4 a = uModes[i * 2];
    vec4 b = uModes[i * 2 + 1];
    float p = PI * t;
    return a.x * sin(p) + a.y * sin(2.0 * p) + a.z * sin(3.0 * p) + a.w * sin(4.0 * p)
         + b.x * sin(5.0 * p) + b.y * sin(6.0 * p) + b.z * sin(7.0 * p) + b.w * sin(8.0 * p);
  }

  vec3 at(float t, int i) {
    float z = uZ0 - float(i) * uDZ;
    float len = uSpanK * (uCamZ0 - z) + uSpanB;
    return vec3((t - 0.5) * len, uY + swing(t, i), z);
  }

  void main() {
    int i = int(aIdx + 0.5);
    vec2 clipT = uClip[i];
    if (clipT.x >= clipT.y) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
    float t = clamp(aT, clipT.x, clipT.y);
    vec3 p = at(t, i);
    vec4 c = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
    vec4 c0 = projectionMatrix * modelViewMatrix * vec4(at(clamp(t - uDT, clipT.x, clipT.y), i), 1.0);
    vec4 c1 = projectionMatrix * modelViewMatrix * vec4(at(clamp(t + uDT, clipT.x, clipT.y), i), 1.0);
    float depth = -(modelViewMatrix * vec4(p, 1.0)).z;
    if (depth < 0.2 || c0.w <= 0.0 || c1.w <= 0.0) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }

    vec2 s0 = c0.xy / c0.w * uRes * 0.5;
    vec2 s1 = c1.xy / c1.w * uRes * 0.5;
    vec2 dir = normalize(s1 - s0 + vec2(1e-5, 0.0));
    vec2 nrm = vec2(-dir.y, dir.x);
    float hw = mix(uWNear, uWFar, clamp((depth - 2.0) / 18.0, 0.0, 1.0)) * 0.5;
    float ext = hw + 1.0;
    c.xy += nrm * aSide * ext / (uRes * 0.5) * c.w;
    gl_Position = c;

    vEdge = aSide * ext;
    vHalf = hw;
    vDepth = depth;
    vSwing = swing(t, i) / max(0.012 * (uSpanK * (uCamZ0 - p.z) + uSpanB), 1e-4);
    vT = t;
    vXZ = p.xz;
  }
`;

const FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform vec2 uLight;
  uniform float uLightR, uFog, uAlpha;
  uniform vec2 uRes;
  varying float vEdge, vHalf, vDepth, vSwing, vT;
  varying vec2 vXZ;

  void main() {
    float a = 1.0 - smoothstep(vHalf - 0.5, vHalf + 0.5, abs(vEdge));
    a *= clamp(vHalf * 2.0, 0.3, 1.0);
    float fog = exp(-vDepth * uFog);
    float overhead = smoothstep(0.9, 2.6, vDepth);
    float ends = smoothstep(0.0, 0.08, vT) * (1.0 - smoothstep(0.92, 1.0, vT));
    vec2 d = vXZ - uLight;
    float spot = exp(-dot(d, d) / (uLightR * uLightR));
    float glow = smoothstep(0.0, 1.0, abs(vSwing));
    // keep the lower left, where the headline sits, quiet
    vec2 q = gl_FragCoord.xy / uRes;
    float shield = mix(0.35, 1.0, smoothstep(0.0, 0.55, q.y + max(q.x - 0.45, 0.0)));
    float k = (0.11 + 0.85 * spot + 0.6 * glow) * fog * overhead * ends * shield * uAlpha;
    gl_FragColor = vec4(uColor, a * k);
  }
`;

type Props = { className?: string };

export const StringField = ({ className }: Props) => {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let disposed = false;
    let cleanup: (() => void) | null = null;
    const still = prefersReducedMotion();
    const small = window.matchMedia("(max-width: 767px)").matches;

    const boot = async () => {
      const THREE = await import("@/lib/three");
      if (disposed) return;

      let renderer: WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
      } catch {
        return;
      }
      const S = small ? 28 : 34;
      const P = small ? 80 : 120;
      const dpr = Math.min(window.devicePixelRatio || 1, small ? 1.75 : 2);
      renderer.setPixelRatio(dpr);
      renderer.setClearColor(0x000000, 0);
      const canvas = renderer.domElement;
      canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;opacity:0;transition:opacity 1.2s cubic-bezier(.16,1,.3,1)";
      el.appendChild(canvas);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(36, 1, 0.05, 120);
      camera.rotation.order = "YXZ";
      // Landscape: a long lens turned a little to the left, so the strings sweep in from the upper
      // left and meet far off to the right. Portrait: a wider lens tipped further up.
      const lens = (aspect: number) => {
        const tall = aspect < 1;
        camera.fov = tall ? 60 : 36;
        camera.rotation.set(tall ? 0.1 : 0.02, tall ? 0.3 : 0.24, tall ? -0.07 : -0.045);
      };
      const CAM_Z0 = 0;
      const TRAVEL = small ? 3.5 : 4.5;

      // geometry: two vertices per sample, a quad per segment, every string in one draw call
      const count = S * P * 2;
      const aT = new Float32Array(count);
      const aSide = new Float32Array(count);
      const aIdx = new Float32Array(count);
      const index = new Uint32Array(S * (P - 1) * 6);
      let v = 0;
      let k = 0;
      for (let i = 0; i < S; i++) {
        for (let j = 0; j < P; j++) {
          for (const side of [-1, 1]) {
            aT[v] = j / (P - 1);
            aSide[v] = side;
            aIdx[v] = i;
            v++;
          }
          if (j < P - 1) {
            const b = (i * P + j) * 2;
            index.set([b, b + 1, b + 2, b + 1, b + 3, b + 2], k);
            k += 6;
          }
        }
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
      geometry.setAttribute("aT", new THREE.BufferAttribute(aT, 1));
      geometry.setAttribute("aSide", new THREE.BufferAttribute(aSide, 1));
      geometry.setAttribute("aIdx", new THREE.BufferAttribute(aIdx, 1));
      geometry.setIndex(new THREE.BufferAttribute(index, 1));

      const modes = new Float32Array(S * MODES);
      const clip = new Float32Array(S * 2);
      const Z0 = -1.4;
      const DZ = 0.62;
      const Y = 1;
      const NEAR = 0.6;
      const uniforms = {
        uModes: { value: modes },
        uClip: { value: clip },
        uRes: { value: new THREE.Vector2(1, 1) },
        uZ0: { value: Z0 },
        uDZ: { value: DZ },
        uY: { value: Y },
        uSpanK: { value: 1 },
        uSpanB: { value: 1 },
        uCamZ0: { value: CAM_Z0 },
        uDT: { value: 1 / (P - 1) },
        uWNear: { value: 1.5 * dpr },
        uWFar: { value: 0.6 * dpr },
        uColor: { value: new THREE.Vector3(0.949, 0.949, 0.941) },
        uLight: { value: new THREE.Vector2(2.4, -8) },
        uLightR: { value: small ? 4.5 : 6 },
        uFog: { value: small ? 0.06 : 0.055 },
        uAlpha: { value: 1 },
      };
      const material = new THREE.ShaderMaterial({
        vertexShader: `#define STRINGS ${S}\n${VERT}`,
        fragmentShader: FRAG,
        uniforms,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        // ribbons are extruded in screen space, so either winding can face the camera
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.frustumCulled = false;
      scene.add(mesh);

      // physics, per string: exact damped harmonics; nearer (shorter) strings ring higher
      const x = new Float64Array(S * MODES);
      const vel = new Float64Array(S * MODES);
      const w = new Float64Array(S * MODES);
      const g = new Float64Array(S * MODES);
      const len = new Float64Array(S);
      const zOf = (i: number) => Z0 - i * DZ;

      const resize = () => {
        const W = el.clientWidth || 1;
        const H = el.clientHeight || 1;
        renderer.setSize(W, H, false);
        camera.aspect = W / H;
        lens(camera.aspect);
        camera.updateProjectionMatrix();
        uniforms.uRes.value.set(W * dpr, H * dpr);
        // each string a little wider than the view at its depth
        const halfW = Math.tan((camera.fov * Math.PI) / 360) * camera.aspect;
        uniforms.uSpanK.value = 2 * halfW * 1.18;
        uniforms.uSpanB.value = 0.4;
        for (let i = 0; i < S; i++) {
          len[i] = uniforms.uSpanK.value * (CAM_Z0 - zOf(i)) + uniforms.uSpanB.value;
          const f1 = gsap.utils.clamp(0.8, 2.4, 3.6 / Math.sqrt(len[i]));
          for (let n = 0; n < MODES; n++) {
            const kk = n + 1;
            w[i * MODES + n] = 2 * Math.PI * f1 * kk * Math.sqrt(1 + 0.002 * kk * kk);
            g[i * MODES + n] = 0.62 * (1 + 0.25 * n * n);
          }
        }
        placeCamera();
        needs();
      };

      const tri = new Float64Array(MODES);
      const strike = (i: number, at: number, amp: number) => {
        if (i < 0 || i >= S) return;
        const p = gsap.utils.clamp(0.06, 0.94, at);
        const h = amp * len[i];
        for (let n = 0; n < MODES; n++) {
          const kk = n + 1;
          tri[n] = (2 * h * Math.sin(kk * Math.PI * p)) / (kk * kk * Math.PI * Math.PI * p * (1 - p));
          vel[i * MODES + n] += w[i * MODES + n] * tri[n];
        }
        energy = Math.max(energy, 1);
        needs();
      };

      let energy = 0;
      const advance = (dt: number) => {
        let e = 0;
        for (let q = 0; q < S * MODES; q++) {
          const wq = w[q];
          const gq = g[q];
          const wd = Math.sqrt(Math.max(wq * wq - gq * gq, 1e-6));
          const x0 = x[q];
          const b = (vel[q] + gq * x0) / wd;
          const ex = Math.exp(-gq * dt);
          const c = Math.cos(wd * dt);
          const sn = Math.sin(wd * dt);
          const xn = ex * (x0 * c + b * sn);
          vel[q] = ex * (wd * (b * c - x0 * sn)) - gq * xn;
          x[q] = xn;
          modes[q] = xn;
          e = Math.max(e, Math.abs(xn) / (len[Math.floor(q / MODES)] * 0.004));
        }
        energy = e;
      };

      // the eye travels forward under the strings as the hero scrolls away
      const section = el.closest("section") ?? el;
      let travel = 0;
      const placeCamera = () => {
        camera.position.set(0, 0, CAM_Z0 - travel * TRAVEL);
        camera.updateMatrixWorld();
        const e = camera.matrixWorldInverse.elements;
        for (let i = 0; i < S; i++) {
          // depth along a string is linear in x: depth = A x + B
          const A = -e[2];
          const B = -(e[6] * Y + e[10] * zOf(i) + e[14]);
          let lo = 0;
          let hi = 1;
          if (Math.abs(A) < 1e-6) {
            if (B < NEAR) hi = -1;
          } else {
            const t = (NEAR - B) / A / len[i] + 0.5;
            if (A > 0) lo = Math.max(lo, t);
            else hi = Math.min(hi, t);
          }
          clip[i * 2] = lo;
          clip[i * 2 + 1] = hi;
        }
      };
      placeCamera();
      let lastPick = camera.position.z - PICK_DEPTH;
      let scrollSpeed = 0;
      const st = still
        ? null
        : ScrollTrigger.create({
            trigger: section,
            start: "top top",
            end: "bottom top",
            onUpdate: (self) => {
              travel = self.progress;
              scrollSpeed = Math.abs(self.getVelocity());
              needs();
            },
          });

      // the light, and the pick, follow the pointer on the plane of the strings
      const light = { x: uniforms.uLight.value.x, z: uniforms.uLight.value.y, tx: 2.4, tz: -8 };
      let hit: { x: number; z: number; t: number } | null = null;
      const ray = new THREE.Vector3();
      const onMove = (e: PointerEvent) => {
        if (e.pointerType === "touch") return;
        const r = el.getBoundingClientRect();
        if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) { hit = null; return; }
        ray.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1, 0.5).unproject(camera).sub(camera.position).normalize();
        if (ray.y <= 0.01) { hit = null; return; }
        const t = (Y - camera.position.y) / ray.y;
        const hx = camera.position.x + ray.x * t;
        const hz = camera.position.z + ray.z * t;
        const now = performance.now();
        if (hit) {
          const dtm = Math.max((now - hit.t) / 1000, 1 / 240);
          const speed = Math.abs(hz - hit.z) / dtm;
          const lo = Math.min(hz, hit.z);
          const hi = Math.max(hz, hit.z);
          for (let i = 0; i < S; i++) {
            const z = zOf(i);
            if (z > lo && z <= hi) strike(i, (hx / len[i]) + 0.5, gsap.utils.clamp(0.006, 0.02, speed * 0.002));
          }
        }
        hit = { x: hx, z: hz, t: now };
        light.tx = hx;
        light.tz = hz;
        needs();
      };
      if (!still) window.addEventListener("pointermove", onMove, { passive: true });

      // render on demand
      let raf = 0;
      let visible = true;
      let lastTime = performance.now();
      const frame = () => {
        raf = 0;
        if (disposed || !visible) return;
        const now = performance.now();
        const dt = gsap.utils.clamp(1 / 240, 1 / 30, (now - lastTime) / 1000);
        lastTime = now;

        placeCamera();
        // strings carried overhead by the scroll are struck as they pass the pick
        const pick = camera.position.z - PICK_DEPTH;
        if (pick !== lastPick && !still) {
          const lo = Math.min(pick, lastPick);
          const hi = Math.max(pick, lastPick);
          for (let i = 0; i < S; i++) {
            const z = zOf(i);
            if (z > lo && z <= hi) strike(i, 0.32 + ((i * 0.618) % 0.36), gsap.utils.clamp(0.006, 0.016, scrollSpeed * 0.000012));
          }
          lastPick = pick;
        }
        light.x += (light.tx - light.x) * 0.08;
        light.z += (light.tz - light.z) * 0.08;
        uniforms.uLight.value.set(light.x, light.z);
        advance(dt);
        renderer.render(scene, camera);

        const settling = Math.abs(light.tx - light.x) + Math.abs(light.tz - light.z) > 0.01;
        if (energy > 0.02 || settling) raf = requestAnimationFrame(frame);
      };
      function needs() {
        if (!raf && visible && !disposed) {
          lastTime = performance.now();
          raf = requestAnimationFrame(frame);
        }
      }

      const ro = new ResizeObserver(resize);
      ro.observe(el);
      const io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible) needs();
      });
      io.observe(el);
      resize();
      renderer.render(scene, camera);
      requestAnimationFrame(() => (canvas.style.opacity = "1"));

      // the field is played once as the page arrives, far to near
      const cancelReady = still
        ? () => undefined
        : whenPageReady(() => {
            for (let i = S - 1; i >= 0; i--) {
              gsap.delayedCall(0.25 + (S - 1 - i) * 0.035, () => strike(i, 0.3 + (i / S) * 0.4, 0.014));
            }
          });

      cleanup = () => {
        cancelReady();
        cancelAnimationFrame(raf);
        st?.kill();
        ro.disconnect();
        io.disconnect();
        window.removeEventListener("pointermove", onMove);
        geometry.dispose();
        material.dispose();
        renderer.dispose();
        // release the GPU context now; page transitions mount and unmount this repeatedly
        renderer.forceContextLoss();
        canvas.remove();
      };
    };

    // Start once the browser is idle so the headline and the page transition are never contended.
    const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
    const id = ric ? ric(() => void boot(), { timeout: 900 }) : window.setTimeout(() => void boot(), 250);

    return () => {
      disposed = true;
      const cic = (window as Window & { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback;
      if (ric && cic) cic(id);
      else window.clearTimeout(id);
      cleanup?.();
    };
  }, []);

  return <div ref={host} aria-hidden="true" className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} />;
};
