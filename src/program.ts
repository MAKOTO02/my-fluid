import { createProgram, getUniforms } from "./material";

export class Program {
    private gl: WebGLRenderingContext | WebGL2RenderingContext;
    uniforms: Map<string, WebGLUniformLocation | null>;
    program: WebGLProgram;

    constructor (gl: WebGLRenderingContext | WebGL2RenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) {
        this.gl = gl;
        this.uniforms = new Map();
        this.program = createProgram(gl, vertexShader, fragmentShader);
        this.uniforms = getUniforms(gl, this.program);
    }

    bind () {
        this.gl.useProgram(this.program);
    }
}