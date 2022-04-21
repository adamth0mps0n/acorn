import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import '../variables.scss'

import {
  ComputedOutcome,
  ComputedScope,
  ComputedSimpleAchievementStatus,
} from '../types'
import EvRightColumn, {
  EvRightColumnProps,
} from '../components/ExpandedViewMode/EVRightColumn/EvRightColumn.component'

// More on args: https://storybook.js.org/docs/react/writing-stories/args

const sharedOutcomeProperties = {
  headerHash: '12344',
  content: 'test content',
  creatorAgentPubKey: 'creatoragentpubkey',
  editorAgentPubKey: 'editoryagentpubkey',
  timestampCreated: Date.now(),
  timestampUpdated: Date.now(),
  tags: [],
  description: 'test description',
  timeFrame: null, // { fromDate: Date.now(), toDate: Date.now() },
  isImported: false,
}

const noChildrenSmallOutcome: ComputedOutcome = {
  ...sharedOutcomeProperties,
  scope: { Small: 'Achieved' },
  computedScope: ComputedScope.Small,
  computedAchievementStatus: {
    uncertains: 0,
    smallsAchieved: 0,
    smallsTotal: 0,
    simple: ComputedSimpleAchievementStatus.NotAchieved,
  },
  children: [],
}

const noChildrenUncertainOutcome: ComputedOutcome = {
  ...sharedOutcomeProperties,
  scope: { Uncertain: 0 },
  computedScope: ComputedScope.Uncertain,
  computedAchievementStatus: {
    uncertains: 0,
    smallsAchieved: 0,
    smallsTotal: 0,
    simple: ComputedSimpleAchievementStatus.NotAchieved,
  },
  children: [],
}

const bigUncertainOutcome: ComputedOutcome = {
  ...sharedOutcomeProperties,
  scope: { Uncertain: 0 }, // ignored
  computedScope: ComputedScope.Uncertain,
  computedAchievementStatus: {
    uncertains: 2,
    smallsAchieved: 0,
    smallsTotal: 0,
    simple: ComputedSimpleAchievementStatus.NotAchieved,
  },
  // @ts-ignore
  children: [{}, {}],
}

const bigCertainOutcome: ComputedOutcome = {
  ...sharedOutcomeProperties,
  scope: { Uncertain: 0 }, // ignored
  computedScope: ComputedScope.Big,
  computedAchievementStatus: {
    uncertains: 0,
    smallsAchieved: 10,
    smallsTotal: 10,
    simple: ComputedSimpleAchievementStatus.Achieved,
  },
  // @ts-ignore
  children: [{}, {}],
}

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Expanded View/EvRightColumn',
  component: EvRightColumn,
} as ComponentMeta<typeof EvRightColumn>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof EvRightColumn> = (args) => {
  return <EvRightColumn {...args} />
}

export const NoChildrenSmall = Template.bind({})
NoChildrenSmall.args = {
  projectId: '124432',
  onClose: () => {},
  outcome: noChildrenSmallOutcome,
  activeAgentPubKey: '',
  outcomeHeaderHash: '',
  isEntryPoint: false,
  entryPointHeaderHash: '',
  projectMeta: undefined,
  updateOutcome: async () => {},
  updateProjectMeta: async () => {},
  createEntryPoint: async () => {},
  deleteEntryPoint: async () => {},
  onDeleteClick: async () => {},
} as EvRightColumnProps

export const NoChildrenUncertain = Template.bind({})
NoChildrenUncertain.args = {
  projectId: '124432',
  onClose: () => {},
  outcome: noChildrenUncertainOutcome,
  activeAgentPubKey: '',
  outcomeHeaderHash: '',
  isEntryPoint: false,
  entryPointHeaderHash: '',
  projectMeta: undefined,
  updateOutcome: async () => {},
  updateProjectMeta: async () => {},
  createEntryPoint: async () => {},
  deleteEntryPoint: async () => {},
  onDeleteClick: async () => {},
} as EvRightColumnProps

export const WithChildrenUncertain = Template.bind({})
WithChildrenUncertain.args = {
  projectId: '124432',
  onClose: () => {},
  outcome: bigUncertainOutcome,
  activeAgentPubKey: '',
  outcomeHeaderHash: '',
  isEntryPoint: false,
  entryPointHeaderHash: '',
  projectMeta: undefined,
  updateOutcome: async () => {},
  updateProjectMeta: async () => {},
  createEntryPoint: async () => {},
  deleteEntryPoint: async () => {},
  onDeleteClick: async () => {},
} as EvRightColumnProps

export const WithChildrenCertain = Template.bind({})
WithChildrenCertain.args = {
  projectId: '124432',
  onClose: () => {},
  outcome: bigCertainOutcome,
  activeAgentPubKey: '',
  outcomeHeaderHash: '',
  isEntryPoint: false,
  entryPointHeaderHash: '',
  projectMeta: undefined,
  updateOutcome: async () => {},
  updateProjectMeta: async () => {},
  createEntryPoint: async () => {},
  deleteEntryPoint: async () => {},
  onDeleteClick: async () => {},
} as EvRightColumnProps
