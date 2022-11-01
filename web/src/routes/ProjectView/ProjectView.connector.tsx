import React from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { connect } from 'react-redux'

// data
import { fetchProjectMeta } from '../../redux/persistent/projects/project-meta/actions'
import { fetchEntryPoints } from '../../redux/persistent/projects/entry-points/actions'
import { fetchMembers } from '../../redux/persistent/projects/members/actions'
import {
  fetchOutcomes,
  updateOutcome,
} from '../../redux/persistent/projects/outcomes/actions'
import { fetchConnections } from '../../redux/persistent/projects/connections/actions'
import { fetchOutcomeMembers } from '../../redux/persistent/projects/outcome-members/actions'
import { fetchOutcomeComments } from '../../redux/persistent/projects/outcome-comments/actions'
import { fetchTags } from '../../redux/persistent/projects/tags/actions'
// ui
import { setActiveEntryPoints } from '../../redux/ephemeral/active-entry-points/actions'
import { setActiveProject } from '../../redux/ephemeral/active-project/actions'
import { closeOutcomeForm } from '../../redux/ephemeral/outcome-form/actions'
import { unselectAll } from '../../redux/ephemeral/selection/actions'
import {
  openExpandedView,
  closeExpandedView,
} from '../../redux/ephemeral/expanded-view/actions'
import {
  animatePanAndZoom,
  resetTranslateAndScale,
} from '../../redux/ephemeral/viewport/actions'
import { ENTRY_POINTS } from '../../searchParams'
import {
  triggerRealtimeInfoSignal,
  sendExitProjectSignal,
} from '../../redux/persistent/projects/realtime-info-signal/actions'
import ProjectsZomeApi from '../../api/projectsApi'
import { getAppWs } from '../../hcWebsockets'
import { cellIdFromString } from '../../utils'
import { RootState } from '../../redux/reducer'
import { CellIdString, ActionHashB64 } from '../../types/shared'
import { Outcome } from '../../types'
import ProjectViewInner, {
  ProjectViewInnerConnectorDispatchProps,
  ProjectViewInnerConnectorStateProps,
  ProjectViewInnerOwnProps,
} from './ProjectView.component'
import { triggerUpdateLayout } from '../../redux/ephemeral/layout/actions'

function mapStateToProps(
  state: RootState
): ProjectViewInnerConnectorStateProps {
  // could be null
  const expandedViewOutcomeActionHash = state.ui.expandedView.outcomeActionHash
  return {
    expandedViewOutcomeActionHash,
    activeAgentPubKey: state.agentAddress,
  }
}

