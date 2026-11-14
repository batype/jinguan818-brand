'use strict'
;(() => {
  const canvas = document.getElementById('sculpture')
  const stage = document.querySelector('.hero-art')
  if (!canvas || !stage) return
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  let paused = reducedMotion.matches,
    visible = true,
    lost = false,
    frame = 0
  const pointer = { x: 0, y: 0 },
    target = { x: 0, y: 0 }
  const gl = canvas.getContext('webgl', {
    alpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: 'low-power',
    premultipliedAlpha: false,
  })
  const fallback = () => {
    stage.dataset.renderer = 'fallback'
  }
  if (!gl) {
    fallback()
    return
  }
  const vertex = 'attribute vec2 a_position; void main(){gl_Position=vec4(a_position,0.0,1.0);}'
  const fragment = `
    precision highp float;
    uniform vec2 u_resolution;
    uniform vec2 u_pointer;
    uniform float u_time;
    uniform float u_scroll;
    mat2 turn(float a){return mat2(cos(a),-sin(a),sin(a),cos(a));}
    float shape(vec3 p){
      p.xz=turn(0.3+u_pointer.x*0.3+u_time*0.075+u_scroll*0.45)*p.xz;
      p.yz=turn(1.13+u_pointer.y*0.22+sin(u_time*0.18)*0.065)*p.yz;
      float a=atan(p.z,p.x);
      vec2 q=vec2(length(p.xz)-1.12,p.y);
      q=turn(a*1.5+0.45)*q;
      vec2 d=abs(q)-vec2(0.13,0.23);
      return length(max(d,0.0))+min(max(d.x,d.y),0.0)-0.115;
    }
    vec3 normalAt(vec3 p){
      vec2 e=vec2(0.0012,0.0);
      return normalize(vec3(shape(p+e.xyy)-shape(p-e.xyy),shape(p+e.yxy)-shape(p-e.yxy),shape(p+e.yyx)-shape(p-e.yyx)));
    }
    vec3 studio(vec3 r){
      float a=pow(max(dot(r,normalize(vec3(-0.6,0.8,0.6))),0.0),12.0);
      float b=pow(max(dot(r,normalize(vec3(0.7,0.2,0.5))),0.0),22.0);
      float c=pow(max(dot(r,normalize(vec3(-0.5,-0.7,-0.3))),0.0),10.0);
      float strip=pow(1.0-abs(r.x*0.72+r.y*0.2-0.13),34.0)*smoothstep(-0.7,0.1,r.z);
      return vec3(0.025,0.022,0.018)+vec3(3.0,2.65,2.15)*a+vec3(1.5,1.55,1.6)*b+vec3(0.7,0.38,0.14)*c+vec3(1.5,1.3,1.0)*strip;
    }
    void main(){
      vec2 uv=(gl_FragCoord.xy*2.0-u_resolution)/u_resolution.y;
      vec3 ro=vec3(0.0,0.0,5.4);
      vec3 rd=normalize(vec3(uv,-2.9));
      float t=0.0; bool hit=false;
      for(int i=0;i<82;i++){
        float d=shape(ro+rd*t);
        if(d<0.0017){hit=true;break;}
        t+=d*0.8;
        if(t>8.0)break;
      }
      if(!hit){gl_FragColor=vec4(0.0);return;}
      vec3 p=ro+rd*t;
      vec3 n=normalAt(p), v=-rd;
      float ao=1.0;
      for(int i=1;i<=3;i++){
        float h=float(i)*0.085;
        ao-=(h-shape(p+n*h))*0.75;
      }
      ao=clamp(ao,0.35,1.0);
      vec3 reflection=studio(reflect(rd,n));
      float diffuse=max(dot(n,normalize(vec3(-0.4,0.8,0.7))),0.0);
      vec3 metal=vec3(0.86,0.73,0.55);
      float f=pow(1.0-max(dot(n,v),0.0),5.0);
      vec3 color=reflection*mix(metal,vec3(0.97),f)*0.88;
      color+=metal*(0.035+diffuse*0.12)*ao;
      color*=ao;
      color=color/(color+vec3(0.8));
      color=pow(color,vec3(0.4545));
      gl_FragColor=vec4(color,1.0);
    }
  `
  function shader(type, source) {
    const result = gl.createShader(type)
    gl.shaderSource(result, source)
    gl.compileShader(result)
    if (!gl.getShaderParameter(result, gl.COMPILE_STATUS)) {
      gl.deleteShader(result)
      throw new Error('visual shader unsupported')
    }
    return result
  }
  let program
  try {
    program = gl.createProgram()
    const vs = shader(gl.VERTEX_SHADER, vertex),
      fs = shader(gl.FRAGMENT_SHADER, fragment)
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
    gl.deleteShader(vs)
    gl.deleteShader(fs)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('visual link unsupported')
  } catch {
    fallback()
    return
  }
  gl.useProgram(program)
  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW,
  )
  const position = gl.getAttribLocation(program, 'a_position')
  gl.enableVertexAttribArray(position)
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)
  const uniforms = Object.fromEntries(
    ['resolution', 'pointer', 'time', 'scroll'].map((name) => [
      name,
      gl.getUniformLocation(program, 'u_' + name),
    ]),
  )
  let time = 0,
    last = 0,
    lastDraw = 0
  function resize() {
    const rect = canvas.getBoundingClientRect()
    const dpr = Math.min(devicePixelRatio || 1, 1.3)
    const scale = Math.min(dpr, Math.sqrt(720000 / Math.max(rect.width * rect.height, 1)))
    canvas.width = Math.max(1, Math.round(rect.width * scale))
    canvas.height = Math.max(1, Math.round(rect.height * scale))
    gl.viewport(0, 0, canvas.width, canvas.height)
    draw()
  }
  function draw() {
    if (lost) return
    gl.uniform2f(uniforms.resolution, canvas.width, canvas.height)
    gl.uniform2f(uniforms.pointer, pointer.x, pointer.y)
    gl.uniform1f(uniforms.time, time)
    gl.uniform1f(uniforms.scroll, Math.min(window.scrollY / Math.max(innerHeight, 1), 1))
    gl.drawArrays(gl.TRIANGLES, 0, 6)
    stage.dataset.renderer = 'webgl'
    canvas.dataset.frames = String(++frame)
  }
  let raf = 0
  function tick(now) {
    raf = 0
    if (paused || document.hidden || !visible || lost) {
      last = 0
      return
    }
    if (now - lastDraw > 32) {
      if (last) time += Math.min((now - last) / 1000, 0.1)
      last = now
      lastDraw = now
      pointer.x += (target.x - pointer.x) * 0.07
      pointer.y += (target.y - pointer.y) * 0.07
      draw()
    }
    raf = requestAnimationFrame(tick)
  }
  function schedule() {
    if (!raf && !paused && !document.hidden && visible && !lost) raf = requestAnimationFrame(tick)
  }
  window.companySculpture = {
    setPaused(value) {
      paused = value
      if (paused && raf) {
        cancelAnimationFrame(raf)
        raf = 0
        last = 0
      } else schedule()
    },
    getStatus() {
      return { paused, visible, renderer: stage.dataset.renderer, frames: frame }
    },
  }
  document.querySelector('.hero').addEventListener(
    'pointermove',
    (event) => {
      if (event.pointerType === 'touch') return
      const rect = document.querySelector('.hero').getBoundingClientRect()
      target.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      target.y = ((event.clientY - rect.top) / rect.height) * 2 - 1
    },
    { passive: true },
  )
  document.querySelector('.hero').addEventListener('pointerleave', () => {
    target.x = 0
    target.y = 0
  })
  document.addEventListener('visibilitychange', schedule)
  if ('IntersectionObserver' in window)
    new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting
      if (!visible && raf) {
        cancelAnimationFrame(raf)
        raf = 0
        last = 0
      }
      schedule()
    }).observe(document.querySelector('.hero'))
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(canvas)
  else window.addEventListener('resize', resize, { passive: true })
  canvas.addEventListener('webglcontextlost', (event) => {
    event.preventDefault()
    lost = true
    if (raf) cancelAnimationFrame(raf)
    fallback()
  })
  window.addEventListener('pagehide', () => {
    if (raf) cancelAnimationFrame(raf)
    last = 0
  })
  window.addEventListener('pageshow', schedule)
  resize()
  schedule()
})()
