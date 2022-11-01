import draw from './draw'

export type drawRoundCornerRectangleInput = {
  ctx: CanvasRenderingContext2D
  xPosition: number
  yPosition: number
  width: number
  height: number
  radius: number
  color: string
  useStroke: boolean
  useDashedStroke: boolean
  strokeWidth?: number
  useBoxShadow: boolean
  useGlow: boolean
  glowBlur?: number
  glowColor?: string
}

export default function drawRoundCornerRectangle({
  ctx,
  xPosition,
  yPosition,
  width,
  height,
  radius,
  color,
  useStroke,
  useDashedStroke,
  strokeWidth,
  useBoxShadow,
  useGlow,
  glowBlur,
  glowColor,
}: drawRoundCornerRectangleInput) {
  draw(ctx, () => {
    const rightConnection = xPosition + width
    const bottomConnection = yPosition + height

    ctx.beginPath()

    if (useStroke) ctx.strokeStyle = color 
    else ctx.fillStyle = color

    // For In Breakdown Mode representation
    if (useDashedStroke) {
      ctx.setLineDash([10, 10])
      ctx.lineCap = 'round'
    }

    // outcome card box shadow
    if (useBoxShadow) {
      ctx.shadowColor = '#00000030'
      ctx.shadowBlur = 30
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 0
      if (useGlow) {
        ctx.shadowColor = glowColor
        ctx.shadowBlur = glowBlur || 60
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 0
      }
    }
    ctx.lineWidth = useStroke ? strokeWidth : 1
    ctx.moveTo(xPosition + radius, yPosition)
    ctx.lineTo(rightConnection - radius, yPosition)
    ctx.quadraticCurveTo(
      rightConnection,
      yPosition,
      rightConnection,
      yPosition + radius
    )
    ctx.lineTo(rightConnection, yPosition + height - radius)
    ctx.quadraticCurveTo(
      rightConnection,
      bottomConnection,
      rightConnection - radius,
      bottomConnection
    )
    ctx.lineTo(xPosition + radius, bottomConnection)
    ctx.quadraticCurveTo(
      xPosition,
      bottomConnection,
      xPosition,
      bottomConnection - radius
    )
    ctx.lineTo(xPosition, yPosition + radius)
    ctx.quadraticCurveTo(xPosition, yPosition, xPosition + radius, yPosition)

    if (useStroke) ctx.stroke()
    else ctx.fill()
  })
}
