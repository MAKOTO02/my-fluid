(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))o(n);new MutationObserver(n=>{for(const a of n)if(a.type==="childList")for(const u of a.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&o(u)}).observe(document,{childList:!0,subtree:!0});function i(n){const a={};return n.integrity&&(a.integrity=n.integrity),n.referrerPolicy&&(a.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?a.credentials="include":n.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function o(n){if(n.ep)return;n.ep=!0;const a=i(n);fetch(n.href,a)}})();function me(e){const t={alpha:!0,depth:!1,stencil:!1,antialias:!1,preserveDrawingBuffer:!1};let i;i=e.getContext("webgl2",t);const o=!!i;if(o||(i=e.getContext("webgl",t)||e.getContext("experimental-webgl",t)),!i)throw new Error("WebGL is not supported");let n,a;o?(i.getExtension("EXT_color_buffer_float"),a=i.getExtension("OES_texture_float_linear")):(n=i.getExtension("OES_texture_half_float"),a=i.getExtension("OES_texture_half_float_linear")),i.clearColor(0,0,0,1);const u=o?i.HALF_FLOAT:n.HALF_FLOAT_OES;let v,c,d;if(o){const s=i;v=A(s,s.RGBA16F,s.RGBA,u),c=A(s,s.RG16F,s.RG,u),d=A(s,s.R16F,s.RED,u)}else{const s=i;v=A(s,s.RGBA,s.RGBA,u),c=A(s,s.RGBA,s.RGBA,u),d=A(s,s.RGBA,s.RGBA,u)}return{gl:i,ext:{formatRGBA:v,formatRG:c,formatR:d,halfFloatTexType:u,supportLinearFiltering:!!a}}}function A(e,t,i,o){if(!he(e,t,i,o)){if("RGBA16F"in e){const n=e;switch(t){case n.R16F:return A(n,n.RG16F,n.RG,o);case n.RG16F:return A(n,n.RGBA16F,n.RGBA,o);default:return null}}return null}return{internalFormat:t,format:i}}function he(e,t,i,o){let n=e.createTexture();e.bindTexture(e.TEXTURE_2D,n),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texImage2D(e.TEXTURE_2D,0,t,4,4,0,i,o,null);let a=e.createFramebuffer();return e.bindFramebuffer(e.FRAMEBUFFER,a),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,n,0),e.checkFramebufferStatus(e.FRAMEBUFFER)===e.FRAMEBUFFER_COMPLETE}function ge(e){if(e.length===0)return 0;let t=0;for(let i=0;i<e.length;i++)t=(t<<5)-t+e.charCodeAt(i),t|=0;return t}class pe{vertexShader;fragmentShaderSource;programs;activeProgram;uniforms;constructor(t,i){this.vertexShader=t,this.fragmentShaderSource=i,this.programs={},this.activeProgram=null,this.uniforms=new Map}setKeywords(t){let i=0;for(let n=0;n<t.length;n++)i+=ge(t[n]);let o=this.programs[i];if(o==null){let n=g(r.FRAGMENT_SHADER,this.fragmentShaderSource,t);o=oe(this.vertexShader,n),this.programs[i]=o}o!=this.activeProgram&&(this.uniforms=ne(o),this.activeProgram=o)}bind(){this.activeProgram&&r.useProgram(this.activeProgram)}}function ne(e){let t=new Map,i=r.getProgramParameter(e,r.ACTIVE_UNIFORMS);for(let o=0;o<i;o++){let n=r.getActiveUniform(e,o);if(!n)continue;let a=n.name;t.set(a,r.getUniformLocation(e,a))}return t}function oe(e,t){let i=r.createProgram();if(!i)throw new Error("WebGLProgram を作成できませんでした");return r.attachShader(i,e),r.attachShader(i,t),r.linkProgram(i),r.getProgramParameter(i,r.LINK_STATUS)||console.trace(r.getProgramInfoLog(i)),i}function g(e,t,i){t=xe(t,i);const o=r.createShader(e);if(!o)throw new Error("shader が見つかりません");return r.shaderSource(o,t),r.compileShader(o),r.getShaderParameter(o,r.COMPILE_STATUS)||console.trace(r.getShaderInfoLog(o)),o}function xe(e,t){if(!t||t.length===0)return e;let i="";return t.forEach(o=>{i+="#define "+o+`
`}),i+e}class T{uniforms;program;constructor(t,i){this.uniforms=new Map,this.program=oe(t,i),this.uniforms=ne(this.program)}bind(){r.useProgram(this.program)}}const Ee=`precision highp float;\r
\r
attribute vec2 aPosition;\r
varying vec2 vUv;\r
varying vec2 vL;\r
varying vec2 vR;\r
varying vec2 vT;\r
varying vec2 vB;\r
uniform vec2 texelSize;\r
\r
void main(){\r
    vUv = aPosition * 0.5 + 0.5;\r
        vL = vUv - vec2(texelSize.x, 0.0);\r
        vR = vUv + vec2(texelSize.x, 0.0);\r
        vT = vUv + vec2(0.0, texelSize.y);\r
        vB = vUv - vec2(0.0, texelSize.y);\r
        gl_Position = vec4(aPosition, 0.0, 1.0);\r
}`,Te=`precision mediump float;\r
precision mediump sampler2D;\r
\r
varying highp vec2 vUv;\r
uniform sampler2D uTexture;\r
\r
void main () {\r
    gl_FragColor = texture2D(uTexture, vUv);\r
}`,Re=`precision mediump float;\r
precision mediump sampler2D;\r
\r
varying highp vec2 vUv;\r
uniform sampler2D uTexture;\r
uniform float value;\r
\r
void main () {\r
    gl_FragColor = value * texture2D(uTexture, vUv);\r
}`,Se=`precision highp float;\r
precision highp sampler2D;\r
\r
varying vec2 vUv;\r
uniform sampler2D uTarget;\r
uniform float aspectRatio;\r
uniform vec3 color;\r
uniform vec2 point;\r
uniform float radius;\r
\r
void main () {\r
    vec2 p = vUv - point.xy;\r
    p.x *= aspectRatio;\r
    vec3 splat = exp(-dot(p, p) / radius) * color;\r
    vec3 base = texture2D(uTarget, vUv).xyz;\r
    gl_FragColor = vec4(base + splat, 1.0);\r
}`,we=`precision mediump float;\r
\r
uniform vec4 color;\r
\r
void main () {\r
    gl_FragColor = color;\r
}`,De=`precision highp float;\r
precision highp sampler2D;\r
\r
varying vec2 vUv;\r
uniform sampler2D uVelocity;\r
uniform sampler2D uSource;\r
uniform vec2 texelSize;\r
uniform vec2 dyeTexelSize;\r
uniform float dt;\r
uniform float dissipation;\r
\r
vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {\r
    vec2 st = uv / tsize - 0.5;\r
\r
    vec2 iuv = floor(st);\r
    vec2 fuv = fract(st);\r
\r
    vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);\r
    vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);\r
    vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);\r
    vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);\r
\r
    return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);\r
}\r
\r
void main () {\r
#ifdef MANUAL_FILTERING\r
    vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;\r
    vec4 result = bilerp(uSource, coord, dyeTexelSize);\r
#else\r
    vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;\r
    vec4 result = texture2D(uSource, coord);\r
#endif\r
    float decay = 1.0 + dissipation * dt;\r
    gl_FragColor = result / decay;\r
}`,ye=`precision mediump float;\r
precision mediump sampler2D;\r
\r
varying highp vec2 vUv;\r
varying highp vec2 vL;\r
varying highp vec2 vR;\r
varying highp vec2 vT;\r
varying highp vec2 vB;\r
uniform sampler2D uVelocity;\r
\r
void main () {\r
    float L = texture2D(uVelocity, vL).x;\r
    float R = texture2D(uVelocity, vR).x;\r
    float T = texture2D(uVelocity, vT).y;\r
    float B = texture2D(uVelocity, vB).y;\r
\r
    vec2 C = texture2D(uVelocity, vUv).xy;\r
    if (vL.x < 0.0) { L = -C.x; }\r
    if (vR.x > 1.0) { R = -C.x; }\r
    if (vT.y > 1.0) { T = -C.y; }\r
    if (vB.y < 0.0) { B = -C.y; }\r
\r
    float div = 0.5 * (R - L + T - B);\r
    gl_FragColor = vec4(div, 0.0, 0.0, 1.0);\r
}\r
`,Ae=`precision mediump float;\r
precision mediump sampler2D;\r
\r
varying highp vec2 vUv;\r
varying highp vec2 vL;\r
varying highp vec2 vR;\r
varying highp vec2 vT;\r
varying highp vec2 vB;\r
uniform sampler2D uVelocity;\r
uniform sampler2D uCurlNoise;\r
\r
void main () {\r
    float L = texture2D(uVelocity, vL).y;\r
    float R = texture2D(uVelocity, vR).y;\r
    float T = texture2D(uVelocity, vT).x;\r
    float B = texture2D(uVelocity, vB).x;\r
    float vorticity = (R - L - T + B) * 0.5;\r
    float nx = texture2D(uCurlNoise, vUv).r;\r
    nx = nx * 2.0 - 1.0;  \r
    float strength = 0.1;\r
    gl_FragColor = vec4(vorticity + nx * strength, 0.0, 0.0, 1.0);\r
}`,_e=`precision highp float;\r
precision highp sampler2D;\r
\r
varying vec2 vUv;\r
varying vec2 vL;\r
varying vec2 vR;\r
varying vec2 vT;\r
varying vec2 vB;\r
uniform sampler2D uVelocity;\r
uniform sampler2D uCurl;\r
uniform float curl;\r
uniform float dt;\r
\r
uniform sampler2D uNoise;\r
uniform float time;\r
\r
void main () {\r
    float L = texture2D(uCurl, vL).x;\r
    float R = texture2D(uCurl, vR).x;\r
    float T = texture2D(uCurl, vT).x;\r
    float B = texture2D(uCurl, vB).x;\r
    float C = texture2D(uCurl, vUv).x;\r
\r
    vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));\r
    force /= length(force) + 0.0001;\r
    force *= curl * C;\r
    force.y *= -1.0;\r
\r
    float n = texture2D(uNoise, vUv * 8.0 + vec2(time * 0.1, 0.0)).r;\r
    float jitter = 1.0 + 0.05 * (n * 2.0 - 1.0);\r
    force *= jitter;\r
\r
    vec2 velocity = texture2D(uVelocity, vUv).xy;\r
    velocity += force * dt;\r
    velocity = min(max(velocity, -1000.0), 1000.0);\r
    gl_FragColor = vec4(velocity, 0.0, 1.0);\r
}`,Fe=`precision mediump float;\r
precision mediump sampler2D;\r
\r
varying highp vec2 vUv;\r
varying highp vec2 vL;\r
varying highp vec2 vR;\r
varying highp vec2 vT;\r
varying highp vec2 vB;\r
uniform sampler2D uPressure;\r
uniform sampler2D uDivergence;\r
\r
void main () {\r
    float L = texture2D(uPressure, vL).x;\r
    float R = texture2D(uPressure, vR).x;\r
    float T = texture2D(uPressure, vT).x;\r
    float B = texture2D(uPressure, vB).x;\r
    float C = texture2D(uPressure, vUv).x;\r
    float divergence = texture2D(uDivergence, vUv).x;\r
    float pressure = (L + R + B + T - divergence) * 0.25;\r
    gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);\r
}`,be=`precision mediump float;\r
precision mediump sampler2D;\r
\r
varying highp vec2 vUv;\r
varying highp vec2 vL;\r
varying highp vec2 vR;\r
varying highp vec2 vT;\r
varying highp vec2 vB;\r
uniform sampler2D uPressure;\r
uniform sampler2D uVelocity;\r
\r
void main () {\r
    float L = texture2D(uPressure, vL).x;\r
    float R = texture2D(uPressure, vR).x;\r
    float T = texture2D(uPressure, vT).x;\r
    float B = texture2D(uPressure, vB).x;\r
    vec2 velocity = texture2D(uVelocity, vUv).xy;\r
    velocity.xy -= vec2(R - L, T - B) * 0.5;\r
    gl_FragColor = vec4(velocity, 0.0, 1.0);\r
}`,Pe=`precision highp float;\r
precision highp sampler2D;\r
\r
varying vec2 vUv;\r
varying vec2 vL;\r
varying vec2 vR;\r
varying vec2 vT;\r
varying vec2 vB;\r
uniform sampler2D uTexture;\r
\r
void main () {\r
    vec3 c = texture2D(uTexture, vUv).rgb;\r
    float a = max(c.r, max(c.g, c.b));\r
    gl_FragColor = vec4(c, a);\r
}`,Ue=`precision mediump float;\r
precision mediump sampler2D;\r
\r
varying vec2 vUv;\r
uniform float uTime;\r
\r
float hash(vec2 p) {\r
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);\r
}\r
\r
void main() {\r
    vec2 p = vUv * 10.0 + vec2(uTime * 0.5, 0.0);\r
    float n = hash(p);              // 超シンプルな疑似ノイズ\r
    gl_FragColor = vec4(vec3(n), 1.0);\r
}`,Le=`precision mediump float;\r
precision mediump sampler2D;\r
\r
varying vec2 vUv;\r
varying vec2 vL;\r
varying vec2 vR;\r
varying vec2 vT;\r
varying vec2 vB;\r
uniform sampler2D uNoise;\r
\r
void main(){\r
  vec3 noise = texture2D(uNoise, vUv).rgb;\r
\r
  vec3 N  = texture2D(uNoise, vUv).rgb;\r
  vec3 Nx = texture2D(uNoise, vR).rgb - texture2D(uNoise, vL).rgb;\r
  vec3 Ny = texture2D(uNoise, vT).rgb - texture2D(uNoise, vB).rgb;\r
\r
  vec2 curl = vec2(\r
    Ny.x - Nx.y,\r
    Nx.y - Ny.x\r
  );\r
\r
\r
  gl_FragColor = vec4(curl, 0.0, 1.0);\r
}`,Ne={baseVert:Ee,copy:Te,clear:Re,splat:Se,color:we,advection:De,divergence:ye,curl:Ae,vorticity:_e,pressure:Fe,gradientSubtract:be,display:Pe,noise:Ue,curlNoise:Le};function p(e){const t=Ne[e];if(!t)throw new Error(`Unknown shader name: ${e}`);return t}class q{id;texcoordX;texcoordY;prevTexcoordX;prevTexcoordY;deltaX;deltaY;down;moved;color;constructor(){this.id=-1,this.texcoordX=0,this.texcoordY=0,this.prevTexcoordX=0,this.prevTexcoordY=0,this.deltaX=0,this.deltaY=0,this.down=!1,this.moved=!1,this.color={r:30,g:0,b:300}}}const f=document.getElementById("canvas");if(!f)throw new Error("canvas が見つかりません");const{gl:r,ext:R}=me(f);let U=performance.now(),h={SIM_RESOLUTION:256,DYE_RESOLUTION:1024,DENSITY_DISSIPATION:1,VELOCITY_DISSIPATION:.2,PRESSURE:.8,PRESSURE_ITERATIONS:20,CURL:30,PAUSED:!1,SPLAT_RADIUS:.25,SPLAT_FORCE:5e3,BACK_COLOR:{r:0,g:0,b:0}},E=g(r.VERTEX_SHADER,p("baseVert")),Be=g(r.FRAGMENT_SHADER,p("copy")),Ce=g(r.FRAGMENT_SHADER,p("clear")),Xe=g(r.FRAGMENT_SHADER,p("splat")),ze=g(r.FRAGMENT_SHADER,p("color")),Me=g(r.FRAGMENT_SHADER,p("advection"),R.supportLinearFiltering?null:["MANUAL_FILTERING"]),Ie=g(r.FRAGMENT_SHADER,p("divergence")),Oe=g(r.FRAGMENT_SHADER,p("curl")),Ye=g(r.FRAGMENT_SHADER,p("vorticity")),Ge=g(r.FRAGMENT_SHADER,p("pressure")),Ve=g(r.FRAGMENT_SHADER,p("gradientSubtract")),x,l,H,W,y,He=g(r.FRAGMENT_SHADER,p("noise")),I=new T(E,He),C,We=g(r.FRAGMENT_SHADER,p("curlNoise")),O=new T(E,We),K;const ee=new T(E,Be),Y=new T(E,Ce),b=new T(E,Xe),re=new T(E,ze);let L=new T(E,Oe),D=new T(E,Ye),G=new T(E,Ie),N=new T(E,Ge),B=new T(E,Ve),F=new T(E,Me);const $=new pe(E,p("display"));$.setKeywords([]);function ae(){if(!f)throw new Error("canvas が見つかりません");let e=w(f.clientWidth),t=w(f.clientHeight);return f.width!=e||f.height!=t?(f.width=e,f.height=t,!0):!1}function w(e){let t=window.devicePixelRatio||1;return Math.floor(e*t)}function ue(){let e=te(h.SIM_RESOLUTION),t=te(h.DYE_RESOLUTION);const i=R.halfFloatTexType,o=R.formatRGBA,n=R.formatRG,a=R.formatR,u=R.supportLinearFiltering?r.LINEAR:r.NEAREST;if(r.disable(r.BLEND),!a||!n||!o)throw new Error("フォーマットが無効です.");x==null?x=V(t.width,t.height,o.internalFormat,o.format,i,u):x=ie(x,t.width,t.height,o.internalFormat,o.format,i,u),l==null?l=V(e.width,e.height,n.internalFormat,n.format,i,u):l=ie(l,e.width,e.height,n.internalFormat,n.format,i,u),H=_(e.width,e.height,a.internalFormat,a.format,i,r.NEAREST),W=_(e.width,e.height,a.internalFormat,a.format,i,r.NEAREST),y=V(e.width,e.height,a.internalFormat,a.format,i,r.NEAREST),C=_(e.width,e.height,a.internalFormat,a.format,i,u),K=_(e.width,e.height,a.internalFormat,a.format,i,u)}function te(e){let t=r.drawingBufferWidth/r.drawingBufferHeight;t<1&&(t=1/t);let i=Math.round(e),o=Math.round(e*t);return r.drawingBufferWidth>r.drawingBufferHeight?{width:o,height:i}:{width:i,height:o}}function Ke(e){let t=(e-U)/1e3;return t=Math.min(t,.016666),U=e,t}function _(e,t,i,o,n,a){r.activeTexture(r.TEXTURE0);let u=r.createTexture();r.bindTexture(r.TEXTURE_2D,u),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MIN_FILTER,a),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MAG_FILTER,a),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_S,r.CLAMP_TO_EDGE),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_T,r.CLAMP_TO_EDGE),r.texImage2D(r.TEXTURE_2D,0,i,e,t,0,o,n,null);let v=r.createFramebuffer();r.bindFramebuffer(r.FRAMEBUFFER,v),r.framebufferTexture2D(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,u,0),r.viewport(0,0,e,t),r.clear(r.COLOR_BUFFER_BIT);let c=1/e,d=1/t;return{texture:u,fbo:v,width:e,height:t,texelSizeX:c,texelSizeY:d,attach(s){return r.activeTexture(r.TEXTURE0+s),r.bindTexture(r.TEXTURE_2D,u),s}}}function V(e,t,i,o,n,a){let u=_(e,t,i,o,n,a),v=_(e,t,i,o,n,a);return{width:e,height:t,texelSizeX:u.texelSizeX,texelSizeY:u.texelSizeY,get read(){return u},set read(c){u=c},get write(){return v},set write(c){v=c},swap(){let c=u;u=v,v=c}}}function $e(e,t,i,o,n,a,u){let v=_(t,i,o,n,a,u);ee.bind();let c=ee.uniforms.get("uTexture");if(c===void 0)throw new Error(" uTexture が未定義です");return r.uniform1i(c,e.attach(0)),m(v),v}function ie(e,t,i,o,n,a,u){return e.width==t&&e.height==i||(e.read=$e(e.read,t,i,o,n,a,u),e.write=_(t,i,o,n,a,u),e.width=t,e.height=i,e.texelSizeX=1/t,e.texelSizeY=1/i),e}function le(e){const t=Ke(e);ae()&&ue(),ke(),h.PAUSED||Ze(t),er(null),requestAnimationFrame(le)}let S=[];S.push(new q);let k=[];function ke(){k.length>0&&je(k.pop()),S.forEach(e=>{e.moved&&(e.moved=!1,qe(e))})}function qe(e){let t=e.deltaX*h.SPLAT_FORCE,i=e.deltaY*h.SPLAT_FORCE;ce(e.texcoordX,e.texcoordY,t,i,e.color)}function je(e){if(e===void 0)throw new Error("amount が未定義です.");for(let t=0;t<e;t++){const i=se();i.r*=10,i.g*=10,i.b*=10;const o=Math.random(),n=Math.random(),a=1e3*(Math.random()-.5),u=1e3*(Math.random()-.5);ce(o,n,a,u,i)}}function ce(e,t,i,o,n){if(!f)throw new Error("canvas が見つかりせん.");b.bind();let a=b.uniforms.get("uTarget"),u=b.uniforms.get("aspectRatio"),v=b.uniforms.get("point"),c=b.uniforms.get("color"),d=b.uniforms.get("radius");if(a===void 0||u==null||v===void 0||c===void 0||d===void 0)throw new Error("splatProgram が不正です.");r.uniform1i(a,l.read.attach(0)),r.uniform1f(u,f.width/f.height),r.uniform2f(v,e,t),r.uniform3f(c,i,o,0),r.uniform1f(d,Je(h.SPLAT_RADIUS/100)),m(l.write),l.swap(),r.uniform1i(a,x.read.attach(0)),r.uniform3f(c,n.r,n.g,n.b),m(x.write),x.swap()}function Je(e){if(!f)throw new Error("canvas が見つかりせん.");let t=f.width/f.height;return t>1&&(e*=t),e}function se(){let e=Qe(Math.random(),1,1);return e.r*=.15,e.g*=.15,e.b*=.15,e}function Qe(e,t,i){let o,n,a,u,v,c,d,s;switch(u=Math.floor(e*6),v=e*6-u,c=i*(1-t),d=i*(1-v*t),s=i*(1-(1-v)*t),u%6){case 0:o=i,n=s,a=c;break;case 1:o=d,n=i,a=c;break;case 2:o=c,n=i,a=s;break;case 3:o=c,n=d,a=i;break;case 4:o=s,n=c,a=i;break;case 5:o=i,n=c,a=d;break;default:o=i,n=s,a=c;break}return{r:o,g:n,b:a}}function Ze(e){r.disable(r.BLEND),I.bind();let t=I.uniforms.get("texelSize"),i=I.uniforms.get("uTime");if(t===void 0||i===void 0)throw new Error("noiseProgram が不正です.");r.uniform2f(t,l.texelSizeX,l.texelSizeY),r.uniform1f(i,U*.001),m(C),O.bind(),t=O.uniforms.get("texelSize");let o=O.uniforms.get("uNoise");if(t===void 0||o===void 0)throw new Error("curlNoiseProgram が不正です.");r.uniform2f(t,l.texelSizeX,l.texelSizeY),r.uniform1i(o,C.attach(0)),m(K),L.bind(),t=L.uniforms.get("texelSize");let n=L.uniforms.get("uVelocity"),a=L.uniforms.get("uCurlNoise");if(t===void 0||n===void 0||a===void 0)throw new Error("curlProgram が不正です.");r.uniform2f(t,l.texelSizeX,l.texelSizeY),r.uniform1i(n,l.read.attach(0)),r.uniform1i(a,K.attach(1)),m(W),D.bind(),t=D.uniforms.get("texelSize"),n=D.uniforms.get("uVelocity");let u=D.uniforms.get("uCurl"),v=D.uniforms.get("curl"),c=D.uniforms.get("dt");o=D.uniforms.get("uNoise");let d=D.uniforms.get("time");if(t===void 0||n===void 0||u===void 0||v===void 0||c===void 0||o===void 0||d===void 0)throw new Error("vorticityProgram が不正です.");if(r.uniform2f(t,l.texelSizeX,l.texelSizeY),r.uniform1i(n,l.read.attach(0)),r.uniform1i(u,W.attach(1)),r.uniform1f(v,h.CURL),r.uniform1f(c,e),r.uniform1i(o,C.attach(2)),r.uniform1f(d,U*.001),m(l.write),l.swap(),G.bind(),t=G.uniforms.get("texelSize"),n=G.uniforms.get("uVelocity"),t===void 0||n===void 0)throw new Error("divergenceProgram が不正です.");r.uniform2f(t,l.texelSizeX,l.texelSizeY),r.uniform1i(n,l.read.attach(0)),m(H),Y.bind();let s=Y.uniforms.get("uTexture"),j=Y.uniforms.get("value");if(s===void 0||j===void 0)throw new Error("clearProgram が不正です.");r.uniform1i(s,y.read.attach(0)),r.uniform1f(j,h.PRESSURE),m(y.write),y.swap(),N.bind(),t=N.uniforms.get("texelSize");let J=N.uniforms.get("uDivergence"),P=N.uniforms.get("uPressure");if(t===void 0||J===void 0||P==null)throw new Error("pressureProgram が不正です.");r.uniform2f(t,l.texelSizeX,l.texelSizeY),r.uniform1i(J,H.attach(0));for(let Z=0;Z<h.PRESSURE_ITERATIONS;Z++)r.uniform1i(P,y.read.attach(1)),m(y.write),y.swap();if(B.bind(),t=B.uniforms.get("texelSize"),P=B.uniforms.get("uPressure"),n=B.uniforms.get("uVelocity"),t==null||P===void 0||n===void 0)throw new Error("gradientSubtractProgram が不正です.");r.uniform2f(t,l.texelSizeX,l.texelSizeY),r.uniform1i(P,y.read.attach(0)),r.uniform1i(n,l.read.attach(1)),m(l.write),l.swap(),F.bind(),t=F.uniforms.get("texelSize");let X=F.uniforms.get("dyeTexelSize");n=F.uniforms.get("uVelocity");let z=F.uniforms.get("uSource");c=F.uniforms.get("dt");let M=F.uniforms.get("dissipation");if(t===void 0||n===void 0||z===void 0||c===void 0||M===void 0)throw new Error("advectionProgram が不正です.");if(!R.supportLinearFiltering&&X===void 0)throw new Error("dyeTexelSize uniform が見つかりません（MANUAL_FILTERING 有効時）");r.uniform2f(t,l.texelSizeX,l.texelSizeY),R.supportLinearFiltering||r.uniform2f(X,l.texelSizeX,l.texelSizeY);let Q=l.read.attach(0);r.uniform1i(n,Q),r.uniform1i(z,Q),r.uniform1f(c,e),r.uniform1f(M,h.VELOCITY_DISSIPATION),m(l.write),l.swap(),R.supportLinearFiltering||r.uniform2f(X,x.texelSizeX,x.texelSizeY),r.uniform1i(n,l.read.attach(0)),r.uniform1i(z,x.read.attach(1)),r.uniform1f(M,h.DENSITY_DISSIPATION),m(x.write),x.swap()}function er(e){r.blendFunc(r.ONE,r.ONE_MINUS_SRC_ALPHA),r.enable(r.BLEND),tr(e,ir(h.BACK_COLOR)),rr(e)}function rr(e){$.bind();let t=$.uniforms.get("uTexture");if(t===void 0)throw new Error("displayShader が不正です.");r.uniform1i(t,x.read.attach(0)),m(e)}function tr(e,t){re.bind();let i=re.uniforms.get("color");if(i==null)throw new Error("colorProgram が不正です.");r.uniform4f(i,t.r,t.g,t.b,1),m(e)}function ir(e){return{r:e.r/255,g:e.g/255,b:e.b/255}}const m=(r.bindBuffer(r.ARRAY_BUFFER,r.createBuffer()),r.bufferData(r.ARRAY_BUFFER,new Float32Array([-1,-1,-1,1,1,1,1,-1]),r.STATIC_DRAW),r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,r.createBuffer()),r.bufferData(r.ELEMENT_ARRAY_BUFFER,new Uint16Array([0,1,2,0,2,3]),r.STATIC_DRAW),r.vertexAttribPointer(0,2,r.FLOAT,!1,0,0),r.enableVertexAttribArray(0),(e,t=!1)=>{e==null?(r.viewport(0,0,r.drawingBufferWidth,r.drawingBufferHeight),r.bindFramebuffer(r.FRAMEBUFFER,null)):(r.viewport(0,0,e.width,e.height),r.bindFramebuffer(r.FRAMEBUFFER,e.fbo)),t&&(r.clearColor(0,0,0,1),r.clear(r.COLOR_BUFFER_BIT)),r.drawElements(r.TRIANGLES,6,r.UNSIGNED_SHORT,0)});window.addEventListener("load",()=>{ae(),ue(),U=performance.now(),requestAnimationFrame(le),console.log("WebGL context:",r,R)});f.addEventListener("mousedown",e=>{let t=w(e.offsetX),i=w(e.offsetY),o=S.find(n=>n.id==-1);o==null&&(o=new q),fe(o,-1,t,i)});f.addEventListener("mousemove",e=>{let t=S[0];if(!t.down)return;let i=w(e.offsetX),o=w(e.offsetY);ve(t,i,o)});window.addEventListener("mouseup",()=>{de(S[0])});f.addEventListener("touchstart",e=>{e.preventDefault();const t=e.targetTouches;for(;t.length>=S.length;)S.push(new q);for(let i=0;i<t.length;i++){let o=w(t[i].pageX),n=w(t[i].pageY);fe(S[i+1],t[i].identifier,o,n)}});f.addEventListener("touchmove",e=>{e.preventDefault();const t=e.targetTouches;for(let i=0;i<t.length;i++){let o=S[i+1];if(!o.down)continue;let n=w(t[i].pageX),a=w(t[i].pageY);ve(o,n,a)}},!1);window.addEventListener("touchend",e=>{const t=e.changedTouches;for(let i=0;i<t.length;i++){let o=S.find(n=>n.id==t[i].identifier);o!=null&&de(o)}});window.addEventListener("keydown",e=>{e.code==="KeyP"&&(h.PAUSED=!h.PAUSED),e.key===" "&&k.push(Math.random()*20+5)});function fe(e,t,i,o){if(!f)throw new Error("canvas が見つかりません.");e.id=t,e.down=!0,e.moved=!1,e.texcoordX=i/f.width,e.texcoordY=1-o/f.height,e.prevTexcoordX=e.texcoordX,e.prevTexcoordY=e.texcoordY,e.deltaX=0,e.deltaY=0,e.color=se()}function ve(e,t,i){if(!f)throw new Error("canvas が見つかりません.");e.prevTexcoordX=e.texcoordX,e.prevTexcoordY=e.texcoordY,e.texcoordX=t/f.width,e.texcoordY=1-i/f.height,e.deltaX=nr(e.texcoordX-e.prevTexcoordX),e.deltaY=or(e.texcoordY-e.prevTexcoordY),e.moved=Math.abs(e.deltaX)>0||Math.abs(e.deltaY)>0}function de(e){e.down=!1}function nr(e){if(!f)throw new Error("canvas が見つかりません.");let t=f.width/f.height;return t<1&&(e*=t),e}function or(e){if(!f)throw new Error("canvas が見つかりません.");let t=f.width/f.height;return t>1&&(e/=t),e}
