import { vec3, mat4, quat } from "gl-matrix";
import type { Program } from "./program";
import { GameObject } from "./gameObject";

export class Camera extends GameObject {
  private fov: number;
  private aspect: number;
  private near: number;
  private far: number;
  private yaw: number;
  private pitch: number;
  private viewMatrix: mat4;
  private projectionMatrix: mat4;
  private program: Program | null = null;
  private gl: WebGLRenderingContext | WebGL2RenderingContext;
  public dt: number = 0;    // 仮置き.

  constructor(
    gl: WebGLRenderingContext | WebGL2RenderingContext,
    fov = Math.PI / 4,
    aspect = 1,
    near = 0.1,
    far = 1000,
    position = vec3.fromValues(0, 0, 5),
    yaw = -Math.PI / 2,
    pitch = 0
  ) {
    super();
    this.gl = gl;

    this.fov = fov;
    this.aspect = aspect;
    this.near = near;
    this.far = far;

    this.viewMatrix = mat4.create();
    this.projectionMatrix = mat4.create();

    vec3.copy(this.transform.position, position);
    this.yaw = yaw;
    this.pitch = pitch;

    const body = this.addRigidBody(1.0, 4.0);
    body.setPosition(position);

    this.updateMatrices();
  }

  public setProgram(program: Program){
    this.program = program;
  }

  move(offset: vec3) {
    this.transform.translate(offset);
    this.updateMatrices();
  }

  rotate(deltaYaw: number, deltaPitch: number) {
    this.yaw   += deltaYaw;
    this.pitch += deltaPitch;

    // 上下向きすぎ防止
    const limit = Math.PI / 2 - 0.01;
    if (this.pitch >  limit) this.pitch =  limit;
    if (this.pitch < -limit) this.pitch = -limit;

    this.updateMatrices();
  }

  setAspect(aspect: number) {
    this.aspect = aspect;
    this.updateMatrices();
  }

  public updateMatrices() {
    // yaw/pitch → quaternion
    const qYaw   = quat.create();
    const qPitch = quat.create();
    quat.setAxisAngle(qYaw,   [0, 1, 0], this.yaw);
    quat.setAxisAngle(qPitch, [1, 0, 0], this.pitch);

    const q = quat.create();
    quat.mul(q, qYaw, qPitch);      // yaw → pitch
    quat.copy(this.transform.rotation, q);

    // Transform の modelMatrix を更新（カメラの「ワールド行列」）
    this.transform.updateMatrix();

    // view = inverse(model)
    mat4.invert(this.viewMatrix, this.transform.modelMatrix);

    // projection
    mat4.perspective(this.projectionMatrix, this.fov, this.aspect, this.near, this.far);
  }

  updateShaderUniforms() {
    if(!this.program) return;

    const locView    = this.program.uniforms.get("uViewMat");
    const locProj    = this.program.uniforms.get("uProjectionMat");

    if (!locView || !locProj) {
      throw new Error("Camera のプログラムが不正です.");
    }

    this.gl.uniformMatrix4fv(locView, false, this.viewMatrix);
    this.gl.uniformMatrix4fv(locProj, false, this.projectionMatrix);
  }

  public override update(dt: number){
    super.update(dt);
    this.dt = dt;
    this.updateMatrices();
  }
}
