import { Transform } from "./transform";
import { RigidBody } from "./rigidBody";
import { Program } from "./program";
import type { InputSystem } from "./inputSystem";

export class GameObject {
  transform: Transform;
  rigidBody: RigidBody | null = null;

  constructor() {
    this.transform = new Transform();
  }

  /** このオブジェクトを物理オブジェクトにする */
  addRigidBody(mass = 1.0, dragK = 3.0): RigidBody {
    if (!this.rigidBody) {
      this.rigidBody = new RigidBody(this.transform);
    }
    this.rigidBody.mass = mass;
    this.rigidBody.dragK = dragK;
    return this.rigidBody;
  }

  /** 物理更新（必要なら Scene から呼ぶ） */
  updatePhysics(dt: number) {
    if (this.rigidBody) {
      this.rigidBody.integrate(dt);
    }
  }

  /** ロジック更新用。継承先で override してもOK */
  update(dt: number, _input?: InputSystem) {
    // デフォルトでは物理だけ更新
    this.updatePhysics(dt);
  }

  draw(){}
  init(){}

  setProgram(_program: Program){}
}