<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)
let cleanup: (() => void) | null = null

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  let W = 0, H = 0, dpr = 1
  let animId = 0, running = true

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2)
    const rect = canvas.getBoundingClientRect()
    W = canvas.width = rect.width * dpr
    H = canvas.height = rect.height * dpr
  }
  resize()
  window.addEventListener('resize', resize, { passive: true })

  // ═══════════════════════════════════════════
  //  BEAM SYSTEM — 3 layers for depth
  // ═══════════════════════════════════════════

  // Layer 1: Background ambient beams (wide, slow, dim)
  const ambientBeams = [
    { x: 0.05, angle: 33, width: 0.12, length: 1.8, speed: 0.25, baseAlpha: 0.06, hue: 220, sat: 60 },
    { x: 0.30, angle: 30, width: 0.10, length: 1.6, speed: 0.20, baseAlpha: 0.05, hue: 215, sat: 55 },
    { x: 0.55, angle: 35, width: 0.14, length: 1.9, speed: 0.30, baseAlpha: 0.07, hue: 225, sat: 65 },
    { x: 0.80, angle: 32, width: 0.11, length: 1.7, speed: 0.22, baseAlpha: 0.05, hue: 210, sat: 58 },
  ]

  // Layer 2: Main visible beams (medium width, moderate speed)
  const mainBeams = [
    { x: 0.12, angle: 34, width: 0.065, length: 1.55, speed: 0.45, baseAlpha: 0.14, hue: 217, sat: 80 },
    { x: 0.28, angle: 31, width: 0.055, length: 1.42, speed: 0.55, baseAlpha: 0.11, hue: 222, sat: 72 },
    { x: 0.42, angle: 36, width: 0.075, length: 1.60, speed: 0.50, baseAlpha: 0.16, hue: 212, sat: 82 },
    { x: 0.56, angle: 33, width: 0.058, length: 1.48, speed: 0.60, baseAlpha: 0.12, hue: 218, sat: 76 },
    { x: 0.68, angle: 37, width: 0.068, length: 1.52, speed: 0.40, baseAlpha: 0.15, hue: 214, sat: 78 },
    { x: 0.82, angle: 30, width: 0.072, length: 1.65, speed: 0.48, baseAlpha: 0.13, hue: 225, sat: 70 },
    { x: 0.92, angle: 35, width: 0.050, length: 1.38, speed: 0.65, baseAlpha: 0.10, hue: 208, sat: 75 },
    { x: 0.38, angle: 29, width: 0.045, length: 1.75, speed: 0.35, baseAlpha: 0.09, hue: 220, sat: 68 },
  ]

  // Layer 3: Bright "shooting" light streaks (narrow, fast, high contrast)
  const streaks = [
    { x: 0.18, angle: 32, width: 0.018, length: 1.70, speed: 0.80, baseAlpha: 0.50, hue: 200, sat: 90 },
    { x: 0.48, angle: 34, width: 0.015, length: 1.60, speed: 1.20, baseAlpha: 0.55, hue: 210, sat: 95 },
    { x: 0.72, angle: 31, width: 0.020, length: 1.75, speed: 0.90, baseAlpha: 0.45, hue: 205, sat: 88 },
    { x: 0.88, angle: 36, width: 0.012, length: 1.55, speed: 1.50, baseAlpha: 0.60, hue: 215, sat: 92 },
  ]

  // Sparkle particles along beam paths
  const sparkles: { t: number; beamIdx: number; layer: string; offset: number; speed: number }[] = []
  for (let i = 0; i < 40; i++) {
    sparkles.push({
      t: Math.random(),
      beamIdx: Math.floor(Math.random() * 8),
      layer: Math.random() > 0.5 ? 'main' : 'streak',
      offset: (Math.random() - 0.5) * 20,
      speed: 0.003 + Math.random() * 0.008,
    })
  }

  let time = 0

  function drawBeamLayer(
    beams: typeof mainBeams,
    time: number,
    isStreak: boolean,
  ) {
    for (let b = 0; b < beams.length; b++) {
      const beam = beams[b]
      const startX = beam.x * W
      const startY = -0.10 * H
      const rad = (beam.angle * Math.PI) / 180
      const halfW = beam.width * W
      const len = beam.length * H

      // Dramatic oscillation + breathing
      const oscPhase = time * beam.speed + b * 2.3
      const breathPhase = time * beam.speed * 0.6 + b * 1.5

      const osc = Math.sin(oscPhase) * (isStreak ? 25 : 20)
      const breath = 0.45 + 0.55 * Math.sin(breathPhase) // 0.45 ~ 1.0 range
      const fadeAlpha = beam.baseAlpha * breath

      const endX = startX + Math.cos(rad) * len
      const endY = startY + Math.sin(rad) * len
      const px = Math.sin(rad)
      const py = -Math.cos(rad)

      // ── Outer glow ──
      const oGrad = ctx.createLinearGradient(
        startX + px * halfW, startY + py * halfW + osc,
        startX - px * halfW, startY - py * halfW + osc,
      )
      const { hue, sat } = beam

      if (isStreak) {
        // Streaks: sharper, brighter, more contrast
        oGrad.addColorStop(0, `hsla(${hue},${sat}%,85%,0)`)
        oGrad.addColorStop(0.15, `hsla(${hue},${sat}%,75%,${fadeAlpha * 0.15})`)
        oGrad.addColorStop(0.35, `hsla(${hue},${sat}%,60%,${fadeAlpha * 0.7})`)
        oGrad.addColorStop(0.50, `hsla(${hue},${sat}%,50%,${fadeAlpha})`)
        oGrad.addColorStop(0.65, `hsla(${hue},${sat}%,60%,${fadeAlpha * 0.6})`)
        oGrad.addColorStop(0.85, `hsla(${hue},${sat}%,80%,${fadeAlpha * 0.1})`)
        oGrad.addColorStop(1, `hsla(${hue},${sat}%,90%,0)`)
      } else {
        // Main beams: soft and wide
        oGrad.addColorStop(0, `hsla(${hue},${sat}%,78%,0)`)
        oGrad.addColorStop(0.12, `hsla(${hue},${sat}%,68%,${fadeAlpha * 0.2})`)
        oGrad.addColorStop(0.35, `hsla(${hue},${sat}%,55%,${fadeAlpha * 0.85})`)
        oGrad.addColorStop(0.50, `hsla(${hue},${sat}%,48%,${fadeAlpha})`)
        oGrad.addColorStop(0.65, `hsla(${hue},${sat}%,55%,${fadeAlpha * 0.75})`)
        oGrad.addColorStop(0.88, `hsla(${hue},${sat}%,70%,${fadeAlpha * 0.18})`)
        oGrad.addColorStop(1, `hsla(${hue},${sat}%,82%,0)`)
      }

      ctx.beginPath()
      ctx.moveTo(startX + px * halfW, startY + py * halfW + osc)
      ctx.lineTo(endX + px * halfW * 0.22, endY + py * halfW * 0.22 + osc)
      ctx.lineTo(endX - px * halfW * 0.22, endY - py * halfW * 0.22 + osc)
      ctx.lineTo(startX - px * halfW, startY - py * halfW + osc)
      ctx.closePath()
      ctx.fillStyle = oGrad
      ctx.fill()

      // ── Bright core ──
      const coreW = halfW * (isStreak ? 0.08 : 0.12)
      const cGrad = ctx.createLinearGradient(
        startX + px * coreW, startY + py * coreW + osc,
        startX - px * coreW, startY - py * coreW + osc,
      )
      cGrad.addColorStop(0, 'rgba(255,255,255,0)')
      cGrad.addColorStop(0.2, `rgba(255,255,255,${fadeAlpha * (isStreak ? 0.45 : 0.35)})`)
      cGrad.addColorStop(0.5, `rgba(255,255,255,${fadeAlpha * (isStreak ? 0.85 : 0.65)})`)
      cGrad.addColorStop(0.8, `rgba(255,255,255,${fadeAlpha * (isStreak ? 0.35 : 0.25)})`)
      cGrad.addColorStop(1, 'rgba(255,255,255,0)')

      ctx.beginPath()
      ctx.moveTo(startX + px * coreW, startY + py * coreW + osc)
      ctx.lineTo(endX + px * coreW * 0.15, endY + py * coreW * 0.15 + osc)
      ctx.lineTo(endX - px * coreW * 0.15, endY - py * coreW * 0.15 + osc)
      ctx.lineTo(startX - px * coreW, startY - py * coreW + osc)
      ctx.closePath()
      ctx.fillStyle = cGrad
      ctx.fill()
    }
  }

  function drawSparkles() {
    for (const s of sparkles) {
      s.t += s.speed
      if (s.t > 1) s.t = 0

      const beamArr = s.layer === 'streak' ? streaks : mainBeams
      const beam = beamArr[s.beamIdx % beamArr.length]
      const startX = beam.x * W
      const startY = -0.10 * H
      const rad = (beam.angle * Math.PI) / 180
      const len = beam.length * H
      const osc = Math.sin(time * beam.speed + s.beamIdx * 2.3) * 20

      const sx = startX + Math.cos(rad) * len * s.t
      const sy = startY + Math.sin(rad) * len * s.t
      const px = Math.sin(rad), py = -Math.cos(rad)
      const sparkleX = sx + px * s.offset + osc * s.t
      const sparkleY = sy + py * s.offset

      const sz = (Math.sin(s.t * 15 + time * 3) + 1) * 2 + 0.5
      const alpha = (Math.sin(s.t * 12 + time * 2) + 1) * 0.35 * (1 - Math.abs(s.t - 0.5) * 2)

      ctx.beginPath()
      ctx.arc(sparkleX, sparkleY, sz, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(200, 230, 255, ${alpha})`
      ctx.fill()

      // Star cross sparkle effect
      if (alpha > 0.2) {
        const arm = sz * 3
        ctx.beginPath()
        ctx.moveTo(sparkleX - arm, sparkleY)
        ctx.lineTo(sparkleX + arm, sparkleY)
        ctx.moveTo(sparkleX, sparkleY - arm)
        ctx.lineTo(sparkleX, sparkleY + arm)
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.4})`
        ctx.lineWidth = 0.5
        ctx.stroke()
      }
    }
  }

  function draw() {
    if (!running) return
    ctx.clearRect(0, 0, W, H)

    // ── Background radial glow ──
    const ambGrad = ctx.createRadialGradient(W * 0.5, H * 0.18, 0, W * 0.5, H * 0.45, W * 0.85)
    ambGrad.addColorStop(0, 'rgba(175, 210, 255, 0.55)')
    ambGrad.addColorStop(0.25, 'rgba(205, 225, 255, 0.32)')
    ambGrad.addColorStop(0.50, 'rgba(225, 240, 255, 0.15)')
    ambGrad.addColorStop(0.75, 'rgba(240, 248, 255, 0.05)')
    ambGrad.addColorStop(1, 'rgba(255, 255, 255, 0)')
    ctx.fillStyle = ambGrad
    ctx.fillRect(0, 0, W, H)

    // ── Draw 3 layers ──
    drawBeamLayer(ambientBeams, time, false)
    drawBeamLayer(mainBeams, time, false)
    drawBeamLayer(streaks, time, true)

    // ── Sparkles along beams ──
    drawSparkles()

    // ── Floating ambient particles ──
    for (let i = 0; i < 35; i++) {
      const pX = (Math.sin(i * 1.91 + time * 0.18) * 0.5 + 0.5) * W
      const pY = (Math.cos(i * 2.53 + time * 0.14) * 0.38 + 0.28) * H
      const sz = (Math.sin(i * 3.41 + time * 0.7) + 1) * 2 + 0.5
      const alpha = (Math.sin(i * 5.17 + time * 0.8) + 1) * 0.18

      ctx.beginPath()
      ctx.arc(pX, pY, sz, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(180, 215, 255, ${alpha})`
      ctx.fill()
    }

    time += 0.020
    animId = requestAnimationFrame(draw)
  }

  draw()

  cleanup = () => {
    running = false
    window.removeEventListener('resize', resize)
    cancelAnimationFrame(animId)
  }
})

onUnmounted(() => {
  cleanup?.()
})
</script>

<template>
  <canvas
    ref="canvasRef"
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 0;"
  />
</template>
