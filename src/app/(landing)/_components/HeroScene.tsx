"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Hero centerpiece: a lesson document on the left from which a small stack of
 * "draft question" cards floats out to the right — the AI/PDF-to-test story in
 * one glance. Raw three.js (no R3F) so it stays a single lazy chunk; mounted via
 * `next/dynamic({ ssr: false })` from the hero so it never blocks first paint.
 *
 * Brand-violet surfaces read on both the light and dark page backgrounds. The
 * canvas is transparent; a CSS glow behind it (in MainPage) supplies depth and
 * doubles as the graceful fallback if WebGL is unavailable.
 */

const VIOLET = 0x6a4ff0;
const VIOLET_LIGHT = 0x8e78ff;
const SUCCESS = 0x16b981;
const LINE = 0xd7dcf2;
const CARD_SURFACE = 0xf7f8ff;
const DOC_SURFACE = 0xffffff;

/** Rounded-rectangle profile used by every panel and bar in the scene. */
function roundedRectShape(w: number, h: number, r: number): THREE.Shape {
  const shape = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  const radius = Math.min(r, w / 2, h / 2);
  shape.moveTo(x + radius, y);
  shape.lineTo(x + w - radius, y);
  shape.quadraticCurveTo(x + w, y, x + w, y + radius);
  shape.lineTo(x + w, y + h - radius);
  shape.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  shape.lineTo(x + radius, y + h);
  shape.quadraticCurveTo(x, y + h, x, y + h - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);
  return shape;
}

function roundedPanelGeometry(w: number, h: number, r: number, depth: number): THREE.ExtrudeGeometry {
  const geo = new THREE.ExtrudeGeometry(roundedRectShape(w, h, r), {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.02,
    bevelSegments: 2,
    steps: 1,
    curveSegments: 14,
  });
  geo.center();
  return geo;
}

function surfaceMaterial(color: number): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.55, metalness: 0.05 });
}

/** A small content bar (header pill, text line, accent dot) sitting on a card face. */
function addBar(
  parent: THREE.Object3D,
  w: number,
  h: number,
  color: number,
  x: number,
  y: number,
  z: number,
  emissive = false,
): void {
  const mat = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.5,
    metalness: 0,
    emissive: new THREE.Color(emissive ? color : 0x000000),
    emissiveIntensity: emissive ? 0.5 : 0,
  });
  const mesh = new THREE.Mesh(roundedPanelGeometry(w, h, Math.min(w, h) / 2, 0.015), mat);
  mesh.position.set(x, y, z);
  parent.add(mesh);
}

type CardOptions = {
  w: number;
  h: number;
  surface?: number;
  accent?: number;
  /** Draw an "approved" check badge in the corner instead of an answer dot. */
  approved?: boolean;
};

/** A floating draft-question card: header pill, two text lines, and an accent. */
function makeCard({ w, h, surface = CARD_SURFACE, accent = VIOLET, approved = false }: CardOptions): THREE.Group {
  const group = new THREE.Group();
  const depth = 0.12;
  const body = new THREE.Mesh(roundedPanelGeometry(w, h, 0.16, depth), surfaceMaterial(surface));
  group.add(body);

  const faceZ = depth / 2 + 0.03;
  const padX = 0.26;
  const innerW = w - padX * 2;

  // Header pill + question number dot
  addBar(group, 0.16, 0.16, accent, -w / 2 + padX + 0.08, h / 2 - 0.34, faceZ, true);
  addBar(group, innerW * 0.5, 0.12, accent, -w / 2 + padX + 0.08 + 0.16 + innerW * 0.25, h / 2 - 0.34, faceZ);

  // Two text lines
  addBar(group, innerW, 0.1, LINE, 0, h * 0.02, faceZ);
  addBar(group, innerW * 0.7, 0.1, LINE, -innerW * 0.15, h * 0.02 - 0.26, faceZ);

  // Answer row: a couple of option ticks, with the last "selected"
  addBar(group, 0.12, 0.12, LINE, -w / 2 + padX + 0.06, -h / 2 + 0.32, faceZ);
  if (approved) {
    // Green check badge bottom-right
    const badge = new THREE.Mesh(roundedPanelGeometry(0.42, 0.42, 0.21, 0.05), surfaceMaterial(0xffffff));
    badge.position.set(w / 2 - 0.34, -h / 2 + 0.34, faceZ);
    group.add(badge);
    addBar(badge, 0.18, 0.06, SUCCESS, -0.02, -0.03, 0.05, true);
    addBar(badge, 0.1, 0.06, SUCCESS, 0.07, 0.0, 0.05, true);
  } else {
    addBar(group, 0.12, 0.12, accent, -w / 2 + padX + 0.06, -h / 2 + 0.32, faceZ + 0.005, true);
  }

  return group;
}

/** The lesson PDF the questions are drafted from. */
function makeDocument(): THREE.Group {
  const group = new THREE.Group();
  const w = 2.5;
  const h = 3.1;
  const depth = 0.14;
  const body = new THREE.Mesh(roundedPanelGeometry(w, h, 0.14, depth), surfaceMaterial(DOC_SURFACE));
  group.add(body);

  const faceZ = depth / 2 + 0.03;
  const padX = 0.34;
  const innerW = w - padX * 2;

  // Title block
  addBar(group, innerW * 0.6, 0.16, VIOLET, -innerW * 0.2, h / 2 - 0.46, faceZ, true);
  // Paragraph lines
  for (let i = 0; i < 7; i++) {
    const lineW = i % 3 === 2 ? innerW * 0.55 : innerW;
    addBar(group, lineW, 0.08, LINE, -(innerW - lineW) / 2, h / 2 - 0.9 - i * 0.28, faceZ);
  }
  return group;
}

