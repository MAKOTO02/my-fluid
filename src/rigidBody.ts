// rigidBody.ts
import { vec3 } from "gl-matrix";
import type { Transform } from "./transform";

export class RigidBody {
  readonly transform: Transform;

  velocity: vec3 = vec3.create();
  private forceAccum: vec3 = vec3.create();

  mass: number = 1.0;
  damping: number = 2.0; // 大きいほど減速が速い（空気抵抗）

  constructor(transform: Transform) {
    this.transform = transform;
  }

  /** 力を加える（F = m a の F 部分） */
  addForce(f: vec3) {
    vec3.add(this.forceAccum, this.forceAccum, f);
  }

  /** 1フレーム分の物理更新 */
  integrate(dt: number) {
    if (dt <= 0) return;

    // a = F / m
    const accel = vec3.create();
    vec3.scale(accel, this.forceAccum, 1.0 / this.mass);

    // v = v + a dt
    vec3.scaleAndAdd(this.velocity, this.velocity, accel, dt);

    // 減衰（簡単な空気抵抗）
    const dampingFactor = Math.max(0, 1 - this.damping * dt);
    vec3.scale(this.velocity, this.velocity, dampingFactor);

    // x = x + v dt
    vec3.scaleAndAdd(this.transform.position, this.transform.position, this.velocity, dt);

    this.transform.markDirty();

    // 力は使い切ったのでリセット
    vec3.set(this.forceAccum, 0, 0, 0);

    // Transform の行列も更新しておく
    this.transform.updateMatrix();
  }

  /** 位置を即時にいじりたいとき用（テレポートなど） */
  setPosition(pos: vec3) {
    this.transform.setPosition(pos);
    vec3.set(this.velocity, 0, 0, 0);
    vec3.set(this.forceAccum, 0, 0, 0);
  }
}
