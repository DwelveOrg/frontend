"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Hero centerpiece: a violet "brand book" (the Dwelve open-book mark, in 3D) at
 * the core, orbited by a small constellation of drafted-question cards and
 * glowing data nodes, each tethered to the book by a thin light thread. It reads
 * as "one source of knowledge → tests and insight radiating out of it" in a
 * single glance, and leans on the brand mark itself rather than a literal
 * document-to-cards diagram.
 *
 * Built in raw three.js (no R3F) so it stays a single lazy chunk; mounted via
 * `next/dynamic({ ssr: false })` from the hero so it never blocks first paint.
 * Card/page labels are drawn onto the surfaces themselves (canvas textures) so
 * the words live *on* the model and tilt with it. The canvas is transparent; a
 * CSS glow behind it (in MainPage) supplies depth and is the graceful fallback
 * if WebGL is unavailable.
 */

const VIOLET = 0x6a4ff0;
const VIOLET_LIGHT = 0x8e78ff;
const VIOLET_DEEP = 0x5739d6;
const SUCCESS = 0x16b981;
const LINE = 0xd7dcf2;
const CARD_SURFACE = 0xf7f8ff;
const PAGE_SURFACE = 0xffffff;

// CSS colours for the canvas-texture text drawn onto the surfaces.
const WHITE_CSS = "#FFFFFF";
const INK_CSS = "#0F1430";
const VIOLET_CSS = "#6A4FF0";
const VIOLET_SOFT_CSS = "#EFEBFF";
const VIOLET_DEEP_CSS = "#4B36C9";
const SUCCESS_CSS = "#0A8F61";

/** Draws crisp text onto a card/page face. Provided by the component (it needs
 *  the renderer's anisotropy + the page font), passed into the builders. */
