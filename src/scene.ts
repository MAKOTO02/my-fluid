// scene.ts
import type { Program } from "./program";
import type { Camera } from "./camera";
import type { Mesh } from "./mesh";   // Mesh2D を 3D に拡張した版を想定
import type { InputSystem } from "./inputSystem";

export class Scene {
  private program: Program;
  private camera: Camera | null = null;
  private objects: Mesh[] = [];
  private input?: InputSystem;

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

  addObject(obj: Mesh) {
    obj.setProgram(this.program);
    obj.init();
    this.objects.push(obj);
  }

  public update(dt: number) {
    // カメラ側でアニメーションさせる場合はここで更新しても良い
    if (this.camera) {
      this.camera.update(dt, this.input);
    }
    // オブジェクトごとに動かしたい場合
    for (const obj of this.objects) {
      if (typeof (obj as any).update === "function") {
        (obj as any).update(dt);
      }
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
