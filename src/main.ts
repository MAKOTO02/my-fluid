import { getWebGLContext} from "./glContext"; // さっき作ったやつを想定
import { Program } from "./program";
import { Material } from "./material";
import { compileShader } from "./material";
import { loadShaderSource } from "./shaderLoader";
import { Pointer, type RGB } from "./pointer";
import { Scene } from "./scene";
import { Quad } from "./mesh";
import { Camera } from "./camera";
import { vec3 } from "gl-matrix";
import { InputSystem } from "./inputSystem";
import { SplatPointerObject } from "./splatPointerObject";
import { FollowController } from "./followController";
import { config } from "./config";

// ------- グローバル状態 -------
const canvas = document.getElementById("canvas") as HTMLCanvasElement | null;
if (!canvas) {
  throw new Error("canvas が見つかりません");
}
resizeCanvas();
export const { gl, ext } = getWebGLContext(canvas);
let lastUpdateTime = performance.now();



let baseVertexShader = compileShader(gl, gl.VERTEX_SHADER, loadShaderSource("baseVert"));
let copyShader = compileShader(gl, gl.FRAGMENT_SHADER, loadShaderSource("copy"));
let clearShader = compileShader(gl, gl.FRAGMENT_SHADER, loadShaderSource("clear"));
let splatShader = compileShader(gl, gl.FRAGMENT_SHADER, loadShaderSource("splat"));
let colorShader = compileShader(gl, gl.FRAGMENT_SHADER, loadShaderSource("color"));
let advectionShader = compileShader(gl, gl.FRAGMENT_SHADER, loadShaderSource("advection"), ext.supportLinearFiltering ? null : ["MANUAL_FILTERING"]);
let divergenceShader = compileShader(gl, gl.FRAGMENT_SHADER, loadShaderSource("divergence"));
let curlShader = compileShader(gl, gl.FRAGMENT_SHADER, loadShaderSource("curl"));
let vorticityShader = compileShader(gl, gl.FRAGMENT_SHADER, loadShaderSource("vorticity"));
let pressureShader = compileShader(gl, gl.FRAGMENT_SHADER, loadShaderSource("pressure"));
let gradientSubtractShader = compileShader(gl, gl.FRAGMENT_SHADER, loadShaderSource("gradientSubtract"));

let dye: DoubleFBO;
let velocity: DoubleFBO;
let divergence: FBO;
let curl: FBO;
let pressure: DoubleFBO;

// 追加.
let noiseShader = compileShader(gl, gl.FRAGMENT_SHADER, loadShaderSource("noise"));;
let noiseProgram = new Program(gl, baseVertexShader, noiseShader);
let noise: FBO;
let curlNoiseshader = compileShader(gl, gl.FRAGMENT_SHADER, loadShaderSource("curlNoise"));
let curlNoiseProgram = new Program(gl, baseVertexShader, curlNoiseshader);
let curlNoise: FBO;
let physicsShader = compileShader(gl, gl.FRAGMENT_SHADER, loadShaderSource("physics"));
let physicsProgram = new Program(gl, baseVertexShader, physicsShader);

const copyProgram  = new Program(gl, baseVertexShader, copyShader);
const clearProgram = new Program(gl, baseVertexShader, clearShader);
const splatProgram = new Program(gl, baseVertexShader, splatShader);
const colorProgram = new Program(gl, baseVertexShader, colorShader);

let curlProgram = new Program(gl, baseVertexShader, curlShader);
let vorticityProgram = new Program(gl, baseVertexShader, vorticityShader);
let divergenceProgram = new Program(gl, baseVertexShader, divergenceShader);
let pressureProgram = new Program(gl, baseVertexShader, pressureShader);
let gradienSubtractProgram = new Program(gl, baseVertexShader, gradientSubtractShader);
let advectionProgram = new Program(gl, baseVertexShader, advectionShader);

let sceneVertexShader = compileShader(gl, gl.VERTEX_SHADER, loadShaderSource("sceneVert"));
let sceneShader = compileShader(gl, gl.FRAGMENT_SHADER, loadShaderSource("scene"));
let sceneProgram = new Program(gl, sceneVertexShader, sceneShader);
let input = new InputSystem(canvas);

