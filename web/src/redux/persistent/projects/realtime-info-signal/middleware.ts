import {
  OPEN_EXPANDED_VIEW,
  CLOSE_EXPANDED_VIEW,
} from '../../../ephemeral/expanded-view/actions'
import {
  START_TITLE_EDIT,
  END_TITLE_EDIT,
  START_DESCRIPTION_EDIT,
  END_DESCRIPTION_EDIT,
} from '../../../ephemeral/outcome-editing/actions'
import {
  SEND_REALTIME_INFO,
  SEND_EXIT_PROJECT_SIGNAL,
} from './actions'
import ProjectsZomeApi from '../../../../api/projectsApi'
import { getAppWs } from '../../../../hcWebsockets'
import { cellIdFromString } from '../../../../utils'
import { RootState } from '../../../reducer'
import { CellIdString } from '../../../../types/shared'

const isOneOfRealtimeInfoAffectingActions = (action) => {
  const { type } = action
  return (
    type === OPEN_EXPANDED_VIEW ||
    type === CLOSE_EXPANDED_VIEW ||
    type === START_TITLE_EDIT ||
    type === END_TITLE_EDIT ||
    type === START_DESCRIPTION_EDIT ||
    type === END_DESCRIPTION_EDIT ||
    type === SEND_REALTIME_INFO
  )
}

const isProjectExitAction = (action: { type: string }) => {
  const { type } = action
  return type === SEND_EXIT_PROJECT_SIGNAL
}
// watch for actions that will affect the realtime info state values

const realtimeInfoWatcher = (store) => {
  // return the action handler middleware
  return (next) => async (action) => {
    if (isOneOfRealtimeInfoAffectingActions(action)) {
      const appWebsocket = await getAppWs()
      const projectsZomeApi = new ProjectsZomeApi(appWebsocket)
      let result = next(action)
      if (appWebsocket.client.socket.readyState === appWebsocket.client.socket.OPEN) {
        let state: RootState = store.getState()
        const payload = getRealtimeInfo(state)
        // there is a chance that the project has been exited
        // and thus this need not be fired
        if (payload.projectId) {
          const cellId = cellIdFromString(payload.projectId)
          await projectsZomeApi.realtimeInfoSignal.send(cellId, payload)
        }
      }
      return result
    } else if (isProjectExitAction(action)) {
      const appWebsocket = await getAppWs()
      const projectsZomeApi = new ProjectsZomeApi(appWebsocket)
      const payload = {
        projectId: '',
        outcomeBeingEdited: null,
        outcomeExpandedView: null,
      }
      const cellIdString: CellIdString = action.payload
      const cellId = cellIdFromString(cellIdString)
      // TODO: catch and log error, but don't
      // await this call
      projectsZomeApi.realtimeInfoSignal.send(cellId, payload)
      return next(action)
    } else {
      return next(action)
    }
  }
}
// cherry-pick the relevant state for sending as a RealtimeInfo Signal
function getRealtimeInfo(state: RootState) {
  let payload = {
    projectId: state.ui.activeProject,
    outcomeBeingEdited: state.ui.outcomeEditing,
    outcomeExpandedView: state.ui.expandedView.outcomeActionHash,
  }
  return payload
}
export { realtimeInfoWatcher }
