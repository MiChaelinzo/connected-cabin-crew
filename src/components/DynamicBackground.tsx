import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  hue: number
}

interface TrailPoint {
  x: number
  y: number
  life: number
  size: number
}

export default function DynamicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const trailPointsRef = useRef<TrailPoint[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const animationFrameRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { willReadFrequently: false })
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const initParticles = () => {
      particlesRef.current = []
      const particleCount = Math.floor((canvas.width * canvas.height) / 15000)
      
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          life: Math.random() * 100,
          maxLife: 100,
          size: Math.random() * 2 + 0.5,
          hue: 200 + Math.random() * 40
        })
      }
    }
    initParticles()

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
      
      trailPointsRef.current.push({
        x: e.clientX,
        y: e.clientY,
        life: 1,
        size: 3
      })

      if (trailPointsRef.current.length > 50) {
        trailPointsRef.current.shift()
      }

      for (let i = 0; i < 2; i++) {
        particlesRef.current.push({
          x: e.clientX + (Math.random() - 0.5) * 20,
          y: e.clientY + (Math.random() - 0.5) * 20,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          life: 60,
          maxLife: 60,
          size: Math.random() * 3 + 1,
          hue: 140 + Math.random() * 30
        })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)

    const animate = () => {
      ctx.fillStyle = 'rgba(245, 245, 250, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      particlesRef.current = particlesRef.current.filter(p => {
        p.x += p.vx
        p.y += p.vy
        p.life -= 0.5

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1

        const alpha = p.life / p.maxLife
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue}, 60%, 60%, ${alpha * 0.6})`
        ctx.fill()

        return p.life > 0
      })

      trailPointsRef.current = trailPointsRef.current.filter(t => {
        t.life -= 0.02
        t.size *= 0.98

        const alpha = t.life
        ctx.beginPath()
        ctx.arc(t.x, t.y, t.size, 0, Math.PI * 2)
        
        const gradient = ctx.createRadialGradient(t.x, t.y, 0, t.x, t.y, t.size * 2)
        gradient.addColorStop(0, `hsla(145, 70%, 60%, ${alpha * 0.8})`)
        gradient.addColorStop(0.5, `hsla(160, 60%, 50%, ${alpha * 0.4})`)
        gradient.addColorStop(1, `hsla(180, 50%, 40%, 0)`)
        
        ctx.fillStyle = gradient
        ctx.fill()

        return t.life > 0
      })

      for (let i = 0; i < trailPointsRef.current.length - 1; i++) {
        const current = trailPointsRef.current[i]
        const next = trailPointsRef.current[i + 1]
        
        ctx.beginPath()
        ctx.moveTo(current.x, current.y)
        ctx.lineTo(next.x, next.y)
        ctx.strokeStyle = `hsla(145, 70%, 60%, ${current.life * 0.3})`
        ctx.lineWidth = current.size * 0.5
        ctx.stroke()
      }

      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const p1 = particlesRef.current[i]
          const p2 = particlesRef.current[j]
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 120) {
            const alpha = (1 - distance / 120) * 0.15 * (p1.life / p1.maxLife)
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `hsla(220, 50%, 50%, ${alpha})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', handleMouseMove)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ 
        mixBlendMode: 'normal',
        opacity: 0.6
      }}
    />
  )
}
