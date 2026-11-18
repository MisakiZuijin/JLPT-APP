export type Point = {
  x: number;
  y: number;
};

export type ValidationMode = "trace" | "free";

export type StrokeValidationResult = {
  passed: boolean;
  accuracy: number;
  feedback: string;
};

/**
 * Mengurai SVG path standar KanjiVG (`M`, `L`, `H`, `V`, `Q`, `C`, `Z`) menjadi
 * daftar titik tersampel pada ruang koordinat 0..100.
 */
export function sampleSvgPath(pathData: string, samplesPerSegment = 16): Point[] {
  const tokens = pathData.match(/[a-zA-Z]|-?\d*\.?\d+/g);
  if (!tokens) return [];

  const points: Point[] = [];
  let idx = 0;
  let cur: Point = { x: 0, y: 0 };
  let start: Point = { x: 0, y: 0 };
  let cmd = "";

  const nextNum = () => Number.parseFloat(tokens[idx++] ?? "0");

  while (idx < tokens.length) {
    const token = tokens[idx]!;
    if (/^[a-zA-Z]$/.test(token)) {
      cmd = token;
      idx++;
    }

    if (cmd === "M" || cmd === "m") {
      const nx = (cmd === "m" ? cur.x : 0) + nextNum();
      const ny = (cmd === "m" ? cur.y : 0) + nextNum();
      cur = { x: nx, y: ny };
      start = cur;
      points.push(cur);
      cmd = cmd === "m" ? "l" : "L";
    } else if (cmd === "L" || cmd === "l") {
      const nx = (cmd === "l" ? cur.x : 0) + nextNum();
      const ny = (cmd === "l" ? cur.y : 0) + nextNum();
      for (let i = 1; i <= samplesPerSegment; i++) {
        const t = i / samplesPerSegment;
        points.push({ x: cur.x + (nx - cur.x) * t, y: cur.y + (ny - cur.y) * t });
      }
      cur = { x: nx, y: ny };
    } else if (cmd === "H" || cmd === "h") {
      const nx = (cmd === "h" ? cur.x : 0) + nextNum();
      for (let i = 1; i <= samplesPerSegment; i++) {
        const t = i / samplesPerSegment;
        points.push({ x: cur.x + (nx - cur.x) * t, y: cur.y });
      }
      cur = { x: nx, y: cur.y };
    } else if (cmd === "V" || cmd === "v") {
      const ny = (cmd === "v" ? cur.y : 0) + nextNum();
      for (let i = 1; i <= samplesPerSegment; i++) {
        const t = i / samplesPerSegment;
        points.push({ x: cur.x, y: cur.y + (ny - cur.y) * t });
      }
      cur = { x: cur.x, y: ny };
    } else if (cmd === "Q" || cmd === "q") {
      const cx = (cmd === "q" ? cur.x : 0) + nextNum();
      const cy = (cmd === "q" ? cur.y : 0) + nextNum();
      const nx = (cmd === "q" ? cur.x : 0) + nextNum();
      const ny = (cmd === "q" ? cur.y : 0) + nextNum();
      for (let i = 1; i <= samplesPerSegment; i++) {
        const t = i / samplesPerSegment;
        const u = 1 - t;
        points.push({
          x: u * u * cur.x + 2 * u * t * cx + t * t * nx,
          y: u * u * cur.y + 2 * u * t * cy + t * t * ny,
        });
      }
      cur = { x: nx, y: ny };
    } else if (cmd === "C" || cmd === "c") {
      const c1x = (cmd === "c" ? cur.x : 0) + nextNum();
      const c1y = (cmd === "c" ? cur.y : 0) + nextNum();
      const c2x = (cmd === "c" ? cur.x : 0) + nextNum();
      const c2y = (cmd === "c" ? cur.y : 0) + nextNum();
      const nx = (cmd === "c" ? cur.x : 0) + nextNum();
      const ny = (cmd === "c" ? cur.y : 0) + nextNum();
      for (let i = 1; i <= samplesPerSegment; i++) {
        const t = i / samplesPerSegment;
        const u = 1 - t;
        points.push({
          x: u ** 3 * cur.x + 3 * u ** 2 * t * c1x + 3 * u * t ** 2 * c2x + t ** 3 * nx,
          y: u ** 3 * cur.y + 3 * u ** 2 * t * c1y + 3 * u * t ** 2 * c2y + t ** 3 * ny,
        });
      }
      cur = { x: nx, y: ny };
    } else if (cmd === "Z" || cmd === "z") {
      for (let i = 1; i <= samplesPerSegment; i++) {
        const t = i / samplesPerSegment;
        points.push({ x: cur.x + (start.x - cur.x) * t, y: cur.y + (start.y - cur.y) * t });
      }
      cur = start;
    } else {
      idx++;
    }
  }

  return points;
}

