"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Hero centerpiece: "Graded, instantly."
 *
 * A crisp exam sheet floats at the core. A luminous violet scan-line sweeps down
 * it — automated grading passing over the paper — dropping a green check onto each
 * question row in its wake, then a "Graded" pill. From the sheet's right edge a 3D
 * performance chart rises: bars grow from the base, a glowing trend ribbon arcs up
 * to a green apex chevron, and a "92%" grade token settles beside a "Class average"
 * caption. A soft constellation of violet nodes and faint threads ties sheet → chart.
 *
 * The whole thing loops as one self-contained micro-story — submit → auto-grade →
 * performance rises — so it reads in a single glance and leans on the product's own
 * promise (grade the moment students submit) rather than a literal document diagram.
 *
 * Built in raw three.js (no R3F) so it stays a single lazy chunk; mounted via
 * `next/dynamic({ ssr: false })` from the hero so it never blocks first paint.
 * Text lives *on* the surfaces (canvas textures) so labels tilt with the model. The
 * canvas is transparent; a CSS glow behind it (in MainPage) supplies depth and is
 * the graceful fallback when WebGL is unavailable or motion is reduced — in which
 * case the scene paints one settled "graded" frame instead of animating.
 */

// Brand palette — strictly the design-system violet/ink/success tokens.
const VIOLET = 0x6a4ff0; // --primary
const VIOLET_LIGHT = 0x8e78ff; // --brand-violet-300
const VIOLET_BRIGHT = 0x9b80ff; // violet-400, for glow lines
const VIOLET_DEEP = 0x5739d6; // --primary-hover
const SUCCESS = 0x16b981;
const LINE = 0xd7dcf2;
const CARD_SURFACE = 0xf7f8ff;
const PAGE_SURFACE = 0xffffff;

// CSS colours for the canvas-texture text drawn onto the surfaces.
const WHITE_CSS = "#FFFFFF";
const INK_CSS = "#0F1430";
const VIOLET_CSS = "#6A4FF0";
const VIOLET_DEEP_CSS = "#4B36C9";
const SUCCESS_CSS = "#0A8F61";

// --- Easing -----------------------------------------------------------------
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const easeOutCubic = (t: number) => 1 - Math.pow(1 - clamp01(t), 3);
const easeInOutCubic = (t: number) => {
  const x = clamp01(t);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};
const easeOutBack = (t: number) => {
  const x = clamp01(t);
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};

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

/** A small content bar (text line, accent pill) sitting on a face. */
function addBar(
  parent: THREE.Object3D,
  w: number,
  h: number,
  color: number,
  x: number,
  y: number,
  z: number,
  emissive = false,
): THREE.Mesh {
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
  return mesh;
}

/** White rounded badge carrying a green ✓, drawn from two bars. Returned as a
 *  group so callers can pop it in by scaling from 0. */
function makeCheckBadge(size: number): THREE.Group {
  const g = new THREE.Group();
  const badge = new THREE.Mesh(roundedPanelGeometry(size, size, size * 0.32, 0.05), surfaceMaterial(PAGE_SURFACE));
  g.add(badge);
  const s = size;
  addBar(badge, s * 0.42, s * 0.15, SUCCESS, -s * 0.05, -s * 0.07, 0.05, true).rotation.z = Math.PI * 0.32;
  addBar(badge, s * 0.24, s * 0.15, SUCCESS, s * 0.16, s * 0.02, 0.05, true).rotation.z = -Math.PI * 0.28;
  return g;
}

type SheetLabels = { quiz: string; graded: string };

type SheetRefs = {
  group: THREE.Group;
  /** Front-face local Z of the sheet, for placing the scan-line just above it. */
  faceZ: number;
  /** Green check badge per question row (scaled 0→1 as grading passes). */
  checks: THREE.Group[];
  /** Each row's local Y, so the scan crossing it triggers that row's check. */
  rowY: number[];
  scanTop: number;
  scanBottom: number;
  /** The sweeping grading line (an emissive plane). */
  scan: THREE.Mesh;
  scanMat: THREE.MeshBasicMaterial;
  /** "Graded" confirmation pill, revealed after the sweep completes. */
  graded: THREE.Group;
};

/** The hero exam sheet: header pill, question rows (marker + text line), a
 *  sweeping scan-line, per-row check badges, and a "Graded" pill. */
