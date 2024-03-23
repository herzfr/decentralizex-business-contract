import { None, Opt, Principal, Record, Variant, Vec, bool, int, int16, int8, nat64, text } from "azle";

export const TipeParty = Variant({
    INDIVIDUALS: text,
    COMPANIES: text,
    ORGANIZATIONS: text,
});

export const ContractStatus = Variant({
    ISSUED: text,
    UNISSUED: text,
});

const Error = Variant({
    NotFound: text,
    InvalidPayload: text,
});

export const listholder = Record({
    contract_id: Vec(text),
    badge: bool,
    message: text,
});

export const parties = Record({
    account_id: Principal,
    legal_name: text,
    address: text,
    identification_information: text,
    type_parties: TipeParty,
});

export const signature = Record({
    principal: Principal,
    sign_date: nat64,
    agree: bool,
})

const PaymenStatus = Variant({
    PaymentPending: text,
    DownPayment: text,
    Completed: text,
    Partial: text,
    Refund: text,
});

export const transaction = Record({
    transactionid: text,
    total: nat64,
    reciever: text,
    paid_at_block: Opt(nat64),
    token_symbol: text,
    token_name: text,
    transfer_fee: nat64,
    transaction_date: nat64,
    transaction_hash: nat64,
    transaction_memo: text
})

export const payment = Record({
    total_payment: nat64,
    change_output: nat64,
    payment_status: PaymenStatus,
    transactions: Vec(transaction)
})

export const contract = Record({
    contracting_party: Principal, // AS A PARTY WHO CREATE CONTRACT
    contract_recipient: Principal,
    contract_id: text,
    parties_involved: Vec(parties), // as the involved party 
    effective_date: text,
    objective: text,
    scope_of_work: text,
    term_and_condition: text,
    payment_terms: text,
    term_and_termination: text,
    confidentialy: text,
    intellectual_property: text,
    dispute_resolution: text,
    governing_law: text,
    force_majeure: text,
    notice: text,
    amendments: text,
    signatures: Vec(signature), // as the signing party
    status: ContractStatus,
    contract_payment: nat64,
    payment: payment
})


export const contractpayload = Record({
    contracting_party: Principal, // AS A PARTY WHO CREATE CONTRACT
    contract_recipient: Principal,
    parties_involved: parties,
    effective_date: text,
    objective: text,
    scope_of_work: text,
    term_and_condition: text,
    payment_terms: Opt(text),
    term_and_termination: Opt(text),
    confidentialy: Opt(text),
    intellectual_property: Opt(text),
    dispute_resolution: Opt(text),
    governing_law: Opt(text),
    force_majeure: Opt(text),
    notice: Opt(text),
    amendments: Opt(text),
    signatures: Vec(signature), // as the signing party
    contract_payment: Opt(nat64)
})

export const partiespayload = Record({
    account_id: Principal,
    legal_name: text,
    address: text,
    identification_information: text,
    type_parties: TipeParty,
});

export const getpartypayload = Record({
    account_id: Principal
})

export const getcontractpayload = Record({
    contract_id: text,
    principal: Principal
})

export const getcontractapplicant = Record({
    principal: Principal,
    index: int8,
    length: int16
})

export const getcontractholder = Record({
    principal: Principal,
    contract_assigns: Vec(text),
    index: int8,
    length: int8
})

export const assigncontractpayload = Record({
    principal: Principal,
    contract_id: text,
    contract_recipient: Principal
})

export const payloadsign = Record({
    parties: parties,
    principal: Principal,
    contract_id: text,
    client_wallet_id: Opt(text)
})

export const createpaymentpayload = Record({
    contract_id: text,
    principal: Principal,
    amount: nat64,
    reciever: text,
    transaction_memo: text,
    paid_to_block: Opt(nat64),
})

export const makepaymentpayload = Record({
    contract_id: text,
    principal: Principal,
    amount: nat64,
    transaction_block: text,
    transaction_memo: text,
    transaction_hash: nat64
})