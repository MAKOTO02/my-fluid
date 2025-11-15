(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))i(o);new MutationObserver(o=>{for(const a of o)if(a.type==="childList")for(const s of a.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&i(s)}).observe(document,{childList:!0,subtree:!0});function t(o){const a={};return o.integrity&&(a.integrity=o.integrity),o.referrerPolicy&&(a.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?a.credentials="include":o.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function i(o){if(o.ep)return;o.ep=!0;const a=t(o);fetch(o.href,a)}})();function Vr(r){const e={alpha:!0,depth:!1,stencil:!1,antialias:!1,preserveDrawingBuffer:!1};let t;t=r.getContext("webgl2",e);const i=!!t;if(i||(t=r.getContext("webgl",e)||r.getContext("experimental-webgl",e)),!t)throw new Error("WebGL is not supported");let o,a;i?(t.getExtension("EXT_color_buffer_float"),a=t.getExtension("OES_texture_float_linear")):(o=t.getExtension("OES_texture_half_float"),a=t.getExtension("OES_texture_half_float_linear")),t.clearColor(0,0,0,1);const s=i?t.HALF_FLOAT:o.HALF_FLOAT_OES;let c,l,f;if(i){const u=t;c=G(u,u.RGBA16F,u.RGBA,s),l=G(u,u.RG16F,u.RG,s),f=G(u,u.R16F,u.RED,s)}else{const u=t;c=G(u,u.RGBA,u.RGBA,s),l=G(u,u.RGBA,u.RGBA,s),f=G(u,u.RGBA,u.RGBA,s)}return{gl:t,ext:{formatRGBA:c,formatRG:l,formatR:f,halfFloatTexType:s,supportLinearFiltering:!!a}}}function G(r,e,t,i){if(!Hr(r,e,t,i)){if("RGBA16F"in r){const o=r;switch(e){case o.R16F:return G(o,o.RG16F,o.RG,i);case o.RG16F:return G(o,o.RGBA16F,o.RGBA,i);default:return null}}return null}return{internalFormat:e,format:t}}function Hr(r,e,t,i){let o=r.createTexture();r.bindTexture(r.TEXTURE_2D,o),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MIN_FILTER,r.NEAREST),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MAG_FILTER,r.NEAREST),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_S,r.CLAMP_TO_EDGE),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_T,r.CLAMP_TO_EDGE),r.texImage2D(r.TEXTURE_2D,0,e,4,4,0,t,i,null);let a=r.createFramebuffer();return r.bindFramebuffer(r.FRAMEBUFFER,a),r.framebufferTexture2D(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,o,0),r.checkFramebufferStatus(r.FRAMEBUFFER)===r.FRAMEBUFFER_COMPLETE}function $r(r){if(r.length===0)return 0;let e=0;for(let t=0;t<r.length;t++)e=(e<<5)-e+r.charCodeAt(t),e|=0;return e}class Wr{gl;vertexShader;fragmentShaderSource;programs;activeProgram;uniforms;constructor(e,t,i){this.gl=e,this.vertexShader=t,this.fragmentShaderSource=i,this.programs={},this.activeProgram=null,this.uniforms=new Map}setKeywords(e){let t=0;for(let o=0;o<e.length;o++)t+=$r(e[o]);let i=this.programs[t];if(i==null){let o=D(this.gl,this.gl.FRAGMENT_SHADER,this.fragmentShaderSource,e);i=_r(this.gl,this.vertexShader,o),this.programs[t]=i}i!=this.activeProgram&&(this.uniforms=br(this.gl,i),this.activeProgram=i)}bind(){this.activeProgram&&this.gl.useProgram(this.activeProgram)}}function br(r,e){let t=new Map,i=r.getProgramParameter(e,r.ACTIVE_UNIFORMS);for(let o=0;o<i;o++){let a=r.getActiveUniform(e,o);if(!a)continue;let s=a.name;t.set(s,r.getUniformLocation(e,s))}return t}function _r(r,e,t){let i=r.createProgram();if(!i)throw new Error("WebGLProgram を作成できませんでした");return r.attachShader(i,e),r.attachShader(i,t),r.linkProgram(i),r.getProgramParameter(i,r.LINK_STATUS)||console.trace(r.getProgramInfoLog(i)),i}function D(r,e,t,i){t=jr(t,i);const o=r.createShader(e);if(!o)throw new Error("shader が見つかりません");return r.shaderSource(o,t),r.compileShader(o),r.getShaderParameter(o,r.COMPILE_STATUS)||console.trace(r.getShaderInfoLog(o)),o}function jr(r,e){if(!e||e.length===0)return r;let t="";return e.forEach(i=>{t+="#define "+i+`
`}),t+r}class M{gl;uniforms;program;constructor(e,t,i){this.gl=e,this.uniforms=new Map,this.program=_r(e,t,i),this.uniforms=br(e,this.program)}bind(){this.gl.useProgram(this.program)}}const qr=`precision highp float;\r
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
}`,Kr=`precision mediump float;\r
precision mediump sampler2D;\r
\r
varying highp vec2 vUv;\r
uniform sampler2D uTexture;\r
\r
void main () {\r
    gl_FragColor = texture2D(uTexture, vUv);\r
}`,Qr=`precision mediump float;\r
precision mediump sampler2D;\r
\r
varying highp vec2 vUv;\r
uniform sampler2D uTexture;\r
uniform float value;\r
\r
void main () {\r
    gl_FragColor = value * texture2D(uTexture, vUv);\r
}`,kr=`precision highp float;\r
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
}`,Zr=`precision mediump float;\r
\r
uniform vec4 color;\r
\r
void main () {\r
    gl_FragColor = color;\r
}`,Jr=`precision highp float;\r
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
}`,re=`precision mediump float;\r
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
`,ee=`precision mediump float;\r
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
}`,te=`precision highp float;\r
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
}`,ie=`precision mediump float;\r
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
}`,ne=`precision mediump float;\r
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
}`,oe=`precision highp float;\r
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
}`,ae=`precision mediump float;\r
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
}`,se=`precision mediump float;\r
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
}`,ce=`// physics.frag\r
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
`,le=`precision highp float;\r
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
`,ue=`precision highp float;\r
\r
varying vec2 vTexCoord;\r
varying vec3 vFragPos;\r
\r
void main(){\r
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\r
}`,fe={baseVert:qr,copy:Kr,clear:Qr,splat:kr,color:Zr,advection:Jr,divergence:re,curl:ee,vorticity:te,pressure:ie,gradientSubtract:ne,display:oe,noise:ae,curlNoise:se,physics:ce,sceneVert:le,scene:ue};function F(r){const e=fe[r];if(!e)throw new Error(`Unknown shader name: ${r}`);return e}class Tr{id;texcoordX;texcoordY;prevTexcoordX;prevTexcoordY;deltaX;deltaY;down;moved;color;constructor(){this.id=-1,this.texcoordX=0,this.texcoordY=0,this.prevTexcoordX=0,this.prevTexcoordY=0,this.deltaX=0,this.deltaY=0,this.down=!1,this.moved=!1,this.color={r:30,g:0,b:300}}}class ve{program;camera=null;objects=[];constructor(e){this.program=e}setCamera(e){this.camera=e,e.setProgram(this.program)}addObject(e){e.setProgram(this.program),e.init(),this.objects.push(e)}update(e){this.camera&&this.camera.update(e);for(const t of this.objects)typeof t.update=="function"&&t.update(e)}render(){this.program.bind(),this.camera&&this.camera.updateShaderUniforms();for(const e of this.objects)e.draw()}}var he=1e-6,C=typeof Float32Array<"u"?Float32Array:Array;function de(){var r=new C(9);return C!=Float32Array&&(r[1]=0,r[2]=0,r[3]=0,r[5]=0,r[6]=0,r[7]=0),r[0]=1,r[4]=1,r[8]=1,r}function V(){var r=new C(16);return C!=Float32Array&&(r[1]=0,r[2]=0,r[3]=0,r[4]=0,r[6]=0,r[7]=0,r[8]=0,r[9]=0,r[11]=0,r[12]=0,r[13]=0,r[14]=0),r[0]=1,r[5]=1,r[10]=1,r[15]=1,r}function me(r,e){var t=e[0],i=e[1],o=e[2],a=e[3],s=e[4],c=e[5],l=e[6],f=e[7],u=e[8],E=e[9],d=e[10],y=e[11],w=e[12],x=e[13],T=e[14],A=e[15],_=t*c-i*s,g=t*l-o*s,m=t*f-a*s,p=i*l-o*c,R=i*f-a*c,j=o*f-a*l,q=u*x-E*w,K=u*T-d*w,Q=u*A-y*w,k=E*T-d*x,Z=E*A-y*x,J=d*A-y*T,S=_*J-g*Z+m*k+p*Q-R*K+j*q;return S?(S=1/S,r[0]=(c*J-l*Z+f*k)*S,r[1]=(o*Z-i*J-a*k)*S,r[2]=(x*j-T*R+A*p)*S,r[3]=(d*R-E*j-y*p)*S,r[4]=(l*Q-s*J-f*K)*S,r[5]=(t*J-o*Q+a*K)*S,r[6]=(T*m-w*j-A*g)*S,r[7]=(u*j-d*m+y*g)*S,r[8]=(s*Z-c*Q+f*q)*S,r[9]=(i*Q-t*Z-a*q)*S,r[10]=(w*R-x*m+A*_)*S,r[11]=(E*m-u*R-y*_)*S,r[12]=(c*K-s*k-l*q)*S,r[13]=(t*k-i*K+o*q)*S,r[14]=(x*g-w*p-T*_)*S,r[15]=(u*p-E*g+d*_)*S,r):null}function ge(r,e,t){var i=e[0],o=e[1],a=e[2],s=e[3],c=e[4],l=e[5],f=e[6],u=e[7],E=e[8],d=e[9],y=e[10],w=e[11],x=e[12],T=e[13],A=e[14],_=e[15],g=t[0],m=t[1],p=t[2],R=t[3];return r[0]=g*i+m*c+p*E+R*x,r[1]=g*o+m*l+p*d+R*T,r[2]=g*a+m*f+p*y+R*A,r[3]=g*s+m*u+p*w+R*_,g=t[4],m=t[5],p=t[6],R=t[7],r[4]=g*i+m*c+p*E+R*x,r[5]=g*o+m*l+p*d+R*T,r[6]=g*a+m*f+p*y+R*A,r[7]=g*s+m*u+p*w+R*_,g=t[8],m=t[9],p=t[10],R=t[11],r[8]=g*i+m*c+p*E+R*x,r[9]=g*o+m*l+p*d+R*T,r[10]=g*a+m*f+p*y+R*A,r[11]=g*s+m*u+p*w+R*_,g=t[12],m=t[13],p=t[14],R=t[15],r[12]=g*i+m*c+p*E+R*x,r[13]=g*o+m*l+p*d+R*T,r[14]=g*a+m*f+p*y+R*A,r[15]=g*s+m*u+p*w+R*_,r}function pe(r,e){return r[0]=1,r[1]=0,r[2]=0,r[3]=0,r[4]=0,r[5]=1,r[6]=0,r[7]=0,r[8]=0,r[9]=0,r[10]=1,r[11]=0,r[12]=e[0],r[13]=e[1],r[14]=e[2],r[15]=1,r}function xe(r,e){return r[0]=e[0],r[1]=0,r[2]=0,r[3]=0,r[4]=0,r[5]=e[1],r[6]=0,r[7]=0,r[8]=0,r[9]=0,r[10]=e[2],r[11]=0,r[12]=0,r[13]=0,r[14]=0,r[15]=1,r}function Ee(r,e){var t=e[0],i=e[1],o=e[2],a=e[3],s=t+t,c=i+i,l=o+o,f=t*s,u=i*s,E=i*c,d=o*s,y=o*c,w=o*l,x=a*s,T=a*c,A=a*l;return r[0]=1-E-w,r[1]=u+A,r[2]=d-T,r[3]=0,r[4]=u-A,r[5]=1-f-w,r[6]=y+x,r[7]=0,r[8]=d+T,r[9]=y-x,r[10]=1-f-E,r[11]=0,r[12]=0,r[13]=0,r[14]=0,r[15]=1,r}function Te(r,e,t,i,o){var a=1/Math.tan(e/2);if(r[0]=a/t,r[1]=0,r[2]=0,r[3]=0,r[4]=0,r[5]=a,r[6]=0,r[7]=0,r[8]=0,r[9]=0,r[11]=-1,r[12]=0,r[13]=0,r[15]=0,o!=null&&o!==1/0){var s=1/(i-o);r[10]=(o+i)*s,r[14]=2*o*i*s}else r[10]=-1,r[14]=-2*i;return r}var Re=Te,wr=ge;function Rr(){var r=new C(3);return C!=Float32Array&&(r[0]=0,r[1]=0,r[2]=0),r}function ye(r){var e=r[0],t=r[1],i=r[2];return Math.sqrt(e*e+t*t+i*i)}function er(r,e,t){var i=new C(3);return i[0]=r,i[1]=e,i[2]=t,i}function Pr(r,e){return r[0]=e[0],r[1]=e[1],r[2]=e[2],r}function we(r,e,t){return r[0]=e[0]+t[0],r[1]=e[1]+t[1],r[2]=e[2]+t[2],r}function Se(r,e){var t=e[0],i=e[1],o=e[2],a=t*t+i*i+o*o;return a>0&&(a=1/Math.sqrt(a)),r[0]=e[0]*a,r[1]=e[1]*a,r[2]=e[2]*a,r}function Ae(r,e){return r[0]*e[0]+r[1]*e[1]+r[2]*e[2]}function cr(r,e,t){var i=e[0],o=e[1],a=e[2],s=t[0],c=t[1],l=t[2];return r[0]=o*l-a*c,r[1]=a*s-i*l,r[2]=i*c-o*s,r}var De=ye;(function(){var r=Rr();return function(e,t,i,o,a,s){var c,l;for(t||(t=3),i||(i=0),o?l=Math.min(o*t+i,e.length):l=e.length,c=i;c<l;c+=t)r[0]=e[c],r[1]=e[c+1],r[2]=e[c+2],a(r,r,s),e[c]=r[0],e[c+1]=r[1],e[c+2]=r[2];return e}})();function Fe(){var r=new C(4);return C!=Float32Array&&(r[0]=0,r[1]=0,r[2]=0,r[3]=0),r}function be(r,e){return r[0]=e[0],r[1]=e[1],r[2]=e[2],r[3]=e[3],r}function _e(r,e){var t=e[0],i=e[1],o=e[2],a=e[3],s=t*t+i*i+o*o+a*a;return s>0&&(s=1/Math.sqrt(s)),r[0]=t*s,r[1]=i*s,r[2]=o*s,r[3]=a*s,r}(function(){var r=Fe();return function(e,t,i,o,a,s){var c,l;for(t||(t=4),i||(i=0),o?l=Math.min(o*t+i,e.length):l=e.length,c=i;c<l;c+=t)r[0]=e[c],r[1]=e[c+1],r[2]=e[c+2],r[3]=e[c+3],a(r,r,s),e[c]=r[0],e[c+1]=r[1],e[c+2]=r[2],e[c+3]=r[3];return e}})();function H(){var r=new C(4);return C!=Float32Array&&(r[0]=0,r[1]=0,r[2]=0),r[3]=1,r}function sr(r,e,t){t=t*.5;var i=Math.sin(t);return r[0]=i*e[0],r[1]=i*e[1],r[2]=i*e[2],r[3]=Math.cos(t),r}function Mr(r,e,t){var i=e[0],o=e[1],a=e[2],s=e[3],c=t[0],l=t[1],f=t[2],u=t[3];return r[0]=i*u+s*c+o*f-a*l,r[1]=o*u+s*l+a*c-i*f,r[2]=a*u+s*f+i*l-o*c,r[3]=s*u-i*c-o*l-a*f,r}function lr(r,e,t,i){var o=e[0],a=e[1],s=e[2],c=e[3],l=t[0],f=t[1],u=t[2],E=t[3],d,y,w,x,T;return y=o*l+a*f+s*u+c*E,y<0&&(y=-y,l=-l,f=-f,u=-u,E=-E),1-y>he?(d=Math.acos(y),w=Math.sin(d),x=Math.sin((1-i)*d)/w,T=Math.sin(i*d)/w):(x=1-i,T=i),r[0]=x*o+T*l,r[1]=x*a+T*f,r[2]=x*s+T*u,r[3]=x*c+T*E,r}function Pe(r,e){var t=e[0]+e[4]+e[8],i;if(t>0)i=Math.sqrt(t+1),r[3]=.5*i,i=.5/i,r[0]=(e[5]-e[7])*i,r[1]=(e[6]-e[2])*i,r[2]=(e[1]-e[3])*i;else{var o=0;e[4]>e[0]&&(o=1),e[8]>e[o*3+o]&&(o=2);var a=(o+1)%3,s=(o+2)%3;i=Math.sqrt(e[o*3+o]-e[a*3+a]-e[s*3+s]+1),r[o]=.5*i,i=.5/i,r[3]=(e[a*3+s]-e[s*3+a])*i,r[a]=(e[a*3+o]+e[o*3+a])*i,r[s]=(e[s*3+o]+e[o*3+s])*i}return r}var Me=be,Ue=Mr,Ur=_e;(function(){var r=Rr(),e=er(1,0,0),t=er(0,1,0);return function(i,o,a){var s=Ae(o,a);return s<-.999999?(cr(r,e,o),De(r)<1e-6&&cr(r,t,o),Se(r,r),sr(i,r,Math.PI),i):s>.999999?(i[0]=0,i[1]=0,i[2]=0,i[3]=1,i):(cr(r,o,a),i[0]=r[0],i[1]=r[1],i[2]=r[2],i[3]=1+s,Ur(i,i))}})();(function(){var r=H(),e=H();return function(t,i,o,a,s,c){return lr(r,i,s,c),lr(e,o,a,c),lr(t,r,e,2*c*(1-c)),t}})();(function(){var r=de();return function(e,t,i,o){return r[0]=i[0],r[3]=i[1],r[6]=i[2],r[1]=o[0],r[4]=o[1],r[7]=o[2],r[2]=-t[0],r[5]=-t[1],r[8]=-t[2],Ur(e,Pe(e,r))}})();class Le{position;rotation;scale;modelMatrix;_dirty;constructor(){this.position=Rr(),this.rotation=H(),this.scale=er(1,1,1),this.modelMatrix=V(),this._dirty=!0}updateMatrix(){if(!this._dirty)return this.modelMatrix;const e=V(),t=V(),i=V(),o=V();return pe(e,this.position),Ee(t,this.rotation),xe(i,this.scale),wr(o,e,t),wr(this.modelMatrix,o,i),this._dirty=!1,this.modelMatrix}translate(e){we(this.position,this.position,e),this._dirty=!0}rotate(e,t){const i=H();sr(i,t,e),Mr(this.rotation,i,this.rotation),this._dirty=!0}setScale(e){Pr(this.scale,e),this._dirty=!0}getMatrix(){return this.updateMatrix()}}class Lr{transform;constructor(){this.transform=new Le}}class Ce extends Lr{gl;vao=null;vbo=null;ibo=null;program=null;verticesRaw;indices;vertexCount=0;indexCount=0;constructor(e,t,i){super(),this.gl=e,this.verticesRaw=t,this.indices=i}setProgram(e){this.program=e}init(){if(!this.program)return;const e=this.gl;if(!this.verticesRaw||this.verticesRaw.length===0){console.warn("Mesh3D: verticesRaw が空です");return}const t=this.verticesRaw[0].uv!==void 0,i=3,o=t?2:0,a=4,s=i+o,c=s*a,l=this.verticesRaw.flatMap(d=>t?[...d.pos,...d.uv]:[...d.pos]),f=new Float32Array(l);this.vertexCount=f.length/s,this.vao=e.createVertexArray(),this.vbo=e.createBuffer(),this.ibo=null,e.bindVertexArray(this.vao),e.bindBuffer(e.ARRAY_BUFFER,this.vbo),e.bufferData(e.ARRAY_BUFFER,f,e.STATIC_DRAW);let u=0;const E=e.getAttribLocation(this.program.program,"aPosition");if(E>=0&&(e.enableVertexAttribArray(E),e.vertexAttribPointer(E,i,e.FLOAT,!1,c,u)),u+=i*a,t){const d=e.getAttribLocation(this.program.program,"aTexCoord");d>=0&&(e.enableVertexAttribArray(d),e.vertexAttribPointer(d,o,e.FLOAT,!1,c,u)),u+=o*a}this.indices&&this.indices.length>0&&(this.ibo=e.createBuffer(),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,this.ibo),e.bufferData(e.ELEMENT_ARRAY_BUFFER,new Uint16Array(this.indices),e.STATIC_DRAW),this.indexCount=this.indices.length),e.bindVertexArray(null)}uploadModelMatrix(){if(!this.program)return;const e=this.gl;this.transform.updateMatrix();const t=this.program.uniforms.get("uModelMat");t&&e.uniformMatrix4fv(t,!1,this.transform.modelMatrix)}update(){this.transform.updateMatrix()}draw(){const e=this.gl;this.vao&&(this.uploadModelMatrix(),e.bindVertexArray(this.vao),this.ibo&&this.indexCount>0?e.drawElements(e.TRIANGLES,this.indexCount,e.UNSIGNED_SHORT,0):this.vertexCount>0&&e.drawArrays(e.TRIANGLES,0,this.vertexCount),e.bindVertexArray(null))}}class Ne extends Ce{constructor(e){const t=[{pos:[-.5,-.5,0],uv:[0,0]},{pos:[.5,-.5,0],uv:[1,0]},{pos:[.5,.5,0],uv:[1,1]},{pos:[-.5,.5,0],uv:[0,1]}],i=[0,1,2,0,2,3];super(e,t,i)}}class Be extends Lr{fov;aspect;near;far;yaw;pitch;viewMatrix;projectionMatrix;program=null;gl;dt=0;constructor(e,t=Math.PI/4,i=1,o=.1,a=1e3,s=er(0,0,5),c=-Math.PI/2,l=0){super(),this.gl=e,this.fov=t,this.aspect=i,this.near=o,this.far=a,this.viewMatrix=V(),this.projectionMatrix=V(),Pr(this.transform.position,s),this.yaw=c,this.pitch=l,this.updateMatrices()}setProgram(e){this.program=e}move(e){this.transform.translate(e),this.updateMatrices()}rotate(e,t){this.yaw+=e,this.pitch+=t;const i=Math.PI/2-.01;this.pitch>i&&(this.pitch=i),this.pitch<-i&&(this.pitch=-i),this.updateMatrices()}setAspect(e){this.aspect=e,this.updateMatrices()}updateMatrices(){const e=H(),t=H();sr(e,[0,1,0],this.yaw),sr(t,[1,0,0],this.pitch);const i=H();Ue(i,e,t),Me(this.transform.rotation,i),this.transform.updateMatrix(),me(this.viewMatrix,this.transform.modelMatrix),Re(this.projectionMatrix,this.fov,this.aspect,this.near,this.far)}updateShaderUniforms(){if(!this.program)return;const e=this.program.uniforms.get("uViewMat"),t=this.program.uniforms.get("uProjectionMat");if(!e||!t)throw new Error("Camera のプログラムが不正です.");this.gl.uniformMatrix4fv(e,!1,this.viewMatrix),this.gl.uniformMatrix4fv(t,!1,this.projectionMatrix)}update(e){this.dt=e,this.updateMatrices()}}const h=document.getElementById("canvas");if(!h)throw new Error("canvas が見つかりません");const{gl:n,ext:N}=Vr(h);let tr=performance.now(),P={SIM_RESOLUTION:256,DYE_RESOLUTION:1024,DENSITY_DISSIPATION:1,VELOCITY_DISSIPATION:.2,PRESSURE:.8,PRESSURE_ITERATIONS:20,CURL:30,PAUSED:!1,SPLAT_RADIUS:.25,SPLAT_FORCE:5e3,BACK_COLOR:{r:0,g:0,b:0}},U=D(n,n.VERTEX_SHADER,F("baseVert")),ze=D(n,n.FRAGMENT_SHADER,F("copy")),Oe=D(n,n.FRAGMENT_SHADER,F("clear")),Ie=D(n,n.FRAGMENT_SHADER,F("splat")),Xe=D(n,n.FRAGMENT_SHADER,F("color")),Ge=D(n,n.FRAGMENT_SHADER,F("advection"),N.supportLinearFiltering?null:["MANUAL_FILTERING"]),Ye=D(n,n.FRAGMENT_SHADER,F("divergence")),Ve=D(n,n.FRAGMENT_SHADER,F("curl")),He=D(n,n.FRAGMENT_SHADER,F("vorticity")),$e=D(n,n.FRAGMENT_SHADER,F("pressure")),We=D(n,n.FRAGMENT_SHADER,F("gradientSubtract")),L,v,mr,gr,X,je=D(n,n.FRAGMENT_SHADER,F("noise")),ur=new M(n,U,je),ar,qe=D(n,n.FRAGMENT_SHADER,F("curlNoise")),fr=new M(n,U,qe),pr,Ke=D(n,n.FRAGMENT_SHADER,F("physics")),rr=new M(n,U,Ke);const Sr=new M(n,U,ze),vr=new M(n,U,Oe),W=new M(n,U,Ie),Ar=new M(n,U,Xe);let ir=new M(n,U,Ve),I=new M(n,U,He),hr=new M(n,U,Ye),nr=new M(n,U,$e),or=new M(n,U,We),Y=new M(n,U,Ge),Qe=D(n,n.VERTEX_SHADER,F("sceneVert")),ke=D(n,n.FRAGMENT_SHADER,F("scene")),Ze=new M(n,Qe,ke),yr=new ve(Ze),Je=new Ne(n);yr.addObject(Je);if(!h)throw new Error("canvas が見つかりせん.");let rt=h.width/h.height,Cr=new Be(n,Math.PI/3,rt,.1,100,er(0,0,3),0,0);yr.setCamera(Cr);let $;function et(){n.bindFramebuffer(n.FRAMEBUFFER,$.fbo),n.viewport(0,0,$.width,$.height),n.clearColor(0,0,0,1),n.clear(n.COLOR_BUFFER_BIT),yr.render(),n.bindFramebuffer(n.FRAMEBUFFER,null)}const xr=new Wr(n,U,F("display"));xr.setKeywords([]);function Nr(){if(!h)throw new Error("canvas が見つかりません");let r=z(h.clientWidth),e=z(h.clientHeight);return h.width!=r||h.height!=e?(h.width=r,h.height=e,!0):!1}function z(r){let e=window.devicePixelRatio||1;return Math.floor(r*e)}function Br(){let r=Dr(P.SIM_RESOLUTION),e=Dr(P.DYE_RESOLUTION);const t=N.halfFloatTexType,i=N.formatRGBA,o=N.formatRG,a=N.formatR,s=N.supportLinearFiltering?n.LINEAR:n.NEAREST;if(n.disable(n.BLEND),!a||!o||!i)throw new Error("フォーマットが無効です.");L==null?L=dr(e.width,e.height,i.internalFormat,i.format,t,s):L=Fr(L,e.width,e.height,i.internalFormat,i.format,t,s),v==null?v=dr(r.width,r.height,o.internalFormat,o.format,t,s):v=Fr(v,r.width,r.height,o.internalFormat,o.format,t,s),mr=O(r.width,r.height,a.internalFormat,a.format,t,n.NEAREST),gr=O(r.width,r.height,a.internalFormat,a.format,t,n.NEAREST),X=dr(r.width,r.height,a.internalFormat,a.format,t,n.NEAREST),ar=O(r.width,r.height,a.internalFormat,a.format,t,s),pr=O(r.width,r.height,a.internalFormat,a.format,t,s),$=O(r.width,r.height,a.internalFormat,a.format,t,s)}function Dr(r){let e=n.drawingBufferWidth/n.drawingBufferHeight;e<1&&(e=1/e);let t=Math.round(r),i=Math.round(r*e);return n.drawingBufferWidth>n.drawingBufferHeight?{width:i,height:t}:{width:t,height:i}}function tt(r){let e=(r-tr)/1e3;return e=Math.min(e,.016666),tr=r,e}function O(r,e,t,i,o,a){n.activeTexture(n.TEXTURE0);let s=n.createTexture();n.bindTexture(n.TEXTURE_2D,s),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,a),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MAG_FILTER,a),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE),n.texImage2D(n.TEXTURE_2D,0,t,r,e,0,i,o,null);let c=n.createFramebuffer();n.bindFramebuffer(n.FRAMEBUFFER,c),n.framebufferTexture2D(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,s,0),n.viewport(0,0,r,e),n.clear(n.COLOR_BUFFER_BIT);let l=1/r,f=1/e;return{texture:s,fbo:c,width:r,height:e,texelSizeX:l,texelSizeY:f,attach(u){return n.activeTexture(n.TEXTURE0+u),n.bindTexture(n.TEXTURE_2D,s),u}}}function dr(r,e,t,i,o,a){let s=O(r,e,t,i,o,a),c=O(r,e,t,i,o,a);return{width:r,height:e,texelSizeX:s.texelSizeX,texelSizeY:s.texelSizeY,get read(){return s},set read(l){s=l},get write(){return c},set write(l){c=l},swap(){let l=s;s=c,c=l}}}function it(r,e,t,i,o,a,s){let c=O(e,t,i,o,a,s);Sr.bind();let l=Sr.uniforms.get("uTexture");if(l===void 0)throw new Error(" uTexture が未定義です");return n.uniform1i(l,r.attach(0)),b(c),c}function Fr(r,e,t,i,o,a,s){return r.width==e&&r.height==t||(r.read=it(r.read,e,t,i,o,a,s),r.write=O(e,t,i,o,a,s),r.width=e,r.height=t,r.texelSizeX=1/e,r.texelSizeY=1/t),r}function zr(r){const e=tt(r);Nr()&&Br(),nt(),P.PAUSED||lt(e),ut(null),requestAnimationFrame(zr)}let B=[];B.push(new Tr);let Er=[];function nt(){Er.length>0&&at(Er.pop()),B.forEach(r=>{r.moved&&(r.moved=!1,ot(r))})}function ot(r){let e=r.deltaX*P.SPLAT_FORCE,t=r.deltaY*P.SPLAT_FORCE;Or(r.texcoordX,r.texcoordY,e,t,r.color)}function at(r){if(r===void 0)throw new Error("amount が未定義です.");for(let e=0;e<r;e++){const t=Ir();t.r*=10,t.g*=10,t.b*=10;const i=Math.random(),o=Math.random(),a=1e3*(Math.random()-.5),s=1e3*(Math.random()-.5);Or(i,o,a,s,t)}}function Or(r,e,t,i,o){if(!h)throw new Error("canvas が見つかりせん.");W.bind();let a=W.uniforms.get("uTarget"),s=W.uniforms.get("aspectRatio"),c=W.uniforms.get("point"),l=W.uniforms.get("color"),f=W.uniforms.get("radius");if(a===void 0||s==null||c===void 0||l===void 0||f===void 0)throw new Error("splatProgram が不正です.");n.uniform1i(a,v.read.attach(0)),n.uniform1f(s,h.width/h.height),n.uniform2f(c,r,e),n.uniform3f(l,t,i,0),n.uniform1f(f,st(P.SPLAT_RADIUS/100)),b(v.write),v.swap(),n.uniform1i(a,L.read.attach(0)),n.uniform3f(l,o.r,o.g,o.b),b(L.write),L.swap()}function st(r){if(!h)throw new Error("canvas が見つかりせん.");let e=h.width/h.height;return e>1&&(r*=e),r}function Ir(){let r=ct(Math.random(),1,1);return r.r*=.15,r.g*=.15,r.b*=.15,r}function ct(r,e,t){let i,o,a,s,c,l,f,u;switch(s=Math.floor(r*6),c=r*6-s,l=t*(1-e),f=t*(1-c*e),u=t*(1-(1-c)*e),s%6){case 0:i=t,o=u,a=l;break;case 1:i=f,o=t,a=l;break;case 2:i=l,o=t,a=u;break;case 3:i=l,o=f,a=t;break;case 4:i=u,o=l,a=t;break;case 5:i=t,o=l,a=f;break;default:i=t,o=u,a=l;break}return{r:i,g:o,b:a}}function lt(r){n.disable(n.BLEND),Cr.setAspect($.width/$.height),et();function e(m){const p=m.uniforms.get("uObstacle");p&&n.uniform1i(p,$.attach(3))}ur.bind();let t=ur.uniforms.get("texelSize"),i=ur.uniforms.get("uTime");if(t===void 0||i===void 0)throw new Error("noiseProgram が不正です.");n.uniform2f(t,v.texelSizeX,v.texelSizeY),n.uniform1f(i,tr*.001),b(ar),fr.bind(),t=fr.uniforms.get("texelSize");let o=fr.uniforms.get("uNoise");if(t===void 0||o===void 0)throw new Error("curlNoiseProgram が不正です.");n.uniform2f(t,v.texelSizeX,v.texelSizeY),n.uniform1i(o,ar.attach(0)),b(pr),ir.bind(),t=ir.uniforms.get("texelSize");let a=ir.uniforms.get("uVelocity"),s=ir.uniforms.get("uCurlNoise");if(t===void 0||a===void 0||s===void 0)throw new Error("curlProgram が不正です.");n.uniform2f(t,v.texelSizeX,v.texelSizeY),n.uniform1i(a,v.read.attach(0)),n.uniform1i(s,pr.attach(1)),b(gr),I.bind(),t=I.uniforms.get("texelSize"),a=I.uniforms.get("uVelocity");let c=I.uniforms.get("uCurl"),l=I.uniforms.get("curl"),f=I.uniforms.get("dt");o=I.uniforms.get("uNoise");let u=I.uniforms.get("time");if(t===void 0||a===void 0||c===void 0||l===void 0||f===void 0||o===void 0||u===void 0)throw new Error("vorticityProgram が不正です.");n.uniform2f(t,v.texelSizeX,v.texelSizeY),n.uniform1i(a,v.read.attach(0)),n.uniform1i(c,gr.attach(1)),n.uniform1f(l,P.CURL),n.uniform1f(f,r),n.uniform1i(o,ar.attach(2)),n.uniform1f(u,tr*.001),b(v.write),v.swap(),rr.bind(),e(rr),a=rr.uniforms.get("uVelocity");let E=rr.uniforms.get("uGravity");if(f=rr.uniforms.get("dt"),a===void 0||E===void 0||f===void 0)throw new Error("physicsProgram が不正です");if(n.uniform1i(a,v.read.attach(0)),n.uniform2f(E,0,-15),n.uniform1f(f,r),b(v.write),v.swap(),hr.bind(),t=hr.uniforms.get("texelSize"),a=hr.uniforms.get("uVelocity"),t===void 0||a===void 0)throw new Error("divergenceProgram が不正です.");n.uniform2f(t,v.texelSizeX,v.texelSizeY),n.uniform1i(a,v.read.attach(0)),b(mr),vr.bind();let d=vr.uniforms.get("uTexture"),y=vr.uniforms.get("value");if(d===void 0||y===void 0)throw new Error("clearProgram が不正です.");n.uniform1i(d,X.read.attach(0)),n.uniform1f(y,P.PRESSURE),b(X.write),X.swap(),nr.bind(),t=nr.uniforms.get("texelSize");let w=nr.uniforms.get("uDivergence"),x=nr.uniforms.get("uPressure");if(t===void 0||w===void 0||x==null)throw new Error("pressureProgram が不正です.");n.uniform2f(t,v.texelSizeX,v.texelSizeY),n.uniform1i(w,mr.attach(0));for(let m=0;m<P.PRESSURE_ITERATIONS;m++)n.uniform1i(x,X.read.attach(1)),b(X.write),X.swap();if(or.bind(),t=or.uniforms.get("texelSize"),x=or.uniforms.get("uPressure"),a=or.uniforms.get("uVelocity"),t==null||x===void 0||a===void 0)throw new Error("gradientSubtractProgram が不正です.");n.uniform2f(t,v.texelSizeX,v.texelSizeY),n.uniform1i(x,X.read.attach(0)),n.uniform1i(a,v.read.attach(1)),b(v.write),v.swap(),Y.bind(),t=Y.uniforms.get("texelSize");let T=Y.uniforms.get("dyeTexelSize");a=Y.uniforms.get("uVelocity");let A=Y.uniforms.get("uSource");f=Y.uniforms.get("dt");let _=Y.uniforms.get("dissipation");if(t===void 0||a===void 0||A===void 0||f===void 0||_===void 0)throw new Error("advectionProgram が不正です.");if(!N.supportLinearFiltering&&T===void 0)throw new Error("dyeTexelSize uniform が見つかりません（MANUAL_FILTERING 有効時）");n.uniform2f(t,v.texelSizeX,v.texelSizeY),N.supportLinearFiltering||n.uniform2f(T,v.texelSizeX,v.texelSizeY);let g=v.read.attach(0);n.uniform1i(a,g),n.uniform1i(A,g),n.uniform1f(f,r),n.uniform1f(_,P.VELOCITY_DISSIPATION),b(v.write),v.swap(),N.supportLinearFiltering||n.uniform2f(T,L.texelSizeX,L.texelSizeY),n.uniform1i(a,v.read.attach(0)),n.uniform1i(A,L.read.attach(1)),n.uniform1f(_,P.DENSITY_DISSIPATION),b(L.write),L.swap()}function ut(r){n.blendFunc(n.ONE,n.ONE_MINUS_SRC_ALPHA),n.enable(n.BLEND),vt(r,ht(P.BACK_COLOR)),ft(r)}function ft(r){xr.bind();let e=xr.uniforms.get("uTexture");if(e===void 0)throw new Error("displayShader が不正です.");n.uniform1i(e,L.read.attach(0)),b(r)}function vt(r,e){Ar.bind();let t=Ar.uniforms.get("color");if(t==null)throw new Error("colorProgram が不正です.");n.uniform4f(t,e.r,e.g,e.b,1),b(r)}function ht(r){return{r:r.r/255,g:r.g/255,b:r.b/255}}const b=(n.bindBuffer(n.ARRAY_BUFFER,n.createBuffer()),n.bufferData(n.ARRAY_BUFFER,new Float32Array([-1,-1,-1,1,1,1,1,-1]),n.STATIC_DRAW),n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,n.createBuffer()),n.bufferData(n.ELEMENT_ARRAY_BUFFER,new Uint16Array([0,1,2,0,2,3]),n.STATIC_DRAW),n.vertexAttribPointer(0,2,n.FLOAT,!1,0,0),n.enableVertexAttribArray(0),(r,e=!1)=>{r==null?(n.viewport(0,0,n.drawingBufferWidth,n.drawingBufferHeight),n.bindFramebuffer(n.FRAMEBUFFER,null)):(n.viewport(0,0,r.width,r.height),n.bindFramebuffer(n.FRAMEBUFFER,r.fbo)),e&&(n.clearColor(0,0,0,1),n.clear(n.COLOR_BUFFER_BIT)),n.drawElements(n.TRIANGLES,6,n.UNSIGNED_SHORT,0)});window.addEventListener("load",()=>{Nr(),Br(),tr=performance.now(),requestAnimationFrame(zr),console.log("WebGL context:",n,N)});h.addEventListener("mousedown",r=>{let e=z(r.offsetX),t=z(r.offsetY),i=B.find(o=>o.id==-1);i==null&&(i=new Tr),Xr(i,-1,e,t)});h.addEventListener("mousemove",r=>{let e=B[0];if(!e.down)return;let t=z(r.offsetX),i=z(r.offsetY);Gr(e,t,i)});window.addEventListener("mouseup",()=>{Yr(B[0])});h.addEventListener("touchstart",r=>{r.preventDefault();const e=r.targetTouches;for(;e.length>=B.length;)B.push(new Tr);for(let t=0;t<e.length;t++){let i=z(e[t].pageX),o=z(e[t].pageY);Xr(B[t+1],e[t].identifier,i,o)}});h.addEventListener("touchmove",r=>{r.preventDefault();const e=r.targetTouches;for(let t=0;t<e.length;t++){let i=B[t+1];if(!i.down)continue;let o=z(e[t].pageX),a=z(e[t].pageY);Gr(i,o,a)}},!1);window.addEventListener("touchend",r=>{const e=r.changedTouches;for(let t=0;t<e.length;t++){let i=B.find(o=>o.id==e[t].identifier);i!=null&&Yr(i)}});window.addEventListener("keydown",r=>{r.code==="KeyP"&&(P.PAUSED=!P.PAUSED),r.key===" "&&Er.push(Math.random()*20+5)});function Xr(r,e,t,i){if(!h)throw new Error("canvas が見つかりません.");r.id=e,r.down=!0,r.moved=!1,r.texcoordX=t/h.width,r.texcoordY=1-i/h.height,r.prevTexcoordX=r.texcoordX,r.prevTexcoordY=r.texcoordY,r.deltaX=0,r.deltaY=0,r.color=Ir()}function Gr(r,e,t){if(!h)throw new Error("canvas が見つかりません.");r.prevTexcoordX=r.texcoordX,r.prevTexcoordY=r.texcoordY,r.texcoordX=e/h.width,r.texcoordY=1-t/h.height,r.deltaX=dt(r.texcoordX-r.prevTexcoordX),r.deltaY=mt(r.texcoordY-r.prevTexcoordY),r.moved=Math.abs(r.deltaX)>0||Math.abs(r.deltaY)>0}function Yr(r){r.down=!1}function dt(r){if(!h)throw new Error("canvas が見つかりません.");let e=h.width/h.height;return e<1&&(r*=e),r}function mt(r){if(!h)throw new Error("canvas が見つかりません.");let e=h.width/h.height;return e>1&&(r/=e),r}
