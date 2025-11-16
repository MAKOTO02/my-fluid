import { vec3 } from "gl-matrix";
import type { GameObject } from "./gameObject";

export class FollowController {
  private follower: GameObject;  // 追従される側（カメラなど）
  private target: GameObject;    // 追いかける対象（ポインタなど）
  private offset: vec3;
  private stiffness: number;     // どれくらい素早く追従するか（補間係数）

  constructor(
    follower: GameObject,
    target: GameObject,
    offset: vec3,
    stiffness = 8.0
  ) {
    this.follower = follower;
    this.target = target;
    this.offset = vec3.clone(offset);
    this.stiffness = stiffness;
  }

  public update(dt: number) {
    this.follower.transform.markDirty();

    const curPos = this.follower.transform.position;
    const targetPos = this.target.transform.position;

    const desired = vec3.create();
    vec3.add(desired, targetPos, this.offset);

    // いきなりワープさせるなら vec3.copy でもOK。
    // ちょっと追従に「追いかけ感」を出したいなら lerp。
    const t = Math.min(1.0, this.stiffness * dt);
    vec3.lerp(curPos, curPos, desired, t);

    //console.log(this.follower.transform.position);
  }
}
