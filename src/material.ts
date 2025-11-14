import { gl } from "./main";
import { hashCode } from "./Utils";

export class Material{
    vertexShader: WebGLShader;
    fragmentShaderSource: string;
    programs: { [hash: number]: WebGLProgram | undefined};
    activeProgram: WebGLProgram | null;
    uniforms: Map<string, WebGLUniformLocation | null>;
    constructor (vertexShader: WebGLShader, fragmentShaderSource: string) {
        this.vertexShader = vertexShader;
        this.fragmentShaderSource = fragmentShaderSource;
        this.programs = {};
        this.activeProgram = null;
        this.uniforms = new Map();
    }

    setKeywords (keywords: string[]) {
        let hash = 0;
        for (let i = 0; i < keywords.length; i++)
            hash += hashCode(keywords[i]);

        let program = this.programs[hash];
        if (program == null)
        {
            let fragmentShader = compileShader(gl.FRAGMENT_SHADER, this.fragmentShaderSource, keywords);
            program = createProgram(this.vertexShader, fragmentShader);
            this.programs[hash] = program;
        }

        if (program == this.activeProgram) return;

        this.uniforms = getUniforms(program);
        this.activeProgram = program;
    }

    bind () {
        if (!this.activeProgram) return; 
        gl.useProgram(this.activeProgram);
    }
}

export function getUniforms (program: WebGLProgram): Map<string, WebGLUniformLocation | null> {
    let uniforms: Map<string, WebGLUniformLocation | null> = new Map();
    let uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < uniformCount; i++) {
        let uniformInfo = gl.getActiveUniform(program, i);
        if(!uniformInfo) continue;
        let uniformName = uniformInfo.name;
        uniforms.set(uniformName, gl.getUniformLocation(program, uniformName));
    }
    return uniforms;
}

export function createProgram (vertexShader: WebGLShader, fragmentShader: WebGLShader) {
    let program = gl.createProgram();
    if (!program) {
        throw new Error("WebGLProgram を作成できませんでした");
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
        console.trace(gl.getProgramInfoLog(program));

    return program;
}

export function compileShader (type: number, source: string , keywords?: string[] | null) {

    source = addKeywords(source, keywords);

    const shader = gl.createShader(type);
    if(!shader ){
        throw new Error("shader が見つかりません");
    }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
        console.trace(gl.getShaderInfoLog(shader));

    return shader;
};

function addKeywords (source: string, keywords?: string[] | null) {
    if (!keywords || keywords.length === 0) return source;
    let keywordsString = "";
    keywords.forEach(keyword => {
        keywordsString += '#define ' + keyword + '\n';
    });
    return keywordsString + source;
}
