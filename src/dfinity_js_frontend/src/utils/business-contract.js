
export async function registerParties(payload) {
    return window.canister.dcx.upsertParties(payload);
}

export async function getParties(accountid) {
    return window.canister.dcx.getParty({ account_id: accountid })
}

export async function createContract(payload) {
    return window.canister.dcx.createContract(payload)
}

export async function getContract(payload) {
    return window.canister.dcx.getContract(payload)
}

export async function getContractApplicantList(payload) {
    return window.canister.dcx.getContractAplicant(payload)
}

export async function getContractHolder(payload) {
    return window.canister.dcx.getContractHolder(payload)
}

export async function signContractApplicant(payload) {
    return window.canister.dcx.signContractApplicant(payload)
}
export async function signContractHolder(payload) {
    return window.canister.dcx.signContractHolder(payload)
}

export async function issued(payload) {
    return window.canister.dcx.issued(payload)
}

export async function unissued(payload) {
    return window.canister.dcx.unissued(payload)
}