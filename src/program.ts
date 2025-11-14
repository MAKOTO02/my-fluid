import { createProgram, getUniforms } from "./material";
import { gl } from "./main";

export class Program {
    uniforms: Map<string, WebGLUniformLocation | null>;
    program: WebGLProgram;

    constructor (vertexShader: WebGLShader, fragmentShader: WebGLShader) {
        this.uniforms = new Map();
        this.program = createProgram(vertexShader, fragmentShader);
        this.uniforms = getUniforms(this.program);
    }

    bind () {
        gl.useProgram(this.program);
    }
}