export default function HeroScene({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    } catch {
      return; // No WebGL — CSS glow fallback behind the canvas stays visible.
    }

    const width = container.clientWidth || 1;
    const height = container.clientHeight || 1;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    // updateStyle=false: never let three.js write an inline px width/height onto
    // the canvas. CSS below keeps it locked to the container, so it can't overflow
    // the viewport when the layout shrinks (the buffer still resizes for crispness).
    renderer.setSize(width, height, false);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.4);

    // Lighting: soft ambient fill + a key light for form + a violet rim for brand glow.
    scene.add(new THREE.AmbientLight(0xffffff, 0.85));
    const key = new THREE.DirectionalLight(0xffffff, 1.5);
    key.position.set(3, 4, 6);
    scene.add(key);
    const rim = new THREE.PointLight(VIOLET_LIGHT, 14, 30);
    rim.position.set(-4, -1.5, 3);
    scene.add(rim);
    const topViolet = new THREE.DirectionalLight(VIOLET_LIGHT, 0.5);
    topViolet.position.set(-2, 5, 2);
    scene.add(topViolet);

    const root = new THREE.Group();
    scene.add(root);

    // Document, tilted, at back-left.
    const doc = makeDocument();
    doc.position.set(-1.9, -0.1, -0.7);
    doc.rotation.set(0.06, 0.34, 0.04);
    root.add(doc);

    // Three drafted-question cards fanning out to the right at varied depths.
    type Floater = { mesh: THREE.Group; baseY: number; phase: number; amp: number; spin: number };
    const floaters: Floater[] = [];

    const cardA = makeCard({ w: 2.5, h: 1.55, approved: true });
    cardA.position.set(1.15, 0.72, 0.7);
    cardA.rotation.set(0.05, -0.32, -0.04);
    root.add(cardA);
    floaters.push({ mesh: cardA, baseY: 0.72, phase: 0, amp: 0.14, spin: 0.03 });

    const cardB = makeCard({ w: 2.3, h: 1.4 });
    cardB.position.set(0.75, -1.0, 0.25);
    cardB.rotation.set(0.04, -0.28, 0.05);
    root.add(cardB);
    floaters.push({ mesh: cardB, baseY: -1.0, phase: 1.7, amp: 0.18, spin: -0.035 });

    const cardC = makeCard({ w: 1.95, h: 1.2, surface: 0xffffff, accent: VIOLET_LIGHT });
    cardC.position.set(1.95, -0.25, -0.5);
    cardC.rotation.set(0.05, -0.36, -0.02);
    root.add(cardC);
    floaters.push({ mesh: cardC, baseY: -0.25, phase: 3.1, amp: 0.12, spin: 0.028 });

    // A few small violet accent chips for life and depth.
    const chips: Floater[] = [];
    const chipDefs = [
      { x: -0.35, y: 1.7, z: 1.2, s: 0.26, c: VIOLET },
      { x: 2.9, y: 1.3, z: 0.4, s: 0.2, c: VIOLET_LIGHT },
      { x: -0.1, y: -1.9, z: 0.9, s: 0.22, c: VIOLET_LIGHT },
    ];
    for (const def of chipDefs) {
      const mat = new THREE.MeshStandardMaterial({
        color: def.c,
        roughness: 0.4,
        metalness: 0.1,
        emissive: new THREE.Color(def.c),
        emissiveIntensity: 0.45,
      });
      const chip = new THREE.Group();
      const mesh = new THREE.Mesh(roundedPanelGeometry(def.s, def.s, def.s / 2.4, 0.06), mat);
      chip.add(mesh);
      chip.position.set(def.x, def.y, def.z);
      chip.rotation.set(0.1, -0.3, Math.PI / 4);
      root.add(chip);
      chips.push({ mesh: chip, baseY: def.y, phase: def.x * 2, amp: 0.16, spin: 0.5 });
    }

    const baseRotY = -0.18;
    const baseRotX = 0.08;
    root.rotation.set(baseRotX, baseRotY, 0);

    // Pointer parallax target (normalised −1..1), lerped each frame.
    const pointer = { x: 0, y: 0 };
    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    };
    if (!prefersReduced) window.addEventListener("pointermove", onPointerMove, { passive: true });

    const clock = new THREE.Clock();
    let frame = 0;
    const renderFrame = () => {
      const t = clock.getElapsedTime();

      const targetRotY = baseRotY + pointer.x * 0.22 + Math.sin(t * 0.3) * 0.05;
      const targetRotX = baseRotX + pointer.y * 0.14;
      root.rotation.y += (targetRotY - root.rotation.y) * 0.06;
      root.rotation.x += (targetRotX - root.rotation.x) * 0.06;

      for (const f of floaters) {
        f.mesh.position.y = f.baseY + Math.sin(t * 0.9 + f.phase) * f.amp;
        f.mesh.rotation.z = Math.sin(t * 0.7 + f.phase) * f.spin;
      }
      for (const c of chips) {
        c.mesh.position.y = c.baseY + Math.sin(t * 1.2 + c.phase) * c.amp;
        c.mesh.rotation.z += 0.004;
      }

      renderer.render(scene, camera);
      frame = requestAnimationFrame(renderFrame);
    };

    if (prefersReduced) {
      renderer.render(scene, camera); // single static, well-composed frame
    } else {
      frame = requestAnimationFrame(renderFrame);
    }

    const resize = () => {
      const w = container.clientWidth || 1;
      const h = container.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      if (prefersReduced) renderer.render(scene, camera);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(container);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          const mat = obj.material;
          if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
          else mat.dispose();
        }
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className={className} aria-hidden="true" />;
}
