import { vec3, quat, mat4 } from 'gl-matrix';

export class Transform {
  position: vec3;
  rotation: quat;
  scale: vec3;
  modelMatrix: mat4;
  private _dirty: boolean;

  constructor() {
    this.position = vec3.create();
    this.rotation = quat.create();
    this.scale    = vec3.fromValues(1, 1, 1);
    this.modelMatrix = mat4.create();
    this._dirty = true;
  }

  public updateMatrix(): mat4 {
    if (!this._dirty) return this.modelMatrix;

    const T  = mat4.create();
    const R  = mat4.create();
    const S  = mat4.create();
    const TR = mat4.create();

    mat4.fromTranslation(T, this.position);
    mat4.fromQuat(R, this.rotation);
    mat4.fromScaling(S, this.scale);

    mat4.mul(TR, T, R);
    mat4.mul(this.modelMatrix, TR, S);

    this._dirty = false;
    return this.modelMatrix;
  }

  translate(offset: vec3) {
    vec3.add(this.position, this.position, offset);
    this._dirty = true;
  }

  rotate(angleRad: number, axis: vec3) {
    const q = quat.create();
    quat.setAxisAngle(q, axis, angleRad);
    quat.multiply(this.rotation, q, this.rotation);
    this._dirty = true;
  }

  setScale(scale: vec3) {
    vec3.copy(this.scale, scale);
    this._dirty = true;
  }

  getMatrix(): mat4 {
    return this.updateMatrix();
  }

  markDirty(){
    this._dirty = true;
  }

  setPosition(pos: vec3){
    vec3.copy(this.position, pos);
    this._dirty = true;
  }
}
