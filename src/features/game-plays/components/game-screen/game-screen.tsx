import { useEffect, useRef, useState } from "react";
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

const ITEM_HEIGHT = 57;
const COW_HEIGHT = 86;

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

const CANVAS_WIDTH = 1024;
const CANVAS_HEIGHT = 1366;
const COW_Y_RATIO = 0.9;
const COW_Y = CANVAS_HEIGHT * COW_Y_RATIO;

const CONTAINER_STYLE: CSSProperties = {
  position: "fixed",
  inset: 0,
  margin: "auto",
  width: `min(100vw, calc(100dvh * ${CANVAS_WIDTH} / ${CANVAS_HEIGHT}))`,
  height: `min(100dvh, calc(100vw * ${CANVAS_HEIGHT} / ${CANVAS_WIDTH}))`,
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
      g.targetX = ((clientX - r.left) / r.width) * CANVAS_WIDTH;
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
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      for (const en of g.entities) {
        const img =
          en.kind === "item" ? ITEM_IMAGES[en.type] : OBS_IMAGES[en.type];

        drawCenteredByHeight(ctx, img, en.x, en.y, ITEM_HEIGHT);
      }

      drawCenteredByHeight(ctx, COW_IMAGE, g.cowX, COW_Y, COW_HEIGHT);
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

      const cowY = COW_Y;
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
    <div className="flex items-center justify-center" style={CONTAINER_STYLE}>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        style={{
          width: "100%",
          height: "100%",
          touchAction: "none",
          display: "block",
        }}
      />
      <div className="pointer-events-none absolute top-3.5 right-0 left-0 flex justify-center gap-3.5">
        <ScoreBadge score={score} />
        <TimeBadge label={hudTime} />
      </div>
    </div>
  );
};

export default GameScreen;
