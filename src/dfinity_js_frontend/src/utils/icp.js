import { getAuthClient } from "./auth-client";
import { getDCXBusinessContract, getLedger } from './canister-factory'

export async function initializeContract() {
    const authClient = await getAuthClient();
    window.auth = {};
    window.canister = {};
    window.auth.client = authClient;
    window.auth.isAuthenticated = authClient.isAuthenticated()
    window.auth.identity = authClient.getIdentity();
    window.auth.principal = authClient.getIdentity()?.getPrincipal();
    window.auth.principalText = authClient.getIdentity()?.getPrincipal().toText();
    window.canister.dcx = await getDCXBusinessContract();
    window.canister.ledger = await getLedger();
}