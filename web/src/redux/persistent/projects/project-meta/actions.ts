import { WireRecord } from '../../../../api/hdkCrud'
import { ProjectMeta } from '../../../../types'
import { Action, CellIdString } from '../../../../types/shared'
import { createCrudActionCreators } from '../../crudRedux'

const [[
  CREATE_PROJECT_META,
  FETCH_PROJECT_METAS,
  UPDATE_PROJECT_META,
  DELETE_PROJECT_META
],[
  createProjectMeta,
  fetchProjectMetas,
  updateProjectMeta,
  deleteProjectMeta,
]] = createCrudActionCreators<ProjectMeta>('PROJECT_META')

// This model has a special "singular fetch"
// since a Project is only supposed to contain ONE
// ProjectMeta record
const FETCH_PROJECT_META = 'FETCH_PROJECT_META'
const fetchProjectMeta = (cellIdString: CellIdString, payload: WireRecord<ProjectMeta>): Action<WireRecord<ProjectMeta>> => {
  return {
    type: FETCH_PROJECT_META,
    payload,
    meta: { cellIdString }
  }
}

// this model has a special "singular create"
// in order to perform proper validation
// that only one project meta exists
const SIMPLE_CREATE_PROJECT_META = 'SIMPLE_CREATE_PROJECT_META'
const simpleCreateProjectMeta = (cellIdString: CellIdString, payload: WireRecord<ProjectMeta>): Action<WireRecord<ProjectMeta>> => {
  return {
    type: SIMPLE_CREATE_PROJECT_META,
    payload,
    meta: { cellIdString }
  }
}

export {
  CREATE_PROJECT_META,
  FETCH_PROJECT_METAS,
  UPDATE_PROJECT_META,
  DELETE_PROJECT_META,
  SIMPLE_CREATE_PROJECT_META,
  FETCH_PROJECT_META,
  createProjectMeta,
  fetchProjectMetas,
  updateProjectMeta,
  deleteProjectMeta,
  simpleCreateProjectMeta,
  fetchProjectMeta,
}
