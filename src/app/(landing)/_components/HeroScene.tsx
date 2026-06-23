"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Hero centerpiece: a lesson document on the left from which a small stack of
 * "draft question" cards floats out to the right — the AI/PDF-to-test story in
 * one glance. Raw three.js (no R3F) so it stays a single lazy chunk; mounted via
 * `next/dynamic({ ssr: false })` from the hero so it never blocks first paint.
 *
 * The narrative labels ("Lesson PDF", "AI draft", "Ready to review") are drawn
 * onto the card faces themselves (canvas textures), so the words live *on* the
 * surfaces and tilt with them — no separate HTML tags floating in front.
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

// CSS colours for the canvas-texture text drawn onto the surfaces.
const INK_CSS = "#0F1537";
const WHITE_CSS = "#FFFFFF";
const VIOLET_CSS = "#6A5DE9";
const VIOLET_SOFT_CSS = "#EFEBFF";
const SUCCESS_CSS = "#0A8F61";

/** Draws crisp text onto a card/document face. Provided by the component (it
 *  needs the renderer's anisotropy + the page font), passed into the builders. */
type AddLabel = (
  parent: THREE.Object3D,
  text: string,
  opts: {
    x: number;
    y: number;
    z: number;
    /** World height of the text line box. */
    height: number;
    /** Hard cap on world width; longer translations shrink to fit the card. */
    maxWidth: number;
    color?: string;
    weight?: number;
    anchor?: "left" | "center";
    background?: string;
    borderColor?: string;
    paddingX?: number;
    paddingY?: number;
    radius?: number;
    textStrokeColor?: string;
    textStrokeWidth?: number;
  },
) => void;

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

function drawRoundedCanvasRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
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
  /** Real header text drawn onto the card face (replaces the abstract pill). */
  title?: string;
  titleColor?: string;
  titleBackground?: string;
  titleBorder?: string;
};

