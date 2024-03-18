import { Canister, Duration, None, Opt, Principal, Result, Some, StableBTreeMap, Vec, bool, ic, nat64, query, text, update } from 'azle';
import { contract, contractpayload, createpaymentpayload, getcontractapplicant, getcontractholder, getcontractpayload, getpartypayload, makepaymentpayload, parties, partiespayload, payloadsign, payment, signature, transaction } from './interface';
import { ICContract, ICParty, ICSignature } from './payload';
import { v4 as uuidv4 } from "uuid";
// import { hash } from '@dfinity/agent';
import { Principal as PrincipalDfinity } from '@dfinity/principal';
import { Ledger as LadgerCanister, binaryAddressFromPrincipal, hexAddressFromPrincipal } from 'azle/canisters/ledger'

type Contract = typeof contract.tsType;
type Parties = typeof parties.tsType;
type Signature = typeof signature.tsType;
type Transaction = typeof transaction.tsType;
type Payment = typeof payment.tsType

const TIMEOUT_PERIOD = 48000n;

let businessContract = StableBTreeMap<text, Contract>(2);
let businessParties = StableBTreeMap<text, Parties>(1);
let transactionPending = StableBTreeMap<text, Transaction>(0);

const icpCanister = LadgerCanister(PrincipalDfinity.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai"))

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
    maketPayment: update([nat64, makepaymentpayload], Result(text, text), async (cvr, payload) => {
        const trx = transactionPending.get(payload.transaction_memo)
        if ('None' in trx) Result.Err("Transaksi tidak ditemukan")

        const isVerified = await verifyPayment(cvr, payload.principal, payload.transaction_hash)
        if (!isVerified) {
            return Result.Err(`cannot complete the reserve: cannot verify the payment, memo=${payload.transaction_memo}`);
        }

        const trsx = trx.Some
        const bsnis = businessContract.get(payload.contract_id)

        if ("None" in bsnis) {
            throw Result.Err(`Contract with id=${payload.contract_id} not found`)
        }

        const busniss = bsnis.Some;
        busniss.payment = await calculate(busniss.contract_payment, busniss.payment, trsx!)
        businessContract.insert(busniss.contract_id, busniss)
        transactionPending.remove(payload.transaction_memo)
        return Result.Ok("Payment Success");
    }),
    getAddressFromPrincipal: query([Principal], text, (principal) => {
        return hexAddressFromPrincipal(principal, 0);
    }),

})

async function calculate(contract_payment: nat64, payment: Payment, trx: Transaction): Promise<Payment> {
    const py = payment;
    py.transactions.push(trx)
    py.total_payment = BigInt(py.transactions.reduce((a, b) => a + parseFloat(b.total.toString()), 0))
    py.payment_status = py.total_payment === contract_payment
        ? { "Completed": "PAYMENT_COMPLETED" } : py.total_payment < contract_payment && py.total_payment > BigInt(0)
            ? { "DownPayment": "DOWN_PAYMENT" } : py.total_payment < contract_payment && py.transactions.length > 1
                ? { "Partial": "PARTIAL" } : { "PaymentPending": "PAYMENT_PENDING" }
    py.change_output = (contract_payment - py.total_payment)
    return await py;
}

async function verifyPayment(block: nat64, recieverX: Principal, memo_hash: nat64): Promise<bool> {
    const blockdata = await ic.call(icpCanister.query_blocks,
        { args: [{ start: block, length: 1n }] });
    const trx = blockdata.blocks.find(f => {
        if ("None" in f.transaction.operation) return false;
        const operation = f.transaction.operation.Some;
        const sender = binaryAddressFromPrincipal(ic.caller(), 0)
        const reciever = binaryAddressFromPrincipal(recieverX, 0)
        return f.transaction.memo === memo_hash
            && hashdecode(sender) === hashdecode(operation.Transfer!.from)
            && hashdecode(reciever) === hashdecode(operation.Transfer!.to)
    })
    return trx ? true : false
}

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


async function hashdecode(value: Uint8Array): Promise<nat64> {
    return await calculateHashCode(value) as unknown as nat64;
}

async function getCorrelationId(transactionid: text): Promise<nat64> {
    const correlationId = `${transactionid}_${ic.caller().toText()}_${ic.time()}`;
    return await calculateHashCode(correlationId) as unknown as nat64;
};

function calculateHashCode(input: any): Uint8Array {
    // Hashes a string
    const hash = function (string: string): number {
        let hashValue = 0;
        for (let i = 0; i < string.length; i++) {
            hashValue = (((hashValue << 5) - hashValue) + string.charCodeAt(i)) & 0xFFFFFFFF;
        }
        return hashValue;
    };

    // Deep hashes an object
    const objectHash = function (obj: any): number {
        let result = 0;
        for (const property in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, property)) {
                result += hash(property + calculateHashCode(obj[property]));
            }
        }
        return result;
    };

    // Does a type check on the passed-in value and calls the appropriate hash method
    const valueHash = function (value: any): number {
        const types: { [key: string]: (input: any) => number } = {
            'string': hash,
            'number': hash,
            'boolean': hash,
            'object': objectHash
        };
        const type = typeof value;
        return value != null && types[type] ? types[type](value) + hash(type) : 0;
    };

    return convertToNat64(valueHash(input))
}

function convertToNat64(hashValue: number): Uint8Array {
    const buffer = new ArrayBuffer(8);
    const view = new DataView(buffer);
    view.setBigUint64(0, BigInt(hashValue), true);
    return new Uint8Array(buffer);
}

