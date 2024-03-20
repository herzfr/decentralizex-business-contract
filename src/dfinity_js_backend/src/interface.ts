import { None, Opt, Principal, Record, Variant, Vec, bool, int, int8, nat64, text } from "azle";

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

export const parties = Record({
    account_id: text,
    legal_name: text,
    address: text,
    identification_information: text,
    type_parties: TipeParty,
});

export const signature = Record({
    party_id: text,
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
    principal: Principal, // AS A PARTY WHO CREATE CONTRACT
    contract_id: text,
    client_wallet_id: text, // ITS a client wallet id
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
    principal: Principal, // AS A PARTY WHO CREATE CONTRACT
    parties_involved: parties, // as the involved party 
    client_wallet_id: text,
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
    account_id: text,
    legal_name: text,
    address: text,
    identification_information: text,
    type_parties: TipeParty,
});

export const getpartypayload = Record({
    account_id: text
})

export const getcontractpayload = Record({
    contract_id: text,
    principal: Principal
})

export const getcontractapplicant = Record({
    principal: Principal,
    index: int8,
    length: int8
})

export const getcontractholder = Record({
    client_wallet_id: text,
    index: int8,
    length: int8
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