/** A floating draft-question card: header (real title or pill), text lines, accent. */
function makeCard(
  {
    w,
    h,
    surface = CARD_SURFACE,
    accent = VIOLET,
    approved = false,
    title,
    titleColor = WHITE_CSS,
    titleBackground = VIOLET_CSS,
    titleBorder = "rgba(255,255,255,0.64)",
  }: CardOptions,
  addLabel: AddLabel,
): THREE.Group {
  const group = new THREE.Group();
  const depth = 0.12;
  const body = new THREE.Mesh(roundedPanelGeometry(w, h, 0.16, depth), surfaceMaterial(surface));
  group.add(body);

  const faceZ = depth / 2 + 0.03;
  const padX = 0.26;
  const innerW = w - padX * 2;

  // Header: a small accent dot + either the real card title or an abstract pill.
  addBar(group, 0.16, 0.16, accent, -w / 2 + padX + 0.08, h / 2 - 0.34, faceZ, true);
  if (title) {
    addLabel(group, title, {
      x: -w / 2 + padX + 0.34,
      y: h / 2 - 0.34,
      z: faceZ + 0.02,
      height: 0.34,
      maxWidth: innerW - 0.34,
      color: titleColor,
      weight: 800,
      background: titleBackground,
      borderColor: titleBorder,
      paddingX: 30,
      paddingY: 12,
      textStrokeColor: "rgba(15,21,55,0.18)",
      textStrokeWidth: 3,
    });
  } else {
    addBar(group, innerW * 0.5, 0.12, accent, -w / 2 + padX + 0.08 + 0.16 + innerW * 0.25, h / 2 - 0.34, faceZ);
  }

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
function makeDocument(addLabel: AddLabel, title: string): THREE.Group {
  const group = new THREE.Group();
  const w = 2.5;
  const h = 3.1;
  const depth = 0.14;
  const body = new THREE.Mesh(roundedPanelGeometry(w, h, 0.14, depth), surfaceMaterial(DOC_SURFACE));
  group.add(body);

  const faceZ = depth / 2 + 0.03;
  const padX = 0.34;
  const innerW = w - padX * 2;

  // Title block — real document title on the page.
  if (title) {
    addLabel(group, title, {
      x: -innerW / 2,
      y: h / 2 - 0.5,
      z: faceZ + 0.02,
      height: 0.36,
      maxWidth: innerW,
      color: WHITE_CSS,
      weight: 800,
      background: VIOLET_CSS,
      borderColor: VIOLET_SOFT_CSS,
      paddingX: 34,
      paddingY: 12,
      textStrokeColor: "rgba(15,21,55,0.24)",
      textStrokeWidth: 3,
    });
  } else {
    addBar(group, innerW * 0.6, 0.16, VIOLET, -innerW * 0.2, h / 2 - 0.46, faceZ, true);
  }
  // Paragraph lines
  for (let i = 0; i < 7; i++) {
    const lineW = i % 3 === 2 ? innerW * 0.55 : innerW;
    addBar(group, lineW, 0.08, LINE, -(innerW - lineW) / 2, h / 2 - 0.9 - i * 0.28, faceZ);
  }
  return group;
}

type HeroLabels = { document: string; draft: string; ready: string; editable?: string; flow?: string };

export default function HeroScene({ className, labels }: { className?: string; labels?: HeroLabels }) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Primitive deps (not the object) so the scene only rebuilds when the text
  // actually changes — e.g. a language switch — not on every parent re-render.
  const documentLabel = labels?.document ?? "";
  const draftLabel = labels?.draft ?? "";
  const readyLabel = labels?.ready ?? "";
  const editableLabel = labels?.editable ?? "";
  const flowLabel = labels?.flow ?? "";

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

    // --- Text-on-surface helper -------------------------------------------------
    // Draw `text` to a high-DPI canvas and map it onto a thin plane so the words
    // sit on the card face and tilt with it. Width is capped to `maxWidth` so a
    // long translation shrinks to fit rather than spilling past the card edge.
    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
    const fontFamily =
      (typeof document !== "undefined" && getComputedStyle(document.body).fontFamily) ||
      "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";

    const addLabel: AddLabel = (parent, text, opts) => {
      if (!text) return;
      const {
        x,
        y,
        z,
        height: lineWorldH,
        maxWidth,
        color = INK_CSS,
        weight = 700,
        anchor = "left",
        background,
        borderColor,
        paddingX = background ? 26 : 0,
        paddingY = background ? 10 : 0,
        radius,
        textStrokeColor,
        textStrokeWidth = 0,
      } = opts;

      const fontPx = 64;
      const font = `${weight} ${fontPx}px ${fontFamily}`;
      const lineH = Math.round(fontPx * 1.28);

      const measureCtx = document.createElement("canvas").getContext("2d");
      if (!measureCtx) return;
      measureCtx.font = font;
      const textW = Math.max(1, Math.ceil(measureCtx.measureText(text).width));
      const logicalW = textW + paddingX * 2;
      const logicalH = lineH + paddingY * 2;

      const dpr = 2; // supersample for crispness at small on-screen sizes
      const canvas = document.createElement("canvas");
      canvas.width = logicalW * dpr;
      canvas.height = logicalH * dpr;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.scale(dpr, dpr);

      if (background) {
        drawRoundedCanvasRect(ctx, 0, 0, logicalW, logicalH, radius ?? logicalH / 2);
        ctx.fillStyle = background;
        ctx.fill();
        if (borderColor) {
          ctx.strokeStyle = borderColor;
          ctx.lineWidth = 3;
          ctx.stroke();
        }
      }

      ctx.font = font;
      ctx.fillStyle = color;
      ctx.textBaseline = "middle";
      ctx.textAlign = "left";
      if (textStrokeColor && textStrokeWidth > 0) {
        ctx.lineJoin = "round";
        ctx.strokeStyle = textStrokeColor;
        ctx.lineWidth = textStrokeWidth;
        ctx.strokeText(text, paddingX, logicalH / 2);
      }
      ctx.fillText(text, paddingX, logicalH / 2);

      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = maxAnisotropy;
      texture.needsUpdate = true;

      const aspect = logicalW / logicalH;
      let worldW = lineWorldH * aspect;
      let worldH = lineWorldH;
      if (worldW > maxWidth) {
        worldW = maxWidth;
        worldH = maxWidth / aspect;
      }

      const mat = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
        toneMapped: false,
      });
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(worldW, worldH), mat);
      mesh.position.set(anchor === "left" ? x + worldW / 2 : x, y, z);
      parent.add(mesh);
    };
    // ---------------------------------------------------------------------------

    const root = new THREE.Group();
    scene.add(root);

    if (flowLabel) {
      addLabel(root, flowLabel, {
        x: 0.35,
        y: 2.0,
        z: 1.25,
        height: 0.36,
        maxWidth: 2.9,
        color: WHITE_CSS,
        weight: 800,
        anchor: "center",
        background: VIOLET_CSS,
        borderColor: VIOLET_SOFT_CSS,
        paddingX: 38,
        paddingY: 14,
        textStrokeColor: "rgba(15,21,55,0.22)",
        textStrokeWidth: 3,
      });
    }

    // Document, tilted, at back-left.
    const doc = makeDocument(addLabel, documentLabel);
    doc.position.set(-1.9, -0.1, -0.7);
    doc.rotation.set(0.06, 0.34, 0.04);
    root.add(doc);

    // Three drafted-question cards fanning out to the right at varied depths.
    type Floater = { mesh: THREE.Group; baseY: number; phase: number; amp: number; spin: number };
    const floaters: Floater[] = [];

    const cardA = makeCard(
      {
        w: 2.5,
        h: 1.55,
        approved: true,
        title: readyLabel,
        titleBackground: SUCCESS_CSS,
      },
      addLabel,
    );
    cardA.position.set(1.15, 0.72, 0.7);
    cardA.rotation.set(0.05, -0.32, -0.04);
    root.add(cardA);
    floaters.push({ mesh: cardA, baseY: 0.72, phase: 0, amp: 0.14, spin: 0.03 });

    const cardB = makeCard({ w: 2.3, h: 1.4, title: draftLabel }, addLabel);
    cardB.position.set(0.75, -1.0, 0.25);
    cardB.rotation.set(0.04, -0.28, 0.05);
    root.add(cardB);
    floaters.push({ mesh: cardB, baseY: -1.0, phase: 1.7, amp: 0.18, spin: -0.035 });

    const cardC = makeCard(
      {
        w: 1.95,
        h: 1.2,
        surface: 0xffffff,
        accent: VIOLET_LIGHT,
        title: editableLabel,
        titleBackground: "#4B36C9",
      },
      addLabel,
    );
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

    // Pointer parallax target (normalised), lerped each frame. Measured from the
    // scene centre in half-container units: ~0 at centre, ~1 at the card edge,
    // and >1 as the cursor moves away across the page.
    const pointer = { x: 0, y: 0 };
    const MAX_REACH = 2.4; // past this the cursor is "too far" — stop chasing it
    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const ny = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      const dist = Math.hypot(nx, ny);

      if (dist > MAX_REACH) {
        // Too far away — let the model settle back to its resting pose.
        pointer.x = 0;
        pointer.y = 0;
        return;
      }
      // Ease influence to zero across the outer band so there's no hard snap.
      const falloff = dist <= 1 ? 1 : Math.max(0, 1 - (dist - 1) / (MAX_REACH - 1));
      pointer.x = THREE.MathUtils.clamp(nx, -1, 1) * falloff;
      pointer.y = THREE.MathUtils.clamp(ny, -1, 1) * falloff;
    };
    if (!prefersReduced) window.addEventListener("pointermove", onPointerMove, { passive: true });

    const clock = new THREE.Clock();
    let elapsed = 0; // own accumulator so pausing/resuming never jumps the motion
    let frame = 0;
    let running = false;

    const renderFrame = () => {
      elapsed += clock.getDelta();
      const t = elapsed;

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

    const startLoop = () => {
      if (running || prefersReduced) return;
      running = true;
      clock.getDelta(); // drop the paused interval so motion resumes where it left off
      frame = requestAnimationFrame(renderFrame);
    };
    const stopLoop = () => {
      if (!running) return;
      running = false;
      cancelAnimationFrame(frame);
    };

    // Always paint one composed frame so the hero is correct before the loop runs
    // (and is the single static frame under reduced motion / while paused).
    renderer.render(scene, camera);

    // Only animate while the scene is actually on-screen AND the tab is visible —
    // no wasted GPU churn when scrolled away or backgrounded.
    let onScreen = false;
    const sync = () => {
      if (onScreen && !document.hidden) startLoop();
      else stopLoop();
    };
    let io: IntersectionObserver | undefined;
    if (!prefersReduced) {
      io = new IntersectionObserver(
        (entries) => {
          onScreen = entries[0]?.isIntersecting ?? false;
          sync();
        },
        { threshold: 0.01 },
      );
      io.observe(container);
      document.addEventListener("visibilitychange", sync);
    }

    const resize = () => {
      const w = container.clientWidth || 1;
      const h = container.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      if (!running) renderer.render(scene, camera); // keep the static/paused frame correct
    };
    const observer = new ResizeObserver(resize);
    observer.observe(container);

    return () => {
      cancelAnimationFrame(frame);
      io?.disconnect();
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("pointermove", onPointerMove);
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          const mat = obj.material;
          const mats = Array.isArray(mat) ? mat : [mat];
          for (const m of mats) {
            const map = (m as THREE.MeshBasicMaterial).map;
            if (map) map.dispose();
            m.dispose();
          }
        }
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [documentLabel, draftLabel, readyLabel, editableLabel, flowLabel]);

  return <div ref={containerRef} className={className} aria-hidden="true" />;
}