type AddLabel = (
  parent: THREE.Object3D,
  text: string,
  opts: {
    x: number;
    y: number;
    z: number;
    /** World height of the text line box. */
    height: number;
    /** Hard cap on world width; longer translations shrink to fit the surface. */
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

/** A small content bar (header pill, text line, accent dot) sitting on a face. */
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
  accent?: number;
  /** Draw an "approved" check badge in the corner. */
  approved?: boolean;
  title?: string;
  titleBackground?: string;
};

/** A floating orbit card: accent dot, a real title pill, two text lines. */
function makeOrbitCard(
  { w, h, accent = VIOLET, approved = false, title, titleBackground = VIOLET_CSS }: CardOptions,
  addLabel: AddLabel,
): THREE.Group {
  const group = new THREE.Group();
  const depth = 0.12;
  const body = new THREE.Mesh(roundedPanelGeometry(w, h, 0.16, depth), surfaceMaterial(CARD_SURFACE));
  group.add(body);

  const faceZ = depth / 2 + 0.03;
  const padX = 0.22;
  const innerW = w - padX * 2;

  addBar(group, 0.14, 0.14, accent, -w / 2 + padX + 0.07, h / 2 - 0.3, faceZ, true);
  if (title) {
    addLabel(group, title, {
      x: -w / 2 + padX + 0.3,
      y: h / 2 - 0.3,
      z: faceZ + 0.008,
      height: 0.3,
      maxWidth: innerW - 0.3,
      color: WHITE_CSS,
      weight: 800,
      background: titleBackground,
      borderColor: "rgba(255,255,255,0.62)",
      paddingX: 28,
      paddingY: 11,
      textStrokeColor: "rgba(15,20,48,0.18)",
      textStrokeWidth: 3,
    });
  }

  addBar(group, innerW, 0.09, LINE, 0, -h * 0.02, faceZ);
  addBar(group, innerW * 0.62, 0.09, LINE, -innerW * 0.19, -h * 0.02 - 0.24, faceZ);

  if (approved) {
    const badge = new THREE.Mesh(roundedPanelGeometry(0.36, 0.36, 0.18, 0.05), surfaceMaterial(0xffffff));
    badge.position.set(w / 2 - 0.3, -h / 2 + 0.3, faceZ);
    group.add(badge);
    addBar(badge, 0.16, 0.055, SUCCESS, -0.02, -0.025, 0.05, true);
    addBar(badge, 0.09, 0.055, SUCCESS, 0.06, 0.005, 0.05, true);
  }

  return group;
}

/** The central brand mark: an open book (two violet-edged pages on a spine). */
function makeBook(addLabel: AddLabel, headerText: string): THREE.Group {
  const book = new THREE.Group();
  const pageW = 1.65;
  const pageH = 2.1;
  const pageD = 0.08;
  const open = 0.44; // radians each page opens toward the camera

  const buildPage = (side: 1 | -1) => {
    const pivot = new THREE.Group();
    const page = new THREE.Mesh(
      roundedPanelGeometry(pageW, pageH, 0.1, pageD),
      surfaceMaterial(side < 0 ? PAGE_SURFACE : CARD_SURFACE),
    );
    page.position.x = (side * pageW) / 2;
    pivot.add(page);
    // Violet cover sits a touch behind + larger, so the brand colour frames the page edge.
    const cover = new THREE.Mesh(
      roundedPanelGeometry(pageW + 0.16, pageH + 0.16, 0.12, pageD * 1.1),
      surfaceMaterial(VIOLET),
    );
    cover.position.set((side * pageW) / 2, 0, -pageD * 0.85);
    pivot.add(cover);
    pivot.rotation.y = side * open;
    return { pivot, page };
  };

  const left = buildPage(-1);
  const right = buildPage(1);
  book.add(left.pivot, right.pivot);

  const spine = new THREE.Mesh(
    roundedPanelGeometry(0.18, pageH + 0.12, 0.08, 0.18),
    new THREE.MeshStandardMaterial({
      color: VIOLET_DEEP,
      roughness: 0.4,
      metalness: 0.1,
      emissive: new THREE.Color(VIOLET),
      emissiveIntensity: 0.25,
    }),
  );
  spine.position.set(0, 0, -0.04);
  book.add(spine);

  const faceZ = pageD / 2 + 0.03;
  const padX = 0.26;
  const innerW = pageW - padX * 2;

  // Left page: real header (the "Lesson PDF" label) + paragraph lines.
  if (headerText) {
    addLabel(left.page, headerText, {
      x: -pageW / 2 + padX,
      y: pageH / 2 - 0.42,
      z: faceZ + 0.008,
      height: 0.32,
      maxWidth: innerW,
      color: WHITE_CSS,
      weight: 800,
      background: VIOLET_CSS,
      borderColor: VIOLET_SOFT_CSS,
      paddingX: 30,
      paddingY: 11,
      textStrokeColor: "rgba(15,20,48,0.22)",
      textStrokeWidth: 3,
    });
  } else {
    addBar(left.page, innerW * 0.6, 0.14, VIOLET, -innerW * 0.2, pageH / 2 - 0.4, faceZ, true);
  }
  for (let i = 0; i < 5; i++) {
    const lw = i % 3 === 2 ? innerW * 0.55 : innerW;
    addBar(left.page, lw, 0.08, LINE, -(innerW - lw) / 2, pageH / 2 - 0.95 - i * 0.26, faceZ);
  }

  // Right page: paragraph lines + a settled "graded" check.
  for (let i = 0; i < 5; i++) {
    const lw = i % 4 === 3 ? innerW * 0.5 : innerW;
    addBar(right.page, lw, 0.08, LINE, -(innerW - lw) / 2, pageH / 2 - 0.5 - i * 0.26, faceZ);
  }
  const badge = new THREE.Mesh(roundedPanelGeometry(0.4, 0.4, 0.2, 0.05), surfaceMaterial(0xffffff));
  badge.position.set(pageW / 2 - 0.34, -pageH / 2 + 0.36, faceZ);
  right.page.add(badge);
  addBar(badge, 0.17, 0.06, SUCCESS, -0.02, -0.03, 0.05, true);
  addBar(badge, 0.1, 0.06, SUCCESS, 0.06, 0.0, 0.05, true);

  return book;
}

type HeroLabels = { document: string; draft: string; ready: string; editable?: string };

export default function HeroScene({ className, labels }: { className?: string; labels?: HeroLabels }) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Primitive deps (not the object) so the scene only rebuilds when the text
  // actually changes — e.g. a language switch — not on every parent re-render.
  const documentLabel = labels?.document ?? "";
  const draftLabel = labels?.draft ?? "";
  const readyLabel = labels?.ready ?? "";
  const editableLabel = labels?.editable ?? "";

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
    camera.position.set(0, 0, 7.6);

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

    // --- Composition -----------------------------------------------------------
    // The brand book at the core (its own group so it can sway independently),
    // then question cards + data nodes scattered in the front hemisphere, each
    // tethered to the book by a light thread. Cards stay camera-facing so their
    // labels read; the whole thing bobs and pulses rather than spinning, so text
    // never turns away.
    const core = new THREE.Group();
    root.add(core);
    const baseBookTiltX = -0.1;
    core.rotation.set(baseBookTiltX, 0, 0);
    core.add(makeBook(addLabel, documentLabel));

    type Floater = { mesh: THREE.Group; baseX: number; baseY: number; phase: number; amp: number; drift: number };
    const cards: Floater[] = [];
    const cardDefs = [
      { x: -1.95, y: 1.0, z: 0.7, w: 1.5, h: 0.92, title: draftLabel, bg: VIOLET_CSS, accent: VIOLET, phase: 1.2, amp: 0.12, drift: 0.06, approved: false },
      { x: 2.05, y: 0.12, z: 0.85, w: 1.46, h: 0.9, title: editableLabel, bg: VIOLET_DEEP_CSS, accent: VIOLET_LIGHT, phase: 2.7, amp: 0.1, drift: 0.05, approved: false },
      { x: -1.4, y: -1.5, z: 0.95, w: 1.5, h: 0.9, title: readyLabel, bg: SUCCESS_CSS, accent: VIOLET, phase: 0.4, amp: 0.13, drift: 0.07, approved: true },
    ];
    for (const d of cardDefs) {
      const card = makeOrbitCard(
        { w: d.w, h: d.h, title: d.title, titleBackground: d.bg, accent: d.accent, approved: !!d.approved },
        addLabel,
      );
      card.position.set(d.x, d.y, d.z);
      card.rotation.set(0.06, d.x > 0 ? -0.22 : 0.22, 0);
      root.add(card);
      cards.push({ mesh: card, baseX: d.x, baseY: d.y, phase: d.phase, amp: d.amp, drift: d.drift });
    }

    type Node = { mesh: THREE.Mesh; mat: THREE.MeshStandardMaterial; phase: number };
    const nodes: Node[] = [];
    const nodeDefs = [
      { x: 1.5, y: 1.65, z: 0.4, r: 0.13, c: VIOLET },
      { x: -2.5, y: -0.25, z: 0.3, r: 0.1, c: VIOLET_LIGHT },
      { x: 2.55, y: -1.35, z: 0.5, r: 0.12, c: VIOLET_LIGHT },
      { x: -0.5, y: 2.1, z: 0.5, r: 0.09, c: VIOLET },
      { x: 0.85, y: -2.05, z: 0.4, r: 0.11, c: VIOLET_LIGHT },
    ];
    for (const d of nodeDefs) {
      const mat = new THREE.MeshStandardMaterial({
        color: d.c,
        roughness: 0.35,
        metalness: 0.1,
        emissive: new THREE.Color(d.c),
        emissiveIntensity: 0.7,
      });
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(d.r, 24, 24), mat);
      mesh.position.set(d.x, d.y, d.z);
      root.add(mesh);
      nodes.push({ mesh, mat, phase: d.x * 1.7 + d.y });
    }

    // Light threads: book core → each card + a few nodes. Geometry is rewritten
    // each frame so the lines track the bobbing cards (cheap — ~6 two-point lines).
    type Thread = { posAttr: THREE.BufferAttribute; to: THREE.Object3D };
    const threads: Thread[] = [];
    const threadFrom = new THREE.Vector3(0, 0, 0.12);
    const makeThread = (toObj: THREE.Object3D, opacity: number) => {
      const geo = new THREE.BufferGeometry();
      const posAttr = new THREE.BufferAttribute(new Float32Array(6), 3);
      geo.setAttribute("position", posAttr);
      const line = new THREE.Line(
        geo,
        new THREE.LineBasicMaterial({ color: VIOLET_LIGHT, transparent: true, opacity }),
      );
      root.add(line);
      threads.push({ posAttr, to: toObj });
    };
    cards.forEach((c) => makeThread(c.mesh, 0.34));
    [nodes[0], nodes[1], nodes[2]].forEach((n) => makeThread(n.mesh, 0.24));

    const updateThreads = () => {
      for (const th of threads) {
        const arr = th.posAttr.array as Float32Array;
        arr[0] = threadFrom.x;
        arr[1] = threadFrom.y;
        arr[2] = threadFrom.z;
        arr[3] = th.to.position.x;
        arr[4] = th.to.position.y;
        arr[5] = th.to.position.z;
        th.posAttr.needsUpdate = true;
      }
    };
    updateThreads();

    const baseRotY = -0.12;
    const baseRotX = 0.05;
    root.rotation.set(baseRotX, baseRotY, 0);

    // Auto-fit: scale the whole model so its projected bounding box sits inside the
    // frame with margin, evaluated at the square aspect (the tightest breakpoint).
    // Guarantees nothing is clipped at any width, with headroom for the float motion.
    const fitToFrame = (margin: number) => {
      const prevAspect = camera.aspect;
      camera.aspect = 1;
      camera.updateProjectionMatrix();
      camera.updateMatrixWorld(true);
      root.scale.setScalar(1);
      root.updateMatrixWorld(true);
      const box = new THREE.Box3().setFromObject(root);
      const corner = new THREE.Vector3();
      let maxNdc = 0;
      for (let i = 0; i < 8; i++) {
        corner.set(
          i & 1 ? box.max.x : box.min.x,
          i & 2 ? box.max.y : box.min.y,
          i & 4 ? box.max.z : box.min.z,
        );
        corner.project(camera);
        maxNdc = Math.max(maxNdc, Math.abs(corner.x), Math.abs(corner.y));
      }
      if (maxNdc > 0) root.scale.setScalar(margin / maxNdc);
      camera.aspect = prevAspect;
      camera.updateProjectionMatrix();
    };
    fitToFrame(0.72);

    // True only while the hero is meaningfully on-screen (maintained by the
    // observer below). The pointer handler reads it so the model never tracks the
    // cursor while the scene is scrolled out of view.
    let onScreen = false;

    const pointer = { x: 0, y: 0 };
    const REACH = 1.6;
    const onPointerMove = (e: PointerEvent) => {
      if (!onScreen) return; // scrolled away — don't chase the cursor
      const rect = container.getBoundingClientRect();
      const nx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const ny = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      const dist = Math.hypot(nx, ny);

      if (dist > REACH) {
        pointer.x = 0;
        pointer.y = 0;
        return;
      }
      const linear = dist <= 1 ? 1 : (REACH - dist) / (REACH - 1);
      const falloff = linear * linear;
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

      const targetRotY = baseRotY + pointer.x * 0.18 + Math.sin(t * 0.25) * 0.04;
      const targetRotX = baseRotX + pointer.y * 0.12;
      root.rotation.y += (targetRotY - root.rotation.y) * 0.06;
      root.rotation.x += (targetRotX - root.rotation.x) * 0.06;

      // Book gently sways so it has dimensionality without turning its back.
      core.rotation.y = Math.sin(t * 0.35) * 0.16;
      core.rotation.x = baseBookTiltX + Math.sin(t * 0.5) * 0.03;

      for (const c of cards) {
        c.mesh.position.y = c.baseY + Math.sin(t * 0.8 + c.phase) * c.amp;
        c.mesh.position.x = c.baseX + Math.cos(t * 0.5 + c.phase) * c.drift;
        c.mesh.rotation.z = Math.sin(t * 0.6 + c.phase) * 0.05;
      }
      for (const n of nodes) {
        const p = 0.5 + 0.5 * Math.sin(t * 1.6 + n.phase);
        n.mesh.scale.setScalar(0.85 + p * 0.4);
        n.mat.emissiveIntensity = 0.5 + p * 0.7;
      }
      updateThreads();

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

    // Only animate while the scene is actually on-screen AND the tab is visible.
    const sync = () => {
      if (onScreen && !document.hidden) startLoop();
      else stopLoop();
    };
    let io: IntersectionObserver | undefined;
    if (!prefersReduced) {
      io = new IntersectionObserver(
        (entries) => {
          onScreen = (entries[0]?.intersectionRatio ?? 0) >= 0.1;
          if (!onScreen) {
            pointer.x = 0;
            pointer.y = 0;
          }
          sync();
        },
        { threshold: [0, 0.1, 0.25] },
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
        const withGeo = obj as Partial<THREE.Mesh>;
        if (withGeo.geometry) withGeo.geometry.dispose();
        const mat = (obj as Partial<THREE.Mesh>).material;
        if (mat) {
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
  }, [documentLabel, draftLabel, readyLabel, editableLabel]);

  return <div ref={containerRef} className={className} aria-hidden="true" />;
}