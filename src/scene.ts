// scene.ts
import type { Program } from "./program";
import type { Camera } from "./camera";
import type { Mesh } from "./mesh";   // Mesh2D を 3D に拡張した版を想定

export class Scene {
  private program: Program;
  private camera: Camera | null = null;
  private objects: Mesh[] = [];

  constructor(
    program: Program
  ) {
    this.program = program;
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

  update(dt: number) {
    // カメラ側でアニメーションさせる場合はここで更新しても良い
    if (this.camera) {
      this.camera.update(dt);
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
