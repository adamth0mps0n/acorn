import { AppWebsocket, CellId } from '@holochain/client'
import { WeServices } from '@lightningrodlabs/we-applet'
import { Profile, WhoAmIOutput } from '../types'
import { AgentPubKeyB64, UpdateInput } from '../types/shared'
import { WireRecord } from './hdkCrud'
import { get } from 'svelte/store'

function weToAcornProfile(weProfile: WeProfile): Profile {
    let acornProfile: Profile
    Object.keys(weProfile.fields).forEach((key) => {
        if (key === 'isImported') {
            acornProfile[key] = JSON.parse(weProfile.fields[key])
        }
        else {
            acornProfile[key] = weProfile.fields[key]
        }
    })
    return acornProfile
}
function acornToWeProfile(acornProfile: Profile, nickname: string): WeProfile {
    let weProfile: WeProfile = { nickname: '', fields: {} }
    Object.keys(acornProfile).forEach((key) => {
        if (key === 'isImported') {
            weProfile.fields[key] = JSON.stringify(acornProfile[key])
        }
        else {
            weProfile.fields[key] = acornProfile[key]
        }
    })
    return weProfile
}
async function getMyNickname(weServices: WeServices): Promise<string> {
    let myWeProfile = get(await weServices.profilesStore.fetchMyProfile());
    return myWeProfile.nickname
}
export interface WeProfile {
    nickname: string;
    fields: Record<string, string>;
}
const WeProfilesApi = (appWebsocket: AppWebsocket, weServices: WeServices) => {
  return {
    createWhoami: async (cellId: CellId, payload: Profile): Promise<WireRecord<Profile>> => {
        const profile = acornToWeProfile(payload, await getMyNickname(weServices))
        await weServices.profilesStore.updateProfile(profile)
        return {
            actionHash: null,
            entryHash: null,
            entry: payload,
            createdAt: null,
            updatedAt: null,
        }
    },
    createImportedProfile: async (cellId: CellId, payload: Profile): Promise<WireRecord<Profile>> => {
        const profile = acornToWeProfile(payload, await getMyNickname(weServices))
        await weServices.profilesStore.updateProfile(profile)
        return {
            actionHash: null,
            entryHash: null,
            entry: payload,
            createdAt: null,
            updatedAt: null,
        }
    },
    updateWhoami: async (cellId: CellId, payload: UpdateInput<Profile>): Promise<WireRecord<Profile>> => {
        const profile = acornToWeProfile(payload.entry, await getMyNickname(weServices))
        await weServices.profilesStore.updateProfile(profile)
        return {
            actionHash: null,
            entryHash: null,
            entry: payload.entry,
            createdAt: null,
            updatedAt: null,
        }
    },
    whoami: async (cellId: CellId): Promise<WhoAmIOutput> => {
        let myWeProfile = get(await weServices.profilesStore.fetchMyProfile());
        return {
            actionHash: null,
            entryHash: null,
            entry: weToAcornProfile(myWeProfile),
            createdAt: null,
            updatedAt: null,
        }
    },
    fetchAgents: async (cellId: CellId): Promise<Array<Profile>> => {
      let profiles: Array<Profile> = get(await weServices.profilesStore.fetchAllProfiles()).values().map((weProfile) => weToAcornProfile(weProfile));
      return profiles
    },
    fetchAgentAddress: async (cellId: CellId): Promise<AgentPubKeyB64> => {
      // is this an alright way to convert the byte array to string?
      return new TextDecoder().decode(weServices.profilesStore.myAgentPubKey)
    },
  }
}

export default class WeProfilesZomeApi {
  appWebsocket: AppWebsocket
  profile: ReturnType<typeof WeProfilesApi>
  constructor(appWebsocket: AppWebsocket, weServices: WeServices) {
    this.appWebsocket = appWebsocket
    this.profile = WeProfilesApi(appWebsocket, weServices)
  }
}
