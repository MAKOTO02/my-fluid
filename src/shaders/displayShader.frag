precision highp float;
precision highp sampler2D;

varying vec2 vUvDisplay;
uniform sampler2D uTexture;

void main () {
    vec3 c = texture2D(uTexture, vUvDisplay).rgb;
    float a = max(c.r, max(c.g, c.b));
    gl_FragColor = vec4(c, a);
}