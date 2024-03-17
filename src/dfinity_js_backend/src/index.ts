import { Canister, Duration, None, Opt, Principal, Result, StableBTreeMap, Vec, ic, nat64, query, text, update } from 'azle';
import { contract, contractpayload, createpaymentpayload, getcontractapplicant, getcontractholder, getcontractpayload, getpartypayload, parties, partiespayload, payloadsign, signature, transaction } from './interface';
import { ICContract, ICParty, ICSignature } from './payload';
import { v4 as uuidv4 } from "uuid";
import { hash } from '@dfinity/agent';

type Contract = typeof contract.tsType;
type Parties = typeof parties.tsType;
type Signature = typeof signature.tsType;
type Transaction = typeof transaction.tsType;

const TIMEOUT_PERIOD = 48000n;

let businessContract = StableBTreeMap<text, Contract>(2);
let businessParties = StableBTreeMap<text, Parties>(1);
let transactionPending = StableBTreeMap<text, Transaction>(0);

export default Canister({
    upsertParties: update([partiespayload], Result(parties, text), async (payload) => {
        try {
            let party = businessParties.get(payload.account_id)
            let new_party: Parties = ICParty

            if ('None' in party) {
                new_party = {
                    ...new_party,
                    account_id: payload.account_id,
                    legal_name: payload.legal_name,
                    address: payload.address,
                    identification_information: payload.identification_information.Some ?? '',
                    type_parties: payload.type_parties
                }
                businessParties.insert(new_party.account_id, new_party)
                return Result.Ok(new_party);
            }


            let party_update = party.Some
            party_update = {
                ...party_update,
                legal_name: payload.legal_name,
                address: payload.address,
                identification_information: payload.identification_information.Some ?? '',
                type_parties: payload.type_parties
            }

            businessParties.insert(party_update.account_id, party_update)
            return Result.Ok(party_update);
        } catch (error) {
            return Result.Err("Error While update Party [" + error + "]");
        }
    }),
    getParty: query([getpartypayload], Result(parties, text), (party) => {
        let ct = businessParties.get(party.account_id)
        if ('None' in ct) return Result.Err('Party is Empty')
        return Result.Ok(ct.Some)
    }),
    createContract: update([contractpayload, Principal], Result(contract, text), (create, principal) => {
        try {
            let party = businessParties.get(create.parties_involved.account_id)
            if ('None' in party) return Result.Err('Party not found, please register your party first')

            let new_contract: Contract = ICContract

            new_contract = {
                ...new_contract,
                contract_id: uuidv4(),
                principal: principal,
                client_wallet_id: create.client_wallet_id,
                parties_involved: [party.Some],
                effective_date: create.effective_date,
                objective: create.effective_date,
                scope_of_work: create.effective_date,
                term_and_condition: create.term_and_condition,
                payment_terms: create.payment_terms.Some ?? '',
                term_and_termination: create.term_and_termination.Some ?? '',
                confidentialy: create.confidentialy.Some ?? '',
                intellectual_property: create.intellectual_property.Some ?? '',
                dispute_resolution: create.dispute_resolution.Some ?? '',
                governing_law: create.governing_law.Some ?? '',
                force_majeure: create.force_majeure.Some ?? '',
                notice: create.notice.Some ?? '',
                amendments: create.amendments.Some ?? '',
                signatures: [], // as the signing party
                status: { "UNISSUED": "UNISSUED" },
                contract_payment: create.contract_payment.Some ?? BigInt(0),
            }
            businessContract.insert(new_contract.contract_id, new_contract)
            return Result.Ok(new_contract);
        } catch (error) {
            return Result.Err("Error While creating contract [" + error + "]");
        }
    }),
    getContract: query([getcontractpayload], Result(Opt(contract), text), (key) => {
        let ct = businessContract.get(key.contract_id)
        if ('None' in ct) return Result.Err('Contract is Empty')
        return Result.Ok(ct)
    }),
    getContractAplicant: query([getcontractapplicant], Result(Vec(contract), text), (list) => {
        const contractList = businessContract.items(list.index, list.length)
            .filter(e => e[1].principal.toString() === list.principal.toString())
            .map(([_, contractData]) => contractData)
        if (contractList.length === 0) {
            return Result.Err(`There's no one contract list`)
        }
        return Result.Ok(contractList)
    }),
    getContractHolder: query([getcontractholder], Result(Vec(contract), text), (list) => {
        const contractList = businessContract.items(list.index, list.length)
            .filter(e => e[1].client_wallet_id === list.client_wallet_id)
            .map(([_, contractData]) => contractData)
        if (contractList.length === 0) {
            return Result.Err(`There's no one contract list`)
        }
        return Result.Ok(contractList)
    }),
    signContractApplicant: update([payloadsign], Result(text, text), (sign) => {
        try {
            let ct = businessContract.get(sign.contract_id)
            let new_sign: Signature = ICSignature

            if ('None' in ct) {
                return Result.Err('Contract is Empty')
            }

            if (sign.principal.toString() !== ct.Some.principal.toString()) return Result.Err("You're not as principal")
            if (ct.Some.signatures.length > 0) {
                let idxSign = ct.Some.signatures.findIndex(f => f.party_id === sign.parties.account_id)
                if (idxSign !== -1) return Result.Err("You already signed!")
            }

            new_sign = {
                ...new_sign,
                agree: true,
                sign_date: ic.time(),
                party_id: sign.parties.account_id
            }
            ct.Some.signatures.push(new_sign)
            businessContract.insert(ct.Some.contract_id, ct.Some)
            return Result.Ok("Success Signed");
        } catch (error) {
            return Result.Err(`Error while do signing`)
        }
    }),
    signContractHolder: update([payloadsign], Result(text, text), (sign) => {
        try {
            let ct = businessContract.get(sign.contract_id)
            let new_sign: Signature = ICSignature

            if ('None' in ct) return Result.Err('Contract is Empty')

            if (ct.Some.signatures.length > 0) {
                let idxSign = ct.Some.signatures.findIndex(f => f.party_id === sign.parties.account_id)
                if (idxSign !== -1) return Result.Err("You already signed!")
            }

            if (ct.Some.client_wallet_id !== sign.client_wallet_id.Some) return Result.Err('Your access does not have the authority to sign')

            new_sign = {
                ...new_sign,
                agree: true,
                sign_date: ic.time(),
                party_id: sign.parties.account_id
            }

            ct.Some.parties_involved.push(sign.parties)
            ct.Some.signatures.push(new_sign)
            businessContract.insert(ct.Some.contract_id, ct.Some)
            return Result.Ok("Success Signed");
        } catch (error) {
            return Result.Err(`Error while do signing`)
        }
    }),
    issued: update([getcontractpayload], Result(text, text), (key) => {
        try {
            let ct = businessContract.get(key.contract_id)
            if ('None' in ct) return Result.Err("There are no contracts listed")
            if (key.principal.toString() !== ct.Some.principal.toString()) return Result.Err("You don't have access")
            if (ct.Some.signatures.length === 1) return Result.Err("You and client must sign first before issued")
            ct.Some.status = { "ISSUED": "SUCCESS" }

            businessContract.insert(ct.Some.contract_id, ct.Some)
            return Result.Ok("Success Issued");
        } catch (error) {
            return Result.Err(`Error Issued`)
        }


    }),
    unissued: update([getcontractpayload], Result(text, text), (key) => {
        try {
            let ct = businessContract.get(key.contract_id)
            if ('None' in ct) return Result.Err("There are no contracts listed")
            if (key.principal.toString() !== ct.Some.principal.toString()) return Result.Err("You don't have access")
            ct.Some.status = { "UNISSUED": "UNISSUED" }

            businessContract.insert(ct.Some.contract_id, ct.Some)
            return Result.Ok("Success Unissued");
        } catch (error) {
            return Result.Err(`Error Unissued`)
        }


    }),
    createTransaction: update([createpaymentpayload], Result(transaction, text), async (payload) => {
        let contract = businessContract.get(payload.contract_id)
        if ('None' in contract) return Result.Err("There are no contracts listed")
        if (contract.Some.principal !== payload.principal) return Result.Err("You cannot make payment towards this contract")

        const on = contract.Some
        if (on.payment.total_payment >= on.contract_payment || on.payment.total_payment >= payload.amount && on.payment.change_output == BigInt(0)) return Result.Err("Contract has been paid!")

        if (on.payment.transactions.length > 0) { // validate if have transaction history
            let total_trx = on.payment.transactions.reduce((a, b) => a + parseFloat(b.total.toString()), 0)
            if (payload.amount >= total_trx) return Result.Err("Your payment exceeds the total amount due. Please try again with a payment amount below the total transaction.")
        }

        let idtrx = getRandomId(16)
        let memo_hash = await getCorrelationId(idtrx)
        const tranx: Transaction = {
            transactionid: idtrx,
            total: payload.amount,
            reciever: payload.reciever,
            paid_at_block: None,
            transaction_memo: payload.transaction_memo,
            transaction_hash: memo_hash,
            token_name: '',
            token_symbol: '',
            transaction_date: BigInt(0),
            transfer_fee: BigInt(0),
        }

        transactionPending.insert(memo_hash.toString(), tranx);
        timeoutTransaction(memo_hash.toString(), TIMEOUT_PERIOD);
        return Result.Ok(tranx);
    }),
})

function timeoutTransaction(memo: string, delay: Duration) {
    console.log('test')
    ic.setTimer(delay, () => {
        const trx = transactionPending.remove(memo);
        console.log(`Transaction has been expired ${trx}`);
    });
};


function getRandomId(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + ic.time();
    let result = '';
    const charLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charLength));
    }
    return result;
}


async function getCorrelationId(transactionid: text): Promise<nat64> {
    const correlationId = `${transactionid}_${ic.caller().toText()}_${ic.time()}`;
    const encoder = new TextEncoder();
    const inputBuffer = encoder.encode(correlationId);
    const hashedValue = await hash(inputBuffer)

    const hashBigInt = BigInt('0x' + Array.from(new Uint8Array(hashedValue))
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join(''));

    return hashBigInt as nat64
};