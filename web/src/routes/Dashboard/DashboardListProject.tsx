import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'

import Icon from '../../components/Icon/Icon'

import './DashboardListProject.scss'

import { pickColorForString } from '../../styles'

import ProjectSettingsModal from '../../components/ProjectSettingsModal/ProjectSettingsModal.connector'
import { ENTRY_POINTS, GO_TO_OUTCOME } from '../../searchParams'
import AvatarsList from '../../components/AvatarsList/AvatarsList'
import { ProjectAggregated } from '../../types'

function DashboardListProjectLoading() {
  return (
    <>
      <div className="dashboard-list-project-wrapper">
        <div className="dashboard-list-project">
          <NavLink to={'/dashboard'} className="dashboard-list-project-image">
            <div
              className="dashboard-list-project-image-bg"
              style={{ backgroundColor: '#f1f1f1' }}
            ></div>
          </NavLink>
          <div className="dashboard-list-project-content">
            <NavLink
              to={'/dashboard'}
              className={`dashboard-list-project-name placeholder`}
            ></NavLink>
            <div
              className={`dashboard-list-project-member-count placeholder`}
            ></div>
          </div>
          <div className="dashboard-list-project-members-settings"></div>
        </div>
      </div>
    </>
  )
}

export type DashboardListProjectProps = {
  project: ProjectAggregated
  setShowInviteMembersModal: (passphrase: string) => void
}

const DashboardListProject: React.FC<DashboardListProjectProps> = ({
  project,
  setShowInviteMembersModal,
}) => {
  // TODO: this is placeholder for implementing this
  const updateIsAvailable = false
  const [showEntryPoints, setShowEntryPoints] = useState(false)

  const imageStyles = project.image
    ? { backgroundImage: `url(${project.image})` }
    : { backgroundColor: pickColorForString(project.name) }

  const projectInitials = project.name
    .split(' ')
    .map((word) => (word ? word[0].toUpperCase() : 'X'))
    .slice(0, 3)

  const [showProjectSettingsModal, setShowProjectSettingsModal] = useState(
    false
  )

  const openInviteMembersModal = () => {
    setShowInviteMembersModal(project.passphrase)
  }

  return (
    <div className="dashboard-list-project-wrapper">
      {updateIsAvailable && (
        <>
          <div className="update-required-button" onClick={() => {}}>
            Update required to access
          </div>
          <div className="unavailable-layer"></div>
        </>
      )}
      <div className="dashboard-list-project">
        <NavLink
          to={`/project/${project.cellId}`}
          className="dashboard-list-project-image"
        >
          <div className="dashboard-list-project-image-bg" style={imageStyles}>
            {project.image ? '' : projectInitials}
          </div>
        </NavLink>
        <div className="dashboard-list-project-content">
          <NavLink
            to={`/project/${project.cellId}/map`}
            className={`dashboard-list-project-name`}
          >
            {project.name}
          </NavLink>

          <div className={`dashboard-list-project-member-count`}>
            {project.members.length} member
            {project.members.length > 1 ? 's' : ''}
          </div>
        </div>
        <div className="dashboard-list-project-members-settings">
          <div className="dashboard-list-project-members">
            <AvatarsList
              // showPresence
              // profilesPresent={project.presentMembers}
              size="small-medium"
              profiles={project.members}
              showInviteButton
              onClickButton={openInviteMembersModal}
            />
          </div>

          {/* project item settings */}
          <div
            className="dashboard-list-project-settings-button"
            onClick={() => setShowProjectSettingsModal(true)}
          >
            <Icon
              name="dots-horizontal.svg"
              size="medium"
              className="light-grey"
            />
          </div>
        </div>
      </div>

      {/* project entry points */}

      <div className="dashboard-list-project-entry-points">
        {/* only allow expanding entry points list if there are some */}
        {project.entryPoints.length > 0 && (
          <>
            <div
              className="dashboard-list-project-entry-point-button"
              onClick={() => setShowEntryPoints(!showEntryPoints)}
            >
              <Icon
                name="door-open.svg"
                size="small"
                className="grey not-clickable"
              />
              <div className="dashboard-list-project-entry-point-button-text">
                {project.entryPoints.length} entry point
                {project.entryPoints.length === 1 ? '' : 's'}
              </div>
              <Icon
                name="chevron-down.svg"
                size="small"
                className={`grey ${showEntryPoints ? 'active' : ''}`}
              />
            </div>
          </>
        )}
        {showEntryPoints && (
          <div className="dashboard-list-project-entry-point-expanded">
            {project.entryPoints.map(({ entryPoint, outcome }) => {
              const dotStyle = {
                backgroundColor: entryPoint.color,
              }
              return (
                <NavLink
                  key={`entry-point-${entryPoint.actionHash}`}
                  to={`/project/${project.cellId}/map?${ENTRY_POINTS}=${entryPoint.actionHash}&${GO_TO_OUTCOME}=${entryPoint.outcomeActionHash}`}
                  className="entry-point-item"
                >
                  <div className="entry-point-color-dot" style={dotStyle} />
                  <div className="entry-point-name">{outcome.content}</div>
                </NavLink>
              )
            })}
          </div>
        )}
      </div>
      <ProjectSettingsModal
        showModal={showProjectSettingsModal}
        onClose={() => setShowProjectSettingsModal(false)}
        project={project}
        cellIdString={project.cellId}
        openInviteMembersModal={openInviteMembersModal}
      />
    </div>
  )
}

export { DashboardListProjectLoading, DashboardListProject }
