import { Fund, Model, Operator, PolicyProvider, PolicyType, ProviderCharge, ProviderDiscount } from "./OrgResources";
import { File } from "./Types";

export interface ClientIdentity {
    Email: string,
	Forenames: string,
	Surname: string,
}

export interface Advisor {
    Id: string,
    Email: string,
    Forenames: string,
    Surname: string,
    Role: string,
}

export interface Client {
    Id: string,
	UserId: string,
	Identity: ClientIdentity,
	Fee: number,
	Advisor: Advisor,
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

export interface PolicyFund {
    Id: string,
	FundId: string,
	PolicyId: string,
	Proportion: number,
	IncludeInFee: boolean,
}

export interface Portfolio {
    Id: string,
	ModelId: string,
	PolicyId: string,
	Proportion: number,
	IncludeInFee: boolean,    
}

export interface Report {
    // Org-level:
    PolicyProviders: PolicyProvider[],
    ProviderCharges: ProviderCharge[],
    PolicyTypes: PolicyType[],
    Funds: Fund[],
    Models: Model[],
    Operators: Operator[],

    // Client-level:
    ProviderDiscounts: ProviderDiscount[],
    Policies: Policy[],
    PolicyFunds: PolicyFund[],
    Portfolios: Portfolio[],
}

export interface RiskAssessment {
    Id: string,
    RiskProviderId: string,
	RiskLevelId: string,
	Completed: string,
	File?: File,
}
