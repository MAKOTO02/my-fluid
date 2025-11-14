precision mediump float;
precision mediump sampler2D;

varying vec2 vUv;
uniform float uTime;

float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

void main() {
    vec2 p = vUv * 10.0 + vec2(uTime * 0.5, 0.0);
    float n = hash(p);              // 超シンプルな疑似ノイズ
    gl_FragColor = vec4(vec3(n), 1.0);
}