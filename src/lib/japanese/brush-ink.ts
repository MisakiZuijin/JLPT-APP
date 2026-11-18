import type { Point } from "./stroke-validator";

export type InkPoint = Point & {
  t?: number;
  p?: number;
};

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function chaikinSmooth(pts: InkPoint[]): InkPoint[] {
  if (pts.length < 3) return pts;
  const out: InkPoint[] = [pts[0]!];
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i]!;
    const b = pts[i + 1]!;
    if (i > 0) {
      out.push({
        x: a.x * 0.75 + b.x * 0.25,
        y: a.y * 0.75 + b.y * 0.25,
        t: a.t !== undefined && b.t !== undefined ? a.t * 0.75 + b.t * 0.25 : a.t,
        p: a.p !== undefined && b.p !== undefined ? a.p * 0.75 + b.p * 0.25 : a.p,
      });
    }
    if (i < pts.length - 2) {
      out.push({
        x: a.x * 0.25 + b.x * 0.75,
        y: a.y * 0.25 + b.y * 0.75,
        t: a.t !== undefined && b.t !== undefined ? a.t * 0.25 + b.t * 0.75 : b.t,
        p: a.p !== undefined && b.p !== undefined ? a.p * 0.25 + b.p * 0.75 : b.p,
      });
    }
  }
  out.push(pts[pts.length - 1]!);
  return out;
}

function densifyPoints(pts: InkPoint[], maxGap = 2.4): InkPoint[] {
  if (pts.length < 2) return pts;
  const out: InkPoint[] = [pts[0]!];
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1]!;
    const b = pts[i]!;
    const d = Math.hypot(b.x - a.x, b.y - a.y);
    if (d > maxGap) {
      const steps = Math.ceil(d / maxGap);
      for (let s = 1; s < steps; s++) {
        const k = s / steps;
        out.push({
          x: a.x + (b.x - a.x) * k,
          y: a.y + (b.y - a.y) * k,
          t: a.t !== undefined && b.t !== undefined ? a.t + (b.t - a.t) * k : undefined,
          p: a.p !== undefined && b.p !== undefined ? a.p + (b.p - a.p) * k : undefined,
        });
      }
    }
    out.push(b);
  }
  return out;
}

/**
 * Menghasilkan path SVG terisi (`fill`) menyerupai sapuan kuas kaligrafi Jepang (fude):
 * pangkal agak tebal (uchikomi), ketebalan dinamis mengikuti kecepatan/tekanan,
 * dan ujung meruncing alami (harai).
 */
