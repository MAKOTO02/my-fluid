precision mediump float;
precision mediump sampler2D;

varying highp vec2 vUv;
varying highp vec2 vL;
varying highp vec2 vR;
varying highp vec2 vT;
varying highp vec2 vB;
uniform sampler2D uVelocity;
uniform sampler2D uCurlNoise;

void main () {
    float L = texture2D(uVelocity, vL).y;
    float R = texture2D(uVelocity, vR).y;
    float T = texture2D(uVelocity, vT).x;
    float B = texture2D(uVelocity, vB).x;
    float vorticity = (R - L - T + B) * 0.5;
    float nx = texture2D(uCurlNoise, vUv).r;
    nx = nx * 2.0 - 1.0;  
    float strength = 0.1;
    gl_FragColor = vec4(vorticity + nx * strength, 0.0, 0.0, 1.0);
}