let scene = new Scene(sceneProgram, input);
let quad = new Quad(gl);
let quad2 = new Quad(gl);
quad2.transform.translate(vec3.fromValues(2.0,0.0,0.0));
scene.addObject(quad);
scene.addObject(quad2);
if(!canvas)
  throw new Error("canvas が見つかりせん.");
let aspect = canvas.width / canvas.height
let camera = new Camera(
  gl,
  Math.PI / 3,
  aspect,
  0.1,
  100.0,
  vec3.fromValues(0, 0, 3), // z=3 にカメラ
  0,                        // yaw = 0
  0                         // pitch = 0
);
scene.setCamera(camera);
let player = new SplatPointerObject(canvas);
scene.addObject(player);
//let offset = vec3.subtract(vec3.create(), camera.transform.position, player.transform.position);
//let followController = new FollowController(camera, player, offset);

// fluid 面のワールド座標範囲をどこかで定義しておく


let sceneFBO: FBO;
function renderSceneToFBO() {
    // sceneFBO に向かって描く
    gl.bindFramebuffer(gl.FRAMEBUFFER, sceneFBO.fbo);
    gl.viewport(0, 0, sceneFBO.width, sceneFBO.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // ここで 3D オブジェクト群を描く
    scene.render();

    // 戻しておく（この後 fluid 等を描く）
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}

const displayVertexShader = compileShader(gl, gl.VERTEX_SHADER, loadShaderSource("displayVertex"));
const displayMaterial = new Material(gl, displayVertexShader, loadShaderSource("display"));
displayMaterial.setKeywords([]);

// ------- ユーティリティ -------
function resizeCanvas (): boolean {
  if (!canvas) {
    throw new Error("canvas が見つかりません");
  }
  let width = scaleByPixelRatio(canvas.clientWidth);
  let height = scaleByPixelRatio(canvas.clientHeight);
  if (canvas.width != width || canvas.height != height) {
    canvas.width = width;
    canvas.height = height;
    return true;
  }
  return false;
}
function scaleByPixelRatio (input : number): number {
  let pixelRatio = window.devicePixelRatio || 1;
  return Math.floor(input * pixelRatio);
}

function initFramebuffers () {
    let simRes = getResolution(config.SIM_RESOLUTION);
    let dyeRes = getResolution(config.DYE_RESOLUTION);

    const texType = ext.halfFloatTexType;
    const rgba    = ext.formatRGBA;
    const rg      = ext.formatRG;
    const r       = ext.formatR;
    const filtering = ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST;

    gl.disable(gl.BLEND);
    if(!r || !rg || !rgba)
      throw new Error("フォーマットが無効です.");

    if (dye == null)
        dye = createDoubleFBO(dyeRes.width, dyeRes.height, rgba.internalFormat, rgba.format, texType, filtering);
    else
        dye = resizeDoubleFBO(dye, dyeRes.width, dyeRes.height, rgba.internalFormat, rgba.format, texType, filtering);

    if (velocity == null)
        velocity = createDoubleFBO(simRes.width, simRes.height, rg.internalFormat, rg.format, texType, filtering);
    else
        velocity = resizeDoubleFBO(velocity, simRes.width, simRes.height, rg.internalFormat, rg.format, texType, filtering);

    divergence = createFBO      (simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST);
    curl       = createFBO      (simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST);
    pressure   = createDoubleFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST);

    // 追加.
    noise = createFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, filtering);
    curlNoise = createFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, filtering);

    sceneFBO = createFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, filtering);
}
function getResolution (resolution: number) {
    let aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight;
    if (aspectRatio < 1)
        aspectRatio = 1.0 / aspectRatio;

    let min = Math.round(resolution);
    let max = Math.round(resolution * aspectRatio);

    if (gl.drawingBufferWidth > gl.drawingBufferHeight)
        return { width: max, height: min };
    else
        return { width: min, height: max };
}
function calcDeltaTime(now: number) {
  let dt = (now - lastUpdateTime) / 1000;
  dt = Math.min(dt, 0.016666);
  lastUpdateTime = now;
  return dt;
}

type FBO = {
    texture: WebGLTexture,
    fbo: WebGLFramebuffer,
    width: number,
    height: number,
    texelSizeX: number,
    texelSizeY: number,
    attach(id: number): number
}

