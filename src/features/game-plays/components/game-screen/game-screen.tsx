import { useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { GameOutcome, GameResultKind } from "../../types";
import type { GameConfigs } from "../../configs/game";
import ScoreBadge from "./components/score-badge";
import TimeBadge from "./components/time-badge";
import Grains from "@/assets/logos/grains.png";
import Grass from "@/assets/logos/grass.png";
import Virus from "@/assets/logos/virus.png";
import Referee from "@/assets/logos/referee.png";
import Vaccine from "@/assets/logos/vaccine.png";
import CowRun from "@/assets/logos/cow-run.png";

const ITEM_HEIGHT = 70;
const COW_HEIGHT = 116;

const loadImage = (src: string) => {
  const img = new Image();
  img.src = src;
  return img;
};

const drawCenteredByHeight = (
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  cx: number,
  cy: number,
  height: number,
) => {
  const naturalW = img.naturalWidth || height;
  const naturalH = img.naturalHeight || height;
  const scale = height / naturalH;
  const w = naturalW * scale;
  ctx.drawImage(img, cx - w / 2, cy - height / 2, w, height);
};

const ITEM_IMAGES: Record<ItemType, HTMLImageElement> = {
  grain: loadImage(Grains),
  grass: loadImage(Grass),
};

const OBS_IMAGES: Record<ObsType, HTMLImageElement> = {
  vaccine: loadImage(Vaccine),
  virus: loadImage(Virus),
  ref: loadImage(Referee),
};

const COW_IMAGE = loadImage(CowRun);

const SPEED_MULT: Record<GameConfigs["gameSpeed"], number> = {
  Slow: 0.7,
  Normal: 1,
  Fast: 1.4,
  veryFast: 1.8,
};

// Bò dừng ở vị trí này theo % chiều cao màn hình thật, không còn phụ thuộc
// độ phân giải canvas cố định nữa.
const COW_Y_RATIO = 0.9;

const SPAWN_MARGIN_X = 60;
const DESPAWN_MARGIN_Y = 60;

// Né các vật thể vừa spawn (còn gần đỉnh) khi chọn x cho vật thể mới, tránh
// chồng vị trí ngay lúc rơi xuống.
const MIN_SPAWN_SPACING_X = 120;
const SPAWN_OVERLAP_CHECK_Y = 100;
const MAX_SPAWN_ATTEMPTS = 10;

const getSpawnX = (entities: Entity[], width: number): number => {
  const minX = SPAWN_MARGIN_X;
  const maxX = width - SPAWN_MARGIN_X;
  let x = minX + Math.random() * (maxX - minX);

  for (let attempt = 0; attempt < MAX_SPAWN_ATTEMPTS; attempt++) {
    const overlaps = entities.some(
      (en) =>
        en.y < SPAWN_OVERLAP_CHECK_Y &&
        Math.abs(en.x - x) < MIN_SPAWN_SPACING_X,
    );
    if (!overlaps) return x;
    x = minX + Math.random() * (maxX - minX);
  }

  return x;
};

const CONTAINER_STYLE: CSSProperties = {
  position: "fixed",
  inset: 0,
  touchAction: "none",
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

interface Props {
  config: GameConfigs;
  onFinish: (result: GameOutcome) => void;
}

const GameScreen = ({ config, onFinish }: Props) => {
  const cfg = useRef<GameConfigs>(config).current;
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

  useLayoutEffect(() => {
    const cv = canvasRef.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;

    const size = { width: 0, height: 0 };

    const updateCanvasSize = () => {
      const rect = cv.getBoundingClientRect();
      const width = Math.round(rect.width);
      const height = Math.round(rect.height);
      if (width <= 0 || height <= 0) return;
      size.width = width;
      size.height = height;
      cv.width = width;
      cv.height = height;
    };

    updateCanvasSize();
    const ro = new ResizeObserver(updateCanvasSize);
    ro.observe(cv);

    const g: GameState = {
      cowX: size.width / 2,
      targetX: size.width / 2,
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

    const endRound = (win: boolean) => {
      if (finished.current) return;
      finished.current = true;
      g.over = true;
      cancelAnimationFrame(rafId.current);
      const result: GameResultKind = win ? "win" : "lose_obstacle";
      onFinishRef.current({
        score: g.score,
        result,
        playedSeconds: Math.round((performance.now() - g.startTime) / 1000),
      });
    };

    const setTarget = (clientX: number) => {
      const r = cv.getBoundingClientRect();
      g.targetX = clientX - r.left;
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
      ctx.clearRect(0, 0, size.width, size.height);

      for (const en of g.entities) {
        const img =
          en.kind === "item" ? ITEM_IMAGES[en.type] : OBS_IMAGES[en.type];

        drawCenteredByHeight(ctx, img, en.x, en.y, ITEM_HEIGHT);
      }

      drawCenteredByHeight(
        ctx,
        COW_IMAGE,
        g.cowX,
        size.height * COW_Y_RATIO,
        COW_HEIGHT,
      );
    };

    const tick = (now: number) => {
      if (g.over) return;
      const dt = Math.min((now - g.lastT) / 1000, 0.05);
      g.lastT = now;
      const sp = g.speed;

      const maxV = 900 * sp * dt;
      const dx = g.targetX - g.cowX;
      g.cowX += Math.abs(dx) <= maxV ? dx : Math.sign(dx) * maxV;
      g.cowX = Math.max(
        SPAWN_MARGIN_X,
        Math.min(size.width - SPAWN_MARGIN_X, g.cowX),
      );

      if (now - g.lastSpawnItem > 750 / sp) {
        g.lastSpawnItem = now;
        g.entities.push({
          kind: "item",
          type: Math.random() < 0.5 ? "grain" : "grass",
          x: getSpawnX(g.entities, size.width),
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
          x: getSpawnX(g.entities, size.width),
          y: -40,
        });
      }

      const cowY = size.height * COW_Y_RATIO;
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
            endRound(false);
            return;
          }
        }
      }
      g.entities = g.entities.filter(
        (en) => !en.hit && en.y < size.height + DESPAWN_MARGIN_Y,
      );

      if (gained) {
        g.score += gained;
        setScore(g.score);
        if (cfg.unlimitedTime && g.score >= cfg.winningScore) {
          endRound(true);
          return;
        }
      }

      const elapsed = (now - g.startTime) / 1000;

      if (!cfg.unlimitedTime) {
        const left = Math.max(0, Math.ceil(cfg.timeLimit - elapsed));
        setTimeLeft((prev) => (prev !== left ? left : prev));
        if (elapsed >= cfg.timeLimit) {
          endRound(true);
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
      ro.disconnect();
      cancelAnimationFrame(rafId.current);
      cv.removeEventListener("pointerdown", onPointerDown);
      cv.removeEventListener("pointermove", onPointerMove);
      cv.removeEventListener("pointerup", onPointerUp);
      cv.removeEventListener("pointercancel", onPointerUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hudTime = cfg.unlimitedTime
    ? `${score}/${cfg.winningScore}`
    : `Còn lại: ${timeLeft}s`;

  return (
    <div className="flex items-center justify-center" style={CONTAINER_STYLE}>
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          touchAction: "none",
          display: "block",
        }}
      />
      <div className="pointer-events-none absolute top-3.5 right-0 left-0 flex justify-center gap-3.5">
        <ScoreBadge score={score} />
        <TimeBadge time={hudTime} />
      </div>
    </div>
  );
};

export default GameScreen;
