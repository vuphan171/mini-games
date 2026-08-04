import { decompressFrames, parseGIF } from "gifuct-js";
import type { ParsedFrame } from "gifuct-js";

export class GifPlayer {
  private frames: ParsedFrame[] = [];
  private totalDuration = 0;
  private frameIndex = -1;
  private startTime = 0;
  private canvas = document.createElement("canvas");
  private patchCanvas = document.createElement("canvas");

  ready = false;

  async load(src: string) {
    const res = await fetch(src);
    const buffer = await res.arrayBuffer();
    const gif = parseGIF(buffer);

    this.frames = decompressFrames(gif, true);
    this.totalDuration = this.frames.reduce((sum, f) => sum + f.delay, 0);
    this.canvas.width = gif.lsd.width;
    this.canvas.height = gif.lsd.height;
    this.frameIndex = -1;
    this.ready = this.frames.length > 0 && this.totalDuration > 0;
  }

  get width() {
    return this.canvas.width;
  }

  get height() {
    return this.canvas.height;
  }

  private drawPatch(frame: ParsedFrame) {
    const { dims } = frame;
    this.patchCanvas.width = dims.width;
    this.patchCanvas.height = dims.height;

    const patchCtx = this.patchCanvas.getContext("2d");
    const ctx = this.canvas.getContext("2d");
    if (!patchCtx || !ctx) return;

    const imageData = patchCtx.createImageData(dims.width, dims.height);
    imageData.data.set(frame.patch);
    patchCtx.putImageData(imageData, 0, 0);

    if (frame.disposalType === 2) {
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    ctx.drawImage(this.patchCanvas, dims.left, dims.top);
  }

  getFrame(now: number): HTMLCanvasElement | null {
    if (!this.ready) return null;
    if (this.frameIndex === -1) this.startTime = now;

    const elapsed = (now - this.startTime) % this.totalDuration;

    let acc = 0;
    let index = this.frames.length - 1;
    for (let i = 0; i < this.frames.length; i++) {
      acc += this.frames[i].delay;
      if (elapsed < acc) {
        index = i;
        break;
      }
    }

    if (index !== this.frameIndex) {
      if (index < this.frameIndex) {
        this.canvas
          .getContext("2d")
          ?.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let i = 0; i <= index; i++) this.drawPatch(this.frames[i]);
      } else {
        for (let i = this.frameIndex + 1; i <= index; i++) {
          this.drawPatch(this.frames[i]);
        }
      }
      this.frameIndex = index;
    }

    return this.canvas;
  }
}