function mapDispatchToProps(
  dispatch: any,
  ownProps: ProjectViewInnerOwnProps
): ProjectViewInnerConnectorDispatchProps {
  const { projectId: cellIdString } = ownProps
  const cellId = cellIdFromString(cellIdString)
  return {
    setActiveProject: (projectId: CellIdString) =>
      dispatch(setActiveProject(projectId)),
    setActiveEntryPoints: (entryPointActionHashes: ActionHashB64[]) =>
      dispatch(setActiveEntryPoints(entryPointActionHashes)),
    triggerUpdateLayout: (instant?: boolean) => {
      return dispatch(triggerUpdateLayout(instant))
    },
    resetProjectView: () => {
      // send this signal so peers know you left project
      dispatch(sendExitProjectSignal(cellIdString))
      dispatch(closeExpandedView())
      dispatch(closeOutcomeForm())
      dispatch(unselectAll())
      dispatch(resetTranslateAndScale())
    },
    openExpandedView: (actionHash: ActionHashB64) =>
      dispatch(openExpandedView(actionHash)),
    closeExpandedView: () => dispatch(closeExpandedView()),
    goInstantlyToOutcome: (outcomeActionHash: ActionHashB64) => {
      const adjustScale = false
      const instant = true
      return dispatch(animatePanAndZoom(outcomeActionHash, adjustScale, instant))
    },
    updateOutcome: async (outcome: Outcome, actionHash: ActionHashB64) => {
      const appWebsocket = await getAppWs()
      const projectsZomeApi = new ProjectsZomeApi(appWebsocket)
      const outcomeWireRecord = await projectsZomeApi.outcome.update(cellId, {
        entry: outcome,
        actionHash,
      })
      return dispatch(updateOutcome(cellIdString, outcomeWireRecord))
    },
    fetchProjectMeta: async () => {
      const appWebsocket = await getAppWs()
      const projectsZomeApi = new ProjectsZomeApi(appWebsocket)
      const projectMeta = await projectsZomeApi.projectMeta.fetchProjectMeta(
        cellId
      )
      // is not currently a layout affecting action
      return dispatch(fetchProjectMeta(cellIdString, projectMeta))
    },
    fetchEntryPoints: async () => {
      const appWebsocket = await getAppWs()
      const projectsZomeApi = new ProjectsZomeApi(appWebsocket)
      const entryPoints = await projectsZomeApi.entryPoint.fetch(cellId, {
        All: null,
      })
      // is not currently a layout affecting action
      return dispatch(fetchEntryPoints(cellIdString, entryPoints))
    },
    fetchMembers: async () => {
      const appWebsocket = await getAppWs()
      const projectsZomeApi = new ProjectsZomeApi(appWebsocket)
      const members = await projectsZomeApi.member.fetch(cellId)
      // is not currently a layout affecting action
      return dispatch(fetchMembers(cellIdString, members))
    },
    fetchOutcomes: async () => {
      const appWebsocket = await getAppWs()
      const projectsZomeApi = new ProjectsZomeApi(appWebsocket)
      const outcomes = await projectsZomeApi.outcome.fetch(cellId, {
        All: null,
      })
      const skipLayoutAnimation = true
      return dispatch(
        fetchOutcomes(cellIdString, outcomes, skipLayoutAnimation)
      )
    },
    fetchConnections: async () => {
      const appWebsocket = await getAppWs()
      const projectsZomeApi = new ProjectsZomeApi(appWebsocket)
      const connections = await projectsZomeApi.connection.fetch(cellId, {
        All: null,
      })
      const skipLayoutAnimation = true
      return dispatch(
        fetchConnections(cellIdString, connections, skipLayoutAnimation)
      )
    },
    fetchOutcomeMembers: async () => {
      const appWebsocket = await getAppWs()
      const projectsZomeApi = new ProjectsZomeApi(appWebsocket)
      const outcomeMembers = await projectsZomeApi.outcomeMember.fetch(cellId, {
        All: null,
      })
      const skipLayoutAnimation = true
      return dispatch(
        fetchOutcomeMembers(cellIdString, outcomeMembers, skipLayoutAnimation)
      )
    },
    // DEPRECATED
    // fetchOutcomeVotes: async () => {
    //   const appWebsocket = await getAppWs()
    //   const projectsZomeApi = new ProjectsZomeApi(appWebsocket)
    //   const outcomeVotes = await projectsZomeApi.outcomeVote.fetch(cellId, {
    //     All: null,
    //   })
    //   return dispatch(fetchOutcomeVotes(cellIdString, outcomeVotes))
    // },
    fetchOutcomeComments: async () => {
      const appWebsocket = await getAppWs()
      const projectsZomeApi = new ProjectsZomeApi(appWebsocket)
      const outcomeComments = await projectsZomeApi.outcomeComment.fetch(
        cellId,
        { All: null }
      )
      // is not currently a layout affecting action
      return dispatch(fetchOutcomeComments(cellIdString, outcomeComments))
    },
    fetchTags: async () => {
      const appWebsocket = await getAppWs()
      const projectsZomeApi = new ProjectsZomeApi(appWebsocket)
      const tags = await projectsZomeApi.tag.fetch(cellId, { All: null })
      const skipLayoutAnimation = true
      dispatch(fetchTags(cellIdString, tags, skipLayoutAnimation))
    },
    triggerRealtimeInfoSignal: () => dispatch(triggerRealtimeInfoSignal()),
  }
}

const ProjectView = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectViewInner)

function ProjectViewWrapper() {
  const { projectId } = useParams<{ projectId: CellIdString }>()
  const location = useLocation()
  let entryPointActionHashesRaw = new URLSearchParams(location.search).get(
    ENTRY_POINTS
  )
  let entryPointActionHashes = []
  if (entryPointActionHashesRaw) {
    entryPointActionHashes = entryPointActionHashesRaw.split(',')
  }
  return (
    <ProjectView
      projectId={projectId}
      entryPointActionHashes={entryPointActionHashes}
    />
  )
}

export default ProjectViewWrapper
