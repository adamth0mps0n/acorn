import React from 'react'

import Modal from '../components/Modal/Modal'
import Preferences from '../components/Preferences/Preferences'
import ProfileEditForm from '../components/ProfileEditForm/ProfileEditForm'
import ProjectSettingsModal from '../components/ProjectSettingsModal/ProjectSettingsModal.connector'
import InviteMembersModal from '../components/InviteMembersModal/InviteMembersModal'
import { WireRecord } from '../api/hdkCrud'
import { Profile, ProjectMeta } from '../types'
import { AgentPubKeyB64, CellIdString, WithActionHash } from '../types/shared'
// import UpdatePromptModal from '../components/UpdatePromptModal/UpdatePromptModal'

export type GlobalModalsProps = {
  whoami: WireRecord<Profile>
  activeProjectMeta: WithActionHash<ProjectMeta>
  projectId: CellIdString 
  agentAddress: AgentPubKeyB64
  navigationPreference: 'mouse' | 'trackpad'
  setNavigationPreference: (preference: 'mouse' | 'trackpad') => void
  showProfileEditForm: boolean
  setShowProfileEditForm: (val: boolean) => void
  showPreferences: boolean
  setShowPreferences: (val: boolean) => void
  showProjectSettingsModal: boolean
  setShowProjectSettingsOpen: (val: boolean) => void
  inviteMembersModalShowing: null | string // will be the passphrase if defined
  openInviteMembersModal: (passphrase: string) => void
  hideInviteMembersModal: () => void
  onProfileSubmit: (profile: Profile) => Promise<void>
}

const GlobalModals: React.FC<GlobalModalsProps> = ({
  whoami,
  activeProjectMeta,
  projectId,
  agentAddress,
  navigationPreference,
  setNavigationPreference,
  showProfileEditForm,
  setShowProfileEditForm,
  showPreferences,
  setShowPreferences,
  showProjectSettingsModal,
  setShowProjectSettingsOpen,
  inviteMembersModalShowing,
  openInviteMembersModal,
  hideInviteMembersModal,
  onProfileSubmit,
}) => {

  // profile edit modal
  const titleText = 'Profile Settings'
  const subText = ''
  // This is hardcoded on purpose, not a big deal because the modal closes 
  // when the user hits 'Save Changes'
  const pending = false
  const pendingText = 'Submitting...'
  const submitText = 'Save Changes'

  return (
    <>
      {/* This will only show when 'active' prop is true */}
      {/* Profile Settings Modal */}
      <Modal
        white
        active={showProfileEditForm}
        onClose={() => setShowProfileEditForm(false)}
      >
        <ProfileEditForm
          onSubmit={onProfileSubmit}
          whoami={whoami ? whoami.entry : null}
          {...{ pending, pendingText, titleText, subText, submitText, agentAddress }}
        />
      </Modal>
      {/* Preferences Modal */}
      <Preferences
        navigation={navigationPreference}
        setNavigationPreference={setNavigationPreference}
        showPreferences={showPreferences}
        setShowPreferences={setShowPreferences}
      />
      {/* Project Settings Modal */}
      <ProjectSettingsModal
        showModal={showProjectSettingsModal}
        onClose={() => setShowProjectSettingsOpen(false)}
        project={activeProjectMeta}
        cellIdString={projectId}
        openInviteMembersModal={openInviteMembersModal}
      />
      <InviteMembersModal
        passphrase={inviteMembersModalShowing}
        showModal={inviteMembersModalShowing}
        onClose={hideInviteMembersModal}
      />
      {/* Update Prompt Modal */}
      {/* <UpdatePromptModal
          show={showUpdatePromptModal}
          onClose={onCloseUpdatePromptModal}
        /> */}
    </>
  )
}

export default GlobalModals