type DoubleFBO = {
    width: number,
    height: number,
    texelSizeX: number,
    texelSizeY: number,
    read: FBO,
    write: FBO,
    swap: Function
}

function createFBO(
    w: number, 
    h: number,
    internalFormat: number, 
    format: number, 
    type:number, 
    param: number
  ): FBO {
    gl.activeTexture(gl.TEXTURE0);
    let texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);

    let fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    gl.viewport(0, 0, w, h);
    gl.clear(gl.COLOR_BUFFER_BIT);

    let texelSizeX = 1.0 / w;
    let texelSizeY = 1.0 / h;

    return {
        texture,
        fbo,
        width: w,
        height: h,
        texelSizeX,
        texelSizeY,
        attach (id: number) {
            gl.activeTexture(gl.TEXTURE0 + id);
            gl.bindTexture(gl.TEXTURE_2D, texture);
            return id;
        }
    };
}

function createDoubleFBO (
    w: number, 
    h: number, 
    internalFormat: number, 
    format: number, 
    type: number, 
    param: number
  ): DoubleFBO {
    let fbo1 = createFBO(w, h, internalFormat, format, type, param);
    let fbo2 = createFBO(w, h, internalFormat, format, type, param);

    return {
        width: w,
        height: h,
        texelSizeX: fbo1.texelSizeX,
        texelSizeY: fbo1.texelSizeY,
        get read () {
            return fbo1;
        },
        set read (value) {
            fbo1 = value;
        },
        get write () {
            return fbo2;
        },
        set write (value) {
            fbo2 = value;
        },
        swap () {
            let temp = fbo1;
            fbo1 = fbo2;
            fbo2 = temp;
        }
    }
}
function resizeFBO (
    target: FBO, 
    w: number, 
    h: number, 
    internalFormat: number, 
    format: number, 
    type: number, 
    param: number
  ) {
    let newFBO = createFBO(w, h, internalFormat, format, type, param);
    copyProgram.bind();
    let loc = copyProgram.uniforms.get("uTexture");
    if(loc === undefined)
      throw new Error(" uTexture が未定義です");
    gl.uniform1i(loc, target.attach(0));
    blit(newFBO);
    return newFBO;
}
function resizeDoubleFBO (
    target: DoubleFBO, 
    w: number, 
    h: number, 
    internalFormat: number, 
    format: number, 
    type: number, 
    param: number
) {
    if (target.width == w && target.height == h)
        return target;
    target.read = resizeFBO(target.read, w, h, internalFormat, format, type, param);
    target.write = createFBO(w, h, internalFormat, format, type, param);
    target.width = w;
    target.height = h;
    target.texelSizeX = 1.0 / w;
    target.texelSizeY = 1.0 / h;
    return target;
}

// ------- メインループ -------
function update (now:number) {
  const dt = calcDeltaTime(now);
  if (resizeCanvas())
    initFramebuffers();

  applyInputs();
  if (!config.PAUSED)
    step(dt);
  render(null);
  
  requestAnimationFrame(update);
}

let pointers: Pointer[] = [];
pointers.push(new Pointer());
pointers.push(player.pointer);
let splatStack: number[] = [];
function applyInputs(){
  if (splatStack.length > 0)
    multipleSplats(splatStack.pop());

  pointers.forEach(p => {
    if (p.moved) {
      p.moved = false;
      splatPointer(p);
    }
  });
}
function splatPointer (pointer: Pointer) {
    let dx = pointer.deltaX * config.SPLAT_FORCE;
    let dy = pointer.deltaY * config.SPLAT_FORCE;
    splat(pointer.texcoordX, pointer.texcoordY, dx, dy, pointer.color);
}

