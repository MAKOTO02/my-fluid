(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))i(o);new MutationObserver(o=>{for(const a of o)if(a.type==="childList")for(const s of a.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&i(s)}).observe(document,{childList:!0,subtree:!0});function t(o){const a={};return o.integrity&&(a.integrity=o.integrity),o.referrerPolicy&&(a.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?a.credentials="include":o.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function i(o){if(o.ep)return;o.ep=!0;const a=t(o);fetch(o.href,a)}})();function Ge(e){const r={alpha:!0,depth:!1,stencil:!1,antialias:!1,preserveDrawingBuffer:!1};let t;t=e.getContext("webgl2",r);const i=!!t;if(i||(t=e.getContext("webgl",r)||e.getContext("experimental-webgl",r)),!t)throw new Error("WebGL is not supported");let o,a;i?(t.getExtension("EXT_color_buffer_float"),a=t.getExtension("OES_texture_float_linear")):(o=t.getExtension("OES_texture_half_float"),a=t.getExtension("OES_texture_half_float_linear")),t.clearColor(0,0,0,1);const s=i?t.HALF_FLOAT:o.HALF_FLOAT_OES;let c,l,f;if(i){const u=t;c=V(u,u.RGBA16F,u.RGBA,s),l=V(u,u.RG16F,u.RG,s),f=V(u,u.R16F,u.RED,s)}else{const u=t;c=V(u,u.RGBA,u.RGBA,s),l=V(u,u.RGBA,u.RGBA,s),f=V(u,u.RGBA,u.RGBA,s)}return{gl:t,ext:{formatRGBA:c,formatRG:l,formatR:f,halfFloatTexType:s,supportLinearFiltering:!!a}}}function V(e,r,t,i){if(!He(e,r,t,i)){if("RGBA16F"in e){const o=e;switch(r){case o.R16F:return V(o,o.RG16F,o.RG,i);case o.RG16F:return V(o,o.RGBA16F,o.RGBA,i);default:return null}}return null}return{internalFormat:r,format:t}}function He(e,r,t,i){let o=e.createTexture();e.bindTexture(e.TEXTURE_2D,o),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texImage2D(e.TEXTURE_2D,0,r,4,4,0,t,i,null);let a=e.createFramebuffer();return e.bindFramebuffer(e.FRAMEBUFFER,a),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,o,0),e.checkFramebufferStatus(e.FRAMEBUFFER)===e.FRAMEBUFFER_COMPLETE}function $e(e){if(e.length===0)return 0;let r=0;for(let t=0;t<e.length;t++)r=(r<<5)-r+e.charCodeAt(t),r|=0;return r}class We{gl;vertexShader;fragmentShaderSource;programs;activeProgram;uniforms;constructor(r,t,i){this.gl=r,this.vertexShader=t,this.fragmentShaderSource=i,this.programs={},this.activeProgram=null,this.uniforms=new Map}setKeywords(r){let t=0;for(let o=0;o<r.length;o++)t+=$e(r[o]);let i=this.programs[t];if(i==null){let o=D(this.gl,this.gl.FRAGMENT_SHADER,this.fragmentShaderSource,r);i=Pe(this.gl,this.vertexShader,o),this.programs[t]=i}i!=this.activeProgram&&(this.uniforms=be(this.gl,i),this.activeProgram=i)}bind(){this.activeProgram&&this.gl.useProgram(this.activeProgram)}}function be(e,r){let t=new Map,i=e.getProgramParameter(r,e.ACTIVE_UNIFORMS);for(let o=0;o<i;o++){let a=e.getActiveUniform(r,o);if(!a)continue;let s=a.name;t.set(s,e.getUniformLocation(r,s))}return t}function Pe(e,r,t){let i=e.createProgram();if(!i)throw new Error("WebGLProgram を作成できませんでした");return e.attachShader(i,r),e.attachShader(i,t),e.linkProgram(i),e.getProgramParameter(i,e.LINK_STATUS)||console.trace(e.getProgramInfoLog(i)),i}function D(e,r,t,i){t=Ke(t,i);const o=e.createShader(r);if(!o)throw new Error("shader が見つかりません");return e.shaderSource(o,t),e.compileShader(o),e.getShaderParameter(o,e.COMPILE_STATUS)||console.trace(e.getShaderInfoLog(o)),o}function Ke(e,r){if(!r||r.length===0)return e;let t="";return r.forEach(i=>{t+="#define "+i+`
`}),t+e}class M{gl;uniforms;program;constructor(r,t,i){this.gl=r,this.uniforms=new Map,this.program=Pe(r,t,i),this.uniforms=be(r,this.program)}bind(){this.gl.useProgram(this.program)}}const je=`precision highp float;\r
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
}`,qe=`precision mediump float;\r
precision mediump sampler2D;\r
\r
varying highp vec2 vUv;\r
uniform sampler2D uTexture;\r
\r
void main () {\r
    gl_FragColor = texture2D(uTexture, vUv);\r
}`,ke=`precision mediump float;\r
precision mediump sampler2D;\r
\r
varying highp vec2 vUv;\r
uniform sampler2D uTexture;\r
uniform float value;\r
\r
void main () {\r
    gl_FragColor = value * texture2D(uTexture, vUv);\r
}`,Qe=`precision highp float;\r
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
}`,Ze=`precision mediump float;\r
\r
uniform vec4 color;\r
\r
void main () {\r
    gl_FragColor = color;\r
}`,Je=`precision highp float;\r
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
}`,er=`precision mediump float;\r
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
`,rr=`precision mediump float;\r
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
}`,tr=`precision highp float;\r
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
}`,ir=`precision mediump float;\r
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
}`,nr=`precision mediump float;\r
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
}`,or=`precision highp float;\r
precision highp sampler2D;\r
\r
varying vec2 vUvDisplay;\r
uniform sampler2D uTexture;\r
\r
void main () {\r
    vec3 c = texture2D(uTexture, vUvDisplay).rgb;\r
    float a = max(c.r, max(c.g, c.b));\r
    gl_FragColor = vec4(c, a);\r
}`,ar=`// displayVert.glsl\r
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
`,sr=`precision mediump float;\r
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
}`,cr=`precision mediump float;\r
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
}`,lr=`// physics.frag\r
precision mediump float;\r
precision mediump sampler2D;\r
\r
varying vec2 vUv;\r
uniform sampler2D uVelocity;\r
uniform vec2 uGravity;  // (0.0, -9.8) のようなイメージ（スケールは適当）\r
uniform float dt;\r
uniform sampler2D uObstacle;\r
\r
void main () {\r
    vec2 v = texture2D(uVelocity, vUv).xy;\r
    float mask = texture2D(uObstacle, vUv).r;\r
    v += uGravity * dt;      // v^{*} = v^n + dt * g\r
\r
    // 暴走防止（元コードの vorticity と同じ感じ）\r
    v = clamp(v, vec2(-1000.0), vec2(1000.0));\r
\r
    v *= (1.0 - mask);\r
\r
    gl_FragColor = vec4(v, 0.0, 1.0);\r
}\r
`,ur=`precision highp float;\r
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
`,fr=`precision highp float;\r
\r
varying vec2 vTexCoord;\r
varying vec3 vFragPos;\r
\r
void main(){\r
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\r
}`,vr={baseVert:je,copy:qe,clear:ke,splat:Qe,color:Ze,advection:Je,divergence:er,curl:rr,vorticity:tr,pressure:ir,gradientSubtract:nr,display:or,displayVertex:ar,noise:sr,curlNoise:cr,physics:lr,sceneVert:ur,scene:fr};function F(e){const r=vr[e];if(!r)throw new Error(`Unknown shader name: ${e}`);return r}class we{id;texcoordX;texcoordY;prevTexcoordX;prevTexcoordY;deltaX;deltaY;down;moved;color;constructor(){this.id=-1,this.texcoordX=0,this.texcoordY=0,this.prevTexcoordX=0,this.prevTexcoordY=0,this.deltaX=0,this.deltaY=0,this.down=!1,this.moved=!1,this.color={r:30,g:0,b:300}}}class hr{program;camera=null;objects=[];input;constructor(r,t){this.program=r,this.input=t}setCamera(r){this.camera=r,r.setProgram(this.program)}addObject(r){r.setProgram(this.program),r.init(),this.objects.push(r)}update(r){this.camera&&this.camera.update(r,this.input);for(const t of this.objects)typeof t.update=="function"&&t.update(r)}render(){this.program.bind(),this.camera&&this.camera.updateShaderUniforms();for(const r of this.objects)r.draw()}}var dr=1e-6,C=typeof Float32Array<"u"?Float32Array:Array;function mr(){var e=new C(9);return C!=Float32Array&&(e[1]=0,e[2]=0,e[3]=0,e[5]=0,e[6]=0,e[7]=0),e[0]=1,e[4]=1,e[8]=1,e}function G(){var e=new C(16);return C!=Float32Array&&(e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0),e[0]=1,e[5]=1,e[10]=1,e[15]=1,e}function pr(e,r){var t=r[0],i=r[1],o=r[2],a=r[3],s=r[4],c=r[5],l=r[6],f=r[7],u=r[8],E=r[9],d=r[10],T=r[11],w=r[12],x=r[13],y=r[14],A=r[15],b=t*c-i*s,p=t*l-o*s,m=t*f-a*s,g=i*l-o*c,R=i*f-a*c,K=o*f-a*l,j=u*x-E*w,q=u*y-d*w,k=u*A-T*w,Q=E*y-d*x,Z=E*A-T*x,J=d*A-T*y,S=b*J-p*Z+m*Q+g*k-R*q+K*j;return S?(S=1/S,e[0]=(c*J-l*Z+f*Q)*S,e[1]=(o*Z-i*J-a*Q)*S,e[2]=(x*K-y*R+A*g)*S,e[3]=(d*R-E*K-T*g)*S,e[4]=(l*k-s*J-f*q)*S,e[5]=(t*J-o*k+a*q)*S,e[6]=(y*m-w*K-A*p)*S,e[7]=(u*K-d*m+T*p)*S,e[8]=(s*Z-c*k+f*j)*S,e[9]=(i*k-t*Z-a*j)*S,e[10]=(w*R-x*m+A*b)*S,e[11]=(E*m-u*R-T*b)*S,e[12]=(c*q-s*Q-l*j)*S,e[13]=(t*Q-i*q+o*j)*S,e[14]=(x*p-w*g-y*b)*S,e[15]=(u*g-E*p+d*b)*S,e):null}function gr(e,r,t){var i=r[0],o=r[1],a=r[2],s=r[3],c=r[4],l=r[5],f=r[6],u=r[7],E=r[8],d=r[9],T=r[10],w=r[11],x=r[12],y=r[13],A=r[14],b=r[15],p=t[0],m=t[1],g=t[2],R=t[3];return e[0]=p*i+m*c+g*E+R*x,e[1]=p*o+m*l+g*d+R*y,e[2]=p*a+m*f+g*T+R*A,e[3]=p*s+m*u+g*w+R*b,p=t[4],m=t[5],g=t[6],R=t[7],e[4]=p*i+m*c+g*E+R*x,e[5]=p*o+m*l+g*d+R*y,e[6]=p*a+m*f+g*T+R*A,e[7]=p*s+m*u+g*w+R*b,p=t[8],m=t[9],g=t[10],R=t[11],e[8]=p*i+m*c+g*E+R*x,e[9]=p*o+m*l+g*d+R*y,e[10]=p*a+m*f+g*T+R*A,e[11]=p*s+m*u+g*w+R*b,p=t[12],m=t[13],g=t[14],R=t[15],e[12]=p*i+m*c+g*E+R*x,e[13]=p*o+m*l+g*d+R*y,e[14]=p*a+m*f+g*T+R*A,e[15]=p*s+m*u+g*w+R*b,e}function xr(e,r){return e[0]=1,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=1,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[10]=1,e[11]=0,e[12]=r[0],e[13]=r[1],e[14]=r[2],e[15]=1,e}function Er(e,r){return e[0]=r[0],e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=r[1],e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[10]=r[2],e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e}function yr(e,r){var t=r[0],i=r[1],o=r[2],a=r[3],s=t+t,c=i+i,l=o+o,f=t*s,u=i*s,E=i*c,d=o*s,T=o*c,w=o*l,x=a*s,y=a*c,A=a*l;return e[0]=1-E-w,e[1]=u+A,e[2]=d-y,e[3]=0,e[4]=u-A,e[5]=1-f-w,e[6]=T+x,e[7]=0,e[8]=d+y,e[9]=T-x,e[10]=1-f-E,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e}function Rr(e,r,t,i,o){var a=1/Math.tan(r/2);if(e[0]=a/t,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=a,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[11]=-1,e[12]=0,e[13]=0,e[15]=0,o!=null&&o!==1/0){var s=1/(i-o);e[10]=(o+i)*s,e[14]=2*o*i*s}else e[10]=-1,e[14]=-2*i;return e}var Tr=Rr,Se=gr;function ue(){var e=new C(3);return C!=Float32Array&&(e[0]=0,e[1]=0,e[2]=0),e}function wr(e){var r=e[0],t=e[1],i=e[2];return Math.sqrt(r*r+t*t+i*i)}function te(e,r,t){var i=new C(3);return i[0]=e,i[1]=r,i[2]=t,i}function Me(e,r){return e[0]=r[0],e[1]=r[1],e[2]=r[2],e}function Sr(e,r,t){return e[0]=r[0]+t[0],e[1]=r[1]+t[1],e[2]=r[2]+t[2],e}function Ar(e,r){var t=r[0],i=r[1],o=r[2],a=t*t+i*i+o*o;return a>0&&(a=1/Math.sqrt(a)),e[0]=r[0]*a,e[1]=r[1]*a,e[2]=r[2]*a,e}function Dr(e,r){return e[0]*r[0]+e[1]*r[1]+e[2]*r[2]}function ve(e,r,t){var i=r[0],o=r[1],a=r[2],s=t[0],c=t[1],l=t[2];return e[0]=o*l-a*c,e[1]=a*s-i*l,e[2]=i*c-o*s,e}var Fr=wr;(function(){var e=ue();return function(r,t,i,o,a,s){var c,l;for(t||(t=3),i||(i=0),o?l=Math.min(o*t+i,r.length):l=r.length,c=i;c<l;c+=t)e[0]=r[c],e[1]=r[c+1],e[2]=r[c+2],a(e,e,s),r[c]=e[0],r[c+1]=e[1],r[c+2]=e[2];return r}})();function _r(){var e=new C(4);return C!=Float32Array&&(e[0]=0,e[1]=0,e[2]=0,e[3]=0),e}function br(e,r){return e[0]=r[0],e[1]=r[1],e[2]=r[2],e[3]=r[3],e}function Pr(e,r){var t=r[0],i=r[1],o=r[2],a=r[3],s=t*t+i*i+o*o+a*a;return s>0&&(s=1/Math.sqrt(s)),e[0]=t*s,e[1]=i*s,e[2]=o*s,e[3]=a*s,e}(function(){var e=_r();return function(r,t,i,o,a,s){var c,l;for(t||(t=4),i||(i=0),o?l=Math.min(o*t+i,r.length):l=r.length,c=i;c<l;c+=t)e[0]=r[c],e[1]=r[c+1],e[2]=r[c+2],e[3]=r[c+3],a(e,e,s),r[c]=e[0],r[c+1]=e[1],r[c+2]=e[2],r[c+3]=e[3];return r}})();function H(){var e=new C(4);return C!=Float32Array&&(e[0]=0,e[1]=0,e[2]=0),e[3]=1,e}function le(e,r,t){t=t*.5;var i=Math.sin(t);return e[0]=i*r[0],e[1]=i*r[1],e[2]=i*r[2],e[3]=Math.cos(t),e}function Ue(e,r,t){var i=r[0],o=r[1],a=r[2],s=r[3],c=t[0],l=t[1],f=t[2],u=t[3];return e[0]=i*u+s*c+o*f-a*l,e[1]=o*u+s*l+a*c-i*f,e[2]=a*u+s*f+i*l-o*c,e[3]=s*u-i*c-o*l-a*f,e}function he(e,r,t,i){var o=r[0],a=r[1],s=r[2],c=r[3],l=t[0],f=t[1],u=t[2],E=t[3],d,T,w,x,y;return T=o*l+a*f+s*u+c*E,T<0&&(T=-T,l=-l,f=-f,u=-u,E=-E),1-T>dr?(d=Math.acos(T),w=Math.sin(d),x=Math.sin((1-i)*d)/w,y=Math.sin(i*d)/w):(x=1-i,y=i),e[0]=x*o+y*l,e[1]=x*a+y*f,e[2]=x*s+y*u,e[3]=x*c+y*E,e}function Mr(e,r){var t=r[0]+r[4]+r[8],i;if(t>0)i=Math.sqrt(t+1),e[3]=.5*i,i=.5/i,e[0]=(r[5]-r[7])*i,e[1]=(r[6]-r[2])*i,e[2]=(r[1]-r[3])*i;else{var o=0;r[4]>r[0]&&(o=1),r[8]>r[o*3+o]&&(o=2);var a=(o+1)%3,s=(o+2)%3;i=Math.sqrt(r[o*3+o]-r[a*3+a]-r[s*3+s]+1),e[o]=.5*i,i=.5/i,e[3]=(r[a*3+s]-r[s*3+a])*i,e[a]=(r[a*3+o]+r[o*3+a])*i,e[s]=(r[s*3+o]+r[o*3+s])*i}return e}var Ur=br,Lr=Ue,Le=Pr;(function(){var e=ue(),r=te(1,0,0),t=te(0,1,0);return function(i,o,a){var s=Dr(o,a);return s<-.999999?(ve(e,r,o),Fr(e)<1e-6&&ve(e,t,o),Ar(e,e),le(i,e,Math.PI),i):s>.999999?(i[0]=0,i[1]=0,i[2]=0,i[3]=1,i):(ve(e,o,a),i[0]=e[0],i[1]=e[1],i[2]=e[2],i[3]=1+s,Le(i,i))}})();(function(){var e=H(),r=H();return function(t,i,o,a,s,c){return he(e,i,s,c),he(r,o,a,c),he(t,e,r,2*c*(1-c)),t}})();(function(){var e=mr();return function(r,t,i,o){return e[0]=i[0],e[3]=i[1],e[6]=i[2],e[1]=o[0],e[4]=o[1],e[7]=o[2],e[2]=-t[0],e[5]=-t[1],e[8]=-t[2],Le(r,Mr(r,e))}})();class Cr{position;rotation;scale;modelMatrix;_dirty;constructor(){this.position=ue(),this.rotation=H(),this.scale=te(1,1,1),this.modelMatrix=G(),this._dirty=!0}updateMatrix(){if(!this._dirty)return this.modelMatrix;const r=G(),t=G(),i=G(),o=G();return xr(r,this.position),yr(t,this.rotation),Er(i,this.scale),Se(o,r,t),Se(this.modelMatrix,o,i),this._dirty=!1,this.modelMatrix}translate(r){Sr(this.position,this.position,r),this._dirty=!0}rotate(r,t){const i=H();le(i,t,r),Ue(this.rotation,i,this.rotation),this._dirty=!0}setScale(r){Me(this.scale,r),this._dirty=!0}getMatrix(){return this.updateMatrix()}}class Ce{transform;constructor(){this.transform=new Cr}}class Nr extends Ce{gl;vao=null;vbo=null;ibo=null;program=null;verticesRaw;indices;vertexCount=0;indexCount=0;constructor(r,t,i){super(),this.gl=r,this.verticesRaw=t,this.indices=i}setProgram(r){this.program=r}init(){if(!this.program)return;const r=this.gl;if(!this.verticesRaw||this.verticesRaw.length===0){console.warn("Mesh3D: verticesRaw が空です");return}const t=this.verticesRaw[0].uv!==void 0,i=3,o=t?2:0,a=4,s=i+o,c=s*a,l=this.verticesRaw.flatMap(d=>t?[...d.pos,...d.uv]:[...d.pos]),f=new Float32Array(l);this.vertexCount=f.length/s,this.vao=r.createVertexArray(),this.vbo=r.createBuffer(),this.ibo=null,r.bindVertexArray(this.vao),r.bindBuffer(r.ARRAY_BUFFER,this.vbo),r.bufferData(r.ARRAY_BUFFER,f,r.STATIC_DRAW);let u=0;const E=r.getAttribLocation(this.program.program,"aPosition");if(E>=0&&(r.enableVertexAttribArray(E),r.vertexAttribPointer(E,i,r.FLOAT,!1,c,u)),u+=i*a,t){const d=r.getAttribLocation(this.program.program,"aTexCoord");d>=0&&(r.enableVertexAttribArray(d),r.vertexAttribPointer(d,o,r.FLOAT,!1,c,u)),u+=o*a}this.indices&&this.indices.length>0&&(this.ibo=r.createBuffer(),r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,this.ibo),r.bufferData(r.ELEMENT_ARRAY_BUFFER,new Uint16Array(this.indices),r.STATIC_DRAW),this.indexCount=this.indices.length),r.bindVertexArray(null)}uploadModelMatrix(){if(!this.program)return;const r=this.gl;this.transform.updateMatrix();const t=this.program.uniforms.get("uModelMat");t&&r.uniformMatrix4fv(t,!1,this.transform.modelMatrix)}update(){this.transform.updateMatrix()}draw(){const r=this.gl;this.vao&&(this.uploadModelMatrix(),r.bindVertexArray(this.vao),this.ibo&&this.indexCount>0?r.drawElements(r.TRIANGLES,this.indexCount,r.UNSIGNED_SHORT,0):this.vertexCount>0&&r.drawArrays(r.TRIANGLES,0,this.vertexCount),r.bindVertexArray(null))}}class Br extends Nr{constructor(r){const t=[{pos:[-.5,-.5,0],uv:[0,0]},{pos:[.5,-.5,0],uv:[1,0]},{pos:[.5,.5,0],uv:[1,1]},{pos:[-.5,.5,0],uv:[0,1]}],i=[0,1,2,0,2,3];super(r,t,i)}}class zr extends Ce{fov;aspect;near;far;yaw;pitch;viewMatrix;projectionMatrix;program=null;gl;dt=0;constructor(r,t=Math.PI/4,i=1,o=.1,a=1e3,s=te(0,0,5),c=-Math.PI/2,l=0){super(),this.gl=r,this.fov=t,this.aspect=i,this.near=o,this.far=a,this.viewMatrix=G(),this.projectionMatrix=G(),Me(this.transform.position,s),this.yaw=c,this.pitch=l,this.updateMatrices()}setProgram(r){this.program=r}move(r){this.transform.translate(r),this.updateMatrices()}rotate(r,t){this.yaw+=r,this.pitch+=t;const i=Math.PI/2-.01;this.pitch>i&&(this.pitch=i),this.pitch<-i&&(this.pitch=-i),this.updateMatrices()}setAspect(r){this.aspect=r,this.updateMatrices()}updateMatrices(){const r=H(),t=H();le(r,[0,1,0],this.yaw),le(t,[1,0,0],this.pitch);const i=H();Lr(i,r,t),Ur(this.transform.rotation,i),this.transform.updateMatrix(),pr(this.viewMatrix,this.transform.modelMatrix),Tr(this.projectionMatrix,this.fov,this.aspect,this.near,this.far)}updateShaderUniforms(){if(!this.program)return;const r=this.program.uniforms.get("uViewMat"),t=this.program.uniforms.get("uProjectionMat");if(!r||!t)throw new Error("Camera のプログラムが不正です.");this.gl.uniformMatrix4fv(r,!1,this.viewMatrix),this.gl.uniformMatrix4fv(t,!1,this.projectionMatrix)}update(r,t){if(t){console.log("ppp");const o=ue();t.isKeyDown("w")&&(o[1]+=1*r),t.isKeyDown("s")&&(o[1]-=1*r),t.isKeyDown("a")&&(o[0]-=1*r),t.isKeyDown("d")&&(o[0]+=1*r),(o[0]!==0||o[1]!==0)&&this.move(o)}this.dt=r,this.updateMatrices()}}class Or{keys;mouse;constructor(r){this.keys={},this.mouse={x:0,y:0,dx:0,dy:0,down:!1,scrollDelta:0},window.addEventListener("keydown",t=>{this.keys[t.key]=!0}),window.addEventListener("keyup",t=>{this.keys[t.key]=!1}),window.addEventListener("mousemove",t=>{this.mouse.dx+=t.movementX,this.mouse.dy+=t.movementY;const i=r.getBoundingClientRect();this.mouse.x=(t.clientX-i.left)/i.width,this.mouse.y=(t.clientY-i.top)/i.height}),window.addEventListener("mousedown",()=>{this.mouse.down=!0}),window.addEventListener("mouseup",()=>{this.mouse.down=!1}),window.addEventListener("wheel",t=>{this.mouse.scrollDelta+=-t.deltaY/100,t.preventDefault()},{passive:!1})}isKeyDown(r){return!!this.keys[r]}resetMouseDelta(){this.mouse.dx=0,this.mouse.dy=0}resetScroll(){this.mouse.scrollDelta=0}}const h=document.getElementById("canvas");if(!h)throw new Error("canvas が見つかりません");ne();const{gl:n,ext:N}=Ge(h);let ie=performance.now(),P={SIM_RESOLUTION:256,DYE_RESOLUTION:1024,DENSITY_DISSIPATION:1,VELOCITY_DISSIPATION:.2,PRESSURE:.8,PRESSURE_ITERATIONS:20,CURL:30,PAUSED:!1,SPLAT_RADIUS:.25,SPLAT_FORCE:5e3,BACK_COLOR:{r:0,g:0,b:0}},L=D(n,n.VERTEX_SHADER,F("baseVert")),Ir=D(n,n.FRAGMENT_SHADER,F("copy")),Xr=D(n,n.FRAGMENT_SHADER,F("clear")),Vr=D(n,n.FRAGMENT_SHADER,F("splat")),Yr=D(n,n.FRAGMENT_SHADER,F("color")),Gr=D(n,n.FRAGMENT_SHADER,F("advection"),N.supportLinearFiltering?null:["MANUAL_FILTERING"]),Hr=D(n,n.FRAGMENT_SHADER,F("divergence")),$r=D(n,n.FRAGMENT_SHADER,F("curl")),Wr=D(n,n.FRAGMENT_SHADER,F("vorticity")),Kr=D(n,n.FRAGMENT_SHADER,F("pressure")),jr=D(n,n.FRAGMENT_SHADER,F("gradientSubtract")),U,v,Ee,ye,X,qr=D(n,n.FRAGMENT_SHADER,F("noise")),de=new M(n,L,qr),ce,kr=D(n,n.FRAGMENT_SHADER,F("curlNoise")),me=new M(n,L,kr),Re,Qr=D(n,n.FRAGMENT_SHADER,F("physics")),ee=new M(n,L,Qr);const Ae=new M(n,L,Ir),pe=new M(n,L,Xr),W=new M(n,L,Vr),De=new M(n,L,Yr);let oe=new M(n,L,$r),I=new M(n,L,Wr),ge=new M(n,L,Hr),ae=new M(n,L,Kr),se=new M(n,L,jr),Y=new M(n,L,Gr),Zr=D(n,n.VERTEX_SHADER,F("sceneVert")),Jr=D(n,n.FRAGMENT_SHADER,F("scene")),et=new M(n,Zr,Jr),rt=new Or(h),fe=new hr(et,rt),tt=new Br(n);fe.addObject(tt);if(!h)throw new Error("canvas が見つかりせん.");let it=h.width/h.height,Ne=new zr(n,Math.PI/3,it,.1,100,te(0,0,3),0,0);fe.setCamera(Ne);let $;function nt(){n.bindFramebuffer(n.FRAMEBUFFER,$.fbo),n.viewport(0,0,$.width,$.height),n.clearColor(0,0,0,1),n.clear(n.COLOR_BUFFER_BIT),fe.render(),n.bindFramebuffer(n.FRAMEBUFFER,null)}const ot=D(n,n.VERTEX_SHADER,F("displayVertex")),re=new We(n,ot,F("display"));re.setKeywords([]);function ne(){if(!h)throw new Error("canvas が見つかりません");let e=z(h.clientWidth),r=z(h.clientHeight);return h.width!=e||h.height!=r?(h.width=e,h.height=r,!0):!1}function z(e){let r=window.devicePixelRatio||1;return Math.floor(e*r)}function Be(){let e=Fe(P.SIM_RESOLUTION),r=Fe(P.DYE_RESOLUTION);const t=N.halfFloatTexType,i=N.formatRGBA,o=N.formatRG,a=N.formatR,s=N.supportLinearFiltering?n.LINEAR:n.NEAREST;if(n.disable(n.BLEND),!a||!o||!i)throw new Error("フォーマットが無効です.");U==null?U=xe(r.width,r.height,i.internalFormat,i.format,t,s):U=_e(U,r.width,r.height,i.internalFormat,i.format,t,s),v==null?v=xe(e.width,e.height,o.internalFormat,o.format,t,s):v=_e(v,e.width,e.height,o.internalFormat,o.format,t,s),Ee=O(e.width,e.height,a.internalFormat,a.format,t,n.NEAREST),ye=O(e.width,e.height,a.internalFormat,a.format,t,n.NEAREST),X=xe(e.width,e.height,a.internalFormat,a.format,t,n.NEAREST),ce=O(e.width,e.height,a.internalFormat,a.format,t,s),Re=O(e.width,e.height,a.internalFormat,a.format,t,s),$=O(e.width,e.height,a.internalFormat,a.format,t,s)}function Fe(e){let r=n.drawingBufferWidth/n.drawingBufferHeight;r<1&&(r=1/r);let t=Math.round(e),i=Math.round(e*r);return n.drawingBufferWidth>n.drawingBufferHeight?{width:i,height:t}:{width:t,height:i}}function at(e){let r=(e-ie)/1e3;return r=Math.min(r,.016666),ie=e,r}function O(e,r,t,i,o,a){n.activeTexture(n.TEXTURE0);let s=n.createTexture();n.bindTexture(n.TEXTURE_2D,s),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,a),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MAG_FILTER,a),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE),n.texImage2D(n.TEXTURE_2D,0,t,e,r,0,i,o,null);let c=n.createFramebuffer();n.bindFramebuffer(n.FRAMEBUFFER,c),n.framebufferTexture2D(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,s,0),n.viewport(0,0,e,r),n.clear(n.COLOR_BUFFER_BIT);let l=1/e,f=1/r;return{texture:s,fbo:c,width:e,height:r,texelSizeX:l,texelSizeY:f,attach(u){return n.activeTexture(n.TEXTURE0+u),n.bindTexture(n.TEXTURE_2D,s),u}}}function xe(e,r,t,i,o,a){let s=O(e,r,t,i,o,a),c=O(e,r,t,i,o,a);return{width:e,height:r,texelSizeX:s.texelSizeX,texelSizeY:s.texelSizeY,get read(){return s},set read(l){s=l},get write(){return c},set write(l){c=l},swap(){let l=s;s=c,c=l}}}function st(e,r,t,i,o,a,s){let c=O(r,t,i,o,a,s);Ae.bind();let l=Ae.uniforms.get("uTexture");if(l===void 0)throw new Error(" uTexture が未定義です");return n.uniform1i(l,e.attach(0)),_(c),c}function _e(e,r,t,i,o,a,s){return e.width==r&&e.height==t||(e.read=st(e.read,r,t,i,o,a,s),e.write=O(r,t,i,o,a,s),e.width=r,e.height=t,e.texelSizeX=1/r,e.texelSizeY=1/t),e}function ze(e){const r=at(e);ne()&&Be(),ct(),P.PAUSED||ht(r),dt(null),requestAnimationFrame(ze)}let B=[];B.push(new we);let Te=[];function ct(){Te.length>0&&ut(Te.pop()),B.forEach(e=>{e.moved&&(e.moved=!1,lt(e))})}function lt(e){let r=e.deltaX*P.SPLAT_FORCE,t=e.deltaY*P.SPLAT_FORCE;Oe(e.texcoordX,e.texcoordY,r,t,e.color)}function ut(e){if(e===void 0)throw new Error("amount が未定義です.");for(let r=0;r<e;r++){const t=Ie();t.r*=10,t.g*=10,t.b*=10;const i=Math.random(),o=Math.random(),a=1e3*(Math.random()-.5),s=1e3*(Math.random()-.5);Oe(i,o,a,s,t)}}function Oe(e,r,t,i,o){if(!h)throw new Error("canvas が見つかりせん.");W.bind();let a=W.uniforms.get("uTarget"),s=W.uniforms.get("aspectRatio"),c=W.uniforms.get("point"),l=W.uniforms.get("color"),f=W.uniforms.get("radius");if(a===void 0||s==null||c===void 0||l===void 0||f===void 0)throw new Error("splatProgram が不正です.");n.uniform1i(a,v.read.attach(0)),n.uniform1f(s,h.width/h.height),n.uniform2f(c,e,r),n.uniform3f(l,t,i,0),n.uniform1f(f,ft(P.SPLAT_RADIUS/100)),_(v.write),v.swap(),n.uniform1i(a,U.read.attach(0)),n.uniform3f(l,o.r,o.g,o.b),_(U.write),U.swap()}function ft(e){if(!h)throw new Error("canvas が見つかりせん.");let r=h.width/h.height;return r>1&&(e*=r),e}function Ie(){let e=vt(Math.random(),1,1);return e.r*=.15,e.g*=.15,e.b*=.15,e}function vt(e,r,t){let i,o,a,s,c,l,f,u;switch(s=Math.floor(e*6),c=e*6-s,l=t*(1-r),f=t*(1-c*r),u=t*(1-(1-c)*r),s%6){case 0:i=t,o=u,a=l;break;case 1:i=f,o=t,a=l;break;case 2:i=l,o=t,a=u;break;case 3:i=l,o=f,a=t;break;case 4:i=u,o=l,a=t;break;case 5:i=t,o=l,a=f;break;default:i=t,o=u,a=l;break}return{r:i,g:o,b:a}}function ht(e){n.disable(n.BLEND),Ne.setAspect($.width/$.height),fe.update(e),nt();function r(m){const g=m.uniforms.get("uObstacle");g&&n.uniform1i(g,$.attach(3))}de.bind();let t=de.uniforms.get("texelSize"),i=de.uniforms.get("uTime");if(t===void 0||i===void 0)throw new Error("noiseProgram が不正です.");n.uniform2f(t,v.texelSizeX,v.texelSizeY),n.uniform1f(i,ie*.001),_(ce),me.bind(),t=me.uniforms.get("texelSize");let o=me.uniforms.get("uNoise");if(t===void 0||o===void 0)throw new Error("curlNoiseProgram が不正です.");n.uniform2f(t,v.texelSizeX,v.texelSizeY),n.uniform1i(o,ce.attach(0)),_(Re),oe.bind(),t=oe.uniforms.get("texelSize");let a=oe.uniforms.get("uVelocity"),s=oe.uniforms.get("uCurlNoise");if(t===void 0||a===void 0||s===void 0)throw new Error("curlProgram が不正です.");n.uniform2f(t,v.texelSizeX,v.texelSizeY),n.uniform1i(a,v.read.attach(0)),n.uniform1i(s,Re.attach(1)),_(ye),I.bind(),t=I.uniforms.get("texelSize"),a=I.uniforms.get("uVelocity");let c=I.uniforms.get("uCurl"),l=I.uniforms.get("curl"),f=I.uniforms.get("dt");o=I.uniforms.get("uNoise");let u=I.uniforms.get("time");if(t===void 0||a===void 0||c===void 0||l===void 0||f===void 0||o===void 0||u===void 0)throw new Error("vorticityProgram が不正です.");n.uniform2f(t,v.texelSizeX,v.texelSizeY),n.uniform1i(a,v.read.attach(0)),n.uniform1i(c,ye.attach(1)),n.uniform1f(l,P.CURL),n.uniform1f(f,e),n.uniform1i(o,ce.attach(2)),n.uniform1f(u,ie*.001),_(v.write),v.swap(),ee.bind(),r(ee),a=ee.uniforms.get("uVelocity");let E=ee.uniforms.get("uGravity");if(f=ee.uniforms.get("dt"),a===void 0||E===void 0||f===void 0)throw new Error("physicsProgram が不正です");if(n.uniform1i(a,v.read.attach(0)),n.uniform2f(E,0,-15),n.uniform1f(f,e),_(v.write),v.swap(),ge.bind(),t=ge.uniforms.get("texelSize"),a=ge.uniforms.get("uVelocity"),t===void 0||a===void 0)throw new Error("divergenceProgram が不正です.");n.uniform2f(t,v.texelSizeX,v.texelSizeY),n.uniform1i(a,v.read.attach(0)),_(Ee),pe.bind();let d=pe.uniforms.get("uTexture"),T=pe.uniforms.get("value");if(d===void 0||T===void 0)throw new Error("clearProgram が不正です.");n.uniform1i(d,X.read.attach(0)),n.uniform1f(T,P.PRESSURE),_(X.write),X.swap(),ae.bind(),t=ae.uniforms.get("texelSize");let w=ae.uniforms.get("uDivergence"),x=ae.uniforms.get("uPressure");if(t===void 0||w===void 0||x==null)throw new Error("pressureProgram が不正です.");n.uniform2f(t,v.texelSizeX,v.texelSizeY),n.uniform1i(w,Ee.attach(0));for(let m=0;m<P.PRESSURE_ITERATIONS;m++)n.uniform1i(x,X.read.attach(1)),_(X.write),X.swap();if(se.bind(),t=se.uniforms.get("texelSize"),x=se.uniforms.get("uPressure"),a=se.uniforms.get("uVelocity"),t==null||x===void 0||a===void 0)throw new Error("gradientSubtractProgram が不正です.");n.uniform2f(t,v.texelSizeX,v.texelSizeY),n.uniform1i(x,X.read.attach(0)),n.uniform1i(a,v.read.attach(1)),_(v.write),v.swap(),Y.bind(),t=Y.uniforms.get("texelSize");let y=Y.uniforms.get("dyeTexelSize");a=Y.uniforms.get("uVelocity");let A=Y.uniforms.get("uSource");f=Y.uniforms.get("dt");let b=Y.uniforms.get("dissipation");if(t===void 0||a===void 0||A===void 0||f===void 0||b===void 0)throw new Error("advectionProgram が不正です.");if(!N.supportLinearFiltering&&y===void 0)throw new Error("dyeTexelSize uniform が見つかりません（MANUAL_FILTERING 有効時）");n.uniform2f(t,v.texelSizeX,v.texelSizeY),N.supportLinearFiltering||n.uniform2f(y,v.texelSizeX,v.texelSizeY);let p=v.read.attach(0);n.uniform1i(a,p),n.uniform1i(A,p),n.uniform1f(f,e),n.uniform1f(b,P.VELOCITY_DISSIPATION),_(v.write),v.swap(),N.supportLinearFiltering||n.uniform2f(y,U.texelSizeX,U.texelSizeY),n.uniform1i(a,v.read.attach(0)),n.uniform1i(A,U.read.attach(1)),n.uniform1f(b,P.DENSITY_DISSIPATION),_(U.write),U.swap()}function dt(e){n.blendFunc(n.ONE,n.ONE_MINUS_SRC_ALPHA),n.enable(n.BLEND),pt(e,gt(P.BACK_COLOR)),mt(e)}function mt(e){re.bind();let r=re.uniforms.get("uTexture"),t=re.uniforms.get("uOffset"),i=re.uniforms.get("uScale");if(!r||!t||!i)throw new Error("displayShader が不正です.");n.uniform1i(r,U.read.attach(0)),n.uniform2f(t,0,0),n.uniform1f(i,1),_(e)}function pt(e,r){De.bind();let t=De.uniforms.get("color");if(t==null)throw new Error("colorProgram が不正です.");n.uniform4f(t,r.r,r.g,r.b,1),_(e)}function gt(e){return{r:e.r/255,g:e.g/255,b:e.b/255}}const _=(n.bindBuffer(n.ARRAY_BUFFER,n.createBuffer()),n.bufferData(n.ARRAY_BUFFER,new Float32Array([-1,-1,-1,1,1,1,1,-1]),n.STATIC_DRAW),n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,n.createBuffer()),n.bufferData(n.ELEMENT_ARRAY_BUFFER,new Uint16Array([0,1,2,0,2,3]),n.STATIC_DRAW),n.vertexAttribPointer(0,2,n.FLOAT,!1,0,0),n.enableVertexAttribArray(0),(e,r=!1)=>{e==null?(n.viewport(0,0,n.drawingBufferWidth,n.drawingBufferHeight),n.bindFramebuffer(n.FRAMEBUFFER,null)):(n.viewport(0,0,e.width,e.height),n.bindFramebuffer(n.FRAMEBUFFER,e.fbo)),r&&(n.clearColor(0,0,0,1),n.clear(n.COLOR_BUFFER_BIT)),n.drawElements(n.TRIANGLES,6,n.UNSIGNED_SHORT,0)});window.addEventListener("load",()=>{ne(),Be(),ie=performance.now(),requestAnimationFrame(ze),console.log("WebGL context:",n,N)});window.addEventListener("resize",ne);window.addEventListener("orientationchange",ne);h.addEventListener("mousedown",e=>{let r=z(e.offsetX),t=z(e.offsetY),i=B.find(o=>o.id==-1);i==null&&(i=new we),Xe(i,-1,r,t)});h.addEventListener("mousemove",e=>{let r=B[0];if(!r.down)return;let t=z(e.offsetX),i=z(e.offsetY);Ve(r,t,i)});window.addEventListener("mouseup",()=>{Ye(B[0])});h.addEventListener("touchstart",e=>{e.preventDefault();const r=e.targetTouches;for(;r.length>=B.length;)B.push(new we);for(let t=0;t<r.length;t++){let i=z(r[t].pageX),o=z(r[t].pageY);Xe(B[t+1],r[t].identifier,i,o)}});h.addEventListener("touchmove",e=>{e.preventDefault();const r=e.targetTouches;for(let t=0;t<r.length;t++){let i=B[t+1];if(!i.down)continue;let o=z(r[t].pageX),a=z(r[t].pageY);Ve(i,o,a)}},!1);window.addEventListener("touchend",e=>{const r=e.changedTouches;for(let t=0;t<r.length;t++){let i=B.find(o=>o.id==r[t].identifier);i!=null&&Ye(i)}});window.addEventListener("keydown",e=>{e.code==="KeyP"&&(P.PAUSED=!P.PAUSED),e.key===" "&&Te.push(Math.random()*20+5)});function Xe(e,r,t,i){if(!h)throw new Error("canvas が見つかりません.");e.id=r,e.down=!0,e.moved=!1,e.texcoordX=t/h.width,e.texcoordY=1-i/h.height,e.prevTexcoordX=e.texcoordX,e.prevTexcoordY=e.texcoordY,e.deltaX=0,e.deltaY=0,e.color=Ie()}function Ve(e,r,t){if(!h)throw new Error("canvas が見つかりません.");e.prevTexcoordX=e.texcoordX,e.prevTexcoordY=e.texcoordY,e.texcoordX=r/h.width,e.texcoordY=1-t/h.height,e.deltaX=xt(e.texcoordX-e.prevTexcoordX),e.deltaY=Et(e.texcoordY-e.prevTexcoordY),e.moved=Math.abs(e.deltaX)>0||Math.abs(e.deltaY)>0}function Ye(e){e.down=!1}function xt(e){if(!h)throw new Error("canvas が見つかりません.");let r=h.width/h.height;return r<1&&(e*=r),e}function Et(e){if(!h)throw new Error("canvas が見つかりません.");let r=h.width/h.height;return r>1&&(e/=r),e}
