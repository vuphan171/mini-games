import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { BEEF_POINT, COW_R, ICONS, RADII, SPEED_PRESETS, type GameConfig, type ItemType } from "../../../configs";
import { sfx } from "../../../lib/audio";
import { clamp, rand } from "../../../lib/utils";
import type { GameOutcome, GameResultKind } from "../types";

interface GameScreenProps {
  config: GameConfig;
  onFinish: (result: GameOutcome) => void;
}

interface Item {
  id: number;
  type: ItemType;
  x: number;
  y: number;
}

interface GameState {
  w: number;
  h: number;
  cowX: number;
  cowY: number;
  items: Item[];
  score: number;
  timeLeft: number;
  spawnT: number;
  offset: number; // độ cuộn sân
  elapsed: number;
}

type PointerLikeEvent = React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>;

const getClientX = (e: PointerLikeEvent): number | null => {
  if ("touches" in e) return e.touches.length ? e.touches[0].clientX : null;
  return e.clientX;
};

export default function GameScreen({ config, onFinish }: GameScreenProps) {
  const fieldRef = useRef<HTMLDivElement>(null);
  const preset = SPEED_PRESETS[config.speed] || SPEED_PRESETS.medium;

  const [, setTick] = useState(0);
  const [ready, setReady] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const S = useRef<GameState | null>(null);
  const drag = useRef<{ active: boolean; targetX: number | null }>({ active: false, targetX: null });
  const keys = useRef<Record<string, boolean>>({});
  const rafId = useRef(0);
  const finished = useRef(false);
  const idSeq = useRef(1);

  // Khởi tạo: đo kích thước sân (thử lại vài frame nếu chưa có)
  useEffect(() => {
    let cancelled = false;
    let tries = 0;
    const init = () => {
      if (cancelled) return;
      const el = fieldRef.current;
      const w = el ? el.clientWidth : 0;
      const h = el ? el.clientHeight : 0;
      if ((w < 200 || h < 300) && tries < 30) {
        tries++;
        requestAnimationFrame(init);
        return;
      }
      const W = Math.max(w, 320);
      const H = Math.max(h, 480);
      S.current = {
        w: W,
        h: H,
        cowX: W / 2,
        cowY: H - 110, // bò cố định gần đáy
        items: [],
        score: 0,
        timeLeft: config.duration,
        spawnT: 0,
        offset: 0,
        elapsed: 0,
      };
      setReady(true);
    };
    requestAnimationFrame(init);
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Đếm ngược 3-2-1
  useEffect(() => {
    if (!ready || countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 800);
    return () => clearTimeout(t);
  }, [ready, countdown]);

  const endGame = useCallback(
    (result: GameResultKind) => {
      if (finished.current) return;
      finished.current = true;
      cancelAnimationFrame(rafId.current);
      if (result === "win") sfx.win();
      else sfx.lose();
      const st = S.current;
      onFinish({
        score: st ? st.score : 0,
        result,
        playedSeconds: st ? Math.round(config.duration - st.timeLeft) : 0,
      });
    },
    [onFinish, config.duration],
  );

  // Sinh vật phẩm mới ở mép trên
  const spawn = (st: GameState) => {
    const pad = 50;
    const isObstacle = Math.random() < preset.obstacleProb && st.elapsed > 1.2; // 1.2s đầu chỉ có thịt
    let type: ItemType;
    if (!isObstacle) type = "beef";
    else type = Math.random() < 0.7 ? "ball" : "ref";

    // tìm x không dính vật phẩm khác đang ở gần mép trên
    let x = rand(pad, st.w - pad);
    for (let i = 0; i < 10; i++) {
      const near = st.items.some((it) => it.y < 140 && Math.abs(it.x - x) < 90);
      if (!near) break;
      x = rand(pad, st.w - pad);
    }
    st.items.push({ id: idSeq.current++, type, x, y: -50 });
    if (type === "ball") sfx.bounce();
  };

  // Vòng lặp game
  useEffect(() => {
    if (!ready || countdown > 0 || !S.current || finished.current) return;
    let last = performance.now();

    const loop = (now: number) => {
      if (finished.current) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const st = S.current;
      if (!st) return;
      st.elapsed += dt;

      // --- Di chuyển bò (kéo tay hoặc phím trái/phải) ---
      let target: number | null = null;
      if (drag.current.active && drag.current.targetX != null) {
        target = drag.current.targetX;
      } else {
        const dir =
          (keys.current.ArrowRight || keys.current.d ? 1 : 0) - (keys.current.ArrowLeft || keys.current.a ? 1 : 0);
        if (dir !== 0) target = st.cowX + dir * 1000;
      }
      if (target != null) {
        const dx = target - st.cowX;
        const step = preset.cowSpeed * dt;
        st.cowX += Math.abs(dx) <= step ? dx : Math.sign(dx) * step;
        st.cowX = clamp(st.cowX, COW_R + 6, st.w - COW_R - 6);
      }

      // --- Cuộn sân ---
      st.offset += preset.scroll * dt;

      // --- Sinh vật phẩm ---
      st.spawnT += dt;
      if (st.spawnT >= preset.spawnEvery) {
        st.spawnT = 0;
        spawn(st);
        if (Math.random() < 0.35) spawn(st); // thỉnh thoảng sinh đôi
      }

      // --- Vật phẩm trôi xuống + va chạm ---
      const cow = { x: st.cowX, y: st.cowY };
      for (let i = st.items.length - 1; i >= 0; i--) {
        const it = st.items[i];
        it.y += preset.scroll * dt;

        const d = Math.hypot(cow.x - it.x, cow.y - it.y);
        if (it.type === "beef") {
          if (d < COW_R + RADII.beef) {
            st.items.splice(i, 1);
            st.score += BEEF_POINT;
            sfx.eat();
            if (st.score >= config.winScore) {
              setTick((n) => n + 1);
              endGame("win");
              return;
            }
            continue;
          }
        } else {
          if (d < COW_R + RADII[it.type] - 8) {
            // trừ 8px cho dễ thở
            sfx.whistle();
            setTick((n) => n + 1);
            setTimeout(() => endGame("lose_obstacle"), 350);
            return;
          }
        }
        if (it.y > st.h + 60) st.items.splice(i, 1);
      }

      // --- Thời gian ---
      st.timeLeft -= dt;
      if (st.timeLeft <= 0) {
        st.timeLeft = 0;
        setTick((n) => n + 1);
        endGame("lose_timeout");
        return;
      }

      setTick((n) => n + 1);
      rafId.current = requestAnimationFrame(loop);
    };

    rafId.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, countdown, endGame, config.winScore]);

  // Bàn phím (test trên máy tính)
  useEffect(() => {
    const dn = (e: KeyboardEvent) => {
      keys.current[e.key] = true;
    };
    const up = (e: KeyboardEvent) => {
      keys.current[e.key] = false;
    };
    window.addEventListener("keydown", dn);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", dn);
      window.removeEventListener("keyup", up);
    };
  }, []);

  // Kéo ngang để điều khiển bò: chạm bất kỳ đâu trên sân
  const setTarget = (clientX: number) => {
    const el = fieldRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    drag.current.targetX = clientX - r.left;
  };
  const onDown = (e: PointerLikeEvent) => {
    if (e.cancelable) e.preventDefault();
    drag.current.active = true;
    const x = getClientX(e);
    if (x != null) setTarget(x);
  };
  const onMove = (e: PointerLikeEvent) => {
    if (!drag.current.active) return;
    if (e.cancelable) e.preventDefault();
    const x = getClientX(e);
    if (x != null) setTarget(x);
  };
  const onUp = () => {
    drag.current = { active: false, targetX: null };
  };

  const st = S.current;

  // Vạch sân lặp lại mỗi CYCLE px (1 vạch ngang + 1 vòng tròn giữa sân)
  const CYCLE = 620;
  const marks: number[] = [];
  if (st) {
    const base = st.offset % CYCLE;
    for (let k = -1; k * CYCLE + base < st.h + CYCLE; k++) {
      marks.push(base + k * CYCLE);
    }
  }

  return (
    <div
      className="bg-game-gradient w-full flex flex-col select-none"
      style={{ height: "100vh", touchAction: "none", overflow: "hidden" }}
    >
      {/* Sân cỏ cuộn dọc, full màn hình */}
      <div
        ref={fieldRef}
        className="relative"
        style={{
          flex: 1,
          minHeight: 0,
          overflow: "hidden",
          background: "repeating-linear-gradient(180deg,#3c9448 0,#3c9448 120px,#46a552 120px,#46a552 240px)",
          backgroundPositionY: st ? st.offset % 240 : 0,
        }}
        onTouchStart={onDown}
        onTouchMove={onMove}
        onTouchEnd={onUp}
        onMouseDown={onDown}
        onMouseMove={onMove}
        onMouseUp={onUp}
        onMouseLeave={onUp}
      >
        {/* Biên sân trái/phải */}
        <div className="absolute" style={{ left: 14, top: 0, bottom: 0, width: 3, background: "rgba(255,255,255,0.8)" }} />
        <div className="absolute" style={{ right: 14, top: 0, bottom: 0, width: 3, background: "rgba(255,255,255,0.8)" }} />

        {/* Vạch vôi + vòng tròn giữa sân cuộn xuống */}
        {st &&
          marks.map((y, i) => (
            <Fragment key={"m" + i}>
              <div className="absolute" style={{ left: 14, right: 14, top: y, height: 3, background: "rgba(255,255,255,0.8)" }} />
              <div
                className="absolute rounded-full"
                style={{
                  left: "50%",
                  top: y,
                  width: 170,
                  height: 170,
                  transform: "translate(-50%,-50%)",
                  border: "3px solid rgba(255,255,255,0.8)",
                }}
              />
            </Fragment>
          ))}

        {/* Vật phẩm */}
        {ready &&
          st &&
          st.items.map((it) => (
            <div
              key={it.id}
              className="absolute"
              style={{
                left: it.x,
                top: it.y,
                transform: "translate(-50%,-50%)",
                fontSize: it.type === "ref" ? 52 : 44,
                filter: "drop-shadow(0 3px 2px rgba(0,0,0,0.35))",
              }}
            >
              {it.type === "beef" ? (
                <img src={ICONS.beef} alt="beef" width={96} height={60} draggable={false} />
              ) : (
                ICONS[it.type]
              )}
            </div>
          ))}

        {/* Chú bò */}
        {ready && st && (
          <div
            className="absolute"
            style={{
              left: st.cowX,
              top: st.cowY,
              transform: "translate(-50%,-50%)",
              fontSize: 64,
              filter: "drop-shadow(0 4px 3px rgba(0,0,0,0.4))",
            }}
          >
            🐄
          </div>
        )}

        {/* HUD nổi trên sân, căn giữa như game.html */}
        <div className="absolute flex items-center justify-center gap-3.5" style={{ top: 14, left: 14, right: 14 }}>
          <div
            className="flex items-center gap-1.5 rounded-full border-4 py-1 pr-5 pl-2 text-2xl font-extrabold"
            style={{
              borderColor: "#21351f",
              background: "#fff8e7",
              color: "#2c7a37",
              boxShadow: "0 4px 0 #21351f",
            }}
          >
            <img src={ICONS.beef} alt="beef" width={40} height={25} />
            {st ? st.score : 0}
          </div>
          <div
            className="rounded-full border-4 px-5 py-1 text-2xl font-extrabold"
            style={
              st && st.timeLeft < 10
                ? { borderColor: "#d63031", background: "#ffe1e0", color: "#d63031", boxShadow: "0 4px 0 #b0201f" }
                : { borderColor: "#21351f", background: "#ffd54f", color: "#8a5a00", boxShadow: "0 4px 0 #21351f" }
            }
          >
            ⏱ {Math.max(0, Math.ceil(st ? st.timeLeft : config.duration))}s
          </div>
        </div>

        {/* Overlay đếm ngược / đang chuẩn bị */}
        {(!ready || countdown > 0) && (
          <div
            className="absolute flex flex-col items-center justify-center text-white"
            style={{ inset: 0, background: "rgba(0,0,0,0.55)" }}
          >
            {!ready ? (
              <div
                className="text-3xl font-extrabold"
                style={{ textShadow: "0 3px 0 #1a4d21, 0 6px 14px rgba(0,0,0,.35)" }}
              >
                Đang chuẩn bị sân…
              </div>
            ) : (
              <>
                <div
                  className="text-9xl leading-none font-extrabold"
                  style={{
                    color: "#ffd54f",
                    textShadow: "0 4px 0 #8a5a00, 0 8px 20px rgba(0,0,0,.4)",
                    animation: "pop-in .3s ease",
                  }}
                  key={countdown}
                >
                  {countdown}
                </div>
                <p
                  className="mt-6 px-8 text-center text-xl font-semibold"
                  style={{ textShadow: "0 2px 4px rgba(0,0,0,.4)" }}
                >
                  Kéo ngang để điều khiển bò 🐄
                  <br />
                  Ăn <img src={ICONS.beef} alt="beef" width={45} height={29} style={{ display: "inline", verticalAlign: "middle" }} /> lấy
                  điểm — né ⚽ và 🧑‍⚖️ nhé!
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
