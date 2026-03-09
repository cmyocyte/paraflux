"use client"

import dynamic from "next/dynamic"

const ShaderAnimation = dynamic(
  () =>
    import("@/components/ui/shader-animation").then((m) => m.ShaderAnimation),
  { ssr: false }
)

export function HeroShader() {
  return <ShaderAnimation />
}