function multipleSplats (amount: number | undefined) {
    if(amount === undefined)
      throw new Error("amount が未定義です.");
    for (let i = 0; i < amount; i++) {
        const color = generateColor();
        color.r *= 10.0;
        color.g *= 10.0;
        color.b *= 10.0;
        const x = Math.random();
        const y = Math.random();
        const dx = 1000 * (Math.random() - 0.5);
        const dy = 1000 * (Math.random() - 0.5);
        splat(x, y, dx, dy, color);
    }
}
function splat (x: number, y: number, dx: number, dy: number, color: RGB) {
    if(!canvas)
        throw new Error("canvas が見つかりせん.");
    splatProgram.bind();
    let locuTarget = splatProgram.uniforms.get("uTarget");
    let locAspectRatio = splatProgram.uniforms.get("aspectRatio");
    let locPoint = splatProgram.uniforms.get("point");
    let locColor = splatProgram.uniforms.get("color")
    let locRadius = splatProgram.uniforms.get("radius");
    if(
      locuTarget === undefined ||
      locAspectRatio == undefined ||
      locPoint === undefined || 
      locColor === undefined || 
      locRadius === undefined
    )
      throw new Error("splatProgram が不正です.")

    gl.uniform1i(locuTarget, velocity.read.attach(0));
    gl.uniform1f(locAspectRatio, canvas.width / canvas.height);
    gl.uniform2f(locPoint, x, y);
    gl.uniform3f(locColor, dx, dy, 0.0);
    gl.uniform1f(locRadius, correctRadius(config.SPLAT_RADIUS / 100.0));
    blit(velocity.write);
    velocity.swap();

    gl.uniform1i(locuTarget, dye.read.attach(0));
    gl.uniform3f(locColor, color.r, color.g, color.b);
    blit(dye.write);
    dye.swap();
}

function correctRadius (radius: number) {
    if(!canvas)
        throw new Error("canvas が見つかりせん.");
    let aspectRatio = canvas.width / canvas.height;
    if (aspectRatio > 1)
        radius *= aspectRatio;
    return radius;
}



function generateColor (): RGB {
    let c = HSVtoRGB(Math.random(), 1.0, 1.0);
    c.r *= 0.15;
    c.g *= 0.15;
    c.b *= 0.15;
    return c;
}

function HSVtoRGB (h: number, s: number, v: number): RGB {
    let r, g, b, i, f, p, q, t : number;
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);

    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
        default : r = v, g = t, b = p; break;
    }

    return {
        r,
        g,
        b
    };
}

function sceneFlow(dt: number){
    // scene描画を追加.
    camera.setAspect(sceneFBO.width / sceneFBO.height);
    input?.resetMouseDelta();
    input?.resetScroll();
    //followController.update(dt);

    scene.update(dt);
    renderSceneToFBO();
}

function bindObstacle(program: Program) {
    const loc = program.uniforms.get("uObstacle");
    if (!loc) return; // そのシェーダが uObstacle を使ってないなら何もしない
    gl.uniform1i(loc, sceneFBO.attach(3)); // 例: テクスチャユニット3
}

