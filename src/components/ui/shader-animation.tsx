"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export function ShaderAnimation() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mouseRef = useRef({ x: 0.5, y: 0.5 })
  const sceneRef = useRef<{
    camera: THREE.Camera
    scene: THREE.Scene
    renderer: THREE.WebGLRenderer
    uniforms: Record<string, THREE.IUniform>
    animationId: number
  } | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current

    const vertexShader = `
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `

    const fragmentShader = `
      precision highp float;
      uniform vec2 resolution;
      uniform float time;
      uniform vec2 mouse;

      // Simplex-style noise for organic flow
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                           -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy));
        vec2 x0 = v - i + dot(i, C.xx);
        vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                                    + i.x + vec3(0.0, i1.x, 1.0));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
                                dot(x12.zw,x12.zw)), 0.0);
        m = m * m;
        m = m * m;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
        vec3 g;
        g.x = a0.x * x0.x + h.x * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      float fbm(vec2 p) {
        float val = 0.0;
        float amp = 0.5;
        for (int i = 0; i < 4; i++) {
          val += amp * snoise(p);
          p *= 2.0;
          amp *= 0.5;
        }
        return val;
      }

      void main(void) {
        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
        float t = time * 0.02;

        // Mouse influence (smoothed)
        vec2 m = (mouse * 2.0 - 1.0) * 0.3;

        // Color palette — richer than single green
        vec3 green1 = vec3(0.133, 0.773, 0.369);   // #22c55e  bright green
        vec3 green2 = vec3(0.05, 0.55, 0.35);       // teal-green
        vec3 green3 = vec3(0.08, 0.3, 0.15);        // deep emerald
        vec3 dim    = vec3(0.03, 0.12, 0.05);        // dark base

        vec3 color = vec3(0.0);

        // === Layer 1: Subtle background glow ===
        float n1 = fbm(uv * 0.8 + vec2(t * 0.3, t * 0.2));
        color += green3 * smoothstep(0.0, 0.8, n1 + 0.3) * 0.12;

        // === Layer 2: Parabolic curves — clean, mathematical ===
        // Back layer — 5 widely spaced curves
        for (int i = -2; i <= 2; i++) {
          float fi = float(i);
          float shift = fi * 0.45 + sin(t * 1.5 + fi * 0.6) * 0.1;
          float scale = 0.7 + sin(t * 0.8 + fi * 0.4) * 0.1;
          float curve = (uv.x + m.x * 0.5) * (uv.x + m.x * 0.5) * scale + shift - uv.y;
          float glow = 0.003 / (abs(curve) + 0.003);
          float fade = exp(-dot(uv, uv) * 0.25);
          color += green2 * glow * fade * 0.35;
        }

        // Front layer — 7 curves, wider spacing, mouse-reactive
        for (int i = -3; i <= 3; i++) {
          float fi = float(i);
          float shift = fi * 0.35 + sin(t * 3.0 + fi * 0.9) * 0.05;
          float scale = 0.95 + sin(t * 1.2 + fi * 0.5) * 0.12;

          // Mouse displaces the curves
          vec2 p = uv - m * 0.4;
          float curve = p.x * p.x * scale + shift - p.y;
          float glow = 0.002 / (abs(curve) + 0.002);
          float fade = exp(-dot(uv, uv) * 0.3);

          // Color varies per curve
          vec3 curveColor = mix(green1, green2, sin(fi * 0.7 + t) * 0.5 + 0.5);
          color += curveColor * glow * fade * 0.45;
        }

        // === Layer 3: Sparkle particles along curves ===
        for (int i = 0; i < 20; i++) {
          float fi = float(i);
          float px = sin(fi * 1.618 + t * (0.5 + fi * 0.05)) * 1.2;
          float py = px * px * 0.9 + sin(fi * 2.3 + t * 0.8) * 0.15;
          vec2 pp = vec2(px, py);
          float dist = length(uv - pp);

          // Twinkle
          float twinkle = sin(fi * 7.13 + time * (1.0 + fi * 0.2)) * 0.5 + 0.5;
          twinkle = twinkle * twinkle;

          float sparkle = 0.0008 / (dist * dist + 0.0008);
          sparkle *= twinkle;
          sparkle *= exp(-dot(pp, pp) * 0.4);

          color += green1 * sparkle * 0.15;
        }

        // === Layer 4: Quadratic rings with depth ===
        float r = length(uv - m * 0.2);
        for (int i = 1; i <= 6; i++) {
          float fi = float(i);
          float radius = fi * fi * 0.06 + sin(t * 1.2 + fi * 1.8) * 0.025;
          float ring = 0.0012 / (abs(r - radius) + 0.0012);

          // Rings pulse in opacity
          float pulse = sin(t * 2.0 + fi * 1.2) * 0.3 + 0.7;
          vec3 ringColor = mix(dim, green3, smoothstep(0.3, 0.8, fi / 6.0));
          color += ringColor * ring * 0.4 * pulse;
        }

        // === Layer 5: Flowing energy waves ===
        for (int i = 0; i < 4; i++) {
          float fi = float(i);
          float angle = t * 0.25 + fi * 1.571;
          vec2 dir = vec2(cos(angle), sin(angle));
          float d = dot(uv - m * 0.15, dir);

          // Quadratic frequency — accelerates outward
          float wave = sin(d * d * 5.0 - time * 0.15 + fi * 1.5) * 0.5 + 0.5;
          wave *= exp(-abs(d) * 1.8);

          wave *= 0.8;
          color += dim * wave * 0.12;
        }

        // === Central mouse-reactive glow ===
        vec2 glowCenter = m * 0.3;
        float centerDist = length(uv - glowCenter);
        color += green1 * exp(-centerDist * centerDist * 3.0) * 0.08;
        color += green2 * exp(-centerDist * centerDist * 1.0) * 0.04;

        // === Clean grid ===
        vec2 gridUv = uv * 3.0;
        float gridX = smoothstep(0.97, 1.0, abs(sin(gridUv.x * 3.14159)));
        float gridY = smoothstep(0.97, 1.0, abs(sin(gridUv.y * 3.14159)));
        float grid = max(gridX, gridY);
        color += dim * grid * 0.06 * exp(-dot(uv, uv) * 0.5);

        // Vignette
        color *= 1.0 - smoothstep(0.6, 2.5, r);

        // Subtle tone mapping to prevent clipping
        color = color / (color + 0.8) * 1.2;

        gl_FragColor = vec4(color, 1.0);
      }
    `

    const camera = new THREE.Camera()
    camera.position.z = 1

    const scene = new THREE.Scene()
    const geometry = new THREE.PlaneGeometry(2, 2)

    const uniforms: Record<string, THREE.IUniform> = {
      time: { value: 1.0 },
      resolution: { value: new THREE.Vector2() },
      mouse: { value: new THREE.Vector2(0.5, 0.5) },
    }

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
    })

    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    container.appendChild(renderer.domElement)

    const onWindowResize = () => {
      const width = container.clientWidth
      const height = container.clientHeight
      renderer.setSize(width, height)
      uniforms.resolution.value.x = renderer.domElement.width
      uniforms.resolution.value.y = renderer.domElement.height
    }

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX / window.innerWidth
      mouseRef.current.y = 1.0 - e.clientY / window.innerHeight
    }

    onWindowResize()
    window.addEventListener("resize", onWindowResize, false)
    window.addEventListener("mousemove", onMouseMove, false)

    // Smooth mouse tracking
    const smoothMouse = { x: 0.5, y: 0.5 }

    const animate = () => {
      const animationId = requestAnimationFrame(animate)
      uniforms.time.value += 0.05

      // Lerp mouse for smooth following
      smoothMouse.x += (mouseRef.current.x - smoothMouse.x) * 0.03
      smoothMouse.y += (mouseRef.current.y - smoothMouse.y) * 0.03
      ;(uniforms.mouse.value as THREE.Vector2).set(smoothMouse.x, smoothMouse.y)

      renderer.render(scene, camera)

      if (sceneRef.current) {
        sceneRef.current.animationId = animationId
      }
    }

    sceneRef.current = {
      camera,
      scene,
      renderer,
      uniforms,
      animationId: 0,
    }

    animate()

    return () => {
      window.removeEventListener("resize", onWindowResize)
      window.removeEventListener("mousemove", onMouseMove)

      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId)

        if (container && sceneRef.current.renderer.domElement) {
          container.removeChild(sceneRef.current.renderer.domElement)
        }

        sceneRef.current.renderer.dispose()
        geometry.dispose()
        material.dispose()
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{
        background: "#000",
        overflow: "hidden",
      }}
    />
  )
}
