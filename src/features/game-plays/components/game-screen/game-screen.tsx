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
import Coin from "@/assets/logos/ic-coin.png";
import CowRunAnimation from "@/assets/logos/cow-run-animation.gif";
import { GifPlayer } from "./gif-player";

const ITEM_HEIGHT = 70;
const COW_HEIGHT = 116;
const COIN_SIZE = 38;
const COIN_FLY_MS = 1500;

const COIN_SCALE_KEYFRAMES: Keyframe[] = [
  { transform: "scale(0.4)", offset: 0 },
  { transform: "scale(1.4)", offset: 0.45 },
  { transform: "scale(0.6)", offset: 1 },
];

const loadImage = (src: string) => {
  const img = new Image();
  img.src = src;
  return img;
};

const SVG_NS = "http://www.w3.org/2000/svg";

const createCoinNode = (points: number): SVGSVGElement => {
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", "0 0 100 100");

  const image = document.createElementNS(SVG_NS, "image");
  image.setAttribute("href", Coin);
  image.setAttribute("width", "100");
  image.setAttribute("height", "100");
  svg.appendChild(image);

  const text = document.createElementNS(SVG_NS, "text");
  text.setAttribute("x", "50");
  text.setAttribute("y", "54");
  text.setAttribute("text-anchor", "middle");
  text.setAttribute("dominant-baseline", "middle");
  text.setAttribute("font-size", "40");
  text.setAttribute("font-weight", "900");
  text.setAttribute("fill", "#ffffff");
  text.setAttribute("stroke", "#5b3a00");
  text.setAttribute("stroke-width", "2");
  text.setAttribute("paint-order", "stroke");
  text.textContent = `+${points}`;
  svg.appendChild(text);

  return svg;
};

const drawCenteredByHeight = (
  ctx: CanvasRenderingContext2D,
  img: CanvasImageSource,
  srcWidth: number,
  srcHeight: number,
  cx: number,
  cy: number,
  height: number,
) => {
  const scale = height / (srcHeight || height);
  const w = (srcWidth || height) * scale;
  ctx.drawImage(img, cx - w / 2, cy - height / 2, w, height);
};

const drawImageCenteredByHeight = (
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  cx: number,
  cy: number,
  height: number,
) => {
  drawCenteredByHeight(
    ctx,
    img,
    img.naturalWidth,
    img.naturalHeight,
    cx,
    cy,
    height,
  );
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

const cowGifPlayer = new GifPlayer();
cowGifPlayer
  .load(CowRunAnimation)
  .catch((err) => console.error("Failed to load cow run animation", err));

const SPEED_MULT: Record<GameConfigs["gameSpeed"], number> = {
  Slow: 0.7,
  Normal: 1,
  Fast: 1.4,
  veryFast: 1.8,
};

const COW_Y_RATIO = 0.9;

const SPAWN_MARGIN_X = 60;
const DESPAWN_MARGIN_Y = 60;

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
  const coinLayerRef = useRef<HTMLDivElement>(null);
  const scoreBadgeRef = useRef<HTMLDivElement>(null);
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

    const spawnCoinFly = (fromX: number, fromY: number, points: number) => {
      const layer = coinLayerRef.current;
      const target = scoreBadgeRef.current;
      if (!layer || !target) return;

      const targetRect = target.getBoundingClientRect();
      const toX = targetRect.left + targetRect.width / 2;
      const toY = targetRect.top + targetRect.height / 2;

      const coin = createCoinNode(points);
      coin.style.position = "fixed";
      coin.style.width = `${COIN_SIZE}px`;
      coin.style.left = `${fromX - COIN_SIZE / 2}px`;
      coin.style.top = `${fromY - COIN_SIZE / 2}px`;
      coin.style.transition = `left ${COIN_FLY_MS}ms ease-in, top ${COIN_FLY_MS}ms cubic-bezier(0.3, 0, 0.7, 1), opacity ${COIN_FLY_MS}ms ease-in`;

      layer.appendChild(coin);
      coin.animate(COIN_SCALE_KEYFRAMES, {
        duration: COIN_FLY_MS,
        easing: "ease-in-out",
        fill: "forwards",
      });

      requestAnimationFrame(() => {
        coin.style.left = `${toX - COIN_SIZE / 2}px`;
        coin.style.top = `${toY - COIN_SIZE / 2}px`;
        coin.style.opacity = "0.2";
      });

      setTimeout(() => coin.remove(), COIN_FLY_MS + 50);
    };

    const draw = (now: number) => {
      ctx.clearRect(0, 0, size.width, size.height);

      for (const en of g.entities) {
        const img =
          en.kind === "item" ? ITEM_IMAGES[en.type] : OBS_IMAGES[en.type];

        drawImageCenteredByHeight(ctx, img, en.x, en.y, ITEM_HEIGHT);
      }

      const cowFrame = cowGifPlayer.getFrame(now);
      if (cowFrame) {
        drawCenteredByHeight(
          ctx,
          cowFrame,
          cowGifPlayer.width,
          cowGifPlayer.height,
          g.cowX,
          size.height * COW_Y_RATIO,
          COW_HEIGHT,
        );
      }
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
            const pts =
              en.type === "grain" ? cfg.pointsPerGrain : cfg.pointsPerGrass;
            gained += pts;
            spawnCoinFly(en.x, en.y, pts);
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

      draw(now);
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
        <div ref={scoreBadgeRef}>
          <ScoreBadge score={score} />
        </div>
        <TimeBadge time={hudTime} />
      </div>
      <div
        ref={coinLayerRef}
        className="pointer-events-none fixed inset-0 z-50"
      />
    </div>
  );
};

export default GameScreen;
