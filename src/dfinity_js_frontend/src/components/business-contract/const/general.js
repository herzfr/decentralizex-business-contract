const DESC_ROUTE = [
    {
        url: "/dashboard",
        description: "Monitor contract agreements with clients, list of contracts you have created and are currently running."
    },
    {
        url: "/create-contract",
        description: "Create your cooperation contract here, and save it to enter your work contract list on the dashboard page."
    },
    {
        url: "/payment-contract",
        description: "Make payment for your cooperation contract to the client or view the billing of your cooperation contract with the contracting party."
    },
    {
        url: "/parties",
        description: "Register your corporation as a consideration for the client to accept the contract."
    },
]

export const ROLE = [
    { value: "INDIVIDUALS", label: "INDIVIDUALS" },
    { value: "ORGANIZATIONS", label: "ORGANIZATIONS" },
    { value: "COMPANIES", label: "COMPANIES" },
]

export default DESC_ROUTE;

export const CONTRACT_PAYLOAD = {
    parties_involved: [],
    objective: '',
    scope_of_work: '',
    term_and_condition: '',
    payment_terms: '',
    term_and_termination: '',
    confidentiality: '',
    intellectual_property: '',
    dispute_resolution: '',
    governing_law: '',
    force_majeure: '',
    notice: '',
    amendments: '',
    contract_payment: 0,
}
