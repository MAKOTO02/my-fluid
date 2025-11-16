(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const a of n)if(a.type==="childList")for(const s of a.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&i(s)}).observe(document,{childList:!0,subtree:!0});function t(n){const a={};return n.integrity&&(a.integrity=n.integrity),n.referrerPolicy&&(a.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?a.credentials="include":n.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function i(n){if(n.ep)return;n.ep=!0;const a=t(n);fetch(n.href,a)}})();function er(e){const r={alpha:!0,depth:!1,stencil:!1,antialias:!1,preserveDrawingBuffer:!1};let t;t=e.getContext("webgl2",r);const i=!!t;if(i||(t=e.getContext("webgl",r)||e.getContext("experimental-webgl",r)),!t)throw new Error("WebGL is not supported");let n,a;i?(t.getExtension("EXT_color_buffer_float"),a=t.getExtension("OES_texture_float_linear")):(n=t.getExtension("OES_texture_half_float"),a=t.getExtension("OES_texture_half_float_linear")),t.clearColor(0,0,0,1);const s=i?t.HALF_FLOAT:n.HALF_FLOAT_OES;let l,c,f;if(i){const u=t;l=V(u,u.RGBA16F,u.RGBA,s),c=V(u,u.RG16F,u.RG,s),f=V(u,u.R16F,u.RED,s)}else{const u=t;l=V(u,u.RGBA,u.RGBA,s),c=V(u,u.RGBA,u.RGBA,s),f=V(u,u.RGBA,u.RGBA,s)}return{gl:t,ext:{formatRGBA:l,formatRG:c,formatR:f,halfFloatTexType:s,supportLinearFiltering:!!a}}}function V(e,r,t,i){if(!rr(e,r,t,i)){if("RGBA16F"in e){const n=e;switch(r){case n.R16F:return V(n,n.RG16F,n.RG,i);case n.RG16F:return V(n,n.RGBA16F,n.RGBA,i);default:return null}}return null}return{internalFormat:r,format:t}}function rr(e,r,t,i){let n=e.createTexture();e.bindTexture(e.TEXTURE_2D,n),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texImage2D(e.TEXTURE_2D,0,r,4,4,0,t,i,null);let a=e.createFramebuffer();return e.bindFramebuffer(e.FRAMEBUFFER,a),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,n,0),e.checkFramebufferStatus(e.FRAMEBUFFER)===e.FRAMEBUFFER_COMPLETE}function tr(e){if(e.length===0)return 0;let r=0;for(let t=0;t<e.length;t++)r=(r<<5)-r+e.charCodeAt(t),r|=0;return r}class ir{gl;vertexShader;fragmentShaderSource;programs;activeProgram;uniforms;constructor(r,t,i){this.gl=r,this.vertexShader=t,this.fragmentShaderSource=i,this.programs={},this.activeProgram=null,this.uniforms=new Map}setKeywords(r){let t=0;for(let n=0;n<r.length;n++)t+=tr(r[n]);let i=this.programs[t];if(i==null){let n=D(this.gl,this.gl.FRAGMENT_SHADER,this.fragmentShaderSource,r);i=Ie(this.gl,this.vertexShader,n),this.programs[t]=i}i!=this.activeProgram&&(this.uniforms=ze(this.gl,i),this.activeProgram=i)}bind(){this.activeProgram&&this.gl.useProgram(this.activeProgram)}}function ze(e,r){let t=new Map,i=e.getProgramParameter(r,e.ACTIVE_UNIFORMS);for(let n=0;n<i;n++){let a=e.getActiveUniform(r,n);if(!a)continue;let s=a.name;t.set(s,e.getUniformLocation(r,s))}return t}function Ie(e,r,t){let i=e.createProgram();if(!i)throw new Error("WebGLProgram を作成できませんでした");return e.attachShader(i,r),e.attachShader(i,t),e.linkProgram(i),e.getProgramParameter(i,e.LINK_STATUS)||console.trace(e.getProgramInfoLog(i)),i}function D(e,r,t,i){t=nr(t,i);const n=e.createShader(r);if(!n)throw new Error("shader が見つかりません");return e.shaderSource(n,t),e.compileShader(n),e.getShaderParameter(n,e.COMPILE_STATUS)||console.trace(e.getShaderInfoLog(n)),n}function nr(e,r){if(!r||r.length===0)return e;let t="";return r.forEach(i=>{t+="#define "+i+`
`}),t+e}class M{gl;uniforms;program;constructor(r,t,i){this.gl=r,this.uniforms=new Map,this.program=Ie(r,t,i),this.uniforms=ze(r,this.program)}bind(){this.gl.useProgram(this.program)}}const or=`precision highp float;\r
\r
attribute vec2 aPosition;\r
varying vec2 vUv;\r
varying vec2 vL;\r
varying vec2 vR;\r
varying vec2 vT;\r
varying vec2 vB;\r
uniform vec2 texelSize;\r
uniform vec2 uOffset;\r
uniform vec2 uScale;\r
\r
void main(){\r
    vUv = aPosition * 0.5 + 0.5;\r
    vL = vUv - vec2(texelSize.x, 0.0);\r
    vR = vUv + vec2(texelSize.x, 0.0);\r
    vT = vUv + vec2(0.0, texelSize.y);\r
    vB = vUv - vec2(0.0, texelSize.y);\r
    gl_Position = vec4(aPosition, 0.0, 1.0);\r
}`,ar=`precision mediump float;\r
precision mediump sampler2D;\r
\r
varying highp vec2 vUv;\r
uniform sampler2D uTexture;\r
\r
void main () {\r
    gl_FragColor = texture2D(uTexture, vUv);\r
}`,sr=`precision mediump float;\r
precision mediump sampler2D;\r
\r
varying highp vec2 vUv;\r
uniform sampler2D uTexture;\r
uniform float value;\r
\r
void main () {\r
    gl_FragColor = value * texture2D(uTexture, vUv);\r
}`,cr=`precision highp float;\r
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
}`,lr=`precision mediump float;\r
\r
uniform vec4 color;\r
\r
void main () {\r
    gl_FragColor = color;\r
}`,ur=`precision highp float;\r
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
}`,fr=`precision mediump float;\r
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
`,vr=`precision mediump float;\r
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
}`,hr=`precision highp float;\r
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
}`,dr=`precision mediump float;\r
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
}`,mr=`precision mediump float;\r
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
}`,pr=`precision highp float;\r
precision highp sampler2D;\r
\r
varying vec2 vUvDisplay;\r
uniform sampler2D uTexture;\r
\r
void main () {\r
    vec3 c = texture2D(uTexture, vUvDisplay).rgb;\r
    float a = max(c.r, max(c.g, c.b));\r
    gl_FragColor = vec4(c, a);\r
}`,gr=`// displayVert.glsl\r
precision highp float;\r
\r
attribute vec2 aPosition;\r
\r
varying vec2 vUvDisplay;\r
\r
uniform vec2  uOffset;\r
uniform float uScale;\r
\r
void main() {\r
    // フルスクリーンUV\r
    vec2 uv = aPosition * 0.5 + 0.5;\r
\r
    // 中心(0.5, 0.5)から拡大縮小＋オフセット\r
    uv = (uv - 0.5) * uScale + 0.5 + uOffset;\r
\r
    vUvDisplay = uv;\r
    gl_Position = vec4(aPosition, 0.0, 1.0);\r
}\r
`,xr=`precision mediump float;\r
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
}`,yr=`precision mediump float;\r
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
}`,wr=`// physics.frag\r
precision mediump float;\r
precision mediump sampler2D;\r
\r
varying vec2 vUv;\r
uniform sampler2D uVelocity;\r
uniform vec2 uGravity;  // (0.0, -9.8) のようなイメージ（スケールは適当）\r
uniform vec2 uAccel;\r
uniform float dt;\r
uniform sampler2D uObstacle;\r
\r
void main () {\r
    vec2 v = texture2D(uVelocity, vUv).xy;\r
    float mask = texture2D(uObstacle, vUv).r;\r
    v += uGravity * dt;      // v^{*} = v^n + dt * g\r
    v -= uAccel * dt;\r
\r
    // 暴走防止（元コードの vorticity と同じ感じ）\r
    v = clamp(v, vec2(-1000.0), vec2(1000.0));\r
\r
    v *= (1.0 - mask);\r
\r
    gl_FragColor = vec4(v, 0.0, 1.0);\r
}\r
`,Er=`precision highp float;\r
\r
attribute vec3 aPosition;\r
attribute vec2 aTexCoord;\r
\r
uniform mat4 uModelMat;\r
uniform mat4 uViewMat;\r
uniform mat4 uProjectionMat;\r
\r
varying vec2 vTexCoord;\r
varying vec3 vFragPos;\r
\r
void main() {\r
    vec4 worldPos = uModelMat * vec4(aPosition, 1.0);\r
    vFragPos = worldPos.xyz;\r
\r
    vec4 viewPos = uViewMat * worldPos;\r
    gl_Position = uProjectionMat * viewPos;\r
\r
    vTexCoord = aTexCoord;\r
}\r
`,Tr=`precision highp float;\r
\r
varying vec2 vTexCoord;\r
varying vec3 vFragPos;\r
\r
void main(){\r
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\r
}`,Rr={baseVert:or,copy:ar,clear:sr,splat:cr,color:lr,advection:ur,divergence:fr,curl:vr,vorticity:hr,pressure:dr,gradientSubtract:mr,display:pr,displayVertex:gr,noise:xr,curlNoise:yr,physics:wr,sceneVert:Er,scene:Tr};function b(e){const r=Rr[e];if(!r)throw new Error(`Unknown shader name: ${e}`);return r}class ge{id;texcoordX;texcoordY;prevTexcoordX;prevTexcoordY;deltaX;deltaY;down;moved;color;constructor(){this.id=-1,this.texcoordX=0,this.texcoordY=0,this.prevTexcoordX=0,this.prevTexcoordY=0,this.deltaX=0,this.deltaY=0,this.down=!1,this.moved=!1,this.color={r:30,g:0,b:300}}}class Sr{program;camera=null;objects=[];input;constructor(r,t){this.program=r,this.input=t}setCamera(r){this.camera=r,r.setProgram(this.program)}addObject(r){r.setProgram(this.program),r.init(),this.objects.push(r)}update(r){for(const t of this.objects)t.update(r,this.input)}render(){this.program.bind(),this.camera&&this.camera.updateShaderUniforms();for(const r of this.objects)r.draw()}}var Ar=1e-6,C=typeof Float32Array<"u"?Float32Array:Array;function Dr(){var e=new C(9);return C!=Float32Array&&(e[1]=0,e[2]=0,e[3]=0,e[5]=0,e[6]=0,e[7]=0),e[0]=1,e[4]=1,e[8]=1,e}function H(){var e=new C(16);return C!=Float32Array&&(e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0),e[0]=1,e[5]=1,e[10]=1,e[15]=1,e}function br(e,r){var t=r[0],i=r[1],n=r[2],a=r[3],s=r[4],l=r[5],c=r[6],f=r[7],u=r[8],w=r[9],m=r[10],T=r[11],R=r[12],g=r[13],E=r[14],A=r[15],_=t*l-i*s,p=t*c-n*s,d=t*f-a*s,x=i*c-n*l,y=i*f-a*l,J=n*f-a*c,ee=u*g-w*R,re=u*E-m*R,te=u*A-T*R,ie=w*E-m*g,ne=w*A-T*g,oe=m*A-T*E,S=_*oe-p*ne+d*ie+x*te-y*re+J*ee;return S?(S=1/S,e[0]=(l*oe-c*ne+f*ie)*S,e[1]=(n*ne-i*oe-a*ie)*S,e[2]=(g*J-E*y+A*x)*S,e[3]=(m*y-w*J-T*x)*S,e[4]=(c*te-s*oe-f*re)*S,e[5]=(t*oe-n*te+a*re)*S,e[6]=(E*d-R*J-A*p)*S,e[7]=(u*J-m*d+T*p)*S,e[8]=(s*ne-l*te+f*ee)*S,e[9]=(i*te-t*ne-a*ee)*S,e[10]=(R*y-g*d+A*_)*S,e[11]=(w*d-u*y-T*_)*S,e[12]=(l*re-s*ie-c*ee)*S,e[13]=(t*ie-i*re+n*ee)*S,e[14]=(g*p-R*x-E*_)*S,e[15]=(u*x-w*p+m*_)*S,e):null}function Fr(e,r,t){var i=r[0],n=r[1],a=r[2],s=r[3],l=r[4],c=r[5],f=r[6],u=r[7],w=r[8],m=r[9],T=r[10],R=r[11],g=r[12],E=r[13],A=r[14],_=r[15],p=t[0],d=t[1],x=t[2],y=t[3];return e[0]=p*i+d*l+x*w+y*g,e[1]=p*n+d*c+x*m+y*E,e[2]=p*a+d*f+x*T+y*A,e[3]=p*s+d*u+x*R+y*_,p=t[4],d=t[5],x=t[6],y=t[7],e[4]=p*i+d*l+x*w+y*g,e[5]=p*n+d*c+x*m+y*E,e[6]=p*a+d*f+x*T+y*A,e[7]=p*s+d*u+x*R+y*_,p=t[8],d=t[9],x=t[10],y=t[11],e[8]=p*i+d*l+x*w+y*g,e[9]=p*n+d*c+x*m+y*E,e[10]=p*a+d*f+x*T+y*A,e[11]=p*s+d*u+x*R+y*_,p=t[12],d=t[13],x=t[14],y=t[15],e[12]=p*i+d*l+x*w+y*g,e[13]=p*n+d*c+x*m+y*E,e[14]=p*a+d*f+x*T+y*A,e[15]=p*s+d*u+x*R+y*_,e}function _r(e,r){return e[0]=1,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=1,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[10]=1,e[11]=0,e[12]=r[0],e[13]=r[1],e[14]=r[2],e[15]=1,e}function Pr(e,r){return e[0]=r[0],e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=r[1],e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[10]=r[2],e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e}function Mr(e,r){var t=r[0],i=r[1],n=r[2],a=r[3],s=t+t,l=i+i,c=n+n,f=t*s,u=i*s,w=i*l,m=n*s,T=n*l,R=n*c,g=a*s,E=a*l,A=a*c;return e[0]=1-w-R,e[1]=u+A,e[2]=m-E,e[3]=0,e[4]=u-A,e[5]=1-f-R,e[6]=T+g,e[7]=0,e[8]=m+E,e[9]=T-g,e[10]=1-f-w,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e}function Ur(e,r,t,i,n){var a=1/Math.tan(r/2);if(e[0]=a/t,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=a,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[11]=-1,e[12]=0,e[13]=0,e[15]=0,n!=null&&n!==1/0){var s=1/(i-n);e[10]=(n+i)*s,e[14]=2*n*i*s}else e[10]=-1,e[14]=-2*i;return e}var Lr=Ur,Ue=Fr;function U(){var e=new C(3);return C!=Float32Array&&(e[0]=0,e[1]=0,e[2]=0),e}function Br(e){var r=new C(3);return r[0]=e[0],r[1]=e[1],r[2]=e[2],r}function Ye(e){var r=e[0],t=e[1],i=e[2];return Math.sqrt(r*r+t*t+i*i)}function W(e,r,t){var i=new C(3);return i[0]=e,i[1]=r,i[2]=t,i}function $(e,r){return e[0]=r[0],e[1]=r[1],e[2]=r[2],e}function ue(e,r,t,i){return e[0]=r,e[1]=t,e[2]=i,e}function de(e,r,t){return e[0]=r[0]+t[0],e[1]=r[1]+t[1],e[2]=r[2]+t[2],e}function Cr(e,r,t){return e[0]=r[0]-t[0],e[1]=r[1]-t[1],e[2]=r[2]-t[2],e}function Q(e,r,t){return e[0]=r[0]*t,e[1]=r[1]*t,e[2]=r[2]*t,e}function xe(e,r,t,i){return e[0]=r[0]+t[0]*i,e[1]=r[1]+t[1]*i,e[2]=r[2]+t[2]*i,e}function Nr(e,r){var t=r[0],i=r[1],n=r[2],a=t*t+i*i+n*n;return a>0&&(a=1/Math.sqrt(a)),e[0]=r[0]*a,e[1]=r[1]*a,e[2]=r[2]*a,e}function Xr(e,r){return e[0]*r[0]+e[1]*r[1]+e[2]*r[2]}function ye(e,r,t){var i=r[0],n=r[1],a=r[2],s=t[0],l=t[1],c=t[2];return e[0]=n*c-a*l,e[1]=a*s-i*c,e[2]=i*l-n*s,e}var Or=Cr,zr=Ye;(function(){var e=U();return function(r,t,i,n,a,s){var l,c;for(t||(t=3),i||(i=0),n?c=Math.min(n*t+i,r.length):c=r.length,l=i;l<c;l+=t)e[0]=r[l],e[1]=r[l+1],e[2]=r[l+2],a(e,e,s),r[l]=e[0],r[l+1]=e[1],r[l+2]=e[2];return r}})();function Ir(){var e=new C(4);return C!=Float32Array&&(e[0]=0,e[1]=0,e[2]=0,e[3]=0),e}function Yr(e,r){return e[0]=r[0],e[1]=r[1],e[2]=r[2],e[3]=r[3],e}function Vr(e,r){var t=r[0],i=r[1],n=r[2],a=r[3],s=t*t+i*i+n*n+a*a;return s>0&&(s=1/Math.sqrt(s)),e[0]=t*s,e[1]=i*s,e[2]=n*s,e[3]=a*s,e}(function(){var e=Ir();return function(r,t,i,n,a,s){var l,c;for(t||(t=4),i||(i=0),n?c=Math.min(n*t+i,r.length):c=r.length,l=i;l<c;l+=t)e[0]=r[l],e[1]=r[l+1],e[2]=r[l+2],e[3]=r[l+3],a(e,e,s),r[l]=e[0],r[l+1]=e[1],r[l+2]=e[2],r[l+3]=e[3];return r}})();function k(){var e=new C(4);return C!=Float32Array&&(e[0]=0,e[1]=0,e[2]=0),e[3]=1,e}function pe(e,r,t){t=t*.5;var i=Math.sin(t);return e[0]=i*r[0],e[1]=i*r[1],e[2]=i*r[2],e[3]=Math.cos(t),e}function Ve(e,r,t){var i=r[0],n=r[1],a=r[2],s=r[3],l=t[0],c=t[1],f=t[2],u=t[3];return e[0]=i*u+s*l+n*f-a*c,e[1]=n*u+s*c+a*l-i*f,e[2]=a*u+s*f+i*c-n*l,e[3]=s*u-i*l-n*c-a*f,e}function we(e,r,t,i){var n=r[0],a=r[1],s=r[2],l=r[3],c=t[0],f=t[1],u=t[2],w=t[3],m,T,R,g,E;return T=n*c+a*f+s*u+l*w,T<0&&(T=-T,c=-c,f=-f,u=-u,w=-w),1-T>Ar?(m=Math.acos(T),R=Math.sin(m),g=Math.sin((1-i)*m)/R,E=Math.sin(i*m)/R):(g=1-i,E=i),e[0]=g*n+E*c,e[1]=g*a+E*f,e[2]=g*s+E*u,e[3]=g*l+E*w,e}function Gr(e,r){var t=r[0]+r[4]+r[8],i;if(t>0)i=Math.sqrt(t+1),e[3]=.5*i,i=.5/i,e[0]=(r[5]-r[7])*i,e[1]=(r[6]-r[2])*i,e[2]=(r[1]-r[3])*i;else{var n=0;r[4]>r[0]&&(n=1),r[8]>r[n*3+n]&&(n=2);var a=(n+1)%3,s=(n+2)%3;i=Math.sqrt(r[n*3+n]-r[a*3+a]-r[s*3+s]+1),e[n]=.5*i,i=.5/i,e[3]=(r[a*3+s]-r[s*3+a])*i,e[a]=(r[a*3+n]+r[n*3+a])*i,e[s]=(r[s*3+n]+r[n*3+s])*i}return e}var Hr=Yr,$r=Ve,Ge=Vr;(function(){var e=U(),r=W(1,0,0),t=W(0,1,0);return function(i,n,a){var s=Xr(n,a);return s<-.999999?(ye(e,r,n),zr(e)<1e-6&&ye(e,t,n),Nr(e,e),pe(i,e,Math.PI),i):s>.999999?(i[0]=0,i[1]=0,i[2]=0,i[3]=1,i):(ye(e,n,a),i[0]=e[0],i[1]=e[1],i[2]=e[2],i[3]=1+s,Ge(i,i))}})();(function(){var e=k(),r=k();return function(t,i,n,a,s,l){return we(e,i,s,l),we(r,n,a,l),we(t,e,r,2*l*(1-l)),t}})();(function(){var e=Dr();return function(r,t,i,n){return e[0]=i[0],e[3]=i[1],e[6]=i[2],e[1]=n[0],e[4]=n[1],e[7]=n[2],e[2]=-t[0],e[5]=-t[1],e[8]=-t[2],Ge(r,Gr(r,e))}})();class kr{position;rotation;scale;modelMatrix;_dirty;constructor(){this.position=U(),this.rotation=k(),this.scale=W(1,1,1),this.modelMatrix=H(),this._dirty=!0}updateMatrix(){if(!this._dirty)return this.modelMatrix;const r=H(),t=H(),i=H(),n=H();return _r(r,this.position),Mr(t,this.rotation),Pr(i,this.scale),Ue(n,r,t),Ue(this.modelMatrix,n,i),this._dirty=!1,this.modelMatrix}translate(r){de(this.position,this.position,r),this._dirty=!0}rotate(r,t){const i=k();pe(i,t,r),Ve(this.rotation,i,this.rotation),this._dirty=!0}setScale(r){$(this.scale,r),this._dirty=!0}getMatrix(){return this.updateMatrix()}markDirty(){this._dirty=!0}setPosition(r){$(this.position,r),this._dirty=!0}}class Kr{transform;velocity=U();acceleration=U();forceAccum=U();mass;dragK;constructor(r,t=1,i=2){this.transform=r,this.mass=t,this.dragK=i}addForce(r,t="force"){if(t==="impulse"){const i=U();Q(i,r,1/this.mass),de(this.velocity,this.velocity,i)}else de(this.forceAccum,this.forceAccum,r)}integrate(r){if(r<=0)return;const t=Br(this.velocity);if(this.dragK>0){const i=this.dragK/this.mass,n=Math.exp(-i*r),a=U();Q(a,this.velocity,n);const s=U(),l=(1-n)/this.dragK;Q(s,this.forceAccum,l);const c=U();de(c,a,s),xe(this.transform.position,this.transform.position,c,r),Or(this.acceleration,c,t),Q(this.acceleration,this.acceleration,1/r),$(this.velocity,c)}else{const i=U();Q(i,this.forceAccum,1/this.mass),xe(this.velocity,this.velocity,i,r),xe(this.transform.position,this.transform.position,this.velocity,r),$(this.acceleration,i)}ue(this.forceAccum,0,0,0),this.transform.markDirty(),this.transform.updateMatrix()}setPosition(r){$(this.transform.position,r),ue(this.velocity,0,0,0),ue(this.acceleration,0,0,0),ue(this.forceAccum,0,0,0),this.transform.markDirty(),this.transform.updateMatrix()}}class Me{transform;rigidBody=null;constructor(){this.transform=new kr}addRigidBody(r=1,t=3){return this.rigidBody||(this.rigidBody=new Kr(this.transform)),this.rigidBody.mass=r,this.rigidBody.dragK=t,this.rigidBody}updatePhysics(r){this.rigidBody&&this.rigidBody.integrate(r)}update(r,t){this.updatePhysics(r)}draw(){}init(){}setProgram(r){}}class Wr extends Me{gl;vao=null;vbo=null;ibo=null;program=null;verticesRaw;indices;vertexCount=0;indexCount=0;constructor(r,t,i){super(),this.gl=r,this.verticesRaw=t,this.indices=i}setProgram(r){this.program=r}init(){if(!this.program)return;const r=this.gl;if(!this.verticesRaw||this.verticesRaw.length===0){console.warn("Mesh3D: verticesRaw が空です");return}const t=this.verticesRaw[0].uv!==void 0,i=3,n=t?2:0,a=4,s=i+n,l=s*a,c=this.verticesRaw.flatMap(m=>t?[...m.pos,...m.uv]:[...m.pos]),f=new Float32Array(c);this.vertexCount=f.length/s,this.vao=r.createVertexArray(),this.vbo=r.createBuffer(),this.ibo=null,r.bindVertexArray(this.vao),r.bindBuffer(r.ARRAY_BUFFER,this.vbo),r.bufferData(r.ARRAY_BUFFER,f,r.STATIC_DRAW);let u=0;const w=r.getAttribLocation(this.program.program,"aPosition");if(w>=0&&(r.enableVertexAttribArray(w),r.vertexAttribPointer(w,i,r.FLOAT,!1,l,u)),u+=i*a,t){const m=r.getAttribLocation(this.program.program,"aTexCoord");m>=0&&(r.enableVertexAttribArray(m),r.vertexAttribPointer(m,n,r.FLOAT,!1,l,u)),u+=n*a}this.indices&&this.indices.length>0&&(this.ibo=r.createBuffer(),r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,this.ibo),r.bufferData(r.ELEMENT_ARRAY_BUFFER,new Uint16Array(this.indices),r.STATIC_DRAW),this.indexCount=this.indices.length),r.bindVertexArray(null)}uploadModelMatrix(){if(!this.program)return;const r=this.gl;this.transform.updateMatrix();const t=this.program.uniforms.get("uModelMat");t&&r.uniformMatrix4fv(t,!1,this.transform.modelMatrix)}update(){this.transform.updateMatrix()}draw(){const r=this.gl;this.vao&&(this.uploadModelMatrix(),r.bindVertexArray(this.vao),this.ibo&&this.indexCount>0?r.drawElements(r.TRIANGLES,this.indexCount,r.UNSIGNED_SHORT,0):this.vertexCount>0&&r.drawArrays(r.TRIANGLES,0,this.vertexCount),r.bindVertexArray(null))}}class He extends Wr{constructor(r){const t=[{pos:[-.5,-.5,0],uv:[0,0]},{pos:[.5,-.5,0],uv:[1,0]},{pos:[.5,.5,0],uv:[1,1]},{pos:[-.5,.5,0],uv:[0,1]}],i=[0,1,2,0,2,3];super(r,t,i)}}class jr extends Me{fov;aspect;near;far;yaw;pitch;viewMatrix;projectionMatrix;program=null;gl;dt=0;constructor(r,t=Math.PI/4,i=1,n=.1,a=1e3,s=W(0,0,5),l=-Math.PI/2,c=0){super(),this.gl=r,this.fov=t,this.aspect=i,this.near=n,this.far=a,this.viewMatrix=H(),this.projectionMatrix=H(),$(this.transform.position,s),this.yaw=l,this.pitch=c,this.addRigidBody(1,4).setPosition(s),this.updateMatrices()}setProgram(r){this.program=r}move(r){this.transform.translate(r),this.updateMatrices()}rotate(r,t){this.yaw+=r,this.pitch+=t;const i=Math.PI/2-.01;this.pitch>i&&(this.pitch=i),this.pitch<-i&&(this.pitch=-i),this.updateMatrices()}setAspect(r){this.aspect=r,this.updateMatrices()}updateMatrices(){const r=k(),t=k();pe(r,[0,1,0],this.yaw),pe(t,[1,0,0],this.pitch);const i=k();$r(i,r,t),Hr(this.transform.rotation,i),this.transform.updateMatrix(),br(this.viewMatrix,this.transform.modelMatrix),Lr(this.projectionMatrix,this.fov,this.aspect,this.near,this.far)}updateShaderUniforms(){if(!this.program)return;const r=this.program.uniforms.get("uViewMat"),t=this.program.uniforms.get("uProjectionMat");if(!r||!t)throw new Error("Camera のプログラムが不正です.");this.gl.uniformMatrix4fv(r,!1,this.viewMatrix),this.gl.uniformMatrix4fv(t,!1,this.projectionMatrix)}update(r){super.update(r),this.dt=r,this.updateMatrices()}}class qr{keys;mouse;constructor(r){this.keys={},this.mouse={x:0,y:0,dx:0,dy:0,down:!1,scrollDelta:0},window.addEventListener("keydown",t=>{this.keys[t.key]=!0}),window.addEventListener("keyup",t=>{this.keys[t.key]=!1}),window.addEventListener("mousemove",t=>{this.mouse.dx+=t.movementX,this.mouse.dy+=t.movementY;const i=r.getBoundingClientRect();this.mouse.x=(t.clientX-i.left)/i.width,this.mouse.y=(t.clientY-i.top)/i.height}),window.addEventListener("mousedown",()=>{this.mouse.down=!0}),window.addEventListener("mouseup",()=>{this.mouse.down=!1}),window.addEventListener("wheel",t=>{this.mouse.scrollDelta+=-t.deltaY/100,t.preventDefault()},{passive:!1})}isKeyDown(r){return!!this.keys[r]}resetMouseDelta(){this.mouse.dx=0,this.mouse.dy=0}resetScroll(){this.mouse.scrollDelta=0}}class Qr extends Me{moveSpeed=5;pointer=new ge;prevPosition=U();initialized=!1;canvas;constructor(r){super(),this.canvas=r;const t=W(0,0,0);this.transform.setPosition(t),$(this.prevPosition,t),this.pointer.id=-2}update(r,t){if(t){const i=U();t.isKeyDown("w")&&(i[1]+=1),t.isKeyDown("s")&&(i[1]-=1),t.isKeyDown("a")&&(i[0]-=1),t.isKeyDown("d")&&(i[0]+=1);const n=Ye(i);n>0&&(Q(i,i,this.moveSpeed*r/n),this.transform.translate(i)),this.updatePointerFromWorld(),super.update(r)}super.update(r)}updatePointerFromWorld(){if(!this.canvas)throw new Error("canvas が見つかりません.");const r=this.transform.position,{u:t,v:i}=et(r),n=t*this.canvas.width,a=(1-i)*this.canvas.height;if(!this.initialized){this.pointer.down=!0,this.pointer.moved=!1,this.pointer.texcoordX=n/this.canvas.width,this.pointer.texcoordY=1-a/this.canvas.height,this.pointer.prevTexcoordX=this.pointer.texcoordX,this.pointer.prevTexcoordY=this.pointer.texcoordY,this.pointer.deltaX=0,this.pointer.deltaY=0,this.pointer.color=nt(),this.initialized=!0;return}rt(this.canvas,this.pointer,n,a)}}const Le=-5,Zr=5,Be=-5,Jr=5;function et(e){const r=(e[0]-Le)/(Zr-Le),t=(e[1]-Be)/(Jr-Be);return{u:r,v:t}}function rt(e,r,t,i){if(!e)throw new Error("canvas が見つかりません.");r.prevTexcoordX=r.texcoordX,r.prevTexcoordY=r.texcoordY,r.texcoordX=t/e.width,r.texcoordY=1-i/e.height,r.deltaX=tt(e,r.texcoordX-r.prevTexcoordX),r.deltaY=it(e,r.texcoordY-r.prevTexcoordY),r.moved=Math.abs(r.deltaX)>0||Math.abs(r.deltaY)>0}function tt(e,r){if(!e)throw new Error("canvas が見つかりません.");let t=e.width/e.height;return t<1&&(r*=t),r}function it(e,r){if(!e)throw new Error("canvas が見つかりません.");let t=e.width/e.height;return t>1&&(r/=t),r}function nt(){let e=ot(Math.random(),1,1);return e.r*=.15,e.g*=.15,e.b*=.15,e}function ot(e,r,t){let i,n,a,s,l,c,f,u;switch(s=Math.floor(e*6),l=e*6-s,c=t*(1-r),f=t*(1-l*r),u=t*(1-(1-l)*r),s%6){case 0:i=t,n=u,a=c;break;case 1:i=f,n=t,a=c;break;case 2:i=c,n=t,a=u;break;case 3:i=c,n=f,a=t;break;case 4:i=u,n=c,a=t;break;case 5:i=t,n=c,a=f;break;default:i=t,n=u,a=c;break}return{r:i,g:n,b:a}}const P={SIM_RESOLUTION:256,DYE_RESOLUTION:1024,DENSITY_DISSIPATION:1,VELOCITY_DISSIPATION:.2,PRESSURE:.8,PRESSURE_ITERATIONS:20,CURL:30,PAUSED:!1,SPLAT_RADIUS:.25,SPLAT_FORCE:5e3,BACK_COLOR:{r:0,g:0,b:0}},h=document.getElementById("canvas");if(!h)throw new Error("canvas が見つかりません");le();const{gl:o,ext:X}=er(h);let ce=performance.now(),B=D(o,o.VERTEX_SHADER,b("baseVert")),at=D(o,o.FRAGMENT_SHADER,b("copy")),st=D(o,o.FRAGMENT_SHADER,b("clear")),ct=D(o,o.FRAGMENT_SHADER,b("splat")),lt=D(o,o.FRAGMENT_SHADER,b("color")),ut=D(o,o.FRAGMENT_SHADER,b("advection"),X.supportLinearFiltering?null:["MANUAL_FILTERING"]),ft=D(o,o.FRAGMENT_SHADER,b("divergence")),vt=D(o,o.FRAGMENT_SHADER,b("curl")),ht=D(o,o.FRAGMENT_SHADER,b("vorticity")),dt=D(o,o.FRAGMENT_SHADER,b("pressure")),mt=D(o,o.FRAGMENT_SHADER,b("gradientSubtract")),L,v,De,be,Y,pt=D(o,o.FRAGMENT_SHADER,b("noise")),Ee=new M(o,B,pt),me,gt=D(o,o.FRAGMENT_SHADER,b("curlNoise")),Te=new M(o,B,gt),Fe,xt=D(o,o.FRAGMENT_SHADER,b("physics")),j=new M(o,B,xt);const Ce=new M(o,B,at),Re=new M(o,B,st),q=new M(o,B,ct),Ne=new M(o,B,lt);let fe=new M(o,B,vt),I=new M(o,B,ht),Se=new M(o,B,ft),ve=new M(o,B,dt),he=new M(o,B,mt),G=new M(o,B,ut),yt=D(o,o.VERTEX_SHADER,b("sceneVert")),wt=D(o,o.FRAGMENT_SHADER,b("scene")),Et=new M(o,yt,wt),_e=new qr(h),Z=new Sr(Et,_e),Tt=new He(o),$e=new He(o);$e.transform.translate(W(2,0,0));Z.addObject(Tt);Z.addObject($e);if(!h)throw new Error("canvas が見つかりせん.");let Rt=h.width/h.height,se=new jr(o,Math.PI/3,Rt,.1,100,W(0,0,3),0,0);Z.setCamera(se);let ke=new Qr(h);Z.addObject(ke);let K;function St(){o.bindFramebuffer(o.FRAMEBUFFER,K.fbo),o.viewport(0,0,K.width,K.height),o.clearColor(0,0,0,1),o.clear(o.COLOR_BUFFER_BIT),Z.render(),o.bindFramebuffer(o.FRAMEBUFFER,null)}const At=D(o,o.VERTEX_SHADER,b("displayVertex")),ae=new ir(o,At,b("display"));ae.setKeywords([]);function le(){if(!h)throw new Error("canvas が見つかりません");let e=O(h.clientWidth),r=O(h.clientHeight);return h.width!=e||h.height!=r?(h.width=e,h.height=r,!0):!1}function O(e){let r=window.devicePixelRatio||1;return Math.floor(e*r)}function Ke(){let e=Xe(P.SIM_RESOLUTION),r=Xe(P.DYE_RESOLUTION);const t=X.halfFloatTexType,i=X.formatRGBA,n=X.formatRG,a=X.formatR,s=X.supportLinearFiltering?o.LINEAR:o.NEAREST;if(o.disable(o.BLEND),!a||!n||!i)throw new Error("フォーマットが無効です.");L==null?L=Ae(r.width,r.height,i.internalFormat,i.format,t,s):L=Oe(L,r.width,r.height,i.internalFormat,i.format,t,s),v==null?v=Ae(e.width,e.height,n.internalFormat,n.format,t,s):v=Oe(v,e.width,e.height,n.internalFormat,n.format,t,s),De=z(e.width,e.height,a.internalFormat,a.format,t,o.NEAREST),be=z(e.width,e.height,a.internalFormat,a.format,t,o.NEAREST),Y=Ae(e.width,e.height,a.internalFormat,a.format,t,o.NEAREST),me=z(e.width,e.height,a.internalFormat,a.format,t,s),Fe=z(e.width,e.height,a.internalFormat,a.format,t,s),K=z(e.width,e.height,a.internalFormat,a.format,t,s)}function Xe(e){let r=o.drawingBufferWidth/o.drawingBufferHeight;r<1&&(r=1/r);let t=Math.round(e),i=Math.round(e*r);return o.drawingBufferWidth>o.drawingBufferHeight?{width:i,height:t}:{width:t,height:i}}function Dt(e){let r=(e-ce)/1e3;return r=Math.min(r,.016666),ce=e,r}function z(e,r,t,i,n,a){o.activeTexture(o.TEXTURE0);let s=o.createTexture();o.bindTexture(o.TEXTURE_2D,s),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MIN_FILTER,a),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MAG_FILTER,a),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_WRAP_S,o.CLAMP_TO_EDGE),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_WRAP_T,o.CLAMP_TO_EDGE),o.texImage2D(o.TEXTURE_2D,0,t,e,r,0,i,n,null);let l=o.createFramebuffer();o.bindFramebuffer(o.FRAMEBUFFER,l),o.framebufferTexture2D(o.FRAMEBUFFER,o.COLOR_ATTACHMENT0,o.TEXTURE_2D,s,0),o.viewport(0,0,e,r),o.clear(o.COLOR_BUFFER_BIT);let c=1/e,f=1/r;return{texture:s,fbo:l,width:e,height:r,texelSizeX:c,texelSizeY:f,attach(u){return o.activeTexture(o.TEXTURE0+u),o.bindTexture(o.TEXTURE_2D,s),u}}}function Ae(e,r,t,i,n,a){let s=z(e,r,t,i,n,a),l=z(e,r,t,i,n,a);return{width:e,height:r,texelSizeX:s.texelSizeX,texelSizeY:s.texelSizeY,get read(){return s},set read(c){s=c},get write(){return l},set write(c){l=c},swap(){let c=s;s=l,l=c}}}function bt(e,r,t,i,n,a,s){let l=z(r,t,i,n,a,s);Ce.bind();let c=Ce.uniforms.get("uTexture");if(c===void 0)throw new Error(" uTexture が未定義です");return o.uniform1i(c,e.attach(0)),F(l),l}function Oe(e,r,t,i,n,a,s){return e.width==r&&e.height==t||(e.read=bt(e.read,r,t,i,n,a,s),e.write=z(r,t,i,n,a,s),e.width=r,e.height=t,e.texelSizeX=1/r,e.texelSizeY=1/t),e}function We(e){const r=Dt(e);le()&&Ke(),Ft(),P.PAUSED||Nt(r),Xt(null),requestAnimationFrame(We)}let N=[];N.push(new ge);N.push(ke.pointer);let Pe=[];function Ft(){Pe.length>0&&Pt(Pe.pop()),N.forEach(e=>{e.moved&&(e.moved=!1,_t(e))})}function _t(e){let r=e.deltaX*P.SPLAT_FORCE,t=e.deltaY*P.SPLAT_FORCE;je(e.texcoordX,e.texcoordY,r,t,e.color)}function Pt(e){if(e===void 0)throw new Error("amount が未定義です.");for(let r=0;r<e;r++){const t=qe();t.r*=10,t.g*=10,t.b*=10;const i=Math.random(),n=Math.random(),a=1e3*(Math.random()-.5),s=1e3*(Math.random()-.5);je(i,n,a,s,t)}}function je(e,r,t,i,n){if(!h)throw new Error("canvas が見つかりせん.");q.bind();let a=q.uniforms.get("uTarget"),s=q.uniforms.get("aspectRatio"),l=q.uniforms.get("point"),c=q.uniforms.get("color"),f=q.uniforms.get("radius");if(a===void 0||s==null||l===void 0||c===void 0||f===void 0)throw new Error("splatProgram が不正です.");o.uniform1i(a,v.read.attach(0)),o.uniform1f(s,h.width/h.height),o.uniform2f(l,e,r),o.uniform3f(c,t,i,0),o.uniform1f(f,Mt(P.SPLAT_RADIUS/100)),F(v.write),v.swap(),o.uniform1i(a,L.read.attach(0)),o.uniform3f(c,n.r,n.g,n.b),F(L.write),L.swap()}function Mt(e){if(!h)throw new Error("canvas が見つかりせん.");let r=h.width/h.height;return r>1&&(e*=r),e}function qe(){let e=Ut(Math.random(),1,1);return e.r*=.15,e.g*=.15,e.b*=.15,e}function Ut(e,r,t){let i,n,a,s,l,c,f,u;switch(s=Math.floor(e*6),l=e*6-s,c=t*(1-r),f=t*(1-l*r),u=t*(1-(1-l)*r),s%6){case 0:i=t,n=u,a=c;break;case 1:i=f,n=t,a=c;break;case 2:i=c,n=t,a=u;break;case 3:i=c,n=f,a=t;break;case 4:i=u,n=c,a=t;break;case 5:i=t,n=c,a=f;break;default:i=t,n=u,a=c;break}return{r:i,g:n,b:a}}function Lt(e){se.setAspect(K.width/K.height),_e?.resetMouseDelta(),_e?.resetScroll(),Z.update(e),St()}function Bt(e){const r=e.uniforms.get("uObstacle");r&&o.uniform1i(r,K.attach(3))}function Ct(e){Ee.bind();let r=Ee.uniforms.get("texelSize"),t=Ee.uniforms.get("uTime");if(r===void 0||t===void 0)throw new Error("noiseProgram が不正です.");o.uniform2f(r,v.texelSizeX,v.texelSizeY),o.uniform1f(t,ce*.001),F(me),Te.bind(),r=Te.uniforms.get("texelSize");let i=Te.uniforms.get("uNoise");if(r===void 0||i===void 0)throw new Error("curlNoiseProgram が不正です.");o.uniform2f(r,v.texelSizeX,v.texelSizeY),o.uniform1i(i,me.attach(0)),F(Fe),fe.bind(),r=fe.uniforms.get("texelSize");let n=fe.uniforms.get("uVelocity"),a=fe.uniforms.get("uCurlNoise");if(r===void 0||n===void 0||a===void 0)throw new Error("curlProgram が不正です.");o.uniform2f(r,v.texelSizeX,v.texelSizeY),o.uniform1i(n,v.read.attach(0)),o.uniform1i(a,Fe.attach(1)),F(be),I.bind(),r=I.uniforms.get("texelSize"),n=I.uniforms.get("uVelocity");let s=I.uniforms.get("uCurl"),l=I.uniforms.get("curl"),c=I.uniforms.get("dt");i=I.uniforms.get("uNoise");let f=I.uniforms.get("time");if(r===void 0||n===void 0||s===void 0||l===void 0||c===void 0||i===void 0||f===void 0)throw new Error("vorticityProgram が不正です.");o.uniform2f(r,v.texelSizeX,v.texelSizeY),o.uniform1i(n,v.read.attach(0)),o.uniform1i(s,be.attach(1)),o.uniform1f(l,P.CURL),o.uniform1f(c,e),o.uniform1i(i,me.attach(2)),o.uniform1f(f,ce*.001),F(v.write),v.swap(),j.bind(),Bt(j),n=j.uniforms.get("uVelocity");let u=j.uniforms.get("uAccel"),w=j.uniforms.get("uGravity");if(c=j.uniforms.get("dt"),n===void 0||w===void 0||c===void 0)throw new Error("physicsProgram が不正です");if(o.uniform1i(n,v.read.attach(0)),o.uniform2f(w,0,-15),o.uniform1f(c,e),se.rigidBody){if(!u)throw new Error("physicsProgram が不正です.");let d=10,x=se.rigidBody?.acceleration[0]*d,y=se.rigidBody?.acceleration[1]*d;o.uniform2f(u,x,y)}if(F(v.write),v.swap(),Se.bind(),r=Se.uniforms.get("texelSize"),n=Se.uniforms.get("uVelocity"),r===void 0||n===void 0)throw new Error("divergenceProgram が不正です.");o.uniform2f(r,v.texelSizeX,v.texelSizeY),o.uniform1i(n,v.read.attach(0)),F(De),Re.bind();let m=Re.uniforms.get("uTexture"),T=Re.uniforms.get("value");if(m===void 0||T===void 0)throw new Error("clearProgram が不正です.");o.uniform1i(m,Y.read.attach(0)),o.uniform1f(T,P.PRESSURE),F(Y.write),Y.swap(),ve.bind(),r=ve.uniforms.get("texelSize");let R=ve.uniforms.get("uDivergence"),g=ve.uniforms.get("uPressure");if(r===void 0||R===void 0||g==null)throw new Error("pressureProgram が不正です.");o.uniform2f(r,v.texelSizeX,v.texelSizeY),o.uniform1i(R,De.attach(0));for(let d=0;d<P.PRESSURE_ITERATIONS;d++)o.uniform1i(g,Y.read.attach(1)),F(Y.write),Y.swap();if(he.bind(),r=he.uniforms.get("texelSize"),g=he.uniforms.get("uPressure"),n=he.uniforms.get("uVelocity"),r==null||g===void 0||n===void 0)throw new Error("gradientSubtractProgram が不正です.");o.uniform2f(r,v.texelSizeX,v.texelSizeY),o.uniform1i(g,Y.read.attach(0)),o.uniform1i(n,v.read.attach(1)),F(v.write),v.swap(),G.bind(),r=G.uniforms.get("texelSize");let E=G.uniforms.get("dyeTexelSize");n=G.uniforms.get("uVelocity");let A=G.uniforms.get("uSource");c=G.uniforms.get("dt");let _=G.uniforms.get("dissipation");if(r===void 0||n===void 0||A===void 0||c===void 0||_===void 0)throw new Error("advectionProgram が不正です.");if(!X.supportLinearFiltering&&E===void 0)throw new Error("dyeTexelSize uniform が見つかりません（MANUAL_FILTERING 有効時）");o.uniform2f(r,v.texelSizeX,v.texelSizeY),X.supportLinearFiltering||o.uniform2f(E,v.texelSizeX,v.texelSizeY);let p=v.read.attach(0);o.uniform1i(n,p),o.uniform1i(A,p),o.uniform1f(c,e),o.uniform1f(_,P.VELOCITY_DISSIPATION),F(v.write),v.swap(),X.supportLinearFiltering||o.uniform2f(E,L.texelSizeX,L.texelSizeY),o.uniform1i(n,v.read.attach(0)),o.uniform1i(A,L.read.attach(1)),o.uniform1f(_,P.DENSITY_DISSIPATION),F(L.write),L.swap()}function Nt(e){o.disable(o.BLEND),Lt(e),Ct(e)}function Xt(e){o.blendFunc(o.ONE,o.ONE_MINUS_SRC_ALPHA),o.enable(o.BLEND),zt(e,It(P.BACK_COLOR)),Ot(e)}function Ot(e){ae.bind();let r=ae.uniforms.get("uTexture"),t=ae.uniforms.get("uOffset"),i=ae.uniforms.get("uScale");if(!r||!t||!i)throw new Error("displayShader が不正です.");o.uniform1i(r,L.read.attach(0)),o.uniform2f(t,0,0),o.uniform1f(i,1),F(e)}function zt(e,r){Ne.bind();let t=Ne.uniforms.get("color");if(t==null)throw new Error("colorProgram が不正です.");o.uniform4f(t,r.r,r.g,r.b,1),F(e)}function It(e){return{r:e.r/255,g:e.g/255,b:e.b/255}}const F=(o.bindBuffer(o.ARRAY_BUFFER,o.createBuffer()),o.bufferData(o.ARRAY_BUFFER,new Float32Array([-1,-1,-1,1,1,1,1,-1]),o.STATIC_DRAW),o.bindBuffer(o.ELEMENT_ARRAY_BUFFER,o.createBuffer()),o.bufferData(o.ELEMENT_ARRAY_BUFFER,new Uint16Array([0,1,2,0,2,3]),o.STATIC_DRAW),o.vertexAttribPointer(0,2,o.FLOAT,!1,0,0),o.enableVertexAttribArray(0),(e,r=!1)=>{e==null?(o.viewport(0,0,o.drawingBufferWidth,o.drawingBufferHeight),o.bindFramebuffer(o.FRAMEBUFFER,null)):(o.viewport(0,0,e.width,e.height),o.bindFramebuffer(o.FRAMEBUFFER,e.fbo)),r&&(o.clearColor(0,0,0,1),o.clear(o.COLOR_BUFFER_BIT)),o.drawElements(o.TRIANGLES,6,o.UNSIGNED_SHORT,0)});window.addEventListener("load",()=>{le(),Ke(),ce=performance.now(),requestAnimationFrame(We),console.log("WebGL context:",o,X)});window.addEventListener("resize",le);window.addEventListener("orientationchange",le);h.addEventListener("mousedown",e=>{let r=O(e.offsetX),t=O(e.offsetY),i=N.find(n=>n.id==-1);i==null&&(i=new ge),Qe(i,-1,r,t)});h.addEventListener("mousemove",e=>{let r=N[0];if(!r.down)return;let t=O(e.offsetX),i=O(e.offsetY);Ze(r,t,i)});window.addEventListener("mouseup",()=>{Je(N[0])});h.addEventListener("touchstart",e=>{e.preventDefault();const r=e.targetTouches,t=2;for(;r.length+t>N.length;)N.push(new ge);for(let i=0;i<r.length;i++){let n=O(r[i].pageX),a=O(r[i].pageY);Qe(N[i+t],r[i].identifier,n,a)}});h.addEventListener("touchmove",e=>{e.preventDefault();const r=2,t=e.targetTouches;for(let i=0;i<t.length;i++){let n=N[i+r];if(!n.down)continue;let a=O(t[i].pageX),s=O(t[i].pageY);Ze(n,a,s)}},!1);window.addEventListener("touchend",e=>{const r=e.changedTouches;for(let t=0;t<r.length;t++){let i=N.find(n=>n.id==r[t].identifier);i!=null&&Je(i)}});window.addEventListener("keydown",e=>{e.code==="KeyP"&&(P.PAUSED=!P.PAUSED),e.key===" "&&Pe.push(Math.random()*20+5)});function Qe(e,r,t,i){if(!h)throw new Error("canvas が見つかりません.");e.id=r,e.down=!0,e.moved=!1,e.texcoordX=t/h.width,e.texcoordY=1-i/h.height,e.prevTexcoordX=e.texcoordX,e.prevTexcoordY=e.texcoordY,e.deltaX=0,e.deltaY=0,e.color=qe()}function Ze(e,r,t){if(!h)throw new Error("canvas が見つかりません.");e.prevTexcoordX=e.texcoordX,e.prevTexcoordY=e.texcoordY,e.texcoordX=r/h.width,e.texcoordY=1-t/h.height,e.deltaX=Yt(e.texcoordX-e.prevTexcoordX),e.deltaY=Vt(e.texcoordY-e.prevTexcoordY),e.moved=Math.abs(e.deltaX)>0||Math.abs(e.deltaY)>0}function Je(e){e.down=!1}function Yt(e){if(!h)throw new Error("canvas が見つかりません.");let r=h.width/h.height;return r<1&&(e*=r),e}function Vt(e){if(!h)throw new Error("canvas が見つかりません.");let r=h.width/h.height;return r>1&&(e/=r),e}