function distance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function polylineLength(pts: Point[]): number {
  let len = 0;
  for (let i = 1; i < pts.length; i++) {
    len += distance(pts[i - 1]!, pts[i]!);
  }
  return len;
}

function resamplePolyline(pts: Point[], count = 28): Point[] {
  if (pts.length === 0) return [];
  if (pts.length === 1) return Array.from({ length: count }, () => pts[0]!);

  const total = polylineLength(pts);
  if (total < 1e-3) return Array.from({ length: count }, () => pts[0]!);

  const step = total / (count - 1);
  const out: Point[] = [pts[0]!];
  let acc = 0;
  let prev = pts[0]!;

  for (let i = 1; i < pts.length; i++) {
    const cur = pts[i]!;
    let d = distance(prev, cur);
    while (acc + d >= step && out.length < count) {
      const ratio = (step - acc) / d;
      const np = { x: prev.x + ratio * (cur.x - prev.x), y: prev.y + ratio * (cur.y - prev.y) };
      out.push(np);
      prev = np;
      d = distance(prev, cur);
      acc = 0;
    }
    acc += d;
    prev = cur;
  }

  while (out.length < count) out.push(pts[pts.length - 1]!);
  return out;
}

function segmentDirectionAlignment(user: Point[], target: Point[]): number {
  const n = Math.min(user.length, target.length);
  if (n < 6) return 1;

  const chunks = [
    [0, Math.floor(n / 3)],
    [Math.floor(n / 3), Math.floor((2 * n) / 3)],
    [Math.floor((2 * n) / 3), n - 1],
  ] as const;

  let weightedSum = 0;
  let totalWeight = 0;

  for (const [s, e] of chunks) {
    const ux = user[e]!.x - user[s]!.x;
    const uy = user[e]!.y - user[s]!.y;
    const tx = target[e]!.x - target[s]!.x;
    const ty = target[e]!.y - target[s]!.y;
    const uMag = Math.hypot(ux, uy);
    const tMag = Math.hypot(tx, ty);
    if (uMag > 3 && tMag > 3) {
      const dot = (ux * tx + uy * ty) / (uMag * tMag);
      weightedSum += dot * tMag;
      totalWeight += tMag;
    }
  }

  if (totalWeight < 1) return 1;
  return weightedSum / totalWeight;
}

function directedMeanDist(fromPts: Point[], toPts: Point[]): number {
  let sum = 0;
  for (let i = 0; i < fromPts.length; i++) {
    let minD = Infinity;
    for (let j = 0; j < toPts.length; j++) {
      const d = distance(fromPts[i]!, toPts[j]!);
      if (d < minD) minD = d;
    }
    sum += minD;
  }
  return sum / Math.max(1, fromPts.length);
}

/**
 * Validasi 1 goresan user terhadap target path KanjiVG pada koordinat 0..100.
 * Mengecek urutan titik searah, jarak dua arah (mencegah coretan liar), rasio panjang,
 * kecocokan lekukan/sudut, dan arah segmen.
 */
