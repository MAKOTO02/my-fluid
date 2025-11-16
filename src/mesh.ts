// Vertex 型：位置は vec3（x, y, z）、UV は任意
export type Vertex3D = {
  pos: [number, number, number];
  uv?: [number, number];
};

import { GameObject } from "./gameObject";
import { Program } from "./program";

export class Mesh extends GameObject {
  private gl: WebGL2RenderingContext | WebGLRenderingContext;
  private vao: WebGLVertexArrayObject | null = null;
  private vbo: WebGLBuffer | null = null;
  private ibo: WebGLBuffer | null = null;

  private program: Program | null = null;
  private verticesRaw: Vertex3D[] | null;
  private indices: number[] | null;

  private vertexCount = 0;
  private indexCount = 0;

  constructor(
    gl: WebGL2RenderingContext | WebGLRenderingContext,
    verticesRaw: Vertex3D[] | null,
    indices: number[] | null
  ) {
    super();
    this.gl = gl;
    this.verticesRaw = verticesRaw;
    this.indices = indices;
  }

  public setProgram(program: Program){
    this.program = program;
  }

  public override init() {
    if(!this.program) return;
    const gl = this.gl as WebGL2RenderingContext;

    if (!this.verticesRaw || this.verticesRaw.length === 0) {
      console.warn("Mesh3D: verticesRaw が空です");
      return;
    }

    const hasUV = this.verticesRaw[0].uv !== undefined;

    const ATTR_POS = 3; // x,y,z
    const ATTR_UV = hasUV ? 2 : 0;
    const FLOAT_SIZE = 4;
    const TOTAL_ATTRS = ATTR_POS + ATTR_UV;
    const stride = TOTAL_ATTRS * FLOAT_SIZE;

    const flat = this.verticesRaw.flatMap(v =>
      hasUV ? [...v.pos, ...(v.uv as [number, number])] : [...v.pos]
    );
    const vertices = new Float32Array(flat);
    this.vertexCount = vertices.length / TOTAL_ATTRS;

    this.vao = gl.createVertexArray();
    this.vbo = gl.createBuffer();
    this.ibo = null;

    gl.bindVertexArray(this.vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // aPosition (vec3)
    let offset = 0;
    const locPos = gl.getAttribLocation(this.program.program, "aPosition");
    if (locPos >= 0) {
      gl.enableVertexAttribArray(locPos);
      gl.vertexAttribPointer(
        locPos,
        ATTR_POS,
        gl.FLOAT,
        false,
        stride,
        offset
      );
    }
    offset += ATTR_POS * FLOAT_SIZE;

    // aTexCoord (vec2, あれば)
    if (hasUV) {
      const locUV = gl.getAttribLocation(this.program.program, "aTexCoord");
      if (locUV >= 0) {
        gl.enableVertexAttribArray(locUV);
        gl.vertexAttribPointer(
          locUV,
          ATTR_UV,
          gl.FLOAT,
          false,
          stride,
          offset
        );
      }
      offset += ATTR_UV * FLOAT_SIZE;
    }

    // Index Buffer
    if (this.indices && this.indices.length > 0) {
      this.ibo = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
      gl.bufferData(
        gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(this.indices),
        gl.STATIC_DRAW
      );
      this.indexCount = this.indices.length;
    }

    gl.bindVertexArray(null);
  }

  /** uModel に変換行列を送る */
  public uploadModelMatrix() {
    if(!this.program) return;
    const gl = this.gl;
    this.transform.updateMatrix();

    const uModel = this.program.uniforms.get("uModelMat");
    if (uModel) {
      gl.uniformMatrix4fv(uModel, false, this.transform.modelMatrix);
    }
  }

  update() {
    this.transform.updateMatrix();
  }

  /** 描画 */
  override draw() {
    const gl = this.gl as WebGL2RenderingContext;
    if (!this.vao) return;

    this.uploadModelMatrix();

    gl.bindVertexArray(this.vao);

    if (this.ibo && this.indexCount > 0) {
      gl.drawElements(gl.TRIANGLES, this.indexCount, gl.UNSIGNED_SHORT, 0);
    } else if (this.vertexCount > 0) {
      gl.drawArrays(gl.TRIANGLES, 0, this.vertexCount);
    }

    gl.bindVertexArray(null);
  }
}

export class Quad extends Mesh {
  constructor(
    gl: WebGLRenderingContext | WebGL2RenderingContext
  ) {
    // 原点中心の 1x1 クアッド（Z=0）
    const vertices: Vertex3D[] = [
      { pos: [-0.5, -0.5, 0.0], uv: [0.0, 0.0] }, // 左下
      { pos: [ 0.5, -0.5, 0.0], uv: [1.0, 0.0] }, // 右下
      { pos: [ 0.5,  0.5, 0.0], uv: [1.0, 1.0] }, // 右上
      { pos: [-0.5,  0.5, 0.0], uv: [0.0, 1.0] }, // 左上
    ];

    const indices = [
      0, 1, 2,  // 三角形1
      0, 2, 3,  // 三角形2
    ];

    super(gl, vertices, indices);
  }
}