function makeExamSheet(addLabel: AddLabel, labels: SheetLabels): SheetRefs {
  const group = new THREE.Group();
  const W = 2.5;
  const H = 3.25;
  const depth = 0.14;

  // Paper body + a violet left edge (the brand "spine" of the sheet).
  const body = new THREE.Mesh(roundedPanelGeometry(W, H, 0.18, depth), surfaceMaterial(CARD_SURFACE));
  group.add(body);
  const edge = new THREE.Mesh(
    roundedPanelGeometry(0.16, H - 0.24, 0.08, depth * 0.9),
    new THREE.MeshStandardMaterial({
      color: VIOLET,
      roughness: 0.4,
      metalness: 0.1,
      emissive: new THREE.Color(VIOLET),
      emissiveIntensity: 0.25,
    }),
  );
  edge.position.set(-W / 2 + 0.16, 0, 0.01);
  group.add(edge);

  const faceZ = depth / 2 + 0.03;
  const padX = 0.42; // clears the violet edge
  const innerW = W - padX - 0.34;

  // Header pill — "Weekly quiz".
  addLabel(group, labels.quiz, {
    x: -W / 2 + padX,
    y: H / 2 - 0.44,
    z: faceZ + 0.008,
    height: 0.34,
    maxWidth: innerW,
    color: WHITE_CSS,
    weight: 800,
    background: VIOLET_CSS,
    borderColor: "rgba(255,255,255,0.6)",
    paddingX: 30,
    paddingY: 11,
    textStrokeColor: "rgba(15,20,48,0.2)",
    textStrokeWidth: 3,
  });

  // Question rows: a status marker on the left + a "question" text line.
  const rows = 5;
  const rowTop = H / 2 - 1.15;
  const rowGap = 0.46;
  const checks: THREE.Group[] = [];
  const rowY: number[] = [];
  const markerX = -W / 2 + padX + 0.02;
  for (let i = 0; i < rows; i++) {
    const y = rowTop - i * rowGap;
    rowY.push(y);

    // Pending marker (faint ring) always visible under the check.
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.09, 0.13, 24),
      new THREE.MeshBasicMaterial({ color: LINE, transparent: true, opacity: 0.9 }),
    );
    ring.position.set(markerX, y, faceZ);
    group.add(ring);

    // Question text lines (two, second shorter — reads as wrapped copy).
    const lineX = markerX + 0.34;
    const lineW = innerW - 0.4;
    addBar(group, lineW, 0.085, LINE, lineX + lineW / 2 - 0.02, y + 0.09, faceZ);
    const lineW2 = lineW * (i % 2 === 0 ? 0.66 : 0.82);
    addBar(group, lineW2, 0.085, LINE, lineX + lineW2 / 2 - 0.02, y - 0.09, faceZ);

    // Green check badge popped in over the ring as grading passes the row.
    const check = makeCheckBadge(0.3);
    check.position.set(markerX, y, faceZ + 0.03);
    check.scale.setScalar(0);
    group.add(check);
    checks.push(check);
  }

  // Sweeping scan-line — a thin emissive plane spanning the paper width.
  const scanBottom = rowY[rows - 1] - 0.3;
  const scanTop = H / 2 - 0.78;
  const scanMat = new THREE.MeshBasicMaterial({
    color: VIOLET_BRIGHT,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    toneMapped: false,
  });
  const scan = new THREE.Mesh(new THREE.PlaneGeometry(W - 0.34, 0.14), scanMat);
  scan.position.set(0.08, scanTop, faceZ + 0.06);
  scan.visible = false;
  group.add(scan);

  // "Graded" pill — settles at the bottom once the sweep finishes.
  const graded = new THREE.Group();
  graded.position.set(-W / 2 + padX + 0.02, -H / 2 + 0.44, faceZ + 0.02);
  addLabel(graded, labels.graded, {
    x: 0,
    y: 0,
    z: 0.01,
    height: 0.3,
    maxWidth: innerW,
    color: WHITE_CSS,
    weight: 800,
    background: SUCCESS_CSS,
    borderColor: "rgba(255,255,255,0.55)",
    paddingX: 30,
    paddingY: 10,
    anchor: "left",
  });
  graded.scale.setScalar(0);
  group.add(graded);

  return { group, faceZ, checks, rowY, scanTop, scanBottom, scan, scanMat, graded };
}