export function validateStroke(
  userPoints: Point[],
  targetPath: string,
  strokeNumber: number,
  mode: ValidationMode = "trace",
): StrokeValidationResult {
  const targetRaw = sampleSvgPath(targetPath);
  if (targetRaw.length < 2) {
    return { passed: true, accuracy: 100, feedback: "Goresan diterima." };
  }

  const userLen = polylineLength(userPoints);
  const targetLen = polylineLength(targetRaw);

  if (userPoints.length < 3 || userLen < 5) {
    return {
      passed: false,
      accuracy: 0,
      feedback: `Goresan ${strokeNumber} terlalu pendek. Tarik garis lebih tegas.`,
    };
  }

  const N = 28;
  const target = resamplePolyline(targetRaw, N);
  const user = resamplePolyline(userPoints, N);

  const startDist = distance(user[0]!, target[0]!);
  const endDist = distance(user[N - 1]!, target[N - 1]!);

  // 1. Cek arah multi-segmen (mendukung garis lurus, belokan, maupun lengkungan)
  const segAlignment = segmentDirectionAlignment(user, target);
  if (segAlignment < 0.25) {
    return {
      passed: false,
      accuracy: 28,
      feedback: `Arah goresan ${strokeNumber} terbalik atau tidak searah urutan nomor ${strokeNumber}.`,
    };
  }

  // 2. Cek titik awal sesuai mode
  const maxStartDist = mode === "free" ? 30 : 22;
  if (startDist > maxStartDist) {
    return {
      passed: false,
      accuracy: Math.max(20, Math.round(100 - startDist * 1.6)),
      feedback: `Titik awal goresan ${strokeNumber} terlalu jauh. Mulai dari posisi nomor ${strokeNumber}.`,
    };
  }

  // 3. Cek rasio panjang goresan (mencegah memotong sudut atau coretan berlebih)
  if (targetLen >= 24) {
    const lenRatio = userLen / targetLen;
    if (lenRatio < 0.56) {
      return {
        passed: false,
        accuracy: Math.max(25, Math.round(lenRatio * 80)),
        feedback: `Goresan ${strokeNumber} terlalu pendek / memotong jalur sudut.`,
      };
    }
    if (lenRatio > 1.75) {
      return {
        passed: false,
        accuracy: Math.max(25, Math.round(115 - lenRatio * 40)),
        feedback: `Goresan ${strokeNumber} terlalu panjang atau keluar jalur.`,
      };
    }
  }

  // 4. Hitung keselarasan urutan (synced) dan jarak dua arah (Hausdorff rata-rata)
  let syncedSum = 0;
  let maxSynced = 0;
  for (let i = 0; i < N; i++) {
    const d = distance(user[i]!, target[i]!);
    syncedSum += d;
    if (d > maxSynced) maxSynced = d;
  }
  const syncedAvg = syncedSum / N;
  const targetToUser = directedMeanDist(target, user);
  const userToTarget = directedMeanDist(user, target);
  const biDirDist = Math.max(targetToUser, userToTarget);

  // Pada mode "free" tanpa panduan visual, beri sedikit kelonggaran posisi seragam
  const effectiveSynced = mode === "free" ? Math.max(0, syncedAvg - 3) : syncedAvg;
  const effectiveBiDir = mode === "free" ? Math.max(0, biDirDist - 2.5) : biDirDist;

  // Penalti bila melenceng jauh di bagian sudut/tengah (misal diagonal pada sudut 90°)
  const cornerPenalty = Math.max(0, maxSynced - (mode === "free" ? 24 : 18)) * 0.9;
  const endPenalty = Math.max(0, endDist - (mode === "free" ? 14 : 10)) * 0.45;
  const dirBonusPenalty = (1 - Math.min(1, Math.max(0, segAlignment))) * 28;

  const rawScore =
    100 -
    effectiveSynced * 1.45 -
    effectiveBiDir * 1.45 -
    cornerPenalty -
    endPenalty -
    dirBonusPenalty;

  const accuracy = Math.max(0, Math.min(100, Math.round(rawScore)));
  const minPassAccuracy = mode === "free" ? 60 : 65;
  const maxEndDist = mode === "free" ? 32 : 24;

  if (accuracy < minPassAccuracy || endDist > maxEndDist) {
    return {
      passed: false,
      accuracy,
      feedback: `Bentuk atau sudut goresan ${strokeNumber} kurang tepat (${accuracy}%). Perhatikan arah dan belokan jalur.`,
    };
  }

  return {
    passed: true,
    accuracy,
    feedback: `Goresan ${strokeNumber} tepat (${accuracy}%).`,
  };
}
