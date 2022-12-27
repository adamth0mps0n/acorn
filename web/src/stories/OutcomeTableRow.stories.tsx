import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import '../variables.scss'

import OutcomeTableRowComponent, {
  OutcomeTableRowProps,
} from '../components/OutcomeTableRow/OutcomeTableRow'
import { testBigAchievedOutcome } from './testData/testOutcomes'
import testTags from './testData/testTags'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Table View/OutcomeTableRow',
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
  projectTags: testTags,
  outcome: testBigAchievedOutcome,
  topPriorityOutcomes: [],
  presentMembers: [],
  filter: {},
  parentExpanded: true,
  indentationLevel: 0,
  openExpandedView: function (actionHash: string): void {
    throw new Error('Function not implemented.')
  },
  columnWidthPercentages: ['5rem', '45rem', '50%', '50%', '0'],
  goToOutcome: function (actionHash: string): void {
    throw new Error('Function not implemented.')
  },
}
OutcomeTableRow.args = args
