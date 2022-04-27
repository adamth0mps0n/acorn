import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import '../variables.scss'

import OutcomeTableRowComponent, {
  OutcomeTableRowProps,
} from '../components/OutcomeTableRow/OutcomeTableRow'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Example/OutcomeTableRow',
  component: OutcomeTableRowComponent,
} as ComponentMeta<typeof OutcomeTableRowComponent>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof OutcomeTableRowComponent> = (args) => {
  return <OutcomeTableRowComponent {...args} />
}

export const OutcomeTableRow = Template.bind({})

// 'single story hoist' (place the component at the 'top level' without nesting in the storybook menu)
OutcomeTableRow.storyName = 'OutcomeTableRow'
// More on args: https://storybook.js.org/docs/react/writing-stories/args
const args: OutcomeTableRowProps = {
  // assign props here
}
OutcomeTableRow.args = args
