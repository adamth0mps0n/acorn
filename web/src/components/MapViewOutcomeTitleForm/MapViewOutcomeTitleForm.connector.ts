import { connect } from 'react-redux'
import { RootState } from '../../redux/reducer'
import {
  createOutcomeWithConnection,
} from '../../redux/persistent/projects/outcomes/actions'
import { deleteConnection } from '../../redux/persistent/projects/connections/actions'
import {
  closeOutcomeForm,
  updateContent,
} from '../../redux/ephemeral/outcome-form/actions'
import MapViewOutcomeTitleForm, { MapViewOutcomeTitleFormConnectorDispatchProps, MapViewOutcomeTitleFormOwnProps } from './MapViewOutcomeTitleForm.component'
import ProjectsZomeApi from '../../api/projectsApi'
import { getAppWs } from '../../hcWebsockets'
import { cellIdFromString } from '../../utils'
import { ActionHashB64, Option } from '../../types/shared'
import { LinkedOutcomeDetails, Outcome } from '../../types'
import { selectOutcome, unselectAll } from '../../redux/ephemeral/selection/actions'
import { animatePanAndZoom } from '../../redux/ephemeral/viewport/actions'
import { LAYOUT_ANIMATION_DURATION_MS } from '../../constants'

// https://react-redux.js.org/using-react-redux/connect-mapstate
// Designed to grab selective data off of a redux state tree in order
// to pass it to a component for rendering, as specific properties that
// that component expects

function mapStateToProps(state: RootState) {
  const {
    ui: {
      viewport: { scale },
      // all the state for this component is store under state->ui->outcomeForm
      outcomeForm: {
        content,
        leftConnectionXPosition,
        topConnectionYPosition,
        // these three all relate to each other
        fromAddress,
        relation,
        // ASSUMPTION: one parent
        existingParentConnectionAddress, // this is optional though
      },
    },
  } = state

  return {
    activeAgentPubKey: state.agentAddress,
    scale,
    // optional, the address of the Outcome that we are relating this to
    fromAddress,
    // optional, the relation (relation_as_{child|parent})
    // between the potential fromAddress Outcome
    // and a new Outcome to be created
    relation,
    // optional, the address of an existing connection that
    // indicates this Outcome as the child of another (a.k.a has a parent)
    // ASSUMPTION: one parent
    existingParentConnectionAddress,
    content,
    leftConnectionXPosition: leftConnectionXPosition,
    topConnectionYPosition: topConnectionYPosition,
  }
}

// https://react-redux.js.org/using-react-redux/connect-mapdispatch
// Designed to pass functions into components which are already wrapped as
// action dispatchers for redux action types

function mapDispatchToProps(dispatch, ownProps: MapViewOutcomeTitleFormOwnProps): MapViewOutcomeTitleFormConnectorDispatchProps {
  const { projectId: cellIdString } = ownProps
  const cellId = cellIdFromString(cellIdString)
  return {
    updateContent: (content: string) => {
      return dispatch(updateContent(content))
    },
    deleteConnection: async (actionHash: ActionHashB64) => {
      const appWebsocket = await getAppWs()
      const projectsZomeApi = new ProjectsZomeApi(appWebsocket)
      // we will only be archiving
      // an connection here in the context of immediately replacing
      // it with another during a createOutcomeWithConnection
      // thus we don't want a glitchy animation
      // so we DON'T call TRIGGER_UPDATE_LAYOUT
      await projectsZomeApi.connection.delete(cellId, actionHash)
      return dispatch(deleteConnection(cellIdString, actionHash))
    },
    createOutcomeWithConnection: async (entry: Outcome, maybeLinkedOutcome: Option<LinkedOutcomeDetails>) => {
      const appWebsocket = await getAppWs()
      const projectsZomeApi = new ProjectsZomeApi(appWebsocket)
      const outcomeWithConnection = await projectsZomeApi.outcome.createOutcomeWithConnection(
        cellId,
        {
          entry,
          maybeLinkedOutcome,
        }
      )
      dispatch(
        createOutcomeWithConnection(cellIdString, outcomeWithConnection)
      )
      // Re. the timeout...
      // it is necessary because an animation
      // runs in layout.ts that initially moves the position
      // of the Outcome itself. Before animating to the 
      const ADDITIONAL_WAIT_BUFFER_MS = 40
      setTimeout(() => {
        dispatch(unselectAll())
        dispatch(selectOutcome(outcomeWithConnection.outcome.actionHash))
        // `false` here means DONT change the scale, only the translate
        dispatch(animatePanAndZoom(outcomeWithConnection.outcome.actionHash, false))
      }, LAYOUT_ANIMATION_DURATION_MS + ADDITIONAL_WAIT_BUFFER_MS)
    },
    closeOutcomeForm: () => {
      return dispatch(closeOutcomeForm())
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MapViewOutcomeTitleForm)