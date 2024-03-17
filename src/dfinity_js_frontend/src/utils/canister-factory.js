import { HttpAgent, Actor } from "@dfinity/agent";
import { idlFactory as dcxBusinessContractIDL } from "../../../declarations/dfinity_js_backend/dfinity_js_backend.did.js";
import { idlFactory as ledgerIDL } from "../../../declarations/ledger_canister/ledger_canister.did.js";

const DCX_BUSINESS_CONTRACT_CANISTER_ID = process.env.CANISTER_ID_DFINITY_JS_BACKEND;
const LEDGER_CANISTER_ID = process.env.CANISTER_ID_LEDGER_CANISTER;
const HOST_MAIN = "http://localhost:4943";

export async function getDCXBusinessContract() {
    return await getCanister(DCX_BUSINESS_CONTRACT_CANISTER_ID, dcxBusinessContractIDL);
}

export async function getLedger() {
    return await getCanister(LEDGER_CANISTER_ID, ledgerIDL);
}

async function getCanister(canisterId, idl) {
    const authclient$ = window.auth.client;
    const agent = new HttpAgent({
        host: HOST_MAIN,
        identity: authclient$.getIden
    });
    await agent.fetchRootKey();
    return Actor.createActor(idl, {
        agent,
        canisterId,
    });
}