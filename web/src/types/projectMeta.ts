import { EntryPoint } from './entryPoint'
import { Outcome } from './outcome'
import { Profile } from './profile'
import {
  AgentPubKeyB64,
  ActionHashB64,
  Option,
  CellIdString,
  WithActionHash,
} from './shared'

export type ProjectAggregated = WithActionHash<ProjectMeta> & {
  cellId: CellIdString
  presentMembers: AgentPubKeyB64[]
  members: Profile[]
  entryPoints: {
    entryPoint: WithActionHash<EntryPoint>
    outcome: WithActionHash<Outcome>
  }[]
}

export interface ProjectMeta {
  creatorAgentPubKey: AgentPubKeyB64
  createdAt: number // f64
  name: string
  image: Option<string>
  passphrase: string
  isImported: boolean
  topPriorityOutcomes: Array<ActionHashB64>
  isMigrated: Option<string>
}
