import { GameObject } from "./gameObject";
import { vec3 } from "gl-matrix";
import { InputSystem } from "./inputSystem";
import { Pointer, type RGB } from "./pointer";

export class SplatPointerObject extends GameObject {
    private moveSpeed: number = 5.0;
    public pointer:  Pointer = new Pointer();
    public prevPosition = vec3.create();
    private initialized = false;


    private canvas: HTMLCanvasElement;

    constructor(canvas: HTMLCanvasElement) {
        super();
        this.canvas = canvas
        const start = vec3.fromValues(0.0,0.0,0.0)
        this.transform.setPosition(start);
        vec3.copy(this.prevPosition, start);

        this.pointer.id = -2;
    }

    public update(dt: number, input?: InputSystem) {
        if (input) {
            const dir = vec3.create();

            if (input.isKeyDown("w")) dir[1] += 1;
            if (input.isKeyDown("s")) dir[1] -= 1;
            if (input.isKeyDown("a")) dir[0] -= 1;
            if (input.isKeyDown("d")) dir[0] += 1;

            const len = vec3.length(dir);
            if (len > 0) {
                vec3.scale(dir, dir, this.moveSpeed * dt / len);
                this.transform.translate(dir);
            }

            this.updatePointerFromWorld();
            super.update(dt);
        }

        super.update(dt);
    }

    private updatePointerFromWorld() {
        if (!this.canvas)
            throw new Error("canvas が見つかりません.");

        const pos = this.transform.position;

        // 初期化
        const { u, v } = worldToUV(pos);
        const posX = u * this.canvas.width;
        const posY = (1.0 - v) * this.canvas.height;

        // ★ まだ初期化してないときは「down」と同じ処理をする
        if (!this.initialized) {
            this.pointer.down = true;
            this.pointer.moved = false;
            this.pointer.texcoordX = posX / this.canvas.width;
            this.pointer.texcoordY = 1.0 - posY / this.canvas.height;
            this.pointer.prevTexcoordX = this.pointer.texcoordX;
            this.pointer.prevTexcoordY = this.pointer.texcoordY;
            this.pointer.deltaX = 0;
            this.pointer.deltaY = 0;
            this.pointer.color = generateColor();   // 必要なら
            this.initialized = true;
            return;   // このフレームでは splat しない
        }

        // クリックと同じ関数を使う
        updatePointerMoveData(this.canvas, this.pointer, posX, posY);
    }
}

const FLUID_MIN_X = -5;
const FLUID_MAX_X =  5;
const FLUID_MIN_Y = -5;
const FLUID_MAX_Y =  5;
  
  // world座標 → UV に変換するヘルパ
function worldToUV(pos: vec3): { u: number; v: number } {
    const u = (pos[0] - FLUID_MIN_X) / (FLUID_MAX_X - FLUID_MIN_X);
    const v = (pos[1] - FLUID_MIN_Y) / (FLUID_MAX_Y - FLUID_MIN_Y);
    return { u, v };
}

function updatePointerMoveData (canvas: HTMLCanvasElement,pointer: Pointer, posX: number, posY: number) {
  if(!canvas)
      throw new Error("canvas が見つかりません.")
    pointer.prevTexcoordX = pointer.texcoordX;
    pointer.prevTexcoordY = pointer.texcoordY;
    pointer.texcoordX = posX / canvas.width;
    pointer.texcoordY = 1.0 - posY / canvas.height;
    pointer.deltaX = correctDeltaX(canvas, pointer.texcoordX - pointer.prevTexcoordX);
    pointer.deltaY = correctDeltaY(canvas, pointer.texcoordY - pointer.prevTexcoordY);
    pointer.moved = Math.abs(pointer.deltaX) > 0 || Math.abs(pointer.deltaY) > 0;
}

function correctDeltaX (canvas: HTMLCanvasElement ,delta: number) {
  if(!canvas)
      throw new Error("canvas が見つかりません.")
    let aspectRatio = canvas.width / canvas.height;
    if (aspectRatio < 1) delta *= aspectRatio;
    return delta;
}

function correctDeltaY (canvas: HTMLCanvasElement, delta: number) {
    if(!canvas)
        throw new Error("canvas が見つかりません.")
    let aspectRatio = canvas.width / canvas.height;
    if (aspectRatio > 1) delta /= aspectRatio;
    return delta;
}

function generateColor (): RGB {
    let c = HSVtoRGB(Math.random(), 1.0, 1.0);
    c.r *= 0.15;
    c.g *= 0.15;
    c.b *= 0.15;
    return c;
}

function HSVtoRGB (h: number, s: number, v: number): RGB {
    let r, g, b, i, f, p, q, t : number;
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);

    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
        default : r = v, g = t, b = p; break;
    }

    return {
        r,
        g,
        b
    };
}