type Bar = { group: THREE.Group; fullH: number; mat: THREE.MeshStandardMaterial; baseEmissive: number };

type ChartRefs = {
  group: THREE.Group;
  bars: Bar[];
  ribbonMat: THREE.MeshBasicMaterial;
  apex: THREE.Group;
  baseY: number;
};

/** The performance chart rising beside the sheet: bars, a glowing trend ribbon,
 *  and a green upward apex chevron. */
function makePerfChart(): ChartRefs {
  const group = new THREE.Group();
  const bars: Bar[] = [];
  const heights = [0.62, 0.98, 0.82, 1.28, 1.72];
  const colors = [VIOLET_LIGHT, VIOLET, VIOLET_LIGHT, VIOLET, VIOLET_DEEP];
  const emissives = [0.22, 0.3, 0.24, 0.34, 0.55];
  const barW = 0.3;
  const gap = 0.14;
  const baseY = -1.4;
  const startX = 0;

  const tops: THREE.Vector3[] = [];
  for (let i = 0; i < heights.length; i++) {
    const fullH = heights[i];
    const x = startX + i * (barW + gap);
    const holder = new THREE.Group();
    holder.position.set(x, baseY, 0);
    const mat = new THREE.MeshStandardMaterial({
      color: colors[i],
      roughness: 0.42,
      metalness: 0.12,
      emissive: new THREE.Color(colors[i]),
      emissiveIntensity: emissives[i],
    });
    const mesh = new THREE.Mesh(roundedPanelGeometry(barW, fullH, 0.06, 0.16), mat);
    mesh.position.y = fullH / 2;
    holder.add(mesh);
    holder.scale.y = 0.05;
    group.add(holder);
    bars.push({ group: holder, fullH, mat, baseEmissive: emissives[i] });
    tops.push(new THREE.Vector3(x, baseY + fullH + 0.05, 0.12));
  }

  // Trend ribbon: rides the bar tops then lifts to the apex — an "up and to the
  // right" glow line. A thin tube reads as a luminous thread over the chart.
  const lastX = startX + (heights.length - 1) * (barW + gap);
  const apexPos = new THREE.Vector3(lastX + 0.46, baseY + heights[heights.length - 1] + 0.52, 0.14);
  const curvePts = [new THREE.Vector3(startX - 0.28, baseY + 0.34, 0.12), ...tops, apexPos];
  const curve = new THREE.CatmullRomCurve3(curvePts, false, "catmullrom", 0.4);
  const ribbonMat = new THREE.MeshBasicMaterial({
    color: VIOLET_BRIGHT,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    toneMapped: false,
  });
  const ribbon = new THREE.Mesh(new THREE.TubeGeometry(curve, 56, 0.03, 7, false), ribbonMat);
  group.add(ribbon);

  // Apex chevron — a small green "up" arrow marking the positive trend.
  const apex = new THREE.Group();
  apex.position.copy(apexPos);
  const chevron = new THREE.Shape();
  chevron.moveTo(0, 0.17);
  chevron.lineTo(0.17, -0.1);
  chevron.lineTo(0.06, -0.1);
  chevron.lineTo(0, 0.02);
  chevron.lineTo(-0.06, -0.1);
  chevron.lineTo(-0.17, -0.1);
  chevron.closePath();
  const chevronGeo = new THREE.ExtrudeGeometry(chevron, {
    depth: 0.06,
    bevelEnabled: true,
    bevelThickness: 0.015,
    bevelSize: 0.015,
    bevelSegments: 1,
    steps: 1,
  });
  chevronGeo.center();
  const apexMesh = new THREE.Mesh(
    chevronGeo,
    new THREE.MeshStandardMaterial({
      color: SUCCESS,
      roughness: 0.35,
      metalness: 0.1,
      emissive: new THREE.Color(SUCCESS),
      emissiveIntensity: 0.6,
    }),
  );
  apex.add(apexMesh);
  apex.scale.setScalar(0);
  group.add(apex);

  return { group, bars, ribbonMat, apex, baseY };
}

