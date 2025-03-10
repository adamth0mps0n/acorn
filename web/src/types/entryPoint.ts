import { AgentPubKeyB64, ActionHashB64 } from "./shared";

export interface EntryPoint {
    color: string,
    creatorAgentPubKey: AgentPubKeyB64,
    createdAt: number, //f64,
    outcomeActionHash: ActionHashB64,
    isImported: boolean,
}