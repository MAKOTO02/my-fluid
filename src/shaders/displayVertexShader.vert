// displayVert.glsl
precision highp float;

attribute vec2 aPosition;

varying vec2 vUvDisplay;

uniform vec2  uOffset;
uniform float uScale;

void main() {
    // フルスクリーンUV
    vec2 uv = aPosition * 0.5 + 0.5;

    // 中心(0.5, 0.5)から拡大縮小＋オフセット
    uv = (uv - 0.5) * uScale + 0.5 + uOffset;

    vUvDisplay = uv;
    gl_Position = vec4(aPosition, 0.0, 1.0);
}