/** A rounded token carrying centred text (the grade "92%" and the caption). */
function makeToken(
  addLabel: AddLabel,
  text: string,
  opts: {
    height: number;
    surface: number;
    textColor: string;
    background?: string;
    weight?: number;
    emissive?: boolean;
  },
): THREE.Group {
  const g = new THREE.Group();
  addLabel(g, text, {
    x: 0,
    y: 0,
    z: 0.02,
    height: opts.height,
    maxWidth: 4,
    color: opts.textColor,
    weight: opts.weight ?? 800,
    anchor: "center",
    background: opts.background,
    borderColor: opts.background ? "rgba(255,255,255,0.5)" : undefined,
    paddingX: 34,
    paddingY: 14,
    textStrokeColor: opts.background ? "rgba(15,20,48,0.18)" : undefined,
    textStrokeWidth: opts.background ? 3 : 0,
  });
  g.scale.setScalar(0);
  return g;
}

type HeroLabels = { quiz: string; graded: string; average: string };

export default function HeroScene({ className, labels }: { className?: string; labels?: HeroLabels }) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Primitive deps (not the object) so the scene only rebuilds when the text
  // actually changes — e.g. a language switch — not on every parent re-render.
  const quizLabel = labels?.quiz ?? "";
  const gradedLabel = labels?.graded ?? "";
  const averageLabel = labels?.average ?? "";

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReduced =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
    const key = new THREE.DirectionalLight(0xffffff, 1.7);
    key.position.set(3, 4, 6);
    scene.add(key);
    const rim = new THREE.PointLight(VIOLET_LIGHT, 17, 30);
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
    // The exam sheet sits left-of-centre (its own group so it can bob and tilt
    // independently), the performance chart rises off its right edge, and a grade
    // token + caption settle at the chart's apex. Everything faces the camera so
    // labels read; the whole rig sways rather than spins, so text never turns away.
    const sheet = makeExamSheet(addLabel, { quiz: quizLabel, graded: gradedLabel });
    const core = new THREE.Group();
    core.position.set(-0.78, -0.05, 0);
    core.rotation.set(-0.06, 0.16, 0);
    core.add(sheet.group);
    root.add(core);

    const chart = makePerfChart();
    chart.group.position.set(1.18, 0.02, 0.2);
    chart.group.rotation.set(-0.05, -0.12, 0);
    root.add(chart.group);

    // Grade token ("92%") near the apex + a "Class average" caption below it.
    const gradeToken = makeToken(addLabel, "92%", {
      height: 0.5,
      surface: VIOLET,
      textColor: WHITE_CSS,
      background: VIOLET_CSS,
      weight: 800,
    });
    gradeToken.position.set(2.32, 1.62, 0.35);
    root.add(gradeToken);

    const caption = makeToken(addLabel, averageLabel, {
      height: 0.24,
      surface: PAGE_SURFACE,
      textColor: VIOLET_DEEP_CSS,
      background: WHITE_CSS,
      weight: 700,
    });
    caption.position.set(1.86, 1.18, 0.34);
    root.add(caption);

    // Ambient data nodes — a soft violet constellation for depth + the "whole
    // class" read (many submissions feeding one performance picture).
    type Node = { mesh: THREE.Mesh; mat: THREE.MeshStandardMaterial; phase: number };
    const nodes: Node[] = [];
    const nodeDefs = [
      { x: -0.4, y: 2.15, z: 0.3, r: 0.11, c: VIOLET },
      { x: -2.55, y: 1.15, z: 0.2, r: 0.13, c: VIOLET_LIGHT },
      { x: -2.35, y: -1.55, z: 0.35, r: 0.1, c: VIOLET_LIGHT },
      { x: 0.5, y: -2.05, z: 0.3, r: 0.12, c: VIOLET },
      { x: 2.75, y: -0.5, z: 0.25, r: 0.1, c: VIOLET_LIGHT },
    ];
    for (const d of nodeDefs) {
      const mat = new THREE.MeshStandardMaterial({
        color: d.c,
        roughness: 0.35,
        metalness: 0.1,
        emissive: new THREE.Color(d.c),
        emissiveIntensity: 0.7,
      });
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(d.r, 20, 20), mat);
      mesh.position.set(d.x, d.y, d.z);
      root.add(mesh);
      nodes.push({ mesh, mat, phase: d.x * 1.7 + d.y });
    }

    // Faint threads: sheet edge → chart base + a couple of nodes → the network.
    // Geometry is rewritten each frame so lines track the bobbing sheet (cheap).
    type Thread = { posAttr: THREE.BufferAttribute; from: THREE.Object3D; to: THREE.Object3D; fromOffset: THREE.Vector3 };
    const threads: Thread[] = [];
    const makeThread = (from: THREE.Object3D, to: THREE.Object3D, fromOffset: THREE.Vector3, opacity: number) => {
      const geo = new THREE.BufferGeometry();
      const posAttr = new THREE.BufferAttribute(new Float32Array(6), 3);
      geo.setAttribute("position", posAttr);
      const line = new THREE.Line(
        geo,
        new THREE.LineBasicMaterial({ color: VIOLET_LIGHT, transparent: true, opacity }),
      );
      root.add(line);
      threads.push({ posAttr, from, to, fromOffset });
    };
    makeThread(core, chart.group, new THREE.Vector3(1.1, -0.4, 0.2), 0.32);
    makeThread(core, nodes[1].mesh, new THREE.Vector3(-1.0, 1.2, 0.1), 0.22);
    makeThread(core, nodes[3].mesh, new THREE.Vector3(0.3, -1.5, 0.1), 0.2);

    const tmpFrom = new THREE.Vector3();
    const tmpTo = new THREE.Vector3();
    const updateThreads = () => {
      for (const th of threads) {
        const arr = th.posAttr.array as Float32Array;
        tmpFrom.copy(th.fromOffset).applyMatrix4(th.from.matrix);
        tmpTo.copy(th.to.position);
        arr[0] = tmpFrom.x;
        arr[1] = tmpFrom.y;
        arr[2] = tmpFrom.z;
        arr[3] = tmpTo.x;
        arr[4] = tmpTo.y;
        arr[5] = tmpTo.z;
        th.posAttr.needsUpdate = true;
      }
    };

    const baseRotY = -0.1;
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
        corner.set(i & 1 ? box.max.x : box.min.x, i & 2 ? box.max.y : box.min.y, i & 4 ? box.max.z : box.min.z);
        corner.project(camera);
        maxNdc = Math.max(maxNdc, Math.abs(corner.x), Math.abs(corner.y));
      }
      if (maxNdc > 0) root.scale.setScalar(margin / maxNdc);
      camera.aspect = prevAspect;
      camera.updateProjectionMatrix();
    };

    // --- Grading cycle ---------------------------------------------------------
    // One looping micro-story: the scan sweeps the sheet (checks pop in its wake),
    // then "Graded" settles, the chart grows, and the grade token + caption reveal,
    // hold, and reset. `applyCycle(p)` is a pure function of the loop phase p∈[0,1)
    // so it is safe to evaluate at any fixed p for the static/reduced-motion frame.
    const CYCLE = 8.4; // seconds
    const SETTLED_P = 0.74; // the "fully graded" frame used when paused / reduced

    const applyCycle = (p: number, t: number) => {
      const inReset = p >= 0.9;
      const resetT = inReset ? easeInOutCubic((p - 0.9) / 0.1) : 0;
      const settle = 1 - resetT;

      // Scan sweep (top → bottom).
      const scanStart = 0.05;
      const scanEnd = 0.44;
      let scanNorm: number;
      if (p < scanStart) scanNorm = 0;
      else if (p > scanEnd) scanNorm = 1;
      else scanNorm = easeInOutCubic((p - scanStart) / (scanEnd - scanStart));
      const scanY = sheet.scanTop + (sheet.scanBottom - sheet.scanTop) * scanNorm;
      const scanning = p >= scanStart && p <= scanEnd && !inReset;
      sheet.scan.visible = scanning;
      if (scanning) {
        sheet.scan.position.y = scanY;
        // Fade in at the top, out at the bottom of the sweep.
        const edge = Math.min(scanNorm / 0.12, (1 - scanNorm) / 0.12, 1);
        sheet.scanMat.opacity = 0.85 * clamp01(edge) * (0.8 + 0.2 * Math.sin(t * 9));
      }

      // Per-row checks pop in as the scan passes them.
      for (let i = 0; i < sheet.checks.length; i++) {
        const reveal = clamp01((sheet.rowY[i] - scanY) / 0.16);
        const s = easeOutBack(reveal) * settle;
        sheet.checks[i].scale.setScalar(Math.max(0, s));
        sheet.checks[i].visible = s > 0.002;
      }

      // "Graded" pill after the sweep.
      const gradedShow = easeOutBack((p - 0.48) / 0.06) * settle;
      sheet.graded.scale.setScalar(Math.max(0, gradedShow));
      sheet.graded.visible = gradedShow > 0.002;

      // Chart bars grow from the base (slight left-to-right stagger + gentle breathing).
      const barBase = clamp01((p - 0.48) / 0.2);
      for (let i = 0; i < chart.bars.length; i++) {
        const b = chart.bars[i];
        const grow = easeOutCubic(clamp01(barBase * 1.18 - i * 0.06));
        const breathe = 0.02 * Math.sin(t * 1.5 + i) * grow;
        b.group.scale.y = Math.max(0.05, (0.05 + 0.95 * grow + breathe) * (1 - resetT * 0.95));
        b.mat.emissiveIntensity = b.baseEmissive * (0.6 + 0.4 * grow);
      }

      // Trend ribbon fades in with the bars; apex chevron pops after.
      chart.ribbonMat.opacity = 0.9 * easeOutCubic(clamp01((p - 0.5) / 0.2)) * settle;
      const apexShow = easeOutBack((p - 0.62) / 0.06) * settle;
      chart.apex.scale.setScalar(Math.max(0, apexShow));
      chart.apex.visible = apexShow > 0.002;

      // Grade token + caption settle last.
      const tokenShow = easeOutBack((p - 0.6) / 0.07) * settle;
      gradeToken.scale.setScalar(Math.max(0, tokenShow));
      gradeToken.visible = tokenShow > 0.002;
      const capShow = easeOutBack((p - 0.56) / 0.07) * settle;
      caption.scale.setScalar(Math.max(0, capShow));
      caption.visible = capShow > 0.002;
    };

    // Fit after content exists, then paint the settled frame so the hero is correct
    // before any motion (and is the single frame under reduced motion / no WebGL).
    // 0.87 fills more of the frame (a larger, more present centrepiece) while still
    // leaving ~13% headroom for the pointer sway and float bob so nothing clips.
    fitToFrame(0.87);
    core.updateMatrix();
    chart.group.updateMatrix();
    applyCycle(SETTLED_P, SETTLED_P * CYCLE);
    updateThreads();

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
    // Start the accumulator at the settled phase so the first animated frame flows
    // out of the static frame (settled → reset → new sweep) with no jump on load.
    let elapsed = SETTLED_P * CYCLE;
    let frame = 0;
    let running = false;

    const renderFrame = () => {
      elapsed += clock.getDelta();
      const t = elapsed;
      const p = (elapsed % CYCLE) / CYCLE;

      const targetRotY = baseRotY + pointer.x * 0.18 + Math.sin(t * 0.25) * 0.04;
      const targetRotX = baseRotX + pointer.y * 0.12;
      root.rotation.y += (targetRotY - root.rotation.y) * 0.06;
      root.rotation.x += (targetRotX - root.rotation.x) * 0.06;

      // Sheet gently sways + bobs so it has dimensionality without turning away.
      core.position.y = -0.05 + Math.sin(t * 0.7) * 0.06;
      core.rotation.y = 0.16 + Math.sin(t * 0.32) * 0.05;
      core.rotation.x = -0.06 + Math.sin(t * 0.5) * 0.025;
      core.updateMatrix();

      // Chart drifts on its own subtle bob.
      chart.group.position.y = 0.02 + Math.sin(t * 0.6 + 1.5) * 0.05;
      chart.group.updateMatrix();

      // Grade token + caption float alongside the apex.
      gradeToken.position.y = 1.62 + Math.sin(t * 0.8 + 0.6) * 0.07;
      caption.position.y = 1.18 + Math.sin(t * 0.8 + 1.1) * 0.05;

      applyCycle(p, t);

      for (const n of nodes) {
        const pulse = 0.5 + 0.5 * Math.sin(t * 1.6 + n.phase);
        n.mesh.scale.setScalar(0.85 + pulse * 0.4);
        n.mat.emissiveIntensity = 0.5 + pulse * 0.7;
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
  }, [quizLabel, gradedLabel, averageLabel]);

  return <div ref={containerRef} className={className} aria-hidden="true" />;
}
