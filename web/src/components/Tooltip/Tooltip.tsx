import React from 'react'

// @ts-ignore
import TooltipTriangleOnTop from '../../images/tooltip-triangle-top.svg'
// @ts-ignore
import TooltipTriangleOnBottom from '../../images/tooltip-triangle-bottom.svg'
import './Tooltip.scss'

export type TooltipProps = {
  text: string
  top?: boolean
  noTriangle?: boolean
  allowWrapping?: boolean
  noTransition?: boolean
}

const Tooltip: React.FC<TooltipProps> = ({
  text,
  top,
  noTriangle,
  allowWrapping,
  noTransition,
}) => {
  return (
    <div
      className={`tooltip-wrapper ${top ? 'top' : ''} ${
        allowWrapping ? 'allow-wrapping' : ''
      } ${noTransition ? '' : 'with-transition'}`}
    >
      {!top && !noTriangle && (
        <img className="tooltip-triangle-on-top" src={TooltipTriangleOnTop} />
      )}
      {/* TODO: make this use Typography component */}
      <div className="tooltip-text-wrapper">{`${text}`}</div>
      {top && !noTriangle && (
        <img
          className="tooltip-triangle-on-bottom"
          src={TooltipTriangleOnBottom}
        />
      )}
    </div>
  )
}

export default Tooltip