function fluidFlow(dt: number){
    noiseProgram.bind();
    let locTexelSize = noiseProgram.uniforms.get("texelSize");
    let locuTime = noiseProgram.uniforms.get("uTime");
    if(locTexelSize === undefined || locuTime === undefined)
      throw new Error("noiseProgram が不正です.");

    gl.uniform2f(locTexelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform1f(locuTime, lastUpdateTime*0.001)
    blit(noise);

    curlNoiseProgram.bind();
    locTexelSize = curlNoiseProgram.uniforms.get("texelSize");
    let locuNoise = curlNoiseProgram.uniforms.get("uNoise");
    if(locTexelSize === undefined || locuNoise === undefined)
      throw new Error("curlNoiseProgram が不正です.");
    gl.uniform2f(locTexelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform1i(locuNoise, noise.attach(0));
    blit(curlNoise);

    curlProgram.bind();
    locTexelSize = curlProgram.uniforms.get("texelSize");
    let locuVelocity = curlProgram.uniforms.get("uVelocity");
    let locuCurlNoise = curlProgram.uniforms.get("uCurlNoise");
    if(locTexelSize === undefined || locuVelocity === undefined || locuCurlNoise === undefined) 
      throw new Error("curlProgram が不正です.")
    gl.uniform2f(locTexelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform1i(locuVelocity, velocity.read.attach(0));
    gl.uniform1i(locuCurlNoise, curlNoise.attach(1));
    blit(curl);

    vorticityProgram.bind();
    locTexelSize = vorticityProgram.uniforms.get("texelSize");
    locuVelocity = vorticityProgram.uniforms.get("uVelocity");
    let locuCurl = vorticityProgram.uniforms.get("uCurl");
    let locCurl = vorticityProgram.uniforms.get("curl");
    let locDt  = vorticityProgram.uniforms.get("dt");
    locuNoise = vorticityProgram.uniforms.get("uNoise");
    let locTime = vorticityProgram.uniforms.get("time");
    if(locTexelSize === undefined ||
      locuVelocity === undefined ||
      locuCurl === undefined ||
      locCurl === undefined ||
      locDt === undefined ||
      locuNoise === undefined ||
      locTime === undefined
    )
      throw new Error("vorticityProgram が不正です.")

    gl.uniform2f(locTexelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform1i(locuVelocity, velocity.read.attach(0));
    gl.uniform1i(locuCurl, curl.attach(1));
    gl.uniform1f(locCurl, config.CURL);
    gl.uniform1f(locDt, dt);
    gl.uniform1i(locuNoise, noise.attach(2));
    gl.uniform1f(locTime, lastUpdateTime * 0.001);
    blit(velocity.write);
    velocity.swap();

    physicsProgram.bind();
    bindObstacle(physicsProgram);
    locuVelocity = physicsProgram.uniforms.get("uVelocity");
    let locAccel = physicsProgram.uniforms.get("uAccel");
    let locGravity  = physicsProgram.uniforms.get("uGravity");
    locDt       = physicsProgram.uniforms.get("dt");
    if (locuVelocity === undefined || locGravity === undefined || locDt === undefined) {
      throw new Error("physicsProgram が不正です");
    }
    gl.uniform1i(locuVelocity, velocity.read.attach(0));
    // 下向き重力（座標系に合わせて符号は調整）:
    gl.uniform2f(locGravity, 0.0, -config.GRAVITY); 
    gl.uniform1f(locDt, dt);
    if(camera.rigidBody){
      if(! locAccel) throw new Error("physicsProgram が不正です.");
      let coef = 10;
      let fx = camera.rigidBody?.acceleration[0] * coef;
      let fy = camera.rigidBody?.acceleration[1] * coef;
      gl.uniform2f(locAccel, fx, fy);
    }

    blit(velocity.write);
    velocity.swap();

    divergenceProgram.bind();
    locTexelSize = divergenceProgram.uniforms.get("texelSize");
    locuVelocity = divergenceProgram.uniforms.get("uVelocity")
    if(locTexelSize === undefined || locuVelocity === undefined)
      throw new Error("divergenceProgram が不正です.")
    gl.uniform2f(locTexelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform1i(locuVelocity, velocity.read.attach(0));
    blit(divergence);

    clearProgram.bind();
    let locuTexture = clearProgram.uniforms.get("uTexture");
    let locValue = clearProgram.uniforms.get("value");
    if(locuTexture === undefined || locValue === undefined)
      throw new Error("clearProgram が不正です.");
    gl.uniform1i(locuTexture, pressure.read.attach(0));
    gl.uniform1f(locValue, config.PRESSURE);
    blit(pressure.write);
    pressure.swap();

    pressureProgram.bind();
    locTexelSize = pressureProgram.uniforms.get("texelSize");
    let locuDivergence = pressureProgram.uniforms.get("uDivergence");
    let locuPressure = pressureProgram.uniforms.get("uPressure");
    if(locTexelSize === undefined || locuDivergence === undefined || locuPressure == undefined)
      throw new Error("pressureProgram が不正です.")
    gl.uniform2f(locTexelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform1i(locuDivergence, divergence.attach(0));
    for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
        gl.uniform1i(locuPressure, pressure.read.attach(1));
        blit(pressure.write);
        pressure.swap();
    }

    gradienSubtractProgram.bind();
    locTexelSize = gradienSubtractProgram.uniforms.get("texelSize");
    locuPressure = gradienSubtractProgram.uniforms.get("uPressure");
    locuVelocity = gradienSubtractProgram.uniforms.get("uVelocity");
    if(locTexelSize == undefined || locuPressure === undefined || locuVelocity === undefined)
      throw new Error("gradientSubtractProgram が不正です.")
    gl.uniform2f(locTexelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform1i(locuPressure, pressure.read.attach(0));
    gl.uniform1i(locuVelocity, velocity.read.attach(1));
    blit(velocity.write);
    velocity.swap();

    advectionProgram.bind();
    locTexelSize = advectionProgram.uniforms.get("texelSize");
    let locDyeTexelSize = advectionProgram.uniforms.get("dyeTexelSize");
    locuVelocity = advectionProgram.uniforms.get("uVelocity");
    let locuSource = advectionProgram.uniforms.get("uSource");
    locDt = advectionProgram.uniforms.get("dt");
    let locDissipation = advectionProgram.uniforms.get("dissipation");
    if(
      locTexelSize === undefined ||  
      locuVelocity === undefined || 
      locuSource === undefined ||
      locDt === undefined ||
      locDissipation === undefined
    ){
      throw new Error("advectionProgram が不正です.");
    }
    // dyeTexelSize だけは「MANUAL_FILTERING のときだけ存在していれば良い」
    if (!ext.supportLinearFiltering && locDyeTexelSize === undefined) {
      throw new Error("dyeTexelSize uniform が見つかりません（MANUAL_FILTERING 有効時）");
    }
    gl.uniform2f(locTexelSize, velocity.texelSizeX, velocity.texelSizeY);
    if (!ext.supportLinearFiltering)
        gl.uniform2f(locDyeTexelSize as WebGLUniformLocation, velocity.texelSizeX, velocity.texelSizeY);
    let velocityId = velocity.read.attach(0);
    gl.uniform1i(locuVelocity, velocityId);
    gl.uniform1i(locuSource, velocityId);
    gl.uniform1f(locDt, dt);
    gl.uniform1f(locDissipation, config.VELOCITY_DISSIPATION);
    blit(velocity.write);
    velocity.swap();

    if (!ext.supportLinearFiltering)
        gl.uniform2f(locDyeTexelSize as WebGLUniformLocation, dye.texelSizeX, dye.texelSizeY);
    gl.uniform1i(locuVelocity, velocity.read.attach(0));
    gl.uniform1i(locuSource, dye.read.attach(1));
    gl.uniform1f(locDissipation, config.DENSITY_DISSIPATION);
    blit(dye.write);
    dye.swap();
}
function step(dt: number){
    gl.disable(gl.BLEND);

    sceneFlow(dt);
    fluidFlow(dt);
}

function render(target: FBO | null){
  if (target == null || !config.TRANSPARENT) {
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        gl.enable(gl.BLEND);
    }
    else {
        gl.disable(gl.BLEND);
    }

    if (!config.TRANSPARENT)
        drawColor(target, normalizeColor(config.BACK_COLOR));
    drawDisplay(target);
}
function drawDisplay (target: FBO | null) {
    displayMaterial.bind();
    let locuTexture = displayMaterial.uniforms.get("uTexture");
    let locOffset = displayMaterial.uniforms.get("uOffset");
    let locScale = displayMaterial.uniforms.get("uScale");
    if(!locuTexture || !locOffset || !locScale) throw new Error("displayShader が不正です.")
    gl.uniform1i(locuTexture, dye.read.attach(0));
    gl.uniform2f(locOffset, 0, 0);
    gl.uniform1f(locScale, 1);
    //gl.uniform1i(locuTexture, sceneFBO.attach(0));
    blit(target);
}

function drawColor (target: FBO | null, color: RGB) {
    colorProgram.bind();
    let locColor = colorProgram.uniforms.get("color");
    if(locColor == undefined)
      throw new Error("colorProgram が不正です.")
    gl.uniform4f(locColor, color.r, color.g, color.b, 1);
    blit(target);
}
function normalizeColor (input: RGB): RGB {
    let output = {
        r: input.r / 255,
        g: input.g / 255,
        b: input.b / 255
    };
    return output;
}

const blit = (() => {
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    return (target: FBO | null, clear = false) => {
        if (target == null)
        {
            gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }
        else
        {
            gl.viewport(0, 0, target.width, target.height);
            gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
        }
        if (clear)
        {
            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT);
        }
        // CHECK_FRAMEBUFFER_STATUS();
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    }
})();

window.addEventListener("load", () => {
  // キャンバスサイズをウィンドウに合わせる
  resizeCanvas();
  initFramebuffers();

  lastUpdateTime = performance.now();
  requestAnimationFrame(update);

  console.log("WebGL context:", gl, ext);
});
window.addEventListener('resize', resizeCanvas);
window.addEventListener('orientationchange', resizeCanvas);

canvas.addEventListener('mousedown', e => {
    let posX = scaleByPixelRatio(e.offsetX);
    let posY = scaleByPixelRatio(e.offsetY);
    let pointer = pointers.find(p => p.id == -1);
    if (pointer == null)
        pointer = new Pointer();
    updatePointerDownData(pointer, -1, posX, posY);
});

canvas.addEventListener('mousemove', e => {
    let pointer = pointers[0];
    if (!pointer.down) return;
    let posX = scaleByPixelRatio(e.offsetX);
    let posY = scaleByPixelRatio(e.offsetY);
    updatePointerMoveData(pointer, posX, posY);
});

window.addEventListener('mouseup', () => {
    updatePointerUpData(pointers[0]);
});

canvas.addEventListener('touchstart', e => {
    e.preventDefault();
    const touches = e.targetTouches;
    while (touches.length >= pointers.length)
        pointers.push(new Pointer());
    for (let i = 0; i < touches.length; i++) {
        let posX = scaleByPixelRatio(touches[i].pageX);
        let posY = scaleByPixelRatio(touches[i].pageY);
        updatePointerDownData(pointers[i + 1], touches[i].identifier, posX, posY);
    }
});

canvas.addEventListener('touchmove', e => {
    e.preventDefault();
    const touches = e.targetTouches;
    for (let i = 0; i < touches.length; i++) {
        let pointer = pointers[i + 1];
        if (!pointer.down) continue;
        let posX = scaleByPixelRatio(touches[i].pageX);
        let posY = scaleByPixelRatio(touches[i].pageY);
        updatePointerMoveData(pointer, posX, posY);
    }
}, false);

window.addEventListener('touchend', e => {
    const touches = e.changedTouches;
    for (let i = 0; i < touches.length; i++)
    {
        let pointer = pointers.find(p => p.id == touches[i].identifier);
        if (pointer == null) continue;
        updatePointerUpData(pointer);
    }
});

window.addEventListener('keydown', e => {
    if (e.code === 'KeyP')
        config.PAUSED = !config.PAUSED;
    if (e.key === ' ')
        splatStack.push(Math.random() * 20 + 5);
});

function updatePointerDownData (pointer: Pointer, id: number, posX: number, posY: number) {
    if(!canvas)
      throw new Error("canvas が見つかりません.")
    pointer.id = id;
    pointer.down = true;
    pointer.moved = false;
    pointer.texcoordX = posX / canvas.width;
    pointer.texcoordY = 1.0 - posY / canvas.height;
    pointer.prevTexcoordX = pointer.texcoordX;
    pointer.prevTexcoordY = pointer.texcoordY;
    pointer.deltaX = 0;
    pointer.deltaY = 0;
    pointer.color = generateColor();
}

function updatePointerMoveData (pointer: Pointer, posX: number, posY: number) {
  if(!canvas)
      throw new Error("canvas が見つかりません.")
    pointer.prevTexcoordX = pointer.texcoordX;
    pointer.prevTexcoordY = pointer.texcoordY;
    pointer.texcoordX = posX / canvas.width;
    pointer.texcoordY = 1.0 - posY / canvas.height;
    pointer.deltaX = correctDeltaX(pointer.texcoordX - pointer.prevTexcoordX);
    pointer.deltaY = correctDeltaY(pointer.texcoordY - pointer.prevTexcoordY);
    pointer.moved = Math.abs(pointer.deltaX) > 0 || Math.abs(pointer.deltaY) > 0;
}

function updatePointerUpData (pointer: Pointer) {
    pointer.down = false;
}

function correctDeltaX (delta: number) {
  if(!canvas)
      throw new Error("canvas が見つかりません.")
    let aspectRatio = canvas.width / canvas.height;
    if (aspectRatio < 1) delta *= aspectRatio;
    return delta;
}

function correctDeltaY (delta: number) {
  if(!canvas)
      throw new Error("canvas が見つかりません.")
    let aspectRatio = canvas.width / canvas.height;
    if (aspectRatio > 1) delta /= aspectRatio;
    return delta;
}
