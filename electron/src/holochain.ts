import * as path from 'path'
import { app } from 'electron'
import { ElectronHolochainOptions, StateSignal, PathOptions } from '@lightningrodlabs/electron-holochain'
import { INTEGRITY_VERSION_NUMBER, KEYSTORE_VERSION_NUMBER, USER_DATA_PATH } from './paths'

// these messages get seen on the splash page
export enum StateSignalText {
  IsFirstRun = 'Welcome to Acorn...',
  IsNotFirstRun = 'Loading...',
  CreatingKeys = 'Creating cryptographic keys...',
  RegisteringDna = 'Registering Profiles DNA to Holochain...',
  InstallingApp = 'Installing DNA bundle to Holochain...',
  EnablingApp = 'Enabling DNA...',
  AddingAppInterface = 'Attaching API network port...',
}

export function stateSignalToText(state: StateSignal): StateSignalText {
  switch (state) {
    case StateSignal.IsFirstRun:
      return StateSignalText.IsFirstRun
    case StateSignal.IsNotFirstRun:
      return StateSignalText.IsNotFirstRun
    case StateSignal.CreatingKeys:
      return StateSignalText.CreatingKeys
    case StateSignal.RegisteringDna:
      return StateSignalText.RegisteringDna
    case StateSignal.InstallingApp:
      return StateSignalText.InstallingApp
    case StateSignal.EnablingApp:
      return StateSignalText.EnablingApp
    case StateSignal.AddingAppInterface:
      return StateSignalText.AddingAppInterface
  }
}

const projectsHappPath = app.isPackaged
  ? path.join(app.getAppPath(), '../app.asar.unpacked/binaries/projects.happ')
  : path.join(app.getAppPath(), '../happ/workdir/projects/projects.happ')

const profilesHappPath = app.isPackaged
  ? path.join(app.getAppPath(), '../app.asar.unpacked/binaries/profiles.happ')
  : path.join(app.getAppPath(), '../happ/workdir/profiles/profiles.happ')

// in production
// must point to unpacked versions, not in an asar archive
// in development
// fall back on defaults in the electron-holochain package
const BINARY_PATHS: PathOptions | undefined = app.isPackaged
  ? {
      holochainRunnerBinaryPath: path.join(
        __dirname,
        `../../app.asar.unpacked/binaries/holochain-runner${process.platform === 'win32' ? '.exe' : ''}`
      ),
    }
  : undefined

const MAIN_APP_ID = 'main-app'
const COMMUNITY_PROXY_URL =
  'kitsune-proxy://SYVd4CF3BdJ4DS7KwLLgeU3_DbHoZ34Y-qroZ79DOs8/kitsune-quic/h/165.22.32.11/p/5779/--'

const devOptions: ElectronHolochainOptions = {
  happPath: profilesHappPath, // preload
  datastorePath: path.join(USER_DATA_PATH, `databases-${INTEGRITY_VERSION_NUMBER}`),
  appId: MAIN_APP_ID,
  appWsPort: process.env.ACORN_TEST_USER_2 ? 8899 : 8888,
  adminWsPort: process.env.ACORN_TEST_USER_2 ? 1236 : 1234,
  keystorePath: path.join(USER_DATA_PATH, `keystore-${INTEGRITY_VERSION_NUMBER}`),
  passphrase: 'test-passphrase',
  proxyUrl: COMMUNITY_PROXY_URL,
}
const prodOptions: ElectronHolochainOptions = {
  happPath: profilesHappPath, // preload
  datastorePath: path.join(app.getPath('userData'), `databases-${INTEGRITY_VERSION_NUMBER}`),
  appId: MAIN_APP_ID,
  appWsPort: 8889,
  adminWsPort: 1235,
  keystorePath: path.join(app.getPath('userData'), `keystore-${KEYSTORE_VERSION_NUMBER}`),
  passphrase: 'test-passphrase',
  proxyUrl: COMMUNITY_PROXY_URL,
}

export { projectsHappPath, BINARY_PATHS, devOptions, prodOptions }
