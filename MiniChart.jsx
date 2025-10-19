import { useEffect, useRef } from 'react'

function MiniChart({ sparklineData, isPositive }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!sparklineData || sparklineData.length === 0) return
    
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    const width = canvas.width
    const height = canvas.height
    
    ctx.clearRect(0, 0, width, height)
    
    const data = sparklineData.slice(-50)
    const max = Math.max(...data)
    const min = Math.min(...data)
    const range = max - min || 1
    
    const xStep = width / (data.length - 1)
    
    ctx.beginPath()
    ctx.strokeStyle = isPositive ? '#10b981' : '#ef4444'
    ctx.lineWidth = 2
    
    data.forEach((value, index) => {
      const x = index * xStep
      const y = height - ((value - min) / range) * height
      
      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    
    ctx.stroke()
    
    ctx.lineTo(width, height)
    ctx.lineTo(0, height)
    ctx.closePath()
    
    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, isPositive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)')
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
    
    ctx.fillStyle = gradient
    ctx.fill()
  }, [sparklineData, isPositive])

  return (
    <canvas 
      ref={canvasRef} 
      width={300} 
      height={80}
      className="w-full h-full"
    />
  )
}

export default MiniChart
