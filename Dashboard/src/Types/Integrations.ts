export interface PlannrClient {
    uuid: string,
    name: string,
    email: string,
}

export interface PlannrAccount {
    uuid: string,
    name: string,
}

export interface PlannrIntegration {
    Accounts: PlannrAccount[],

    // Plannr account uuid for request context
    AccountId: string,
}

export interface Integrations {
    Plannr: PlannrIntegration,
}
