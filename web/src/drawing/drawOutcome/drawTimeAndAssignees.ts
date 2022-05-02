import moment from 'moment'
import { Profile } from '../../types'
import draw from '../draw'
import drawAvatar from './drawAvatar'

/*
  Assignees
*/

const drawAssignees = ({
  members,
  xRightPosition,
  yPosition,
  avatarInitialsTextColor,
  avatarStrokeColor,
  avatarSize,
  avatarSpace,
  ctx,
}: {
  members: Profile[]
  xRightPosition: number
  yPosition: number
  avatarInitialsTextColor: string
  avatarStrokeColor: string
  avatarSize: number
  avatarSpace: number
  ctx: CanvasRenderingContext2D
}) => {
  if (members.length === 0) {
    return 0 // height
  }

  draw(ctx, () => {
    // draw members avatars
    members.forEach((member, index) => {
      // defensive coding
      if (!member) return

      // adjust the x position according to the index of this member
      // since there can be many
      const xPosition =
        xRightPosition - (index + 1) * avatarSize - index * avatarSpace
      drawAvatar({
        width: avatarSize,
        height: avatarSize,
        member,
        ctx,
        xPosition,
        yPosition,
        textColor: avatarInitialsTextColor,
        strokeColor: avatarStrokeColor,
      })
    })
  })
  return avatarSize
}

/*
  Time
*/

const drawTime = ({
  xPosition,
  yPosition,
  fromDate,
  toDate,
  color,
  fontSizeRem,
  fontFamily,
  ctx,
}: {
  xPosition: number
  yPosition: number
  fromDate?: number // f64
  toDate: number // f64
  color: string
  fontSizeRem: number
  fontFamily: string
  ctx: CanvasRenderingContext2D
}) => {
  let height: number = 0
  if (toDate) {
    draw(ctx, () => {
      // const img = getOrSetImageForUrl('', CALENDAR_WIDTH, CALENDAR_HEIGHT)
      // wait for the image to load before
      // trying to draw
      // if (!img) return
      // image will draw, so calculate where to put it
      // and the text
      // TODO: de-hardcode these values
      let text = fromDate
        ? String(moment.unix(fromDate).format('MMM D, YYYY - '))
        : ''
      text += toDate ? String(moment.unix(toDate).format('MMM D, YYYY')) : ''
      // ctx.drawImage(img, xPosition, yPosition, CALENDAR_WIDTH, CALENDAR_HEIGHT)
      ctx.fillStyle = color
      ctx.font = `${fontSizeRem}rem ${fontFamily}`
      ctx.textBaseline = 'top'

      let measurements = ctx.measureText(
        'the text doesnt matter here to measure height'
      )
      // help from https://stackoverflow.com/questions/1134586/how-can-you-find-the-height-of-text-on-an-html-canvas
      height =
        measurements.actualBoundingBoxAscent +
        measurements.actualBoundingBoxDescent

      // margin top fpr date line to center
      // with avatars list
      const drawAtY = yPosition + 6
      ctx.fillText(text, xPosition, drawAtY)
    })
  }
  return height
}

/*
  Time and Assignees, rendered
  in a row with each other
*/

const drawTimeAndAssignees = ({
  // assignees
  members,
  assigneesXRightPosition,
  yPosition,
  avatarSize,
  avatarSpace,
  avatarInitialsTextColor,
  avatarStrokeColor,
  // time
  timeXLeftPosition,
  fromDate,
  toDate,
  timeTextColor,
  timeFontSizeRem,
  timeFontFamily,
  ctx,
}: {
  // assignees
  members: Profile[]
  assigneesXRightPosition: number
  yPosition: number
  avatarSize: number
  avatarSpace: number
  avatarInitialsTextColor: string
  avatarStrokeColor: string
  // time
  timeXLeftPosition: number
  fromDate?: number // f64 date value
  toDate: number // f64 date value
  timeTextColor: string
  timeFontSizeRem: number
  timeFontFamily: string
  ctx: CanvasRenderingContext2D
}): number => {
  let assigneesHeight: number = 0
  let timeHeight: number = 0
  draw(ctx, () => {
    assigneesHeight = drawAssignees({
      ctx,
      members,
      xRightPosition: assigneesXRightPosition,
      yPosition,
      avatarSize,
      avatarSpace,
      avatarInitialsTextColor,
      avatarStrokeColor,
    })
    timeHeight = drawTime({
      ctx,
      xPosition: timeXLeftPosition,
      yPosition,
      fromDate,
      toDate,
      fontFamily: timeFontFamily,
      fontSizeRem: timeFontSizeRem,
      color: timeTextColor,
    })
  })
  // take whichever height is greater
  return Math.max(assigneesHeight, timeHeight)
}
export default drawTimeAndAssignees
