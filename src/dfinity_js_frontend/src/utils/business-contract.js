
export async function registerParties(payload) {
    const prcpl = await window.auth.principal
    return await window.canister.dcx.upsertParties({ account_id: prcpl, ...payload });
}

export async function readBadge() {
    const prcpl = await window.auth.principal
    const state = await window.canister.dcx.readBadge(prcpl);
    if ('Ok' in state) return null;
}

export async function getParties() {
    const prcpl = await window.auth.principal
    return await window.canister.dcx.getParty(prcpl)
}

export async function getListHolder() {
    const prcpl = await window.auth.principal
    const state = await window.canister.dcx.getListHolder(prcpl)
    if ('Ok' in state) {
        const st = state.Ok
        return {
            contract_id: st.contract_id,
            badge: st.badge,
            message: st.message
        }
    }
    if ('Err' in state) return null
}

export async function getContractListHolder(payload) {
    const prcpl = await window.auth.principal
    const list = await window.canister.dcx.getContractHolder({ principal: prcpl, ...payload })
    if ('Ok' in list) {
        return list.Ok
    }
    if ('Err' in list) return list.Err
}

export async function createContract(payload) {
    const prcpl = await window.auth.principal
    const contract = await window.canister.dcx.createContract({ contracting_party: prcpl, ...payload })
    if ('Ok' in contract) {
        return contract.Ok
    }
    if ('Err' in list) return list.Err
}

export async function getContractAplicant(payload) {
    const prcpl = await window.auth.principal
    const list = await window.canister.dcx.getContractAplicant({ principal: prcpl, ...payload })
    if ('Ok' in list) {
        return list.Ok
    }
    if ('Err' in list) return []
}

export async function assignTo(payload) {
    const list = await window.canister.dcx.assignContractTo(payload)
    if ('Ok' in list) {
        return list.Ok
    }
    if ('Err' in list) list.Err
}

// export async function getContract(payload) {
//     return window.canister.dcx.getContract(payload)
// }

// export async function getContractApplicantList(payload) {
//     return window.canister.dcx.getContractAplicant(payload)
// }

// export async function getContractHolder(payload) {
//     return window.canister.dcx.getContractHolder(payload)
// }

// export async function signContractApplicant(payload) {
//     return window.canister.dcx.signContractApplicant(payload)
// }
// export async function signContractHolder(payload) {
//     return window.canister.dcx.signContractHolder(payload)
// }

// export async function issued(payload) {
//     return window.canister.dcx.issued(payload)
// }

// export async function unissued(payload) {
//     return window.canister.dcx.unissued(payload)
// }