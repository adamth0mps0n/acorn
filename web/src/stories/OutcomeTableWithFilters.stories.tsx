import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import '../variables.scss'

import OutcomeTableWithFiltersComponent, {
  OutcomeTableWithFiltersProps,
} from '../components/OutcomeTableWithFilters/OutcomeTableWithFilters'
import { ComputedOutcome, ComputedScope, ComputedSimpleAchievementStatus, Profile } from '../types'
import testProfile from './testData/testProfile'
import { testBigOutcome } from './testData/testOutcomes'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Table View/OutcomeTableWithFilters',
  component: OutcomeTableWithFiltersComponent,
} as ComponentMeta<typeof OutcomeTableWithFiltersComponent>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof OutcomeTableWithFiltersComponent> = (args) => {
  return <OutcomeTableWithFiltersComponent {...args} />
}

export const OutcomeTableWithFilters = Template.bind({})

// 'single story hoist' (place the component at the 'top level' without nesting in the storybook menu)
OutcomeTableWithFilters.storyName = 'OutcomeTableWithFilters'
// More on args: https://storybook.js.org/docs/react/writing-stories/args
const args: OutcomeTableWithFiltersProps = {
  whoAmI: testProfile,
  projectMemberProfiles: [],
  computedOutcomesAsTree: [
    // a sample outcome
    testBigOutcome
  ],
  openExpandedView: function (headerHash: string): void {
    throw new Error('Function not implemented.')
  },
  tagList: []
}
OutcomeTableWithFilters.args = args
