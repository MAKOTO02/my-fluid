// src/shaderLoader.ts

// Vite の ?raw で「ファイル内容を string として import」
import baseVert from "./shaders/baseVertexShader.vert?raw";
import copy from "./shaders/copyShader.frag?raw";
import clear from "./shaders/clearShader.frag?raw";
import splat from "./shaders/splatShader.frag?raw";
import color from "./shaders/colorShader.frag?raw";
import advection from "./shaders/advectionShader.frag?raw";
import divergence from "./shaders/divergenceShader.frag?raw";
import curl from "./shaders/curlShader.frag?raw";
import vorticity from "./shaders/vorticityShader.frag?raw";
import pressure from "./shaders/pressureShader.frag?raw";
import gradientSubtract from "./shaders/gradientSubtractShader.frag?raw";
import display from "./shaders/displayShader.frag?raw";

import noise from "./shaders/noiseShader.frag?raw";
import curlNoise from "./shaders/curlNoise.frag?raw";
import physics from "./shaders/physicsShader.frag?raw";

import sceneVert from "./shaders/sceneVertexShader.vert?raw";
import scene from "./shaders/sceneShader.frag?raw";
// 他のシェーダーも同様に import

// 名前 → ソースコード のマップ
const SHADERS = {
    baseVert,
    copy,
    clear,
    splat,
    color,
    advection,
    divergence,
    curl,
    vorticity,
    pressure,
    gradientSubtract,
    display,
    noise,
    curlNoise,
    physics,
    sceneVert,
    scene
} as const;

export type ShaderName = keyof typeof SHADERS;
/**
 * シェーダーソースを名前で取得する
 * （存在しない名前ならエラーにする）
 */
export function loadShaderSource(name: ShaderName): string {
  const src = SHADERS[name];
  if (!src) {
    throw new Error(`Unknown shader name: ${name}`);
  }
  return src;
}
