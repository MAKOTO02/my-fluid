// rigidBody.ts
import { vec3 } from "gl-matrix";
import type { Transform } from "./transform";

// ForceMode を「型」だけにする
export type ForceMode = "force" | "impulse";

export class RigidBody {
  readonly transform: Transform;

  velocity: vec3 = vec3.create();
  acceleration: vec3 = vec3.create();   // a(t) を保存しておく
  private forceAccum: vec3 = vec3.create();

  mass: number;
  dragK: number;                        // 抵抗係数 k（大きいほど減速が速い）

  constructor(transform: Transform, mass = 1.0, dragK = 2.0) {
    this.transform = transform;
    this.mass = mass;
    this.dragK = dragK;
  }

  /** 力を加える */
  addForce(f: vec3, mode: ForceMode = "force") {
    if (mode === "impulse") {
      // v += (F / m) （dt 無しで一発反映）
      const dv = vec3.create();
      vec3.scale(dv, f, 1 / this.mass);
      vec3.add(this.velocity, this.velocity, dv);
    } else {
      // 1フレーム中に積分される通常の力
      vec3.add(this.forceAccum, this.forceAccum, f);
    }
  }

  /** 1フレーム分の物理更新（ドラッグ付き） */
  integrate(dt: number) {
    if (dt <= 0) return;

    const vOld = vec3.clone(this.velocity);

    if (this.dragK > 0) {
      // λ = k / m
      const lambda = this.dragK / this.mass;
      const c = Math.exp(-lambda * dt); // e^{-λΔt}

      // vTerm = v_n e^{-λΔt}
      const vTerm = vec3.create();
      vec3.scale(vTerm, this.velocity, c);

      // fTerm = (F/k)(1 - e^{-λΔt})
      const fTerm = vec3.create();
      const scaleF = (1 - c) / this.dragK; // k>0 前提
      vec3.scale(fTerm, this.forceAccum, scaleF);

      const vNext = vec3.create();
      vec3.add(vNext, vTerm, fTerm);

      // 位置更新（シンプルにオイラー）
      vec3.scaleAndAdd(this.transform.position, this.transform.position, vNext, dt);

      // 加速度 a ≒ (vNext - vOld) / dt
      vec3.sub(this.acceleration, vNext, vOld);
      vec3.scale(this.acceleration, this.acceleration, 1 / dt);

      vec3.copy(this.velocity, vNext);
    } else {
      // dragK = 0 のときは通常のニュートン
      const a = vec3.create();
      vec3.scale(a, this.forceAccum, 1 / this.mass);    // a = F/m

      // v_{n+1} = v_n + a dt
      vec3.scaleAndAdd(this.velocity, this.velocity, a, dt);

      // x_{n+1} = x_n + v_{n+1} dt
      vec3.scaleAndAdd(this.transform.position, this.transform.position, this.velocity, dt);

      vec3.copy(this.acceleration, a);
    }

    // 力は使い切ったのでリセット
    vec3.set(this.forceAccum, 0, 0, 0);

    // Transform を汚しておく（ここ重要）
    this.transform.markDirty();
    this.transform.updateMatrix();
  }

  /** 位置を即時変更したいとき（リセット用など） */
  setPosition(pos: vec3) {
    vec3.copy(this.transform.position, pos);
    vec3.set(this.velocity, 0, 0, 0);
    vec3.set(this.acceleration, 0, 0, 0);
    vec3.set(this.forceAccum, 0, 0, 0);
    this.transform.markDirty();
    this.transform.updateMatrix();
  }
}
