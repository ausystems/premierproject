import { useEffect, useRef } from "react";
import { gsap, isTouch, prefersReducedMotion } from "@/lib/gsap";

type Props = {
  /** Index of the hovered row, or null. */
  active: number | null;
  /** One still per row (they may repeat). Rendered as luminance only. */
  images: string[];
};

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;

// Luminance-only output keeps the monochrome rule inside the GPU path. Displacement peaks
// mid-reveal (p * (1 - p)), a soft inset mask opens with progress, one octave of grain on top.
const FRAG = /* glsl */ `
  precision highp float;
  uniform sampler2D uMap;
  uniform float uProgress;
  uniform float uTime;
  uniform float uSeed;
  uniform vec2 uImage;
  uniform vec2 uPlane;
  varying vec2 vUv;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    float a = hash(i), b = hash(i + vec2(1.0, 0.0)), c = hash(i + vec2(0.0, 1.0)), d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  void main() {
    // cover-fit the texture inside the plane
    float pa = uPlane.x / uPlane.y, ia = uImage.x / uImage.y;
    vec2 uv = vUv - 0.5;
    if (ia > pa) uv.x *= pa / ia; else uv.y *= ia / pa;
    uv += 0.5;

    float bell = uProgress * (1.0 - uProgress) * 4.0;
    float n = noise(uv * 3.0 + uSeed + uTime * 0.15);
    uv += (n - 0.5) * 0.12 * bell;

    vec4 c = texture2D(uMap, uv);
    float l = dot(c.rgb, vec3(0.299, 0.587, 0.114));
    l += (hash(vUv * 900.0 + uTime) - 0.5) * 0.06;

    float inset = mix(0.5, 0.0, smoothstep(0.0, 1.0, uProgress));
    vec2 d = abs(vUv - 0.5);
    float mask = 1.0 - smoothstep(0.5 - inset - 0.01, 0.5 - inset, max(d.x, d.y));
    gl_FragColor = vec4(vec3(l), mask * uProgress);
  }
`;

/**
 * The site's one WebGL moment: a monochrome still follows the cursor over the program rows.
 * Gated to fine pointers at 1024px and up with motion allowed; three.js is loaded on demand and the
 * loop stops whenever nothing is hovered. Touch gets the same still inline under each row instead.
 */
export const RowFollower = ({ active, images }: Props) => {
  const host = useRef<HTMLDivElement>(null);
  const state = useRef<{ progress: { v: number }; setActive?: (i: number | null) => void }>({ progress: { v: 0 } });

  useEffect(() => {
    const el = host.current;
    if (!el || isTouch() || prefersReducedMotion() || window.innerWidth < 1024) return;

    let disposed = false;
    let raf = 0;
    let renderer: import("three").WebGLRenderer | null = null;

    (async () => {
      const THREE = await import("three");
      if (disposed) return;

      const W = window.innerWidth, H = window.innerHeight;
      try {
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: "high-performance" });
      } catch { return; }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setSize(W, H);
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-W / 2, W / 2, H / 2, -H / 2, 0.1, 10);
      camera.position.z = 1;

      const PW = 260, PH = 340;
      const loader = new THREE.TextureLoader();
      const textures = await Promise.all(
        images.map((src) => new Promise<import("three").Texture>((res) => loader.load(src, (t) => { t.colorSpace = THREE.SRGBColorSpace; res(t); }, undefined, () => res(new THREE.Texture()))))
      );
      if (disposed) return;

      const material = new THREE.ShaderMaterial({
        transparent: true,
        depthTest: false,
        vertexShader: VERT,
        fragmentShader: FRAG,
        uniforms: {
          uMap: { value: textures[0] },
          uProgress: { value: 0 },
          uTime: { value: 0 },
          uSeed: { value: 0 },
          uImage: { value: new THREE.Vector2(1, 1) },
          uPlane: { value: new THREE.Vector2(PW, PH) },
        },
      });
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(PW, PH), material);
      scene.add(mesh);

      const target = { x: W / 2, y: H / 2 };
      const pos = { x: W / 2, y: H / 2 };
      const onMove = (e: MouseEvent) => { target.x = e.clientX; target.y = e.clientY; };
      window.addEventListener("mousemove", onMove, { passive: true });

      const onResize = () => {
        const w = window.innerWidth, h = window.innerHeight;
        renderer?.setSize(w, h);
        camera.left = -w / 2; camera.right = w / 2; camera.top = h / 2; camera.bottom = -h / 2;
        camera.updateProjectionMatrix();
      };
      window.addEventListener("resize", onResize);

      let running = false;
      let idle = 0;
      const loop = () => {
        if (disposed) return;
        pos.x += (target.x - pos.x) * 0.12;
        pos.y += (target.y - pos.y) * 0.12;
        mesh.position.set(pos.x - window.innerWidth / 2 + PW * 0.55, window.innerHeight / 2 - pos.y - PH * 0.1, 0);
        material.uniforms.uTime.value += 0.016;
        material.uniforms.uProgress.value = state.current.progress.v;
        renderer!.render(scene, camera);
        // stop rendering once fully faded out and the cursor has settled
        if (state.current.progress.v < 0.001 && Math.abs(target.x - pos.x) < 0.5) idle += 1; else idle = 0;
        if (idle > 30) { running = false; return; }
        raf = requestAnimationFrame(loop);
      };
      const start = () => { if (!running) { running = true; idle = 0; raf = requestAnimationFrame(loop); } };

      state.current.setActive = (i) => {
        if (i !== null && textures[i % textures.length]) {
          const t = textures[i % textures.length];
          material.uniforms.uMap.value = t;
          const img = t.image as { width?: number; height?: number } | undefined;
          material.uniforms.uImage.value.set(img?.width || 1, img?.height || 1);
          material.uniforms.uSeed.value = i * 3.7;
          gsap.to(state.current.progress, { v: 1, duration: 0.8, ease: "power3.out", overwrite: true });
        } else {
          gsap.to(state.current.progress, { v: 0, duration: 0.45, ease: "power2.out", overwrite: true });
        }
        start();
      };
      start();

      const cleanup = () => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("resize", onResize);
        cancelAnimationFrame(raf);
        material.dispose();
        mesh.geometry.dispose();
        textures.forEach((t) => t.dispose());
        renderer?.dispose();
        renderer?.domElement.remove();
      };
      (state.current as { cleanup?: () => void }).cleanup = cleanup;
    })();

    return () => {
      disposed = true;
      (state.current as { cleanup?: () => void }).cleanup?.();
    };
  }, [images]);

  useEffect(() => {
    state.current.setActive?.(active);
  }, [active]);

  return <div ref={host} aria-hidden="true" className="pointer-events-none fixed inset-0 z-30 hidden lg:block" />;
};
