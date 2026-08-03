import { useEffect, useRef, useState } from "react";
import type { GameOutcome, GameResultKind } from "../types";
import { DEFAULT_GAME_V2_CONFIG, type GameV2Config } from "../configs/game";

// Bản sao 1:1 logic + canvas render từ docs/game.html (bản gốc "Siêu Bò Úc Sút Bóng")

// TextMetrics.actualBoundingBox* không đáng tin cậy với emoji màu/ZWJ trên Safari
// (thường trả về 0), nên canh giữa bằng cách quét pixel thực tế đã render, thay vì
// dựa vào font metrics — chính xác trên mọi trình duyệt vì đo trên kết quả vẽ thật.
const glyphOffsetCache = new Map<string, { x: number; y: number }>();

const NO_OFFSET = { x: 0, y: 0 };

// Lỡ có gì bất thường (getContext trả về null, getImageData bị chặn...) thì
// trả về NO_OFFSET để fillText vẫn vẽ bình thường (chỉ mất phần canh giữa tinh
// chỉnh), không làm crash cả vòng lặp vẽ game.
const getGlyphCenterOffset = (font: string, glyph: string) => {
  const cacheKey = `${font}::${glyph}`;
  const cached = glyphOffsetCache.get(cacheKey);
  if (cached) return cached;

  try {
    const size = 140;
    const center = size / 2;
    const off = document.createElement("canvas");
    off.width = size;
    off.height = size;
    const octx = off.getContext("2d");
    if (!octx) return NO_OFFSET;

    octx.font = font;
    octx.textAlign = "center";
    octx.textBaseline = "middle";
    octx.fillText(glyph, center, center);

    const { data } = octx.getImageData(0, 0, size, size);
    let minX = size;
    let maxX = -1;
    let minY = size;
    let maxY = -1;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (data[(y * size + x) * 4 + 3] > 10) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }

    const offset =
      maxX >= minX
        ? { x: center - (minX + maxX) / 2, y: center - (minY + maxY) / 2 }
        : NO_OFFSET;
    glyphOffsetCache.set(cacheKey, offset);
    return offset;
  } catch {
    return NO_OFFSET;
  }
};

const SPEED_MULT: Record<GameV2Config["gameSpeed"], number> = {
  Slow: 0.7,
  Normal: 1,
  Fast: 1.4,
  "Very Fast": 1.8,
};

type ItemType = "grain" | "grass";
type ObsType = "vaccine" | "virus" | "ref";
type Entity =
  | { kind: "item"; type: ItemType; x: number; y: number; hit?: boolean }
  | { kind: "obs"; type: ObsType; x: number; y: number; hit?: boolean };

interface GameState {
  cowX: number;
  targetX: number;
  dragging: boolean;
  entities: Entity[];
  score: number;
  startTime: number;
  lastSpawnItem: number;
  lastSpawnObs: number;
  lastT: number;
  speed: number;
  over: boolean;
}

interface GameScreenV2Props {
  config?: Partial<GameV2Config>;
  onFinish: (result: GameOutcome) => void;
}

