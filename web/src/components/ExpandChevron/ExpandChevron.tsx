import React from 'react'
import Icon from '../Icon/Icon'
import './ExpandChevron.scss'

export type ExpandChevronProps = {
  expanded?: boolean
  onClick: () => void
  size: 'small' | 'medium'
}

const ExpandChevron: React.FC<ExpandChevronProps> = ({
  expanded,
  onClick,
  size = 'medium',
}) => {
  return (
    // TODO: add size variations
    <div
      className={`expand-chevron-wrapper ${expanded ? 'expanded' : ''} ${
        size === 'small' ? 'small' : ''
      }`}
      onClick={onClick}
    >
      {/* @ts-ignore */}
      <Icon name="chevron-right.svg" size="small" className="light-grey" />
    </div>
  )
}

export default ExpandChevron