export function pointsToBrushOutline(
  rawPts: InkPoint[],
  baseRadius = 3.1,
): string {
  if (rawPts.length === 0) return "";
  if (rawPts.length === 1) {
    const p = rawPts[0]!;
    const r = baseRadius * 0.9;
    return `M ${(p.x - r).toFixed(2)} ${p.y.toFixed(2)} A ${r} ${r} 0 1 0 ${(p.x + r).toFixed(2)} ${p.y.toFixed(2)} A ${r} ${r} 0 1 0 ${(p.x - r).toFixed(2)} ${p.y.toFixed(2)} Z`;
  }

  const pts = densifyPoints(chaikinSmooth(rawPts), 2.2);
  const n = pts.length;

  // Hitung panjang kumulatif
  const cumLen = new Array<number>(n).fill(0);
  for (let i = 1; i < n; i++) {
    cumLen[i] =
      cumLen[i - 1]! +
      Math.hypot(pts[i]!.x - pts[i - 1]!.x, pts[i]!.y - pts[i - 1]!.y);
  }
  const totalLen = Math.max(cumLen[n - 1] ?? 1, 1);

  // Hitung radius kuas per titik
  const radii = new Array<number>(n);
  let smoothedVel = 0.25;

  for (let i = 0; i < n; i++) {
    const progress = cumLen[i]! / totalLen;
    const prev = pts[Math.max(0, i - 1)]!;
    const cur = pts[i]!;

    // Kecepatan pointer dalam unit koordinat / ms
    if (i > 0 && cur.t !== undefined && prev.t !== undefined) {
      const dt = Math.max(4, cur.t - prev.t);
      const dist = Math.hypot(cur.x - prev.x, cur.y - prev.y);
      const instVel = dist / dt;
      smoothedVel = smoothedVel * 0.72 + instVel * 0.28;
    }

    // Semakin cepat -> agak ramping; semakin lambat -> tinta lebih penuh
    const velFactor = clamp(1.16 - smoothedVel * 0.55, 0.7, 1.18);

    // Tekanan stylus nyata (bila bukan default mouse 0.5 / 0)
    const hasStylus = cur.p !== undefined && cur.p > 0 && Math.abs(cur.p - 0.5) > 0.03;
    const pressureFactor = hasStylus ? clamp(0.65 + (cur.p ?? 0.5) * 0.85, 0.65, 1.35) : 1;

    // Shihitsu/uchikomi: awalan bulat berisi (~1.14x -> 1.0x), TIDAK lancip di pangkal;
    // Bagian akhir melandai lembut (harai) tanpa menjadi jarum tajam.
    let envelope = 1;
    if (progress < 0.16) {
      envelope = 1.14 - (progress / 0.16) * 0.14;
    } else if (progress > 0.8) {
      const tail = (progress - 0.8) / 0.2;
      envelope = Math.max(0.38, 1 - tail * tail * 0.62);
    }

    radii[i] = clamp(baseRadius * velFactor * pressureFactor * envelope, 0.9, baseRadius * 1.38);
  }

  const leftPts: Point[] = [];
  const rightPts: Point[] = [];

  for (let i = 0; i < n; i++) {
    const prev = pts[Math.max(0, i - 1)]!;
    const next = pts[Math.min(n - 1, i + 1)]!;
    let dx = next.x - prev.x;
    let dy = next.y - prev.y;
    const mag = Math.hypot(dx, dy);
    if (mag < 1e-4) {
      dx = 1;
      dy = 0;
    } else {
      dx /= mag;
      dy /= mag;
    }
    const nx = -dy;
    const ny = dx;
    const r = radii[i]!;
    leftPts.push({ x: pts[i]!.x + nx * r, y: pts[i]!.y + ny * r });
    rightPts.push({ x: pts[i]!.x - nx * r, y: pts[i]!.y - ny * r });
  }

  // Rangkai kurva tertutup yang halus: pangkal setengah lingkaran bulat -> sisi kiri -> ujung -> sisi kanan
  const parts: string[] = [];
  const p0L = leftPts[0]!;
  const p0R = rightPts[0]!;
  const rStart = radii[0]!;
  const rEnd = radii[n - 1]!;

  parts.push(`M ${p0R.x.toFixed(2)} ${p0R.y.toFixed(2)}`);
  parts.push(
    `A ${rStart.toFixed(2)} ${rStart.toFixed(2)} 0 0 0 ${p0L.x.toFixed(2)} ${p0L.y.toFixed(2)}`,
  );

  for (let i = 1; i < n - 1; i++) {
    const c = leftPts[i]!;
    const next = leftPts[i + 1]!;
    const mx = (c.x + next.x) / 2;
    const my = (c.y + next.y) / 2;
    parts.push(`Q ${c.x.toFixed(2)} ${c.y.toFixed(2)} ${mx.toFixed(2)} ${my.toFixed(2)}`);
  }

  const endL = leftPts[n - 1]!;
  const endR = rightPts[n - 1]!;
  parts.push(`L ${endL.x.toFixed(2)} ${endL.y.toFixed(2)}`);
  parts.push(
    `A ${rEnd.toFixed(2)} ${rEnd.toFixed(2)} 0 0 0 ${endR.x.toFixed(2)} ${endR.y.toFixed(2)}`,
  );

  for (let i = n - 2; i >= 1; i--) {
    const c = rightPts[i]!;
    const prev = rightPts[i - 1]!;
    const mx = (c.x + prev.x) / 2;
    const my = (c.y + prev.y) / 2;
    parts.push(`Q ${c.x.toFixed(2)} ${c.y.toFixed(2)} ${mx.toFixed(2)} ${my.toFixed(2)}`);
  }

  parts.push(`L ${p0R.x.toFixed(2)} ${p0R.y.toFixed(2)} Z`);
  return parts.join(" ");
}
