import { PolicyProvider, ProviderCharge, ProviderDiscount } from "./OrgResources";

export interface ClientIdentity {
    Email: string,
	Forenames: string,
	Surname: string,
}

export interface Client {
    Id: string,
	UserId: string,
	Identity: ClientIdentity,
	Fee: number,
	AdvisorId: string,
}

export interface Policy {
    EndValue: number,
    ExternalId: string,
    File?: File,
    Id: string,
    MonthlyContributions: number,
    Notes: string,
    PolicyProviderId: string,
    PolicyTypeId: string,
    StartValue: number,
}

export interface Report {
    Policies: Policy[],
    PolicyProviders: PolicyProvider[],
    ProviderCharges: ProviderCharge[],
    ProviderDiscounts: ProviderDiscount[],
}

export interface RiskAssessment {
    Id: string,
    RiskProviderId: string,
	RiskLevelId: string,
	Completed: string,
	File?: File,
}
