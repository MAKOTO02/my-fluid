precision mediump float;
precision mediump sampler2D;

varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;
uniform sampler2D uNoise;

void main(){
  vec3 noise = texture2D(uNoise, vUv).rgb;

  vec3 N  = texture2D(uNoise, vUv).rgb;
  vec3 Nx = texture2D(uNoise, vR).rgb - texture2D(uNoise, vL).rgb;
  vec3 Ny = texture2D(uNoise, vT).rgb - texture2D(uNoise, vB).rgb;

  vec2 curl = vec2(
    Ny.x - Nx.y,
    Nx.y - Ny.x
  );


  gl_FragColor = vec4(curl, 0.0, 1.0);
}