export default function GameScreenV2({ config, onFinish }: GameScreenV2Props) {
  const cfg = useRef<GameV2Config>({
    ...DEFAULT_GAME_V2_CONFIG,
    ...config,
  }).current;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<GameState | null>(null);
  const rafId = useRef(0);
  const finished = useRef(false);
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;

  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(
    cfg.unlimitedTime ? 0 : cfg.timeLimit,
  );

  useEffect(() => {
    const cv = canvasRef.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;

    const g: GameState = {
      cowX: 360,
      targetX: 360,
      dragging: false,
      entities: [],
      score: 0,
      startTime: performance.now(),
      lastSpawnItem: 0,
      lastSpawnObs: 0,
      lastT: performance.now(),
      speed: SPEED_MULT[cfg.gameSpeed] || 1,
      over: false,
    };
    gameRef.current = g;

    const endRound = (win: boolean, obstacleHit: boolean) => {
      if (finished.current) return;
      finished.current = true;
      g.over = true;
      cancelAnimationFrame(rafId.current);
      const result: GameResultKind = win
        ? "win"
        : obstacleHit
          ? "lose_obstacle"
          : "lose_timeout";
      onFinishRef.current({
        score: g.score,
        result,
        playedSeconds: Math.round((performance.now() - g.startTime) / 1000),
      });
    };

    const setTarget = (clientX: number) => {
      const r = cv.getBoundingClientRect();
      g.targetX = ((clientX - r.left) / r.width) * 720;
    };
    const onPointerDown = (e: PointerEvent) => {
      g.dragging = true;
      cv.setPointerCapture(e.pointerId);
      setTarget(e.clientX);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (g.dragging) setTarget(e.clientX);
    };
    const onPointerUp = () => {
      g.dragging = false;
      g.targetX = g.cowX;
    };
    cv.addEventListener("pointerdown", onPointerDown);
    cv.addEventListener("pointermove", onPointerMove);
    cv.addEventListener("pointerup", onPointerUp);
    cv.addEventListener("pointercancel", onPointerUp);

    const draw = () => {
      for (let i = 0; i < 9; i++) {
        ctx.fillStyle = i % 2 ? "#3c9448" : "#46a552";
        ctx.fillRect(0, i * 120, 720, 120);
      }
      ctx.strokeStyle = "rgba(255,255,255,.55)";
      ctx.lineWidth = 4;
      ctx.strokeRect(30, 30, 660, 1020);
      ctx.beginPath();
      ctx.arc(360, 540, 90, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(30, 540);
      ctx.lineTo(690, 540);
      ctx.stroke();

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (const en of g.entities) {
        ctx.font = "52px serif";
        const glyph =
          en.kind === "item"
            ? en.type === "grain"
              ? "🌾"
              : "🌿"
            : en.type === "vaccine"
              ? "💉"
              : en.type === "virus"
                ? "🦠"
                : "🧑‍⚖️";

        ctx.beginPath();
        ctx.arc(en.x, en.y, 34, 0, Math.PI * 2);
        if (en.kind === "item") {
          ctx.fillStyle = "rgba(21,128,61,.55)";
          ctx.strokeStyle = "rgba(20,83,45,1)";
        } else {
          ctx.fillStyle = "rgba(239,68,68,.55)";
          ctx.strokeStyle = "rgba(127,29,29,1)";
        }
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = "#000";
        const offset = getGlyphCenterOffset(ctx.font, glyph);
        ctx.fillText(glyph, en.x + offset.x, en.y + offset.y);
      }
      ctx.font = "84px serif";
      ctx.fillText("🐮", g.cowX, 940);
    };

    const tick = (now: number) => {
      if (g.over) return;
      const dt = Math.min((now - g.lastT) / 1000, 0.05);
      g.lastT = now;
      const sp = g.speed;

      const maxV = 900 * sp * dt;
      const dx = g.targetX - g.cowX;
      g.cowX += Math.abs(dx) <= maxV ? dx : Math.sign(dx) * maxV;
      g.cowX = Math.max(60, Math.min(660, g.cowX));

      if (now - g.lastSpawnItem > 750 / sp) {
        g.lastSpawnItem = now;
        g.entities.push({
          kind: "item",
          type: Math.random() < 0.5 ? "grain" : "grass",
          x: 60 + Math.random() * 600,
          y: -40,
        });
      }
      if (now - g.lastSpawnObs > 1600 / sp) {
        g.lastSpawnObs = now;
        const t = (["vaccine", "virus", "ref"] as const)[
          Math.floor(Math.random() * 3)
        ];
        g.entities.push({
          kind: "obs",
          type: t,
          x: 60 + Math.random() * 600,
          y: -40,
        });
      }

      const cowY = 940;
      const fall = 260 * sp * dt;
      let gained = 0;
      for (const en of g.entities) {
        en.y += fall;
        if (
          !en.hit &&
          Math.abs(en.x - g.cowX) < 58 &&
          Math.abs(en.y - cowY) < 62
        ) {
          if (en.kind === "item") {
            en.hit = true;
            gained +=
              en.type === "grain" ? cfg.pointsPerGrain : cfg.pointsPerGrass;
          } else {
            endRound(false, true);
            return;
          }
        }
      }
      g.entities = g.entities.filter((en) => !en.hit && en.y < 1140);

      if (gained) {
        g.score += gained;
        setScore(g.score);
        if (cfg.unlimitedTime && g.score >= cfg.winningScore) {
          endRound(true, false);
          return;
        }
      }

      const elapsed = (now - g.startTime) / 1000;
      if (!cfg.unlimitedTime) {
        const left = Math.max(0, Math.ceil(cfg.timeLimit - elapsed));
        setTimeLeft((prev) => (prev !== left ? left : prev));
        if (elapsed >= cfg.timeLimit) {
          endRound(true, false);
          return;
        }
      } else {
        const t = Math.floor(elapsed);
        setTimeLeft((prev) => (prev !== t ? t : prev));
      }

      draw();
      rafId.current = requestAnimationFrame(tick);
    };

    rafId.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId.current);
      cv.removeEventListener("pointerdown", onPointerDown);
      cv.removeEventListener("pointermove", onPointerMove);
      cv.removeEventListener("pointerup", onPointerUp);
      cv.removeEventListener("pointercancel", onPointerUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hudTime = cfg.unlimitedTime
    ? `🎯 ${score}/${cfg.winningScore}`
    : `⏱ ${timeLeft}s`;

  return (
    <div
      className="bg-game-gradient relative flex w-full items-center justify-center"
      style={{ height: "100vh", touchAction: "none" }}
    >
      <canvas
        ref={canvasRef}
        width={720}
        height={1080}
        style={{
          height: "100vh",
          maxWidth: "100vw",
          touchAction: "none",
          display: "block",
        }}
      />
      <div className="pointer-events-none absolute top-3.5 right-0 left-0 flex justify-center gap-3.5">
        <div
          className="rounded-full border-4 px-6 py-0.5 text-2xl font-extrabold"
          style={{
            borderColor: "#21351f",
            background: "#fff8e7",
            color: "#2c7a37",
            boxShadow: "0 4px 0 #21351f",
          }}
        >
          ⭐ {score}
        </div>
        <div
          className="rounded-full border-4 px-6 py-0.5 text-2xl font-extrabold"
          style={{
            borderColor: "#21351f",
            background: "#ffd54f",
            color: "#8a5a00",
            boxShadow: "0 4px 0 #21351f",
          }}
        >
          {hudTime}
        </div>
      </div>
    </div>
  );
}
