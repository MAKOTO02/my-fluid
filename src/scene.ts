// scene.ts
import type { Program } from "./program";
import type { Camera } from "./camera";
import type { InputSystem } from "./inputSystem";
import type { GameObject } from "./gameObject";

export class Scene {
  private program: Program;
  private camera: Camera | null = null;
  private objects: GameObject[] = [];
  private input?: InputSystem;
  //private input?: InputSystem;

  constructor(
    program: Program,
    input?: InputSystem
  ) {
    this.program = program;
    this.input = input;
  }

  setCamera(camera: Camera) {
    this.camera = camera;
    camera.setProgram(this.program);
  }

  addObject(obj: GameObject) {
    obj.setProgram(this.program);
    obj.init();
    this.objects.push(obj);
  }

  public update(dt: number) {
    // オブジェクトごとに動かしたい場合
    for (const obj of this.objects) {
      obj.update(dt, this.input)
    }
  }

  render() {
    // このシーン用のプログラムをバインド
    this.program.bind();

    // カメラの行列 & カメラ位置を uniform へ
    if (this.camera) {
      this.camera.updateShaderUniforms();
    }

    // 各メッシュの描画
    for (const obj of this.objects) {
      obj.draw();
    }
  }
}
